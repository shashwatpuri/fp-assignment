import React, { useState, useMemo, useEffect } from "react";
import { Search, ArrowUp, ArrowDown, ListFilter, Layers, ChevronDown, SkipBack, Play, Pause, SkipForward, Trash, Plus, X } from "lucide-react";
import ReactDOM from "react-dom";
import CustomLoader from "../components/CustomLoader";
import ErrorPortal from "../components/ErrorPortal";
import { fetchWithAuth } from "../lib/fetchWithAuth";
import { ErrorBoundary } from "../components/ErrorBoundary";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


const ROLES = {
  admin: "admin",
  user: "user"
};

type Song = {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
};

type Props = {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    role: string;
  };
};

const BG_IMAGE = "https://ucarecdn.com/1b63629d-146e-4c81-9010-15b1251cc335/-/preview/1000x666/"

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function GlassCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={` ${className} bg-black/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 p-6`}>
      {children}
    </div>
  );
}

function Controls({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  groupBy,
  setGroupBy,
  user,
  onAddSong,
  adding
}: any) {
  return (
    <GlassCard className="mb-8 p-6">
      <div className="w-full mb-4">
        <div className="relative flex-1 min-w-[180px] max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search songs, artists, or albums..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full bg-black/40 border border-blue-400/30 rounded-xl text-white placeholder-white/60 outline-none"
          />
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-4 w-full items-center justify-between overflow-x-auto">
        <div className="flex items-stretch flex-1 min-w-[200px] max-w-xs">
          <div className="relative w-full flex-1 flex items-center">
            <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none pl-10 pr-8 py-3 w-full bg-black/40 border border-blue-400/30 rounded-l-xl text-white outline-none h-full"
              style={{ minHeight: 0 }}
            >
              <option value="title">Title</option>
              <option value="artist">Artist</option>
              <option value="album">Album</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-center px-4 py-3 border-t border-b border-r border-blue-400/30 rounded-r-xl text-white hover:bg-gray-500/40 duration-300 outline-none"
            title="Toggle sort order"
            style={{ minHeight: 0 }}
          >
            {sortOrder === 'asc'
              ? <ArrowUp className="text-gray-400" size={20} />
              : <ArrowDown className="text-gray-400" size={20} />}
          </button>
        </div>

        {/* Group By */}
        <div className="relative flex-1 min-w-[130px] max-w-xs">
          <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={groupBy}
            onChange={e => setGroupBy(e.target.value)}
            className="appearance-none pl-10 pr-8 py-3 w-full bg-black/40 border border-blue-400/30 rounded-xl text-white outline-none"
          >
            <option value="none">No Grouping</option>
            <option value="artist">Group by Artist</option>
            <option value="album">Group by Album</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {user.role === ROLES.admin && (
        <div className="w-full flex justify-center">
          <AddSongForm onAdd={onAddSong} adding={adding} />
        </div>
      )}
    </GlassCard>
  );
}

function AddSongForm({ onAdd, adding }: { onAdd: (song: any) => void, adding: boolean }) {
  const [form, setForm] = useState({ title: "", artist: "", album: "", duration: "" });
  const [show, setShow] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.title && form.artist && form.album && form.duration) {
      const durationInSeconds = parseInt(form.duration);
      if (isNaN(durationInSeconds) || durationInSeconds <= 0) {
        alert("Please enter a valid duration in seconds");
        return;
      }
      onAdd({
        ...form,
        id: Date.now(),
        duration: durationInSeconds
      });
      setForm({ title: "", artist: "", album: "", duration: "" });
      setShow(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <button
        className="flex items-center gap-2 mb-2 p-2 px-4 text-lg font-semibold bg-black/30 text-white rounded-lg border border-blue-400/30 hover:bg-black/40 transition"
        onClick={() => setShow(s => !s)}
      >
        {show ?
          <span className="flex items-center gap-2">
            <X className="w-5 h-5" /> Cancel
          </span>
          :
          <span className="flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Song
          </span>
        }
      </button>
      {show && (
        <form
          className="flex flex-col gap-2 mb-4"
          onSubmit={handleSubmit}
        >
          <input
            className="px-3 py-1 rounded-lg bg-black/30 text-white placeholder-white/60 focus:outline-none"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <input
            className="px-3 py-1 rounded-lg bg-black/30 text-white placeholder-white/60 focus:outline-none"
            placeholder="Artist"
            value={form.artist}
            onChange={e => setForm(f => ({ ...f, artist: e.target.value }))}
          />
          <input
            className="px-3 py-1 rounded-lg bg-black/30 text-white placeholder-white/60 focus:outline-none"
            placeholder="Album"
            value={form.album}
            onChange={e => setForm(f => ({ ...f, album: e.target.value }))}
          />
          <input
            className="px-3 py-1 rounded-lg bg-black/30 text-white placeholder-white/60 focus:outline-none"
            placeholder="Duration in seconds (e.g., 200)"
            value={form.duration}
            onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
            type="number"
            min="1"
          />
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            type="submit"
            disabled={adding}
          >
            {adding ? <CustomLoader message="Adding song..." /> : "Add"}
          </button>
        </form>
      )}
    </div>
  );
}

function SongCard({ song, isAdmin, onDelete, onPlay }: any) {
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  return (
    <>
      <div onClick={() => onPlay(song)}>
        <GlassCard className={`flex justify-between items-center gap-2 cursor-pointer hover:bg-black/40 transition-all duration-300`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black/30 rounded-lg flex items-center justify-center text-2xl font-bold text-white/80">
              {song.title.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-lg text-white">{song.title}</div>
              <div className="text-gray-200 text-sm">{song.artist} • {song.album}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-gray-400 text-xs">{formatDuration(song.duration)}</div>
            {isAdmin && (
              <button
                className="text-white/70 hover:text-red-400 p-2 ml-2"
                title="Delete"
                onClick={e => { e.stopPropagation(); setConfirmDelete(true); }}
              >
                <Trash className="w-5 h-5" />
              </button>
            )}
          </div>
        </GlassCard>
      </div>

      {confirmDelete && ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <GlassCard className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[260px] flex flex-col items-center p-8">
            <div className="text-lg font-semibold text-white mb-4">Delete this song?</div>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={e => { e.stopPropagation(); setConfirmDelete(false); onDelete(song.id); }}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={e => { e.stopPropagation(); setConfirmDelete(false); }}
              >
                No
              </button>
            </div>
          </GlassCard>
        </div>,
        document.body
      )}
    </>
  );
}

function NowPlayingBar({ song }: { song: Song }) {
  const totalSeconds = song ? song.duration : 0;
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentSeconds, setCurrentSeconds] = React.useState(0);

  React.useEffect(() => {
    if (!isPlaying) return;
    if (currentSeconds >= totalSeconds) return;
    const interval = setInterval(() => {
      setCurrentSeconds(s => (s < totalSeconds ? s + 1 : s));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentSeconds, totalSeconds]);

  React.useEffect(() => {
    setCurrentSeconds(0);
    setIsPlaying(false);
  }, [song]);

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const progressPercent = totalSeconds > 0 ? Math.min(100, (currentSeconds / totalSeconds) * 100) : 0;

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center z-50">
      <div className="w-full max-w-2xl mx-auto mb-4">
        <GlassCard className="flex flex-col gap-2 py-4 px-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between w-full mb-2 gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 bg-black/30 rounded-lg flex items-center justify-center text-lg font-bold text-white/80">
                {song ? song.title.charAt(0) : "♪"}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="font-semibold text-white text-base truncate max-w-[140px]">
                  {song ? song.title : "No song playing"}
                </div>
                <div className="text-gray-200 text-sm truncate max-w-[140px]">
                  {song ? `${song.artist} • ${song.album}` : "Select a song to play"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="text-white/50 hover:text-white transition p-1"><SkipBack size={20} /></button>
              <button
                className="flex items-center justify-center bg-white/80 text-black rounded-full w-8 h-8 p-0 transition"
                onClick={() => setIsPlaying(p => !p)}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button className="text-white/50 hover:text-white transition p-1"><SkipForward size={20} /></button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-white/70 min-w-[36px] text-left">{formatTime(currentSeconds)}</span>
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-xs text-white/70 min-w-[36px] text-right">{formatTime(totalSeconds)}</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default function MusicLibrary({ isAuthenticated, user }: Props) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Song | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'album'>("title");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("asc");
  const [groupBy, setGroupBy] = useState<'none' | "artist" | "album">("none");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, []);

  async function fetchSongs() {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchWithAuth(`${apiBaseUrl}/api/auth/songs`);
      if (result.success && result.data && Array.isArray(result.data.songs)) {
        setSongs(result.data.songs);
      } else {
        setError(result.error || "Failed to fetch songs");
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSong(song: Song) {
    setAdding(true);
    setError(null);
    try {
      const result = await fetchWithAuth(`${apiBaseUrl}/api/auth/songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(song),
      });
      if (!result.success) {
        setError(result.error || "Failed to add song");
      } else {
        await fetchSongs();
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setAdding(false);
    }
  };

  async function handleDeleteSong(id: number) {
    setError(null);
    try {
      const result = await fetchWithAuth(`${apiBaseUrl}/api/auth/songs/${id}`, {
        method: "DELETE"
      });
      if (!result.success) {
        setError("Failed to delete song");
      } else {
        await fetchSongs();
      }
    } catch (err: any) {
      setError("Unknown error");
    }
  };

  function handlePlaySong(song: Song) {
    setNowPlaying(song);
  }

  const filteredGroupedAndSortedSongs = useMemo(() => {
    let filtered = songs.filter(song => {
      if (!searchTerm) return true;
      return (
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.album.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    filtered.sort((a, b) => {
      const aValue = a[sortBy].toLowerCase();
      const bValue = b[sortBy].toLowerCase();
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    if (groupBy === 'none') {
      return { 'All Songs': filtered };
    }
    return filtered.reduce((groups, song) => {
      const key = song[groupBy];

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(song);
      return groups;
    }, {} as Record<string, Song[]>);

  }, [songs, searchTerm, sortBy, sortOrder, groupBy]);

  if (!isAuthenticated)
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Please Sign in First</div>;
  if (loading)
    return <div className="min-h-screen flex items-center justify-center">
      <CustomLoader message="Loading songs..." />
    </div>;
  if (error)
    return <ErrorPortal message={error} reload={true} />;

  return (
    <ErrorBoundary>
      <div className="px-3 min-h-screen w-full bg-fixed flex flex-col justify-center relative">
        <div className="absolute inset-0 bg-black/60 z-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${BG_IMAGE})` }}
        />
        <div className="relative z-10 w-full max-w-3xl mx-auto mt-20 mb-10 flex flex-col">
          <Controls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            groupBy={groupBy}
            setGroupBy={setGroupBy}
            user={user}
            onAddSong={handleAddSong}
            adding={adding}
          />
          <GlassCard className="mb-24">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-2xl font-bold text-white">Music Library</p>
            </div>
            <div className="mt-4">
              {Object.entries(filteredGroupedAndSortedSongs).map(([groupName, groupSongs]) => (
                <div key={groupName} className="mb-8">
                  {groupBy !== 'none' && (
                    <h2 className="text-lg font-semibold text-white/80 mt-4 mb-1">
                      {groupName}
                    </h2>
                  )}
                  <div className="flex flex-col gap-4">
                    {groupSongs.map((song: Song) => (
                      <SongCard
                        key={song.id}
                        song={song}
                        isAdmin={user.role === ROLES.admin}
                        onDelete={handleDeleteSong}
                        onPlay={handlePlaySong}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
        {nowPlaying && <NowPlayingBar song={nowPlaying} />}
      </div>
    </ErrorBoundary>
  );
}