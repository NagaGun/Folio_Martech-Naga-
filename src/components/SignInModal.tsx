import React, { useState } from 'react';
import { X, LogIn, ArrowRight, Dna, ShieldCheck, Sparkles } from 'lucide-react';

interface SignInModalProps {
  onClose: () => void;
  onSignInSuccess: (userHandle: string) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  onClose,
  onSignInSuccess,
}) => {
  const [handleOrEmail, setHandleOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = handleOrEmail.trim().replace(/^@/, '');
    if (!cleaned) {
      setError('Please enter your Instagram handle or email address');
      return;
    }

    // Sign in success callback
    onSignInSuccess(cleaned);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">Sign In to reel_DNA</h3>
              <p className="text-[11px] text-zinc-400">Quick access to saved virality reports</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300 font-bold block">
              Instagram Handle or Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-zinc-500 font-mono text-xs">@</span>
              <input
                type="text"
                value={handleOrEmail}
                onChange={(e) => {
                  setHandleOrEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="your_handle or name@domain.com"
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-7 pr-3 py-2.5 text-xs font-mono focus:outline-none focus:border-indigo-500"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300 font-bold block">
              Password or Access PIN
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-medium font-mono">{error}</p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.01]"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In & Enter Dashboard</span>
            </button>
          </div>
        </form>

        {/* Quick Demo Access */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-2">
          <p className="text-[11px] text-zinc-500 font-mono text-center">
            Want to test instant access without credentials?
          </p>
          <button
            type="button"
            onClick={() => onSignInSuccess('creator_pro')}
            className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs py-2 px-3 rounded-xl transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Instant Demo Sign-In (@creator_pro)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
