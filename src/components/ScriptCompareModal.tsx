import React, { useState, useEffect } from 'react';
import { ContentDnaPattern } from '../types';
import { X, Wand2, Copy, Check, Sparkles, ArrowLeft, Dna, Eye, ThumbsUp, Flame, Play, FileText, Send } from 'lucide-react';

interface ScriptCompareModalProps {
  creatorHandle: string;
  pattern: ContentDnaPattern;
  userPersonalHandle?: string;
  onSaveUserHandle?: (handle: string) => void;
  onClose: () => void;
}

export const ScriptCompareModal: React.FC<ScriptCompareModalProps> = ({
  creatorHandle,
  pattern,
  userPersonalHandle = '',
  onSaveUserHandle,
  onClose,
}) => {
  const [userHandleInput, setUserHandleInput] = useState(userPersonalHandle);
  const [userNiche, setUserNiche] = useState('Tech & AI SaaS');
  const [activeUserHandle, setActiveUserHandle] = useState(userPersonalHandle || 'your_handle');

  const [copiedHook, setCopiedHook] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [generatedHook, setGeneratedHook] = useState('');
  const [generatedCaption, setGeneratedCaption] = useState('');

  // Sync if userPersonalHandle changes
  useEffect(() => {
    if (userPersonalHandle && !userHandleInput) {
      setUserHandleInput(userPersonalHandle);
      setActiveUserHandle(userPersonalHandle);
    }
  }, [userPersonalHandle]);

  // Main Generator Function triggered by user click or input
  const runPersonalizedAnalysis = (overrideHandle?: string, overrideNiche?: string) => {
    const handleToUse = (overrideHandle !== undefined ? overrideHandle : userHandleInput).trim().replace(/^@/, '') || 'your_handle';
    const nicheToUse = (overrideNiche !== undefined ? overrideNiche : userNiche).trim() || 'your niche';

    setActiveUserHandle(handleToUse);
    if (onSaveUserHandle && handleToUse !== 'your_handle') {
      onSaveUserHandle(handleToUse);
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      // 1. Generate Structured Hook Script
      let baseHook = pattern.typicalHookOrCaption;
      baseHook = baseHook
        .replace(/\[audience\]/g, `${nicheToUse} creators`)
        .replace(/\[common advice\]/g, 'posting 3x a day without hook strategy')
        .replace(/\[bad outcome\]/g, 'stay stuck under 500 views')
        .replace(/\[topic\]/g, nicheToUse);

      const scriptSections = [
        {
          label: 'POPULAR BELIEF',
          text: `Most creators in ${nicheToUse} are told the only way to win on Reels is to post 3x a day without a proven hook strategy.`,
        },
        {
          label: 'DISAGREEMENT',
          text: `But in my experience that's backwards — and it's exactly why so many creators give up under 500 views.`,
        },
        {
          label: 'THE REAL REASON',
          text: `The thing that actually moves the needle isn't effort, it's focusing on the 1.2-second pattern interrupt that stops the scroll.`,
        },
        {
          label: 'OUR EVIDENCE',
          text: `When @${handleToUse} applied @${creatorHandle}'s exact viral formula in ${nicheToUse}, reach skyrocketed without spending a dollar on ads.`,
        },
        {
          label: 'PRACTICAL LESSON',
          text: `So don't add more noise. State a bold contrarian truth in the first 2 seconds, then deliver 3 rapid takeaways.`,
        },
        {
          label: 'CALL TO ACTION',
          text: `Comment "VIRAL" below and @${handleToUse} will DM you the complete blueprint — or grab it via the link in bio.`,
        },
      ];

      const fullScriptText = scriptSections.map((s) => `${s.label}:\n${s.text}`).join('\n\n');

      // 2. Generate Instagram Caption
      const caption = `Stop making this huge mistake in ${nicheToUse} 👇

Most people think you need to spend hours creating content or pay for ads. But @${handleToUse} used @${creatorHandle}'s exact formula to get massive reach in under 30 seconds.

Here is the 3-step breakdown for @${handleToUse}:
1️⃣ HOOK: Say "${baseHook.slice(0, 50)}..." in the first 1.5 seconds.
2️⃣ BODY: Show the exact result on camera while delivering 3 rapid takeaways.
3️⃣ CTA: Comment "VIRAL" below and I'll DM you the complete @${handleToUse} blueprint!

💾 Save this Reel to record your version today.
📌 Follow @${handleToUse} for daily ${nicheToUse} growth breakdowns.`;

      setGeneratedHook(fullScriptText);
      setGeneratedCaption(caption);
      setIsAnalyzing(false);
    }, 400);
  };

  // Initial auto run
  useEffect(() => {
    runPersonalizedAnalysis(userHandleInput, userNiche);
  }, [pattern]);

  const handleCopyHook = () => {
    navigator.clipboard.writeText(generatedHook);
    setCopiedHook(true);
    setTimeout(() => setCopiedHook(false), 2000);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const formattedUserHandle = `@${activeUserHandle.replace(/^@/, '')}`;

  const nicheToUse = userNiche || 'your niche';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-center items-start p-3 sm:p-6 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-3xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative my-4 sm:my-8">
        
        {/* Modal Top Control Bar with Clear Back Button */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3.5 py-2 rounded-xl transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Back to Report</span>
          </button>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors flex items-center gap-1 text-xs font-mono"
            title="Close modal"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>

        {/* Modal Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-medium">
            <Wand2 className="w-3.5 h-3.5" />
            <span>Personalized Script Generator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Compare @{creatorHandle} vs <span className="text-indigo-400">{formattedUserHandle}</span>
          </h2>
          <p className="text-xs text-zinc-400 font-sans">
            Tailored script breakdown formatted for recording and posting.
          </p>
        </div>

        {/* Handle & Niche Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            runPersonalizedAnalysis();
          }} 
          className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-inner"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 font-bold uppercase">
            <Dna className="w-4 h-4 text-indigo-400" />
            <span>Personalize Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Your Instagram Username</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500 font-mono text-xs">@</span>
                <input
                  type="text"
                  value={userHandleInput}
                  onChange={(e) => setUserHandleInput(e.target.value)}
                  placeholder="your_handle"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg pl-7 pr-3 py-2 text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Your Niche / Industry</label>
              <input
                type="text"
                value={userNiche}
                onChange={(e) => setUserNiche(e.target.value)}
                placeholder="e.g. AI SaaS, Fitness, Finance"
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* ENTER BUTTON */}
            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-mono font-bold text-xs py-2 px-3 rounded-lg transition-all shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isAnalyzing ? 'Adapting...' : 'Analyze & Adapt'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* STACKED OUTPUTS: Hook Script (Teleprompter style) on top, Caption directly below */}
        <div className="space-y-6">
          
          {/* SECTION 1: Teleprompter Script (Formatted like user's uploaded image) */}
          <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl">
            
            {/* Teleprompter Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
                  SCRIPT · 60S
                </span>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">
                  Teleprompter View
                </span>
              </div>

              <button
                onClick={handleCopyHook}
                className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 px-3.5 py-1.5 rounded-lg transition-all shadow-sm"
              >
                {copiedHook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHook ? 'Copied script!' : 'Copy script'}</span>
              </button>
            </div>

            {/* Structured Script Sections with Left Border Lines (Matching user's image) */}
            <div className="space-y-4 font-sans text-sm">
              
              {/* 1. Popular Belief */}
              <div className="border-l-2 border-zinc-700 pl-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">
                  POPULAR BELIEF
                </span>
                <p className="text-zinc-200 leading-relaxed font-normal">
                  Most creators in {nicheToUse} are told the way to win on Reels is to post 3x a day without a proven hook strategy.
                </p>
              </div>

              {/* 2. Disagreement */}
              <div className="border-l-2 border-zinc-700 pl-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">
                  DISAGREEMENT
                </span>
                <p className="text-zinc-200 leading-relaxed font-normal">
                  But in my experience that's backwards — and it's exactly why so many creators give up under 500 views.
                </p>
              </div>

              {/* 3. The Real Reason */}
              <div className="border-l-2 border-zinc-700 pl-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">
                  THE REAL REASON
                </span>
                <p className="text-zinc-200 leading-relaxed font-normal">
                  The thing that actually moves the needle isn't effort, it's focusing on the 1.2-second pattern interrupt that stops the scroll.
                </p>
              </div>

              {/* 4. Our Evidence */}
              <div className="border-l-2 border-indigo-500/80 pl-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
                  OUR EVIDENCE
                </span>
                <p className="text-zinc-200 leading-relaxed font-normal">
                  When <span className="text-indigo-300 font-semibold">{formattedUserHandle}</span> applied @{creatorHandle}'s exact viral formula in {nicheToUse}, reach skyrocketed without spending a dollar on ads.
                </p>
              </div>

              {/* 5. Practical Lesson */}
              <div className="border-l-2 border-zinc-700 pl-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">
                  PRACTICAL LESSON
                </span>
                <p className="text-zinc-200 leading-relaxed font-normal">
                  So don't add more noise. State a bold contrarian truth in the first 2 seconds, then deliver 3 rapid proof points.
                </p>
              </div>

              {/* 6. Call to Action */}
              <div className="border-l-2 border-purple-500/80 pl-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold block">
                  CALL TO ACTION
                </span>
                <p className="text-zinc-200 leading-relaxed font-normal">
                  Comment <span className="text-purple-300 font-bold">"VIRAL"</span> below and {formattedUserHandle} will DM you the complete breakdown — or grab it via the link in bio.
                </p>
              </div>

            </div>

            {/* Copy Script Bottom Callout */}
            <div className="pt-2">
              <button
                onClick={handleCopyHook}
                className="w-full flex items-center justify-center gap-2 text-xs font-mono font-bold text-white bg-indigo-600 hover:bg-indigo-500 py-2.5 px-4 rounded-xl transition-all shadow-md"
              >
                {copiedHook ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedHook ? 'Copied Full Script!' : 'Copy Full Script to Teleprompter'}</span>
              </button>
            </div>

          </div>

          {/* SECTION 2: Stacked Directly Below — Personalized Instagram Caption */}
          <div className="bg-zinc-900/90 border border-purple-500/30 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-purple-300 font-bold flex items-center gap-1.5 uppercase">
                <FileText className="w-4 h-4 text-purple-400" />
                Personalized Caption (Post Text)
              </span>
              <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded">
                With CTA & Handle
              </span>
            </div>

            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <p className="text-xs font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {generatedCaption}
              </p>
            </div>

            <button
              onClick={handleCopyCaption}
              className="w-full flex items-center justify-center gap-2 text-xs font-mono font-bold text-white bg-purple-600 hover:bg-purple-500 py-2.5 px-4 rounded-xl transition-all shadow-md"
            >
              {copiedCaption ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCaption ? 'Copied Caption!' : 'Copy Post Caption'}</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar with Back Button for easy exit after copying */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Back to Report</span>
          </button>

          <span className="text-[11px] font-mono text-zinc-500">
            Ready to record on camera
          </span>
        </div>

      </div>
    </div>
  );
};
