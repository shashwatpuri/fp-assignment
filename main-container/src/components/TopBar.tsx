import { LogOut } from "lucide-react";
import { ErrorBoundary } from "./ErrorBoundary";

function GlassCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={` ${className} bg-black/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 p-6`}>
      {children}
    </div>
  );
}

export default function TopBar({ user, onSignOut }: { user: any, onSignOut: () => void }) {
  return (
    <ErrorBoundary>
      <GlassCard className="fixed top-0 left-0 right-0 z-50 max-w-3xl mx-auto flex items-center justify-between py-3 px-6 mb-0 rounded-b-2xl rounded-t-none border-t-0">
        <div className="flex items-center gap-3">
          <span className="text-lg text-white">Hi, {user?.name}</span>
          <span className={
            `px-3 py-1 rounded-full text-xs font-semibold ml-2 bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm`
          }>
            {user?.role}
          </span>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-black/30 text-white rounded-lg border border-blue-400/30 hover:bg-black/40 transition font-semibold"
          onClick={onSignOut}
        >
          <LogOut className="w-5 h-5" /> Sign out
        </button>
      </GlassCard>
    </ErrorBoundary>
  );
}