import express, { RequestHandler, Request, Response } from 'express';
import { User } from '../lib/types/user';
import { Song } from '../lib/types/song';
import { readSongs, writeSongs, findSong } from '../lib/utils/utils';
import { validateSongBody, validateSongId } from '../lib/utils/validators';

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

export const signoutHandler: RequestHandler = (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    path: '/',
  });
  res.status(200).json({
    success: true,
    message: 'Signed out successfully',
  });
};

export const listSongsHandler: RequestHandler = (req: Request, res: Response) => {
  try {
    const songs = readSongs();
    res.status(200).json({
      success: true,
      songs
    });
  } catch (error) {
    console.error('Error in list songs handler:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const addSongHandler: RequestHandler = (req: Request, res: Response) => {
  try {
    const validation = validateSongBody(req);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: validation.error || 'Invalid input'
      });
      return;
    }

    const { title, artist, album, duration } = req.body;
    const songs = readSongs();

    const newSong: Song = {
      id: Date.now(),
      title,
      artist,
      album,
      duration
    };

    songs.push(newSong);
    writeSongs(songs);

    res.status(201).json({
      success: true,
      message: 'Song added successfully',
      song: newSong
    });

  } catch (error) {
    console.error('Error in add song handler:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteSongHandler: RequestHandler = (req: Request, res: Response) => {
  try {
    const validation = validateSongId(req);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: validation.error || 'Invalid song ID'
      });
      return;
    }

    const { id } = req.params;
    const songs = readSongs();
    const songIndex = songs.findIndex(song => song.id === Number(id));

    if (songIndex === -1) {
      res.status(404).json({
        success: false,
        message: 'Song not found'
      });
      return;
    }

    songs.splice(songIndex, 1);
    writeSongs(songs);

    res.status(200).json({
      success: true,
      message: 'Song deleted successfully',
    });

  } catch (error) {
    console.error('Error in delete song handler:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

protectedRouter.get('/me', meHandler);
protectedRouter.post('/signout', signoutHandler);

// Song routes
protectedRouter.get('/songs', listSongsHandler);
protectedRouter.post('/songs', addSongHandler);
protectedRouter.delete('/songs/:id', deleteSongHandler);