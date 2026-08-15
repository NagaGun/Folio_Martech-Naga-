import { ApifyClient } from 'apify-client';

export interface ScrapedReel {
  id: string;
  url: string;
  caption: string;
  playCount: number;
  likeCount: number;
  videoUrl?: string;
  displayUrl?: string;
  timestamp?: string;
  duration?: number;
}

function normalizeReelItem(item: any, idx: number): ScrapedReel | null {
  const code = item?.code || item?.shortcode || item?.id || `reel_${idx}`;
  const playCount =
    item?.videoPlayCount ||
    item?.videoViewCount ||
    item?.playsCount ||
    item?.viewCount ||
    item?.play_count ||
    item?.playCount ||
    0;
  const likeCount =
    item?.likesCount ||
    item?.likeCount ||
    item?.likes_count ||
    item?.likes ||
    Math.max(0, Math.round(Number(playCount) * 0.08));
  const caption = item?.caption || item?.text || item?.title || item?.edge_media_to_caption?.edges?.[0]?.node?.text || '';
  const displayUrl =
    item?.displayUrl ||
    item?.thumbnailUrl ||
    item?.imageUrl ||
    item?.thumbnail_url ||
    item?.image_url ||
    item?.images?.[0] ||
    item?.display_url ||
    '';
  const videoUrl = item?.videoUrl || item?.video_url || item?.video?.url || item?.downloadUrl || item?.download_url || '';
  const duration = item?.videoDuration || item?.duration || item?.video_duration || item?.length || 15;

  if (!code) return null;

  const normalized: ScrapedReel = {
    id: String(code),
    url: item?.url || item?.permalink || `https://www.instagram.com/reel/${code}/`,
    caption: typeof caption === 'string' ? caption : String(caption || ''),
    playCount: Number(playCount) || 0,
    likeCount: Number(likeCount) || 0,
    videoUrl: videoUrl || undefined,
    displayUrl: displayUrl || undefined,
    timestamp: item?.timestamp || item?.takenAt || item?.taken_at || new Date().toISOString(),
    duration: Number(duration) || 15,
  };

  return normalized;
}

function filterReels(items: any[]): ScrapedReel[] {
  const normalized = items
    .map((item, idx) => normalizeReelItem(item, idx))
    .filter(Boolean) as ScrapedReel[];

  return normalized.filter((reel) => {
    const hasVideo = Boolean(reel.videoUrl);
    const hasImage = Boolean(reel.displayUrl);
    const hasCaption = Boolean(reel.caption?.trim());
    const isLikelyReel = hasVideo || hasImage;
    return isLikelyReel && hasCaption && (hasVideo || hasImage);
  });
}

export async function scrapeInstagramReels(handle: string): Promise<ScrapedReel[]> {
  const apifyToken = process.env.APIFY_TOKEN;
  const cleanHandle = handle.trim().replace(/^@/, '');

  console.log(`[Apify] Starting Instagram Reels scrape for @${cleanHandle}...`);

  if (!apifyToken) {
    throw new Error('APIFY_TOKEN environment variable is missing.');
  }

  const client = new ApifyClient({ token: apifyToken });
  let items: any[] = [];

  try {
    const run = await client.actor('apify/instagram-reel-scraper').call({
      username: [cleanHandle],
      usernames: [cleanHandle],
      profiles: [cleanHandle],
      directUrls: [
        `https://www.instagram.com/${cleanHandle}/reels/`,
        `https://www.instagram.com/${cleanHandle}/`,
      ],
      resultsLimit: 12,
      maxItems: 12,
    });

    const dataset = await client.dataset(run.defaultDatasetId).listItems();
    items = dataset.items || [];
  } catch (err: any) {
    console.warn(`[Apify] Primary reel scraper notice: ${err.message}. Trying instagram-scraper fallback...`);
    try {
      const fallbackRun = await client.actor('apify/instagram-scraper').call({
        directUrls: [`https://www.instagram.com/${cleanHandle}/reels/`],
        resultsType: 'posts',
        resultsLimit: 12,
      });
      const fallbackDataset = await client.dataset(fallbackRun.defaultDatasetId).listItems();
      items = fallbackDataset.items || [];
    } catch (fbErr: any) {
      console.error(`[Apify] Fallback scraper error: ${fbErr.message}`);
    }
  }

  const filtered = filterReels(items);
  console.log(`[Apify] Scraped ${filtered.length} usable reels from Apify for @${cleanHandle}`);

  return filtered.slice(0, 12);
}
