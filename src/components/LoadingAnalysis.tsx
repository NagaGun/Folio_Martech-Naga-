import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Film, Dna, ArrowLeft } from 'lucide-react';

interface LoadingAnalysisProps {
  handle: string;
  isReady?: boolean;
  onComplete: () => void;
  onBack?: () => void;
}

const STEPS = [
  { id: 1, label: 'Indexing public Reels feed for @handle...' },
  { id: 2, label: 'Connecting to Apify Actor & scraping Instagram feed...' },
  { id: 3, label: 'Extracting audio hooks & visual pattern interrupts...' },
  { id: 4, label: 'Analyzing caption psychology, CTAs & hashtags...' },
  { id: 5, label: 'Gemini 2.5 Flash synthesizing reel_DNA viral formula...' },
];

export const LoadingAnalysis: React.FC<LoadingAnalysisProps> = ({
  handle,
  isReady = false,
  onComplete,
  onBack,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [analyzedCount, setAnalyzedCount] = useState(0);

  // Step progression effect
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          return prev;
        }
      });
    }, 1200);

    const counterInterval = setInterval(() => {
      setAnalyzedCount((prev) => {
        if (prev < 48) {
          return prev + Math.floor(Math.random() * 5) + 1;
        } else {
          return prev;
        }
      });
    }, 200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(counterInterval);
    };
  }, []);

  // Watch for isReady prop or max timeout
  useEffect(() => {
    if (isReady) {
      setCurrentStepIndex(STEPS.length - 1);
      setAnalyzedCount(48);
      const timer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(timer);
    }

    // Safety fallback timeout: allow plenty of time for live Apify + Gemini analysis.
    const safetyTimer = setTimeout(() => {
      onComplete();
    }, 180000);

    return () => clearTimeout(safetyTimer);
  }, [isReady, onComplete]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Back Navigation */}
      {onBack && (
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-300 hover:text-white bg-zinc-900/90 border border-zinc-800 px-3.5 py-2 rounded-xl transition-all shadow-md backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Back to Search</span>
          </button>
        </div>
      )}

      <div className="max-w-md w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-xl space-y-6 text-center">
        {/* Animated DNA Loader Header */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-spin blur-md opacity-50" />
          <div className="relative w-full h-full bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center">
            <Dna className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
        </div>

        {/* Status text */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Analyzing <span className="font-mono text-indigo-400">@{handle}</span>
          </h2>
          <p className="text-xs font-mono text-zinc-400 flex items-center justify-center gap-2">
            <Film className="w-3.5 h-3.5 text-indigo-400" />
            <span>{analyzedCount} Reels scanned & indexed</span>
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-500 ease-out"
            style={{
              width: isReady ? '100%' : `${Math.min(92, ((currentStepIndex + 1) / STEPS.length) * 100)}%`,
            }}
          />
        </div>

        {/* Live Scraper Notice */}
        <div className="py-2 px-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-[11px] font-mono text-zinc-300 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Scraping live Reels via Apify & Gemini 2.5...</span>
        </div>

        {/* Step Checklist */}
        <div className="space-y-2.5 text-left pt-2 border-t border-zinc-800/80">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex || isReady;
            const isCurrent = idx === currentStepIndex && !isReady;
            const stepText = step.label.replace('@handle', `@${handle}`);

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 text-xs font-mono transition-opacity duration-200 ${
                  isDone
                    ? 'text-zinc-300 opacity-100'
                    : isCurrent
                    ? 'text-indigo-300 font-semibold opacity-100'
                    : 'text-zinc-600 opacity-50'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />
                )}
                <span className="truncate">{stepText}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom Cancel / Back action */}
        {onBack && (
          <div className="pt-2">
            <button
              onClick={onBack}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 underline transition-colors"
            >
              Cancel analysis & go back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
