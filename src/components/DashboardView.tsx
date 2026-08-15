import React, { useState } from 'react';
import { Search, User, History, Sparkles, TrendingUp, Dna, ArrowRight, Zap, ExternalLink, Bookmark } from 'lucide-react';
import { FEATURED_HANDLES } from '../data/mockReports';

interface DashboardViewProps {
  userPersonalHandle: string;
  savedHandles: string[];
  onAnalyze: (handle: string) => void;
  onOpenUserHandleModal: () => void;
  onOpenSavedHandlesModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userPersonalHandle,
  savedHandles,
  onAnalyze,
  onOpenUserHandleModal,
  onOpenSavedHandlesModal,
}) => {
  const [inputHandle, setInputHandle] = useState('');
  const [error, setError] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputHandle.trim().replace(/^@/, '');
    if (!clean) {
      setError('Please enter an Instagram handle to analyze');
      return;
    }
    onAnalyze(clean);
  };

  const handleQuickAnalyze = (h: string) => {
    onAnalyze(h);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      
      {/* Top Banner: User Greeting & Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-zinc-900 to-purple-950/60 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Signed In Creator Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-indigo-400">@{userPersonalHandle || 'creator'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-xl">
              Your personalized virality dashboard. Analyze any handle below or access your saved report history.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenUserHandleModal}
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-mono font-bold px-4 py-2.5 rounded-xl transition-all shadow-md"
            >
              <User className="w-4 h-4 text-emerald-400" />
              <span>Edit Handle (@{userPersonalHandle || 'set'})</span>
            </button>
          </div>
        </div>

        {/* Search Bar inside Dashboard */}
        <form onSubmit={handleSearchSubmit} className="pt-2 relative z-10 max-w-2xl">
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <span className="absolute left-4 top-3.5 text-zinc-500 font-mono text-sm">@</span>
              <input
                type="text"
                value={inputHandle}
                onChange={(e) => {
                  setInputHandle(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter Instagram handle to analyze..."
                className="w-full bg-zinc-950/90 border border-zinc-800 text-white rounded-2xl pl-9 pr-4 py-3.5 text-sm font-mono focus:outline-none focus:border-indigo-500 shadow-inner"
              />
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Analyze Virality DNA</span>
            </button>
          </div>
          {error && <p className="text-xs text-rose-400 font-mono mt-1.5 pl-2">{error}</p>}
        </form>
      </div>

      {/* SECTION 1: Saved & Recent Analyzed Reports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Your Saved Handle Reports</h2>
          </div>
          <button
            onClick={onOpenSavedHandlesModal}
            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Manage All ({savedHandles.length}) →
          </button>
        </div>

        {savedHandles.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-8 text-center space-y-2">
            <p className="text-sm font-mono text-zinc-400">No saved handles yet.</p>
            <p className="text-xs text-zinc-500">Analyze your first handle above to save its virality patterns.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedHandles.map((h) => (
              <div
                key={h}
                onClick={() => handleQuickAnalyze(h)}
                className="bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 rounded-2xl p-4 transition-all cursor-pointer group space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-sm uppercase">
                      {h.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                        @{h}
                      </h3>
                      <span className="text-[10px] font-mono text-emerald-400">Saved Report</span>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-zinc-800 group-hover:bg-indigo-600 flex items-center justify-center text-zinc-400 group-hover:text-white transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-zinc-800/80">
                  <span>Virality Index: 92%</span>
                  <span className="text-indigo-400">Open Report →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Featured Creator Benchmarks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Featured Virality Formulas</h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">1-Click DNA Extraction</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_HANDLES.map((f) => (
            <div
              key={f.handle}
              onClick={() => handleQuickAnalyze(f.handle)}
              className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-purple-500/50 rounded-2xl p-4 transition-all cursor-pointer group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                    @{f.handle}
                  </span>
                  <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded">
                    {f.followers}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-sans line-clamp-2">
                  {f.desc}
                </p>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-1.5 text-xs font-mono font-semibold bg-zinc-800 group-hover:bg-purple-600 text-zinc-300 group-hover:text-white py-2 rounded-xl transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:text-white" />
                <span>Analyze Formula</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
