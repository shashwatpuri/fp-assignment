import bcrypt from 'bcryptjs';
import express, { Request, Response } from 'express';

import { User, UserRole } from '../lib/types/user';
import { findUser, readUsers, writeUsers } from '../lib/utils/utils';
import { validateUserSignupBody, validateUserSigninBody } from '../lib/utils/validators';
import { generateToken, setTokenCookie } from '../lib/utils/jwt';

export const unprotectedRouter = express.Router();

const signupHandler = async (req: Request, res: Response) => {
  try {
    const validation = validateUserSignupBody(req);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: validation.error || 'Invalid input'
      });
      return;
    }

    const { email, password, name } = req.body;
    const users: User[] = readUsers();

    const existingUser = findUser(email);
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User already exists'
      });
      return;
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: (users.length + 1).toString(),
      email,
      name,
      password: hashedPassword,
      role: UserRole.USER
    };

    users.push(newUser);
    writeUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error in signup handler:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

const signinHandler = async (req: Request, res: Response) => {
  try {
    const validation = validateUserSigninBody(req);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: validation.error || 'Invalid input'
      });
      return;
    }

    const { email, password } = req.body;
    const user = findUser(email);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }
    const { password: _, ...userWithoutPassword } = user;

    const token = generateToken(userWithoutPassword);
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error in signin handler:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

unprotectedRouter.post('/signup', signupHandler);
unprotectedRouter.post('/signin', signinHandler);

export default unprotectedRouter;