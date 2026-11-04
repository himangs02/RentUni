import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const listingType = searchParams.get('listingType') || 'all';
    const condition = searchParams.get('condition') || 'all';
    const university = searchParams.get('university') || '';
    const sort = searchParams.get('sort') || 'newest';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;

    // Build Prisma where clause
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

    // Price filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      if (listingType === 'RENT') {
        whereClause.rentalRate = {
          ...(minPrice !== undefined ? { gte: minPrice } : {}),
          ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
        };
      } else if (listingType === 'SELL') {
        whereClause.price = {
          ...(minPrice !== undefined ? { gte: minPrice } : {}),
          ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
        };
      }
    }

    // Determine orderBy
    let orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' };
    if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'popular') {
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
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to retrieve marketplace items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in with your university account to post a listing.' }, { status: 401 });
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

    // Validation
    if (!title || !description || !category || !listingType || !condition) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
    }

    if (listingType === 'SELL' && (!price || parseFloat(price) <= 0)) {
      return NextResponse.json({ error: 'Please provide a valid sale price' }, { status: 400 });
    }

    if (listingType === 'RENT' && (!rentalRate || parseFloat(rentalRate) <= 0)) {
      return NextResponse.json({ error: 'Please provide a valid rental rate' }, { status: 400 });
    }

    // Process images
    let imagesJson = '[]';
    if (Array.isArray(images) && images.length > 0) {
      imagesJson = JSON.stringify(images);
    } else if (typeof images === 'string' && images.trim()) {
      imagesJson = JSON.stringify([images.trim()]);
    } else {
      imagesJson = JSON.stringify(['https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80']);
    }

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
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
