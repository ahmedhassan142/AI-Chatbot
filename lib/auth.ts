// lib/auth.ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  department?: string; // Make department optional
  name?: string;
}

export function generateAccessToken(payload: JwtPayload): string {
  //@ts-ignore
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Type guard to ensure it's a JwtPayload
    if (typeof decoded === 'object' && decoded !== null) {
      const payload = decoded as any;
      return {
        userId: payload.userId || payload.id,
        email: payload.email,
        role: payload.role || 'user',
        department: payload.department || 'general',
        name: payload.name,
      };
    }
    
    return null;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

// Helper function to verify and extract user data safely
export function verifyAndExtractUser(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (typeof decoded === 'object' && decoded !== null) {
      const payload = decoded as any;
      return {
        userId: payload.userId || payload.id,
        email: payload.email,
        role: payload.role || 'user',
        department: payload.department || 'general',
        name: payload.name,
      };
    }
    
    return null;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

// Server-side function to get token from cookies (for API routes)
export async function getTokenFromCookies() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('token')?.value;
  } catch (error) {
    console.error('Error getting token from cookies:', error);
    return null;
  }
}

// Server-side function to get authenticated user from cookies
export async function getAuthenticatedUser() {
  try {
    const token = await getTokenFromCookies();
    if (!token) return null;
    
    return verifyAccessToken(token);
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}