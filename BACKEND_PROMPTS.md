# Backend & Apify Integration Blueprint for reel_DNA

This guide provides modular prompts, backend code templates, and step-by-step instructions for building an Express + Apify + Gemini backend server and connecting it to the **reel_DNA** frontend.

---

## Architecture Overview

```
[ Frontend (React) ] ──(POST /api/analyze { handle: "alexhormozi" })──> [ Express Backend ]
                                                                             │
                                              ┌──────────────────────────────┴──────────────────────────────┐
                                              ▼                                                             ▼
                                [ Apify Instagram Scraper ]                                     [ Gemini / LLM Synthesis ]
                             Fetches top 10-20 Reels metadata,                                  Analyzes hooks, generates 
                             views, captions & thumbnails                                       structured CreatorReport JSON
```

---

## 1. Environment Setup Prompt
Use this prompt with any coding assistant or LLM to generate the project scaffold:

```text
PROMPT 1: Environment & Dependencies Setup

Create a Node.js + Express + TypeScript backend service for reel_DNA with the following dependencies:
- express, cors, dotenv
- apify-client (for scraping Instagram Reels)
- @google/genai (for Gemini AI synthesis of scraped reel metadata)
- tsx and typescript for dev execution

Requirements:
1. Configure an .env file with APIFY_TOKEN and GEMINI_API_KEY.
2. Initialize express app on port 3000 or custom PORT.
3. Configure CORS middleware to accept requests from the Vite frontend domain.
```

---

## 2. Apify Scraper Integration Code (`server/apifyService.ts`)

```typescript
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

export interface ScrapedReel {
  id: string;
  url: string;
  caption: string;
  playCount: number;
  likeCount: number;
  videoUrl: string;
  displayUrl: string; // Thumbnail
  timestamp: string;
  duration?: number;
}

export async function scrapeInstagramReels(handle: string): Promise<ScrapedReel[]> {
  const cleanHandle = handle.replace(/^@/, '');
  
  // Running Apify Instagram Reel Scraper (apify/instagram-reel-scraper)
  const run = await client.actor('apify/instagram-reel-scraper').call({
    username: [cleanHandle],
    resultsLimit: 15, // Scrape last 15 reels for viral analysis
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  return items.map((item: any) => ({
    id: item.id || item.code,
    url: item.url || `https://www.instagram.com/reel/${item.code}/`,
    caption: item.caption || '',
    playCount: item.videoPlayCount || item.videoViewCount || 0,
    likeCount: item.likesCount || 0,
    videoUrl: item.videoUrl || '',
    displayUrl: item.displayUrl || item.thumbnailUrl || '',
    timestamp: item.timestamp || new Date().toISOString(),
    duration: item.videoDuration || 15,
  }));
}
```

---

## 3. Gemini Synthesis Prompt & Analysis Service (`server/geminiService.ts`)

Use this prompt to instruct Gemini to process raw Apify data into structured `CreatorReport` JSON matching our frontend TypeScript interfaces:

```typescript
import { GoogleGenAI } from '@google/genai';
import { ScrapedReel } from './apifyService';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateCreatorReport(handle: string, reels: ScrapedReel[]) {
  const model = 'gemini-2.5-flash';

  const prompt = `
You are an expert Instagram Virality & Content Strategy Analyst for reel_DNA.
Analyze the following raw Instagram Reels data for @${handle} and generate a structured JSON report.

Raw Reels Data (Last 15 Reels):
${JSON.stringify(reels.map(r => ({
  views: r.playCount,
  likes: r.likeCount,
  caption: r.caption,
  thumbnail: r.displayUrl,
  url: r.url
})), null, 2)}

OUTPUT REQUIREMENT:
Return ONLY valid raw JSON matching this TypeScript schema without Markdown ticks:

{
  "handle": "${handle}",
  "displayName": "Full Name / Brand Title",
  "avatarUrl": "https://images.unsplash.com/photo-...",
  "followerCount": "Estimated string e.g. 150K",
  "verified": true,
  "archetype": "Founder | Content Creator | Marketer | Community Builder",
  "archetypeReason": "1 sentence explanation of why they belong to this archetype",
  "totalReelsAnalyzed": ${reels.length},
  "avgViralViews": "Average view count e.g. 45.2K",
  "theRead": {
    "synthesisText": "2-3 sentences breaking down their overarching positioning and content DNA strategy.",
    "whoTheySpeakTo": ["Target audience 1", "Target audience 2", "Target audience 3"],
    "contentPillars": ["Pillar 1", "Pillar 2", "Pillar 3"]
  },
  "hooks": [
    {
      "id": "hook-1",
      "title": "Hook Pattern Title e.g. The Contrarian Claim",
      "frequency": "4/10",
      "dotColor": "bg-indigo-500",
      "accentBorder": "border-indigo-500/40",
      "type": "hook",
      "description": "Short description of the pattern mechanics.",
      "typicalHookOrCaption": "Everyone tells [audience] to do X, but that's why you fail...",
      "evidence": {
        "views": "120K",
        "likes": "12.4K",
        "quote": "Direct quote or transcript hook line from their top reel",
        "visual": "Fast cuts, bold yellow text overlays, high contrast frame",
        "whyItWorks": "Creates instant curiosity and pattern interruption in the first 1.2s.",
        "tryThisSuggestion": "Start your next video with 'Stop doing X if you want Y'",
        "videoThumbnail": "${reels[0]?.displayUrl || ''}",
        "videoDuration": "0:24",
        "videoTitle": "Top Performing Reel"
      }
    }
    // EXACTLY 4 HOOK PATTERNS
  ],
  "opportunities": [
    { "id": "opp-1", "text": "Opportunity 1 for creators competing with this handle" },
    { "id": "opp-2", "text": "Opportunity 2" },
    { "id": "opp-3", "text": "Opportunity 3" }
  ]
}
`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    }
  });

  return JSON.parse(response.text || '{}');
}
```

---

## 4. Main API Express Server Route (`server.ts`)

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { scrapeInstagramReels } from './apifyService';
import { generateCreatorReport } from './geminiService';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  try {
    const { handle } = req.body;
    if (!handle) {
      return res.status(400).json({ error: 'Instagram handle is required' });
    }

    console.log(`[API] Scraping Instagram reels for @${handle}...`);
    const reels = await scrapeInstagramReels(handle);

    console.log(`[API] Scraped ${reels.length} reels. Synthesizing report with Gemini...`);
    const report = await generateCreatorReport(handle, reels);

    return res.json(report);
  } catch (error: any) {
    console.error('[API Error]', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze handle' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`reel_DNA Backend server running on port ${PORT}`);
});
```

---

## 5. Connecting Frontend to Real Backend (`src/data/mockReports.ts`)

In `src/data/mockReports.ts`, update `getReportForHandle` to fetch from the live API with fallback to mock data:

```typescript
export async function fetchLiveReportForHandle(handle: string): Promise<CreatorReport> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Falling back to local report template due to backend API offline:', err);
    return getReportForHandle(handle); // Local fallback
  }
}
```

---

## 6. Full Deployment Checklist

1. **Apify API Key:** Get your token from [Apify Console](https://console.apify.com/account/integrations).
2. **Gemini API Key:** Get your key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3. **Run Dev Server:** `npm run dev` or `tsx server.ts`.
