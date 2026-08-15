import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { scrapeInstagramReels } from './server/apifyService.js';
import { generateCreatorReportFromReels } from './server/geminiService.js';

function proxyReportMedia(report: any) {
  const rewrite = (url?: string) => {
    if (!url || typeof url !== 'string') return url;
    if (!url.startsWith('http') || url.includes('unsplash.com')) return url;
    return `/api/media?url=${encodeURIComponent(url)}`;
  };

  for (const pattern of [...(report?.hooks || []), ...(report?.captions || [])]) {
    if (pattern?.evidence) {
      pattern.evidence.videoThumbnail = rewrite(pattern.evidence.videoThumbnail);
      pattern.evidence.videoUrl = rewrite(pattern.evidence.videoUrl);
    }
  }

  if (report?.avatarUrl) {
    report.avatarUrl = rewrite(report.avatarUrl);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Endpoint for handle analysis
  app.post('/api/analyze', async (req, res) => {
    try {
      const { handle, apifyToken: clientApifyToken } = req.body;
      if (!handle || typeof handle !== 'string') {
        return res.status(400).json({ error: 'Valid Instagram handle is required.' });
      }

      const cleanHandle = handle.trim().replace(/^@/, '');
      console.log(`[API] Starting analysis for handle: @${cleanHandle}`);

      // Allow APIFY_TOKEN from environment OR client body/header
      const effectiveApifyToken = clientApifyToken || process.env.APIFY_TOKEN;
      if (clientApifyToken && !process.env.APIFY_TOKEN) {
        process.env.APIFY_TOKEN = clientApifyToken;
      }

      // Step 1: Scrape Reels with Apify if token is available
      let reels: any[] = [];
      if (effectiveApifyToken) {
        try {
          console.log(`[API] Scraping live reels via Apify token (${effectiveApifyToken.slice(0, 6)}...)...`);
          reels = await scrapeInstagramReels(cleanHandle);
          console.log(`[API] Successfully scraped ${reels.length} reels via Apify`);
        } catch (apifyErr: any) {
          console.warn(`[API] Apify scrape notice: ${apifyErr.message}`);
        }
      } else {
        console.log(`[API] APIFY_TOKEN not set in environment or client. Gemini will synthesize report.`);
      }

      // Step 2: Generate Report with Gemini
      const geminiKey = process.env.GEMINI_API_KEY;
      if (geminiKey) {
        const report = await generateCreatorReportFromReels(cleanHandle, reels);
        proxyReportMedia(report);
        return res.json({
          success: true,
          report,
          source: reels.length > 0 ? 'apify_gemini' : 'gemini_direct',
          apifyScrapedCount: reels.length,
          apifyUsed: Boolean(effectiveApifyToken && reels.length > 0),
        });
      } else {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is missing on server.',
        });
      }
    } catch (err: any) {
      console.error('[API Error]', err);
      return res.status(500).json({ error: err.message || 'Failed to analyze handle.' });
    }
  });

  app.get('/api/media', async (req, res) => {
    const target = req.query.url;
    if (!target || typeof target !== 'string') {
      return res.status(400).json({ error: 'Missing url query param.' });
    }

    try {
      const upstream = await fetch(target, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
          Referer: 'https://www.instagram.com/',
        },
      });

      if (!upstream.ok || !upstream.body) {
        return res.status(upstream.status || 502).json({ error: 'Upstream media fetch failed.' });
      }

      res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('Access-Control-Allow-Origin', '*');

      const reader = upstream.body.getReader();
      const pump = async () => {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          return;
        }
        res.write(value);
        await pump();
      };

      await pump();
    } catch (err: any) {
      console.error('[Media Proxy Error]', err.message);
      res.status(502).json({ error: 'Failed to proxy media.' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      apifyConfigured: Boolean(process.env.APIFY_TOKEN),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Vite middleware setup for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`reel_DNA Full-stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
