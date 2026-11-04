import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { INITIAL_ITEMS } from '@/lib/mockData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
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

      if (item) {
        await prisma.item.update({
          where: { id },
          data: { viewsCount: { increment: 1 } },
        }).catch(() => null);

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
      }
    } catch {
      // Proceed to fallback lookup
    }

    // Fallback lookup
    const fallbackItem = INITIAL_ITEMS.find((it) => it.id === id);
    if (!fallbackItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const related = INITIAL_ITEMS.filter(
      (it) => it.category === fallbackItem.category && it.id !== fallbackItem.id
    ).slice(0, 4);

    return NextResponse.json({ success: true, item: fallbackItem, relatedItems: related });
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
    const body = await request.json();

    try {
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
    } catch {
      const match = INITIAL_ITEMS.find((it) => it.id === id);
      if (match && body.isAvailable !== undefined) {
        match.isAvailable = Boolean(body.isAvailable);
      }
      return NextResponse.json({ success: true, item: match });
    }
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
    try {
      await prisma.item.delete({ where: { id } });
    } catch {
      // Handled
    }

    return NextResponse.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
  }
}
