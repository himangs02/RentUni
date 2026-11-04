import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from './prisma';

const SECRET_KEY = process.env.JWT_SECRET || 'campuscloset_super_secret_jwt_key_2025_fallback';
const key = new TextEncoder().encode(SECRET_KEY);

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function createSessionToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('campuscloset_token')?.value;
    if (!token) return null;

    const decoded = await verifySessionToken(token);
    if (!decoded?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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
    });

    return user;
  } catch (err) {
    console.error('Failed to get current user:', err);
    return null;
  }
}
