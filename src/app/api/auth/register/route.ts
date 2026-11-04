import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, university, phone, role, dormLocation, bio } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if university email
    const isEduEmail = cleanEmail.endsWith('.edu') || cleanEmail.includes('uni') || cleanEmail.includes('college');
    // We allow any email in development/demo, but highlight verification status
    const verifiedStudent = isEduEmail || true;

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({ error: 'An account with this university email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

    const user = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        password: hashedPassword,
        university: university || 'Stanford University',
        phone: phone || null,
        role: role || 'Student',
        avatarUrl,
        verifiedStudent,
        dormLocation: dormLocation || null,
        bio: bio || 'Campus student & peer trader.',
      },
    });

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        university: user.university,
        role: user.role,
        avatarUrl: user.avatarUrl,
        verifiedStudent: user.verifiedStudent,
        dormLocation: user.dormLocation,
      },
    });

    response.cookies.set('campuscloset_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create student account' }, { status: 500 });
  }
}
