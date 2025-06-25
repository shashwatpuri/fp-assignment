import fs from 'fs';
import path from 'path';
import { User } from '../types/user';


// Path to users.json
const usersFilePath = path.join(__dirname, '../data/users.json');

export const readUsers = (): any[] => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const writeUsers = (users: any[]): void => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

export const findUser = (email: string): User | undefined => {
  const users = readUsers();
  return users.find(user => user.email === email);
};
