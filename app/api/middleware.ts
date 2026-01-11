import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '../../lib/auth';

export async function authMiddleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Add user info to request headers for API routes
  const headers = new Headers(req.headers);
  headers.set('x-user-id', decoded.userId);
  headers.set('x-user-email', decoded.email);
  headers.set('x-user-role', decoded.role);

  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: ['/api/chat', '/api/conversations', '/api/users/:path*'],
};