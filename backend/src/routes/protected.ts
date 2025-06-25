import express, { RequestHandler, Request, Response } from 'express';
import { User } from '../lib/types/user';

export const protectedRouter = express.Router();

export const meHandler: RequestHandler = (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  const { password: _, ...userWithoutPassword } = req.user as User;
  res.status(200).json({
    success: true,
    user: userWithoutPassword
  });
}

protectedRouter.get('/me', meHandler);