import { GoogleGenAI } from '@google/genai';
import { CreatorReport } from '../src/types.js';
import { ScrapedReel } from './apifyService.js';

export async function generateCreatorReportFromReels(
  handle: string,
  reels: ScrapedReel[]
): Promise<CreatorReport> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const reelsSummary = reels.map((r, i) => ({
    index: i + 1,
    views: r.playCount,
    likes: r.likeCount,
    caption: r.caption,
    thumbnail: r.displayUrl,
    videoUrl: r.videoUrl,
    url: r.url,
  }));

  const prompt = `
You are an expert Instagram Content Analyst and Virality Strategist for reel_DNA.
Analyze the following Instagram profile and reels data for user @${handle} to synthesize a comprehensive Virality DNA CreatorReport.

Scraped Reels Data:
${JSON.stringify(reelsSummary, null, 2)}

Instructions:
1. Identify creator details: displayName, estimated followerCount (e.g. "250K"), verified status (boolean), archetype ('Founder' | 'Content Creator' | 'Marketer' | 'Community Builder'), and a concise archetypeReason.
2. Use the provided reel data as the primary evidence. Do not invent a persona or content style that is not supported by the reels. Favor concrete observations from the captions, hooks, and video topics actually present in the scraped reels.
3. Provide 'theRead':
   - synthesisText: 2-3 sentence strategic breakdown of their positioning.
   - whoTheySpeakTo: Array of 3 target audience segments.
   - contentPillars: Array of 3-4 content pillars.
3. Provide 'bioRewrite':
   - originalBio: The current or estimated bio text of @${handle}.
   - rewrittenBio: An optimized, high-converting rewritten bio for @${handle} with clear value hook, target audience callout, proof point, and high-converting DM/Link CTA.
   - keyChanges: Array of 3 bullet points explaining key optimizations.
   - whyItWorks: Strategic explanation of why this rewritten bio drives higher follower conversion.
4. Provide a topViralExamples array of exactly 3 objects with fields { id, title, caption, videoUrl, videoThumbnail, views, likes, sourceReelId } based on the most compelling reels in the scraped set. Use the real scraped reel data whenever possible.
5. Identify EXACTLY 4 distinct Hook Patterns ('hooks'):
   - Each hook pattern MUST include: id (e.g. "h1", "h2"), title (e.g. "Contrarian Hook", "Pattern Interrupt Hook"), frequency (e.g. "4/10"), dotColor ("bg-indigo-500", "bg-purple-500", "bg-emerald-500", or "bg-amber-500"), accentBorder ("border-indigo-500/50", "border-purple-500/50", etc.), type ("hook"), description, typicalHookOrCaption, and an 'evidence' object with views (e.g. "1.2M"), likes (e.g. "45K"), quote (actual verbal or text hook quote from their reel), visual (visual mechanics description), whyItWorks (clear strategic breakdown of why it works), tryThisSuggestion (actionable suggestion), videoThumbnail (use thumbnail from scraped reels if available, otherwise high quality unsplash video style image), videoUrl (use the videoUrl of the matching scraped reel if available, otherwise omit), videoDuration (e.g. "0:22"), and videoTitle.
6. Identify EXACTLY 4 distinct Caption Formulas ('captions'):
   - Each caption formula MUST include: id (e.g. "c1", "c2"), title (e.g. "Micro-Playbook Caption", "Direct Response CTA Caption"), frequency (e.g. "3/10"), dotColor ("bg-pink-500", "bg-purple-500", "bg-sky-500", or "bg-amber-500"), accentBorder ("border-pink-500/50", "border-purple-500/50", etc.), type ("caption"), description, typicalHookOrCaption, and evidence object with whyItWorks, quote, views, likes, tryThisSuggestion, etc.
7. Provide EXACTLY 3-4 Opportunities ('opportunities'): array of { id: string, text: string } detailing specific untapped content angles, formats, or growth opportunities for @${handle}.
8. Return ONLY raw valid JSON conforming strictly to the requested structure without markdown wrappers.

JSON Structure:
{
  "handle": "${handle}",
  "displayName": "...",
  "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  "followerCount": "...",
  "verified": true,
  "archetype": "Founder",
  "archetypeReason": "...",
  "totalReelsAnalyzed": ${reels.length || 15},
  "avgViralViews": "...",
  "generatedAt": "Just now",
  "theRead": {
    "synthesisText": "...",
    "whoTheySpeakTo": ["..."],
    "contentPillars": ["..."]
  },
  "bioRewrite": {
    "originalBio": "...",
    "rewrittenBio": "...",
    "keyChanges": ["..."],
    "whyItWorks": "..."
  },
  "topViralExamples": [],
  "hooks": [],
  "captions": [],
  "opportunities": []
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  let rawText = response.text || '{}';
  // Remove markdown code fence if present
  if (rawText.startsWith('```')) {
    rawText = rawText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
  }

  const report = JSON.parse(rawText) as CreatorReport;
  report.handle = handle;

  if (reels.length > 0) {
    const attachRealMedia = (patterns?: Array<{ evidence: any }> ) => {
      if (!patterns) return;
      patterns.forEach((pattern, idx) => {
        const reel = reels[idx % reels.length];
        if (!pattern?.evidence) return;
        if (reel.displayUrl) pattern.evidence.videoThumbnail = reel.displayUrl;
        if (reel.videoUrl) pattern.evidence.videoUrl = reel.videoUrl;
        if (reel.duration) pattern.evidence.videoDuration = formatDuration(reel.duration);
      });
    };

    attachRealMedia(report.hooks || []);
    attachRealMedia(report.captions || []);

    if (Array.isArray(report.topViralExamples)) {
      report.topViralExamples.forEach((example: any, idx: number) => {
        const reel = reels[idx % reels.length];
        if (!example) return;
        example.videoThumbnail = reel.displayUrl || example.videoThumbnail;
        example.videoUrl = reel.videoUrl || example.videoUrl;
        example.sourceReelId = reel.id || example.sourceReelId;
        example.views = example.views || String(reel.playCount);
        example.likes = example.likes || String(reel.likeCount);
      });
    }
  }

  return report;
}

function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem.toString().padStart(2, '0')}`;
}
