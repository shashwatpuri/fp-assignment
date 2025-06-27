import fs from 'fs';
import path from 'path';
import { User } from '../types/user';
import { Song } from '../types/song';

// Path to users.json
const usersFilePath = path.join(__dirname, '../data/users.json');
// Path to songs.json
const songsFilePath = path.join(__dirname, '../data/songs.json');

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

export const readSongs = (): Song[] => {
  try {
    const data = fs.readFileSync(songsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const writeSongs = (songs: Song[]): void => {
  fs.writeFileSync(songsFilePath, JSON.stringify(songs, null, 2));
};

export const findSong = (id: number): Song | undefined => {
  const songs = readSongs();
  return songs.find(song => song.id === id);
};