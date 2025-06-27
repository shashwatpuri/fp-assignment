import React, { useState, useMemo } from "react";
import { Search, ArrowUp, ArrowDown, ListFilter, Layers, ChevronDown, SkipBack, Play, Pause, SkipForward, Trash, Plus, X, LogOut } from "lucide-react";
import ReactDOM from "react-dom";


const ROLES = {
  admin: "admin",
  user: "user"
};
type props = {
  isAuthenticated: Boolean;
  user: {
    name: string,
    email: string,
    role: (typeof ROLES)[keyof typeof ROLES];
  };
};

const MOCK_SONGS = [
  { id: 1, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: 200 },
  { id: 2, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", duration: 203 },
  { id: 3, title: "Peaches", artist: "Justin Bieber", album: "Justice", duration: 198 },
  { id: 4, title: "Save Your Tears", artist: "The Weeknd", album: "After Hours", duration: 215 },
  { id: 5, title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", duration: 174 },
  { id: 6, title: "Don't Start Now", artist: "Dua Lipa", album: "Future Nostalgia", duration: 183 },
];

const BG_IMAGE = "https://ucarecdn.com/1b63629d-146e-4c81-9010-15b1251cc335/-/preview/1000x666/"

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    // You can log error or info here if needed
    console.log(error, info)
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>Something went wrong in the Music Library. Please try refreshing the page.</div>;
    }
    return this.props.children;
  }
}


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
  onAddSong }: any) {

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
          <AddSongForm onAdd={onAddSong} />
        </div>
      )}
    </GlassCard>
  );
}

function AddSongForm({ onAdd }: { onAdd: (song: any) => void }) {
  const [form, setForm] = useState({ title: "", artist: "", album: "", duration: "" });
  const [show, setShow] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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
          >
            Add
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

function NowPlayingBar({ song }: { song: any }) {
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

function TopBar({ user, onSignOut }: { user: any, onSignOut: () => void }) {
  return (
    <GlassCard className="fixed top-0 left-0 right-0 z-50 max-w-3xl mx-auto flex items-center justify-between py-3 px-6 mb-0 rounded-b-2xl rounded-t-none border-t-0">
      <div className="flex items-center gap-3">
        <span className="text-lg text-white">Hi, {user.name}</span>
        <span className={
          `px-3 py-1 rounded-full text-xs font-semibold ml-2 bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm`
        }>
          {user.role}
        </span>
      </div>
      <button
        className="flex items-center gap-2 px-4 py-2 bg-black/30 text-white rounded-lg border border-blue-400/30 hover:bg-black/40 transition font-semibold"
        onClick={onSignOut}
      >
        <LogOut className="w-5 h-5" /> Sign out
      </button>
    </GlassCard>
  );
}



export default function MusicLibrary({ isAuthenticated, user }: props) {

  const [songs, setSongs] = useState(MOCK_SONGS);
  const [nowPlaying, setNowPlaying] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'album'>("title");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("asc");
  const [groupBy, setGroupBy] = useState<'none' | 'artist' | 'album'>("none");

  if (!isAuthenticated)
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Please Signin First</div>;
  // Filtering, sorting, grouping logic
  const filteredAndSortedSongs = useMemo(() => {
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
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
    return filtered;
  }, [songs, searchTerm, sortBy, sortOrder]);

  const groupedSongs = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Songs': filteredAndSortedSongs };
    }
    return filteredAndSortedSongs.reduce((groups, song) => {
      const key = song[groupBy];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(song);
      return groups;
    }, {} as Record<string, any[]>);
  }, [filteredAndSortedSongs, groupBy]);


  const handleAddSong = (song: any) => setSongs(s => [song, ...s]);
  const handleDeleteSong = (id: number) => setSongs(s => s.filter(song => song.id !== id));
  const handlePlaySong = (song: any) => setNowPlaying(song);

  return (
    <ErrorBoundary>
      <div className="px-3 min-h-screen w-full bg-fixed flex flex-col justify-center relative">
        <div className="absolute inset-0 bg-black/60 z-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${BG_IMAGE})` }}
        />
        <div className="relative z-10 w-full max-w-3xl mx-auto mt-16 mb-10 flex flex-col gap-0">
          <TopBar user={user} onSignOut={() => { /* TODO: implement signout */ }} />

          <div className="flex flex-col gap-4 mt-5">
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
            />
          </div>

          <GlassCard className="mb-24">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-2xl font-bold text-white">Music Library</div>
                <div className="text-white/70 text-sm">({songs.length} songs)</div>
              </div>
            </div>
            <div className="mt-4">
              {Object.entries(groupedSongs).map(([groupName, groupSongs]) => (
                <div key={groupName} className="mb-8">
                  {groupBy !== 'none' && (
                    <h2 className="text-lg font-semibold text-white/80 mt-4 mb-1">
                      {groupName} ({groupSongs.length} songs)
                    </h2>
                  )}
                  <div className="flex flex-col gap-4">
                    {groupSongs.map((song: any) => (
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