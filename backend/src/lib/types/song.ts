export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  genre: string;
  year: number;
  coverUrl?: string;
}