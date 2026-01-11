// lib/auth.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ac2a0fcf731e755942612d8e2baa838654e5fc2881ab542fc694dd0ed53177c3';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  department?: string; // Make department optional
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