import { Request } from 'express';

export const validateUserSignupBody = (req: Request): { isValid: boolean; error?: string } => {
  if (!req.body) {
    return { isValid: false, error: 'Request body is missing' };
  }

  const { email, password, name } = req.body || {};

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

  if (typeof name !== 'string' || !name.trim()) {
    return { isValid: false, error: 'name is required' };
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

export const validateSongBody = (req: Request): { isValid: boolean; error?: string } => {
  if (!req.body) {
    return { isValid: false, error: 'Request body is missing' };
  }

  const { title, artist, album, duration } = req.body || {};

  if (typeof title !== 'string' || !title.trim()) {
    return { isValid: false, error: 'Title is required' };
  }

  if (typeof artist !== 'string' || !artist.trim()) {
    return { isValid: false, error: 'Artist is required' };
  }

  if (typeof album !== 'string' || !album.trim()) {
    return { isValid: false, error: 'Album is required' };
  }

  if (typeof duration !== 'number' || duration <= 0) {
    return { isValid: false, error: 'Duration must be a positive number' };
  }

  return { isValid: true };
};

export const validateSongId = (req: Request): { isValid: boolean; error?: string } => {
  const { id } = req.params || {};

  if (!id || typeof id !== 'string' || !id.trim()) {
    return { isValid: false, error: 'Song ID is required' };
  }

  return { isValid: true };
};
