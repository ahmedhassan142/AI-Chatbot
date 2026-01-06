import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'your-secret-key-change-this';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-this';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const signAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const signRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};