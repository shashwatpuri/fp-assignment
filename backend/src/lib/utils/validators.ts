
import { Request } from 'express';

export const validateUserSignupBody = (req: Request): { isValid: boolean; error?: string } => {
  if (!req.body) {
    return { isValid: false, error: 'Request body is missing' };
  }

  const { email, password } = req.body || {};

  if (typeof email !== 'string' || !email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (typeof password !== 'string' || !password.trim()) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }

  return { isValid: true };
};

export const validateUserSigninBody = (req: Request): { isValid: boolean; error?: string } => {
  if (!req.body) {
    return { isValid: false, error: 'Request body is missing' };
  }

  const { email, password } = req.body || {};

  if (typeof email !== 'string' || !email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (typeof password !== 'string' || !password.trim()) {
    return { isValid: false, error: 'Password is required' };
  }

  return { isValid: true };
};
