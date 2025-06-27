import jwt from 'jsonwebtoken';
import { User } from '../types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'shashwat';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
  ? Math.floor(Number(process.env.JWT_EXPIRES_IN) / 1000)
  : 24 * 60 * 60;

export const generateToken = (user: Omit<User, 'password'>): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const setTokenCookie = (res: any, token: string): void => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  };

  res.cookie('token', token, cookieOptions);
};
