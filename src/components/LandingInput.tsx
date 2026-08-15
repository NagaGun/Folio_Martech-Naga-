import React, { useState } from 'react';
import { Sparkles, ArrowRight, TrendingUp, Zap, FileText, UserCheck, Repeat, Dna } from 'lucide-react';
import { FEATURED_HANDLES } from '../data/mockReports';

interface LandingInputProps {
  onAnalyze: (handle: string) => void;
  userPersonalHandle?: string;
  onSaveUserHandle?: (handle: string) => void;
  onOpenSignIn?: () => void;
}

export const LandingInput: React.FC<LandingInputProps> = ({ 
  onAnalyze, 
  userPersonalHandle = '',
  onSaveUserHandle,
  onOpenSignIn,
}) => {
  const [mode, setMode] = useState<'single' | 'compare'>('single');
  const [handle, setHandle] = useState('');
  const [myHandle, setMyHandle] = useState(userPersonalHandle);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = handle.trim().replace(/^@/, '').replace(/https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '');
    if (!cleaned) {
      setError('Please enter an Instagram handle to analyze');
      return;
    }

    if (mode === 'compare') {
      const cleanMyHandle = myHandle.trim().replace(/^@/, '');
      if (cleanMyHandle && onSaveUserHandle) {
        onSaveUserHandle(cleanMyHandle);
      }
    }

    setError('');
    onAnalyze(cleaned);
  };

  const handleSelectPreset = (presetHandle: string) => {
    setHandle(`@${presetHandle}`);
    setError('');
    onAnalyze(presetHandle);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background ambient glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl w-full text-center relative z-10 space-y-8">
        
        {/* Header Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-mono tracking-wide shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Instagram Reels Virality Intelligence</span>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
            Deconstruct any creator's <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              viral reel formula.
            </span>
          </h1>
          
          <p className="text-base sm:text-xl text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed">
            See the hooks, patterns, and caption structure behind their best Reels — then personalize them for your handle.
          </p>

          {/* Landing Page Quick Sign-In Shortcut */}
          <div className="pt-1">
            <button
              type="button"
              onClick={onOpenSignIn}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold transition-all hover:scale-105 shadow-md"
            >
              <span>Already a user? Quick Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          </div>
        </div>

        {/* Single vs Compare Mode Toggle */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all border ${
              mode === 'single'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            Analyze Creator Handle
          </button>
          
          <button
            type="button"
            onClick={() => setMode('compare')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all border flex items-center gap-1.5 ${
              mode === 'compare'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <Repeat className="w-3.5 h-3.5 text-amber-400" />
            <span>Compare My Handle vs Creator</span>
          </button>
        </div>

        {/* Main Input Form */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto w-full space-y-3">
          
          {mode === 'single' ? (
            /* Single Handle Input */
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-300 blur-sm"></div>
              
              <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-2 shadow-2xl focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/80 transition-all">
                <div className="pl-3.5 text-zinc-500 font-mono text-base select-none">
                  @
                </div>
                
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => {
                    setHandle(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="creator handle (e.g. alexhormozi)"
                  className="w-full bg-transparent px-2.5 py-3 text-white placeholder-zinc-500 text-base sm:text-lg focus:outline-none font-sans"
                  autoFocus
                />

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold px-5 py-3 rounded-lg text-xs sm:text-sm transition-all shadow-lg shadow-indigo-600/25 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Analyze</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Dual Handle Compare Inputs */
            <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl shadow-2xl space-y-3 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* User's Handle */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-emerald-400 font-bold block flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Your Instagram Handle</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-zinc-500 font-mono text-xs">@</span>
                    <input
                      type="text"
                      value={myHandle}
                      onChange={(e) => setMyHandle(e.target.value)}
                      placeholder="your_handle"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-7 pr-3 py-2.5 text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Creator Target Handle */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-indigo-400 font-bold block flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Creator to Deconstruct</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-zinc-500 font-mono text-xs">@</span>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => {
                        setHandle(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="e.g. alexhormozi"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-7 pr-3 py-2.5 text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Enter / Analyze & Compare Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-mono font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-xl hover:scale-[1.01]"
              >
                <span>Analyze & Compare Handles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {error && (
            <p className="text-xs text-rose-400 font-medium text-left px-2">
              {error}
            </p>
          )}
        </form>

        {/* Presets / Popular Creator Chips */}
        <div className="pt-2 space-y-3 max-w-2xl mx-auto">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Try analyzing a featured creator:
          </p>
          
          <div className="flex flex-wrap justify-center gap-2">
            {FEATURED_HANDLES.map((preset) => (
              <button
                key={preset.handle}
                onClick={() => handleSelectPreset(preset.handle)}
                className="group flex items-center gap-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg px-3 py-1.5 transition-all text-left"
              >
                <span className="font-mono text-xs font-semibold text-indigo-300 group-hover:text-indigo-200">
                  @{preset.handle}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-medium group-hover:bg-zinc-700">
                  {preset.archetype}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Core Capabilities Preview Grid */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-sm space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2">
              <Zap className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">
              Pattern Interrupts
            </h2>
            <p className="text-xs text-zinc-400 leading-normal">
              Deconstruct opening visual frame rates, vocal cadences, and first 3-second audio hooks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-sm space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-2">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">
              Virality Psychology
            </h2>
            <p className="text-xs text-zinc-400 leading-normal">
              Identify cognitive dissonance, open loops, and loss aversion mechanics driving reach.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-sm space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-2">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">
              Caption Structure
            </h2>
            <p className="text-xs text-zinc-400 leading-normal">
              Break down opening line types, CTA placement, word counts, and hashtag cluster density.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
