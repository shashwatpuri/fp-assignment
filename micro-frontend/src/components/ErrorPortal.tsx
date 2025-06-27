import React from 'react';
import ReactDOM from 'react-dom';
import { RefreshCw } from 'lucide-react';

interface ErrorPortalProps {
  message: string;
  reload?: boolean;
  onClose?: () => void;
}

function GlassCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-black/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 p-6 ${className}`}>
      {children}
    </div>
  );
}

export default function ErrorPortal({ message, reload = false, onClose }: ErrorPortalProps) {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <GlassCard className="max-w-md w-full mx-4 text-center">
        <div className="text-white text-lg mb-4">{message}</div>
        <div className="flex gap-3 justify-center">
          {reload ? (
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <RefreshCw size={16} />
              Reload
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              OK
            </button>
          )}
        </div>
      </GlassCard>
    </div>,
    document.body
  );
} 