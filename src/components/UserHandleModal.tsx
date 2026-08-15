import React, { useState } from 'react';
import { X, User, Sparkles, Check, AtSign } from 'lucide-react';

interface UserHandleModalProps {
  currentHandle: string;
  onSaveHandle: (handle: string) => void;
  onClose: () => void;
}

export const UserHandleModal: React.FC<UserHandleModalProps> = ({
  currentHandle,
  onSaveHandle,
  onClose,
}) => {
  const [handleInput, setHandleInput] = useState(currentHandle);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handleInput.trim().replace(/^@/, '');
    if (clean) {
      onSaveHandle(clean);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-medium">
            <User className="w-3.5 h-3.5" />
            <span>My Creator Profile</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Set Your Instagram Handle</h2>
          <p className="text-xs text-zinc-400 font-sans">
            Enter your Instagram handle once. It will automatically be used across all script generators and side-by-side formula adapters.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300 block">Your Instagram Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 font-mono">
                @
              </div>
              <input
                type="text"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder="e.g. alex_creator"
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                autoFocus
              />
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl flex items-start gap-2.5 text-xs text-zinc-400">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Once saved, clicking "Turn this into my script" on any creator's reel will instantly customize the formula for <span className="text-indigo-300 font-mono">@{handleInput || 'your_handle'}</span>.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-mono font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Profile</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
