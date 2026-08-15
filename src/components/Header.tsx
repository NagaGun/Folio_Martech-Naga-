import React from 'react';
import { Dna, History, User, Search, LogIn, Key } from 'lucide-react';

interface HeaderProps {
  currentHandle?: string | null;
  userPersonalHandle?: string;
  savedHandlesCount?: number;
  isApifyActive?: boolean;
  onResetSearch?: () => void;
  onGoToDashboard?: () => void;
  onOpenSavedHandles?: () => void;
  onOpenUserHandleModal?: () => void;
  onOpenSignIn?: () => void;
  onOpenApifyModal?: () => void;
  isReportView?: boolean;
  isLanding?: boolean;
  isDashboardView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentHandle,
  userPersonalHandle,
  savedHandlesCount = 0,
  isApifyActive = false,
  onResetSearch,
  onGoToDashboard,
  onOpenSavedHandles,
  onOpenUserHandleModal,
  onOpenSignIn,
  onOpenApifyModal,
  isReportView = false,
  isLanding = false,
  isDashboardView = false,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/85 border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Section: Brand logo in top left corner */}
        <div className="flex items-center gap-3">
          <div 
            onClick={onGoToDashboard || onResetSearch}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
                <Dna className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white tracking-tight text-lg">
                  reel<span className="text-indigo-400 font-mono">_DNA</span>
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">Virality Intelligence for Reels</p>
            </div>
          </div>
        </div>

        {/* Top Navigation Menu Bar */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Apify API Token Status Button */}
          {onOpenApifyModal && (
            <button
              onClick={onOpenApifyModal}
              className={`flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                isApifyActive
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:border-emerald-500/60'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              title="Apify Live Scraper Configuration & Status"
            >
              <Key className={`w-3.5 h-3.5 ${isApifyActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span className="hidden md:inline">
                {isApifyActive ? 'Apify Active' : 'Apify Token'}
              </span>
              <span className={`w-2 h-2 rounded-full ${isApifyActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            </button>
          )}

          {!isLanding && (
            <>
              {/* Search Analyzer Button */}
              <button
                onClick={onResetSearch}
                className={`flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  !isReportView && !isDashboardView
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search Handle</span>
              </button>

              {/* Stored Handles Button */}
              <button
                onClick={onOpenSavedHandles}
                className="flex items-center gap-1.5 text-xs font-mono font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg transition-all relative group"
                title="Saved Analyzed Handles"
              >
                <History className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Saved Handles</span>
                {savedHandlesCount > 0 && (
                  <span className="ml-0.5 bg-indigo-600 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                    {savedHandlesCount}
                  </span>
                )}
              </button>

              {/* My Handle Profile Button */}
              <button
                onClick={onOpenUserHandleModal}
                className={`flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  userPersonalHandle
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:border-emerald-500/50'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
                title="Set your Instagram handle for script generation"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="max-w-[100px] sm:max-w-[140px] truncate">
                  {userPersonalHandle ? `@${userPersonalHandle}` : 'My Handle'}
                </span>
              </button>
            </>
          )}

          {/* Quick Sign In / Dashboard Button */}
          {userPersonalHandle ? (
            <button
              onClick={onGoToDashboard}
              className={`flex items-center gap-1.5 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-lg border transition-all shadow-md ${
                isDashboardView
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/80'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          ) : (
            <button
              onClick={onOpenSignIn}
              className="flex items-center gap-1.5 text-xs font-mono font-semibold bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 px-3.5 py-1.5 rounded-lg transition-all shadow-md"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

        </nav>

      </div>
    </header>
  );
};
