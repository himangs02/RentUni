import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    const whereClause: Record<string, unknown> = {
      OR: [{ senderId: user.id }, { receiverId: user.id }],
    };

    if (itemId) {
      whereClause.itemId = itemId;
    }

    const inquiries = await prisma.inquiry.findMany({
      where: whereClause,
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true, university: true },
        },
        receiver: {
          select: { id: true, name: true, avatarUrl: true, university: true },
        },
        item: {
          select: { id: true, title: true, price: true, rentalRate: true, listingType: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to send a message' }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, receiverId, message } = body;

    if (!itemId || !receiverId || !message?.trim()) {
      return NextResponse.json({ error: 'Missing required message parameters' }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        itemId,
        senderId: user.id,
        receiverId,
        message: message.trim(),
      },
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true, university: true },
        },
      },
    });

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
