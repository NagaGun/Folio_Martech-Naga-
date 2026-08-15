import React, { useState } from 'react';
import { CreatorReport, ContentDnaPattern } from '../types';
import { ScriptCompareModal } from './ScriptCompareModal';
import { HookVideoCard } from './HookVideoCard';
import { 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  ThumbsUp, 
  ShieldCheck, 
  Wand2,
  Film,
  ArrowLeft,
  Zap,
  ArrowRight,
  Lightbulb
} from 'lucide-react';

interface ReportViewProps {
  report: CreatorReport;
  userPersonalHandle?: string;
  onSaveUserHandle?: (handle: string) => void;
  onNewSearch: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  userPersonalHandle = '',
  onSaveUserHandle,
  onNewSearch,
}) => {
  // Nested structure & process toggles state
  const [expandedPatternIds, setExpandedPatternIds] = useState<Record<string, boolean>>({});
  
  // Script compare modal state
  const [modalPattern, setModalPattern] = useState<ContentDnaPattern | null>(null);

  // Toggle nested evidence drawer ("See structure & process")
  const togglePatternEvidence = (id: string) => {
    setExpandedPatternIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formattedUserHandle = userPersonalHandle ? `@${userPersonalHandle}` : 'your_handle';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-12 font-sans">
      
      {/* HEADER CONTROL BAR WITH BACK BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onNewSearch}
            className="flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-300 hover:text-white bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded-lg transition-all shrink-0"
            title="Return to search"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Back</span>
          </button>

          <img
            src={report.avatarUrl}
            alt={report.displayName}
            className="w-10 h-10 rounded-lg object-cover ring-1 ring-zinc-700 bg-zinc-800 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">@{report.handle}</span>
              {report.verified && <ShieldCheck className="w-4 h-4 text-sky-400" />}
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {report.archetype}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              {report.followerCount} followers • {report.totalReelsAnalyzed} Reels indexed • {report.avgViralViews} avg viral views
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewSearch}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-semibold px-3.5 py-2 rounded-lg transition-all shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Analyze Another Handle</span>
          </button>
        </div>
      </div>

      {/* PROMINENT ACTION BANNER: COMPARE MY INSTAGRAM HANDLE */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-zinc-900/90 border border-indigo-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            <Zap className="w-3.5 h-3.5" />
            <span>Compare My Handle vs @{report.handle}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Adapt @{report.handle}'s viral formula for <span className="text-indigo-300">{formattedUserHandle}</span>
          </h3>
          <p className="text-xs text-zinc-300 max-w-xl">
            Click below to generate a tailored on-camera hook script and Instagram caption customized for your account.
          </p>
        </div>

        <button
          onClick={() => setModalPattern(report.hooks[0])}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg hover:scale-102 shrink-0"
        >
          <Wand2 className="w-4 h-4" />
          <span>Compare Handles & Generate Script</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>


      {/* SECTION 01: The Read */}
      <section className="space-y-6 pt-2">
        <div className="flex items-baseline gap-2 border-b border-zinc-800/80 pb-3">
          <span className="font-mono text-xs text-zinc-500 font-medium">01</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">The read</h2>
        </div>

        {/* Synthesis Paragraph */}
        <p className="text-zinc-200 text-base sm:text-lg leading-relaxed font-normal max-w-4xl">
          {report.theRead.synthesisText}
        </p>

        {/* Two Columns: Who they speak to & Content Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Who They Speak To */}
          <div className="space-y-2.5">
            <h3 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
              WHO THEY SPEAK TO
            </h3>
            <div className="flex flex-wrap gap-2">
              {report.theRead.whoTheySpeakTo.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-zinc-900 border border-zinc-800/90 text-zinc-200 text-xs px-3 py-1.5 rounded-lg font-sans shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Content Pillars */}
          <div className="space-y-2.5">
            <h3 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
              CONTENT PILLARS
            </h3>
            <div className="flex flex-wrap gap-2">
              {report.theRead.contentPillars.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-zinc-900 border border-zinc-800/90 text-zinc-200 text-xs px-3 py-1.5 rounded-lg font-sans shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {report.topViralExamples && report.topViralExamples.length > 0 && (
        <section className="space-y-6 pt-2">
          <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
            <span className="font-mono text-xs text-zinc-500 font-medium">02</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Top viral examples</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {report.topViralExamples.map((example) => (
              <div key={example.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3 space-y-3">
                {example.videoThumbnail ? (
                  <img src={example.videoThumbnail} alt={example.title} className="w-full aspect-[9/16] object-cover rounded-xl" />
                ) : (
                  <div className="w-full aspect-[9/16] rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
                    No preview available
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">{example.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-3">{example.caption}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{example.views || '—'}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{example.likes || '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 03: TOP VIRAL HOOKS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs text-zinc-500 font-medium">03</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Top Viral Hooks for @{report.handle}</h2>
          </div>
          <span className="text-xs font-mono text-indigo-400 flex items-center gap-1 font-semibold">
            <Film className="w-3.5 h-3.5" />
            4 Hook Formulas with Video Examples
          </span>
        </div>

        {/* Grid of 4 Hook Cards with embedded video preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {report.hooks.map((pattern) => {
            const isExpanded = !!expandedPatternIds[pattern.id];

            return (
              <div
                key={pattern.id}
                className="w-full max-w-[420px] mx-auto bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3 hover:border-zinc-700/80 transition-all flex flex-col justify-between shadow-xl"
              >
                {/* Card Top Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${pattern.dotColor}`} />
                      <h3 className="text-base font-bold text-white tracking-tight">{pattern.title}</h3>
                    </div>
                    <span className="text-xs font-mono text-zinc-500">{pattern.frequency}</span>
                  </div>

                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    {pattern.description}
                  </p>

                  {/* Visual Example Hook Reel Video Preview Card */}
                  <div className="pt-1">
                    <HookVideoCard
                      creatorHandle={report.handle}
                      avatarUrl={report.avatarUrl}
                      pattern={pattern}
                    />
                  </div>

                  {/* PROMINENT WHY IT WORKS CALLOUT ON CARD */}
                  <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-purple-300 tracking-wider font-bold flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-purple-400" />
                      WHY IT WORKS FOR @{report.handle}
                    </span>
                    <p className="text-xs text-zinc-200 leading-relaxed font-sans">
                      {pattern.evidence.whyItWorks}
                    </p>
                  </div>

                  {/* Typical Hook Formula Code Box */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-bold block">
                      TYPICAL HOOK SCRIPT FORMULA
                    </span>
                    <p className="text-xs font-mono text-zinc-200 leading-relaxed font-medium">
                      {pattern.typicalHookOrCaption}
                    </p>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setModalPattern(pattern)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Turn this into my script</span>
                    </button>

                    <button
                      onClick={() => togglePatternEvidence(pattern.id)}
                      className="text-xs font-sans text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/80 px-3 py-2.5 rounded-xl transition-colors flex items-center gap-1 shrink-0"
                    >
                      <span>{isExpanded ? 'Hide structure' : 'See structure & process'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Nested Accordion Drawer: Structure & Process (Evidence) */}
                  {isExpanded && (
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3 text-xs font-sans animate-fadeIn">
                      <div className="flex items-center justify-between text-zinc-400 font-mono text-[11px] pb-1 border-b border-zinc-800">
                        <span className="flex items-center gap-1 text-indigo-400 font-bold">
                          <Eye className="w-3.5 h-3.5" />
                          {pattern.evidence.views} views
                        </span>
                        <span className="flex items-center gap-1 text-pink-400 font-bold">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          {pattern.evidence.likes} likes
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Example Quote</span>
                        <p className="text-zinc-200 italic font-medium">
                          "{pattern.evidence.quote}"
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Visual Mechanics</span>
                        <p className="text-zinc-300">
                          {pattern.evidence.visual}
                        </p>
                      </div>

                      {pattern.evidence.tryThisSuggestion && (
                        <div className="bg-indigo-950/40 border border-indigo-500/20 p-2.5 rounded-lg space-y-0.5">
                          <span className="text-[10px] font-mono text-indigo-300 uppercase font-bold block">Try This</span>
                          <p className="text-indigo-200 text-[11px]">
                            {pattern.evidence.tryThisSuggestion}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* SECTION 04: Opportunities */}
      <section className="space-y-6 pt-2">
        <div className="flex items-baseline gap-2 border-b border-zinc-800/80 pb-3">
          <span className="font-mono text-xs text-zinc-500 font-medium">04</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">Growth & Content Opportunities for @{report.handle}</h2>
        </div>

        {/* Green Spark Bullet Items */}
        <div className="space-y-3">
          {report.opportunities.map((opp) => (
            <div key={opp.id} className="flex items-start gap-3 bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-xl group hover:border-emerald-500/40 transition-all">
              <span className="text-emerald-400 font-bold text-lg leading-none shrink-0 pt-0.5">
                ✦
              </span>
              <p className="text-zinc-200 text-sm sm:text-base leading-relaxed font-normal">
                {opp.text}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* SCRIPT & HANDLE COMPARISON MODAL */}
      {modalPattern && (
        <ScriptCompareModal
          creatorHandle={report.handle}
          pattern={modalPattern}
          userPersonalHandle={userPersonalHandle}
          onSaveUserHandle={onSaveUserHandle}
          onClose={() => setModalPattern(null)}
        />
      )}

    </div>
  );
};
