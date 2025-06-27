import { useState } from "react";
import MusicLibrary from "./pages/MusicLibrary";
import { X } from "lucide-react";

export default function App() {

  const isAuthenticated = true;
  const user = {
    email: "shashwat@gmail.com",
    name: "Shashwat",
    role: "admin"
  }
  const [hideMessage, setHideMessage] = useState(false);
  return (
    <div>
      {!hideMessage && (
        <div className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-xl">
          <span className="fixed top-10 left-10 right-10 z-[999] text-center text-white text-lg bg-black/30 backdrop-blur-xl border border-white/50 shadow-lg rounded-2xl p-5">
            <button onClick={() => setHideMessage(true)}
              className="absolute top-2 right-2"
            >
              <X className="w-4 h-4" />
            </button>
            Micro Frontend - Please use the main container to access the music library properly
          </span>
        </div>
      )}
      <MusicLibrary
        isAuthenticated={isAuthenticated}
        user={user}
      />
    </div>
  )
}

