import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateRentalDays } from '@/lib/utils';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Transactions where user is the buyer/renter
    const buyerTransactions = await prisma.rentalTransaction.findMany({
      where: { buyerId: user.id },
      include: {
        item: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            university: true,
            phone: true,
            avatarUrl: true,
            dormLocation: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transactions where user is the seller/lender
    const sellerTransactions = await prisma.rentalTransaction.findMany({
      where: { sellerId: user.id },
      include: {
        item: true,
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            university: true,
            phone: true,
            avatarUrl: true,
            dormLocation: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // User's own listed items
    const myListings = await prisma.item.findMany({
      where: { sellerId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      buyerTransactions,
      sellerTransactions,
      myListings,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to retrieve transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to complete this booking or purchase' }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, type, startDate, endDate, pickupLocation, notes } = body;

    if (!itemId || !type) {
      return NextResponse.json({ error: 'Item ID and transaction type are required' }, { status: 400 });
    }

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { seller: true },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (!item.isAvailable) {
      return NextResponse.json({ error: 'This item is no longer available' }, { status: 400 });
    }

    if (item.sellerId === user.id) {
      return NextResponse.json({ error: 'You cannot rent or buy your own item!' }, { status: 400 });
    }

    let totalAmount = 0;
    let depositAmount = 0;
    let start: Date | null = null;
    let end: Date | null = null;

    if (type === 'RENT') {
      if (!startDate || !endDate) {
        return NextResponse.json({ error: 'Start date and end date are required for rentals' }, { status: 400 });
      }

      start = new Date(startDate);
      end = new Date(endDate);

      if (end.getTime() <= start.getTime()) {
        return NextResponse.json({ error: 'Return date must be after the pickup start date' }, { status: 400 });
      }

      const days = calculateRentalDays(start, end);
      const rate = item.rentalRate || 0;
      const rentalFee = days * rate;
      depositAmount = item.securityDeposit || 0;
      totalAmount = rentalFee + depositAmount;
    } else {
      // BUY
      totalAmount = item.price || 0;
      depositAmount = 0;
      // Mark permanently sold item as unavailable
      await prisma.item.update({
        where: { id: itemId },
        data: { isAvailable: false },
      });
    }

    const transaction = await prisma.rentalTransaction.create({
      data: {
        itemId,
        buyerId: user.id,
        sellerId: item.sellerId,
        type,
        startDate: start,
        endDate: end,
        totalAmount,
        depositAmount,
        status: 'ACTIVE',
        paymentStatus: 'PAID',
        pickupLocation: pickupLocation || item.location || 'Campus Center / Quad',
        notes: notes || null,
      },
      include: {
        item: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            university: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, transaction }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to complete transaction' }, { status: 500 });
  }
}
