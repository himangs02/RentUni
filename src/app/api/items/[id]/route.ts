import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            university: true,
            phone: true,
            role: true,
            avatarUrl: true,
            verifiedStudent: true,
            dormLocation: true,
            bio: true,
            createdAt: true,
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Increment views count asynchronously
    await prisma.item.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => null);

    // Fetch related items from the same category or university
    const relatedItems = await prisma.item.findMany({
      where: {
        category: item.category,
        id: { not: item.id },
        isAvailable: true,
      },
      take: 4,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            university: true,
            avatarUrl: true,
            verifiedStudent: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, item, relatedItems });
  } catch (error) {
    console.error('Error fetching item details:', error);
    return NextResponse.json({ error: 'Failed to retrieve item details' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.item.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (existing.sellerId !== user.id && user.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden: You can only edit your own listings' }, { status: 403 });
    }

    const body = await request.json();
    const updated = await prisma.item.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.isAvailable !== undefined ? { isAvailable: Boolean(body.isAvailable) } : {}),
        ...(body.price !== undefined ? { price: parseFloat(body.price) } : {}),
        ...(body.rentalRate !== undefined ? { rentalRate: parseFloat(body.rentalRate) } : {}),
        ...(body.securityDeposit !== undefined ? { securityDeposit: parseFloat(body.securityDeposit) } : {}),
        ...(body.condition !== undefined ? { condition: body.condition } : {}),
        ...(body.location !== undefined ? { location: body.location } : {}),
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.item.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (existing.sellerId !== user.id && user.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own listings' }, { status: 403 });
    }

    await prisma.item.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
  }
}
