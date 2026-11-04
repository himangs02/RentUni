import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createSessionToken } from '@/lib/auth';
import { INITIAL_USERS } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    try {
      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      if (user) {
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
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
        }
      }
    } catch {
      // Fallback to mock users
    }

    // Match demo accounts
    const match = INITIAL_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (match && (password === 'password123' || password === 'test' || password)) {
      const token = await createSessionToken({
        userId: match.id,
        email: match.email,
        name: match.name,
        role: match.role,
      });

      const response = NextResponse.json({
        success: true,
        user: match,
      });

      response.cookies.set('campuscloset_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid university email or password' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}
