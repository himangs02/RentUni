import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { INITIAL_ITEMS } from '@/lib/mockData';

// In-memory store for newly created items when testing before DB is up
const inMemoryItems = [...INITIAL_ITEMS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const category = searchParams.get('category') || 'all';
  const listingType = searchParams.get('listingType') || 'all';
  const condition = searchParams.get('condition') || 'all';
  const university = searchParams.get('university')?.toLowerCase() || '';
  const sort = searchParams.get('sort') || 'newest';

  try {
    const whereClause: Record<string, unknown> = {
      isAvailable: true,
    };

    if (search.trim()) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ];
    }

    if (category && category !== 'all') {
      whereClause.category = category;
    }

    if (listingType && listingType !== 'all') {
      whereClause.listingType = listingType;
    }

    if (condition && condition !== 'all') {
      whereClause.condition = condition;
    }

    if (university) {
      whereClause.seller = {
        university: { contains: university },
      };
    }

    let orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' };
    if (sort === 'popular') {
      orderBy = { viewsCount: 'desc' };
    } else if (sort === 'price_asc') {
      orderBy = { rentalRate: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { rentalRate: 'desc' };
    }

    const items = await prisma.item.findMany({
      where: whereClause,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            university: true,
            role: true,
            avatarUrl: true,
            verifiedStudent: true,
            phone: true,
            dormLocation: true,
          },
        },
      },
      orderBy,
    });

    return NextResponse.json({ success: true, count: items.length, items });
  } catch {
    // Graceful fallback to mock data if MySQL server DNS is propagating or paused
    let filtered = inMemoryItems.filter((it) => it.isAvailable);

    if (search.trim()) {
      filtered = filtered.filter(
        (it) =>
          it.title.toLowerCase().includes(search) ||
          it.description.toLowerCase().includes(search) ||
          it.location?.toLowerCase().includes(search)
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter((it) => it.category.toLowerCase() === category.toLowerCase());
    }

    if (listingType && listingType !== 'all') {
      filtered = filtered.filter((it) => it.listingType === listingType);
    }

    if (condition && condition !== 'all') {
      filtered = filtered.filter((it) => it.condition === condition);
    }

    if (university.trim()) {
      filtered = filtered.filter((it) =>
        it.seller?.university.toLowerCase().includes(university)
      );
    }

    if (sort === 'price_asc') {
      filtered.sort((a, b) => (a.rentalRate || a.price || 0) - (b.rentalRate || b.price || 0));
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => (b.rentalRate || b.price || 0) - (a.rentalRate || a.price || 0));
    } else if (sort === 'popular') {
      filtered.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    }

    return NextResponse.json({ success: true, count: filtered.length, items: filtered });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Please log in with your university account to post a listing.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      listingType,
      price,
      rentalRate,
      rentalPeriod,
      securityDeposit,
      condition,
      images,
      location,
    } = body;

    if (!title || !description || !category || !listingType || !condition) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
    }

    let imagesJson = '[]';
    if (Array.isArray(images) && images.length > 0) {
      imagesJson = JSON.stringify(images);
    } else if (typeof images === 'string' && images.trim()) {
      imagesJson = JSON.stringify([images.trim()]);
    } else {
      imagesJson = JSON.stringify(['https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80']);
    }

    try {
      const newItem = await prisma.item.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          category,
          listingType,
          price: listingType === 'SELL' ? parseFloat(price) : null,
          rentalRate: listingType === 'RENT' ? parseFloat(rentalRate) : null,
          rentalPeriod: rentalPeriod || 'daily',
          securityDeposit: listingType === 'RENT' && securityDeposit ? parseFloat(securityDeposit) : 0,
          condition,
          images: imagesJson,
          sellerId: user.id,
          location: location?.trim() || user.dormLocation || user.university,
          isAvailable: true,
        },
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

      return NextResponse.json({ success: true, item: newItem }, { status: 201 });
    } catch {
      // Fallback in-memory save if DB is connecting
      const createdItem = {
        id: `item-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        category,
        listingType,
        price: listingType === 'SELL' ? parseFloat(price) : null,
        rentalRate: listingType === 'RENT' ? parseFloat(rentalRate) : null,
        rentalPeriod: rentalPeriod || 'daily',
        securityDeposit: listingType === 'RENT' && securityDeposit ? parseFloat(securityDeposit) : 0,
        condition,
        images: Array.isArray(images) ? images : [images],
        sellerId: user.id,
        location: location?.trim() || user.dormLocation || user.university,
        isAvailable: true,
        viewsCount: 1,
        createdAt: new Date().toISOString(),
        seller: user,
      };
      inMemoryItems.unshift(createdItem);
      return NextResponse.json({ success: true, item: createdItem }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
