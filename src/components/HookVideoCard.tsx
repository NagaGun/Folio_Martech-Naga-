import React, { useState, useRef } from 'react';
import { Play, Pause, Eye, ThumbsUp, Music, ShieldCheck, Sparkles, Film } from 'lucide-react';
import { ContentDnaPattern } from '../types';

interface HookVideoCardProps {
  creatorHandle: string;
  avatarUrl: string;
  pattern: ContentDnaPattern;
}

export const HookVideoCard: React.FC<HookVideoCardProps> = ({
  creatorHandle,
  avatarUrl,
  pattern,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const thumbnail = pattern.evidence.videoThumbnail || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80';
  const duration = pattern.evidence.videoDuration || '0:24';
  const hasRealVideo = Boolean(pattern.evidence.videoUrl);

  const togglePlay = () => {
    if (!hasRealVideo || !videoRef.current) {
      setIsPlaying(!isPlaying);
      return;
    }

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      return;
    }

    videoRef.current.play().catch(() => {
      setIsPlaying(false);
    });
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full max-w-[260px] mx-auto bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl group transition-all duration-300 hover:border-indigo-500/50">
      
      {/* Aspect ratio vertical frame (9:16 Reel ratio) */}
      <div className="relative aspect-[9/16] w-full bg-zinc-900 overflow-hidden flex items-center justify-center">
        
        {/* Background Image / Reel Frame */}
        {hasRealVideo ? (
          <video
            ref={videoRef}
            src={pattern.evidence.videoUrl}
            poster={thumbnail}
            loop
            preload="metadata"
            playsInline
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isPlaying ? 'scale-105 filter brightness-105 contrast-105' : 'scale-100 group-hover:scale-105 brightness-75'
            }`}
          />
        ) : (
          <img
            src={thumbnail}
            alt={pattern.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isPlaying ? 'scale-105 filter brightness-105 contrast-105' : 'scale-100 group-hover:scale-105 brightness-75'
            }`}
          />
        )}

        {/* Gradient Overlay for Instagram Reel aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />

        {/* Top Bar on Reel Frame */}
        <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
            <img src={avatarUrl} alt={creatorHandle} className="w-4 h-4 rounded-full object-cover" />
            <span className="text-[10px] font-bold text-white font-mono">@{creatorHandle}</span>
            <ShieldCheck className="w-3 h-3 text-sky-400" />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1">
              <Film className="w-3 h-3 text-indigo-400" />
              {duration}
            </span>
          </div>
        </div>

        {/* Play/Pause Central Trigger Button */}
        <button
          onClick={togglePlay}
          className={`absolute z-20 w-12 h-12 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 active:scale-95 ${
            hasRealVideo && isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}
          title={isPlaying ? 'Pause example reel' : 'Play example reel'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-white" />
          ) : (
            <Play className="w-5 h-5 fill-white ml-0.5" />
          )}
        </button>

        {/* Animated Equalizer Waveform when playing */}
        {isPlaying && (
          <div className="absolute top-3 right-3 z-20 flex items-end gap-0.5 h-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-indigo-500/30">
            <span className="w-0.5 bg-indigo-400 animate-bounce h-2" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 bg-indigo-400 animate-bounce h-3.5" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 bg-indigo-400 animate-bounce h-1.5" style={{ animationDelay: '300ms' }} />
            <span className="w-0.5 bg-indigo-400 animate-bounce h-3" style={{ animationDelay: '450ms' }} />
          </div>
        )}

        {/* Burned-in Subtitles / Hook Quote Text Overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-10 space-y-1.5">
          <div className="bg-black/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
            <span className="text-[9px] font-mono font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1 mb-0.5">
              <Sparkles className="w-3 h-3" />
              Visual Hook Quote
            </span>
            <p className="text-xs font-semibold text-white leading-tight italic drop-shadow-md">
              "{pattern.evidence.quote}"
            </p>
          </div>

          {/* Bottom stats & audio track bar */}
          <div className="flex items-center justify-between text-[10px] text-zinc-300 font-mono px-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <Eye className="w-3 h-3" />
                {pattern.evidence.views}
              </span>
              <span className="flex items-center gap-1 text-pink-400 font-bold">
                <ThumbsUp className="w-3 h-3" />
                {pattern.evidence.likes}
              </span>
            </div>

            <div className="flex items-center gap-1 text-zinc-400 truncate max-w-[130px]">
              <Music className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate">Original audio</span>
            </div>
          </div>
        </div>

      </div>

      {/* Video Caption mechanics footer summary */}
      <div className="bg-zinc-950 p-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <span className="text-zinc-300 truncate">
          <strong>Visual:</strong> {pattern.evidence.visual}
        </span>
        <span className="text-indigo-400 font-bold shrink-0 ml-2">
          {isPlaying ? 'Playing Demo' : 'Click to Play'}
        </span>
      </div>

    </div>
  );
};
