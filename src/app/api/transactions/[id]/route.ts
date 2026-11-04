import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus } = body;

    const transaction = await prisma.rentalTransaction.findUnique({
      where: { id },
      include: { item: true },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Must be either buyer or seller
    if (transaction.buyerId !== user.id && transaction.sellerId !== user.id && user.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.rentalTransaction.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
      },
    });

    // If a rental was marked COMPLETED (item returned safely), make item available again
    if (status === 'COMPLETED' && transaction.type === 'RENT') {
      await prisma.item.update({
        where: { id: transaction.itemId },
        data: { isAvailable: true },
      }).catch(() => null);
    }

    return NextResponse.json({ success: true, transaction: updated });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction status' }, { status: 500 });
  }
}
