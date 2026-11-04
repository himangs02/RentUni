import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateRentalDays } from '@/lib/utils';
import { INITIAL_ITEMS, INITIAL_USERS } from '@/lib/mockData';

// Fallback in-memory transaction store
const inMemoryTransactions: any[] = [
  {
    id: 'tx-active-fridge',
    itemId: 'item-mini-fridge',
    buyerId: 'user-emma',
    sellerId: 'user-alex',
    type: 'RENT',
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
    totalAmount: 30.0,
    depositAmount: 35.0,
    status: 'ACTIVE' as const,
    paymentStatus: 'PAID',
    pickupLocation: 'Wilbur Hall Front Entrance',
    notes: 'Picked up on first day of spring quarter.',
    createdAt: new Date().toISOString(),
    item: INITIAL_ITEMS[0],
    seller: INITIAL_USERS[0],
    buyer: INITIAL_USERS[2],
  },
];

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
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
    } catch {
      // Fallback
      const buyerTx = inMemoryTransactions.filter((tx) => tx.buyerId === user.id);
      const sellerTx = inMemoryTransactions.filter((tx) => tx.sellerId === user.id);
      const myListings = INITIAL_ITEMS.filter((it) => it.sellerId === user.id);

      return NextResponse.json({
        success: true,
        buyerTransactions: buyerTx,
        sellerTransactions: sellerTx,
        myListings,
      });
    }
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to retrieve transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Please log in to complete this booking or purchase' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { itemId, type, startDate, endDate, pickupLocation, notes } = body;

    if (!itemId || !type) {
      return NextResponse.json({ error: 'Item ID and transaction type are required' }, { status: 400 });
    }

    let item = null;
    try {
      item = await prisma.item.findUnique({
        where: { id: itemId },
        include: { seller: true },
      });
    } catch {
      // Fallback lookup
    }

    if (!item) {
      item = INITIAL_ITEMS.find((it) => it.id === itemId) || null;
    }

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
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

      const days = calculateRentalDays(start, end);
      const rate = item.rentalRate || 0;
      const rentalFee = days * rate;
      depositAmount = item.securityDeposit || 0;
      totalAmount = rentalFee + depositAmount;
    } else {
      totalAmount = item.price || 0;
      depositAmount = 0;
    }

    try {
      if (type === 'BUY') {
        await prisma.item.update({
          where: { id: itemId },
          data: { isAvailable: false },
        }).catch(() => null);
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
    } catch {
      // Fallback in-memory transaction
      const newTx = {
        id: `tx-${Date.now()}`,
        itemId,
        buyerId: user.id,
        sellerId: item.sellerId,
        type: type as 'RENT' | 'BUY',
        startDate: start ? start.toISOString() : null,
        endDate: end ? end.toISOString() : null,
        totalAmount,
        depositAmount,
        status: 'ACTIVE' as const,
        paymentStatus: 'PAID',
        pickupLocation: pickupLocation || item.location || 'Campus Center / Quad',
        notes: notes || null,
        createdAt: new Date().toISOString(),
        item,
        buyer: user,
        seller: item.seller,
      };
      inMemoryTransactions.unshift(newTx);
      return NextResponse.json({ success: true, transaction: newTx }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to complete transaction' }, { status: 500 });
  }
}
