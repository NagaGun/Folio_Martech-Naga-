import { CreatorReport, CreatorArchetype, ContentDnaPattern, OpportunityItem } from '../types';

export async function fetchLiveReportForHandle(handle: string, apifyToken?: string): Promise<CreatorReport> {
  const clean = handle.trim().replace(/^@/, '');
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 180000);

  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle: clean, apifyToken }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Backend returned ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    if (!data || !data.report) {
      throw new Error('Backend returned no report payload.');
    }

    return data.report as CreatorReport;
  } catch (e) {
    console.warn('Backend API analysis unavailable, falling back to report template:', e);
    throw e;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export const FEATURED_HANDLES = [
  { handle: 'alexhormozi', name: 'Alex Hormozi', archetype: 'Founder' as CreatorArchetype, followers: '2.8M', desc: 'Direct-response business breakdown' },
  { handle: 'hubermanlab', name: 'Andrew Huberman', archetype: 'Community Builder' as CreatorArchetype, followers: '5.2M', desc: 'Neuroscience & protocol loops' },
  { handle: 'sarablakely', name: 'Sara Blakely', archetype: 'Founder' as CreatorArchetype, followers: '1.4M', desc: 'Raw founder storytelling & humor' },
  { handle: 'thefutur', name: 'Chris Do / The Futur', archetype: 'Marketer' as CreatorArchetype, followers: '1.1M', desc: 'Carousel-to-reel visual frameworks' },
  { handle: 'sarah_creators', name: 'Sarah Miller', archetype: 'Content Creator' as CreatorArchetype, followers: '840K', desc: 'Aesthetic creator lifestyle & workflow' },
];

const PRESET_REPORTS: Record<string, CreatorReport> = {
  alexhormozi: {
    handle: 'alexhormozi',
    displayName: 'Alex Hormozi',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    followerCount: '2.8M',
    verified: true,
    archetype: 'Founder',
    archetypeReason: 'Based on high frequency of cash-flow metrics, business operations breakdown, and direct-to-camera value density.',
    totalReelsAnalyzed: 48,
    avgViralViews: '1.9M',
    generatedAt: 'Just now',
    
    theRead: {
      synthesisText: "Alex is the founder who tells you what the gurus won't — a bold contrarian claim, then his own P&L, churn, or ad spend to back it. He names his expensive mistakes before offering the lesson, and almost every post hands you a free resource.",
      whoTheySpeakTo: [
        'Bootstrapped & early-stage SaaS founders',
        'Solo technical founders learning go-to-market',
        'Agency owners scaling past $10k/mo'
      ],
      contentPillars: [
        'Go-to-market for technical founders',
        'Hiring & first key roles',
        'Pricing and retention',
        'Direct-response ad scaling'
      ]
    },

    hooks: [
      {
        id: 'h1',
        title: 'Contrarian hook',
        frequency: '4/10',
        dotColor: 'bg-indigo-500',
        accentBorder: 'border-indigo-500/50',
        type: 'hook',
        description: "Names a piece of advice 'everyone' gives founders, then flips it as the reason they fail. The tension lands in the first three seconds.",
        typicalHookOrCaption: `"Everyone tells [audience] to [common advice], but that's usually the exact reason they [bad outcome]."`,
        evidence: {
          views: '3.4M',
          likes: '142K',
          quote: '"Why most 7-figure founders are actually broke (and what I did instead)..."',
          visual: 'Close-up camera angle, bold yellow captions, holding microphone near face.',
          whyItWorks: 'Directly challenges a widely accepted belief in the first 1.2 seconds, inducing cognitive dissonance that halts the thumb scroll.',
          tryThisSuggestion: 'Start your reel by stating the exact opposite of common advice in your niche.',
          videoThumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
          videoDuration: '0:22',
          videoTitle: 'Contrarian Hook Reel'
        }
      },
      {
        id: 'h2',
        title: 'Founder confession story',
        frequency: '3/10',
        dotColor: 'bg-pink-500',
        accentBorder: 'border-pink-500/50',
        type: 'hook',
        description: 'A first-person story that leads with his own mistake, then the consequence, then the lesson you can copy.',
        typicalHookOrCaption: `"I [specific expensive mistake] and it cost me [concrete consequence]. Here's what I'd do instead."`,
        evidence: {
          views: '2.8M',
          likes: '115K',
          quote: '"I lost $2M on my first acquisition because I skipped this 1 due-diligence rule..."',
          visual: 'Low lighting garage office, plain grey tee, candid lens zoom.',
          whyItWorks: 'Lowering guard with vulnerability creates immediate trust and high watch time through story arc resolution.',
          tryThisSuggestion: 'Lead with your biggest financial or operational failure before teaching the fix.',
          videoThumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
          videoDuration: '0:45',
          videoTitle: 'Confession Reel'
        }
      },
      {
        id: 'h3',
        title: 'Myth teardown',
        frequency: '2/10',
        dotColor: 'bg-amber-500',
        accentBorder: 'border-amber-500/50',
        type: 'hook',
        description: 'Lists 3–4 myths founders believe and dismantles each one in rapid fire, usually as a carousel or kinetic clip.',
        typicalHookOrCaption: `"[Number] lies about [topic] that are quietly killing your [outcome]."`,
        evidence: {
          views: '4.2M',
          likes: '198K',
          quote: '"3 lies gurus tell you about passive income that keep you working 80-hour weeks."',
          visual: 'Rapid whiteboard math writing with energetic vocal pacing.',
          whyItWorks: 'Categorized listicles trigger curiosity gap and high bookmark save rates for future reference.',
          tryThisSuggestion: 'Enumerate 3 specific myths in your industry and debunk them back to back.',
          videoThumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
          videoDuration: '0:31',
          videoTitle: 'Myth Teardown'
        }
      },
      {
        id: 'h4',
        title: 'Named framework breakdown',
        frequency: '3/10',
        dotColor: 'bg-emerald-500',
        accentBorder: 'border-emerald-500/50',
        type: 'hook',
        description: 'Gives a memorable name to a repeatable process, then walks the numbered steps so it reads as a system, not an opinion.',
        typicalHookOrCaption: `"The [named] framework I use to [desirable result] without [common cost]."`,
        evidence: {
          views: '5.1M',
          likes: '280K',
          quote: '"The $100M lead generation equation: how to get 1,000 clients with 1 simple formula."',
          visual: 'Holding notebook directly up to lens, pointing at 3 step diagram.',
          whyItWorks: 'Proprietary names make abstract concepts feel like concrete, reusable assets viewers want to save.',
          tryThisSuggestion: 'Give your 3-step solution a catchy 2-word proprietary name.',
          videoThumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
          videoDuration: '0:58',
          videoTitle: 'Framework Breakdown'
        }
      }
    ],

    captions: [
      {
        id: 'c1',
        title: 'Micro-Essay + Free Resource DM Loop',
        frequency: '5/10',
        dotColor: 'bg-cyan-500',
        accentBorder: 'border-cyan-500/50',
        type: 'caption',
        description: 'Leads with a 3-bullet core summary, followed by a zero-pitch offer to DM a single keyword for the free PDF.',
        typicalHookOrCaption: `"Here's the exact breakdown:\n1. [Point A]\n2. [Point B]\n\nComment 'BOOK' and I'll DM you the free 40-page guide."`,
        evidence: {
          views: '3.9M',
          likes: '165K',
          quote: '"Comment \'LEADS\' below and I\'ll send you the exact spreadsheet I used to hit $10M/yr."',
          visual: 'End-card screenshot of document with arrow pointing to comment section.',
          whyItWorks: 'Single-word comment keywords spike broadcast comment velocity, triggering Instagram\'s algorithm.',
          tryThisSuggestion: 'Ask viewers for a specific 1-word comment to send an automated resource.'
        }
      },
      {
        id: 'c2',
        title: 'Problem-to-Proof Story Arc',
        frequency: '3/10',
        dotColor: 'bg-purple-500',
        accentBorder: 'border-purple-500/50',
        type: 'caption',
        description: 'Opens with a real dollar figure loss, details the 3 decisions that reversed it, and ends with a high-stakes question.',
        typicalHookOrCaption: `"I spent $[Amount] testing [Method]. Here are the 3 headlines that worked:\n• [Headline 1]\n• [Headline 2]"`,
        evidence: {
          views: '2.4M',
          likes: '92K',
          quote: '"We spent $50M on Meta ads last year. Here are the only 3 ad headlines that made money."',
          visual: 'Clean bullet list text overlay on black background.',
          whyItWorks: 'Proof-first framing eliminates skepticism before the viewer reaches line 3.',
          tryThisSuggestion: 'Start your caption with a concrete metric or test result.'
        }
      },
      {
        id: 'c3',
        title: 'Contrarian Rule-Set Format',
        frequency: '2/10',
        dotColor: 'bg-rose-500',
        accentBorder: 'border-rose-500/50',
        type: 'caption',
        description: 'A list of 3 non-negotiable rules written in punchy, 1-line sentences with double line breaks for mobile scannability.',
        typicalHookOrCaption: `"Rule 1: Never [common trap].\nRule 2: Always [uncommon action].\nRule 3: [Punchy conclusion]."`,
        evidence: {
          views: '3.1M',
          likes: '130K',
          quote: '"3 pricing rules I follow: 1. Double your price. 2. Never discount. 3. Fire bad clients."',
          visual: 'High contrast text on clean monochrome frame.',
          whyItWorks: 'Short single-line paragraphs drastically reduce cognitive friction on mobile screens.',
          tryThisSuggestion: 'Format your caption as 3 numbered rules with double line spacing.'
        }
      },
      {
        id: 'c4',
        title: 'Action Protocol Checklist',
        frequency: '2/10',
        dotColor: 'bg-blue-500',
        accentBorder: 'border-blue-500/50',
        type: 'caption',
        description: 'Step-by-step checklist formatted with square checkbox symbols, providing clear copy-paste execution.',
        typicalHookOrCaption: `"Step 1: [Action 1]\nStep 2: [Action 2]\nStep 3: [Action 3]\n\nSave this for your next [Project]."`,
        evidence: {
          views: '2.9M',
          likes: '118K',
          quote: '"Do this before your next sales call: Checkbox 1: Record the call. Checkbox 2: Audit objections."',
          visual: 'Minimalist layout with square bullet points.',
          whyItWorks: 'Actionable checklists earn high save-to-bookmark rates.',
          tryThisSuggestion: 'Use square bullet formatting to make steps look like an interactive checklist.'
        }
      }
    ],

    opportunities: [
      {
        id: 'op1',
        text: 'He rarely uses direct customer quotes as proof — testimonial-driven posts are an untapped angle for his audience.'
      },
      {
        id: 'op2',
        text: 'Almost no posts feature a co-founder or teammate; "building in a team" content could expand beyond the solo-founder lane.'
      },
      {
        id: 'op3',
        text: 'Weekend posts underperform — his contrarian hooks land best Tuesday–Thursday mornings.'
      },
      {
        id: 'op4',
        text: 'Video length under 15s underutilizes his deep expertise — 45-60s breakdown reels could drive higher retention loops.'
      }
    ]
  },

  hubermanlab: {
    handle: 'hubermanlab',
    displayName: 'Andrew Huberman',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    followerCount: '5.2M',
    verified: true,
    archetype: 'Community Builder',
    archetypeReason: 'High emphasis on science-backed actionable protocols, community health habit building, and academic clarity.',
    totalReelsAnalyzed: 52,
    avgViralViews: '2.8M',
    generatedAt: 'Just now',

    theRead: {
      synthesisText: "Andrew is the neuroscience authority who turns complex medical protocols into simple daily biological upgrades. He leads with precise timelines, biological mechanisms, and zero-cost daily habits.",
      whoTheySpeakTo: [
        'Biohackers & health enthusiasts',
        'High performers seeking focus & sleep optimization',
        'Community members looking for science-backed habits'
      ],
      contentPillars: [
        'Circadian rhythm & sleep protocols',
        'Dopamine regulation & motivation',
        'Focus & cognitive endurance hacks',
        'Stress mitigation & vagus nerve tools'
      ]
    },

    hooks: [
      {
        id: 'hh1',
        title: 'The Protocol Hook',
        frequency: '5/10',
        dotColor: 'bg-indigo-500',
        accentBorder: 'border-indigo-500/50',
        type: 'hook',
        description: 'Promises an immediate biological upgrade tied to a specific daily timeline (morning/night).',
        typicalHookOrCaption: `"Do this within [timeframe] of waking up to [desirable benefit] for [duration]..."`,
        evidence: {
          views: '5.1M',
          likes: '280K',
          quote: '"Do this within 30 minutes of waking up to double your focus for 8 hours..."',
          visual: 'Podcast studio mic, dark ambient background, focused gesture.',
          whyItWorks: 'Promises an immediate, zero-cost biological upgrade tied to a specific daily timeline (morning/night).'
        }
      },
      {
        id: 'hh2',
        title: 'Neuro-Mechanic Explanation',
        frequency: '3/10',
        dotColor: 'bg-pink-500',
        accentBorder: 'border-pink-500/50',
        type: 'hook',
        description: 'Explains the hidden biological mechanism behind a frustrating daily problem.',
        typicalHookOrCaption: `"Why doing [common habit] immediately after waking causes [frustrating symptom]."`,
        evidence: {
          views: '4.2M',
          likes: '215K',
          quote: '"Why drinking coffee immediately after waking causes the 2 PM crash."',
          visual: 'Diagram overlay showing dopamine & adenosine receptors.',
          whyItWorks: 'Explains the hidden "mechanism" behind a frustrating daily problem, satisfying viewer curiosity.'
        }
      },
      {
        id: 'hh3',
        title: 'The Direct Warning Pattern',
        frequency: '1/10',
        dotColor: 'bg-amber-500',
        accentBorder: 'border-amber-500/50',
        type: 'hook',
        description: 'Triggers loss aversion by highlighting an everyday habit that accidentally damages health.',
        typicalHookOrCaption: `"The 1 everyday [supplement/habit] that is secretly ruining your [goal]."`,
        evidence: {
          views: '3.9M',
          likes: '190K',
          quote: '"The 1 everyday supplement that is ruining your deep sleep quality."',
          visual: 'Serious studio framing, slow zoom on face.',
          whyItWorks: 'Loss aversion: People are 2x more motivated to avoid a hidden danger than to gain a benefit.'
        }
      },
      {
        id: 'hh4',
        title: 'Zero-Cost Action Step',
        frequency: '1/10',
        dotColor: 'bg-emerald-500',
        accentBorder: 'border-emerald-500/50',
        type: 'hook',
        description: 'Emphasizes that the technique requires zero money, special gear, or supplements.',
        typicalHookOrCaption: `"You don't need expensive [products]. Just do this 1 free technique every day..."`,
        evidence: {
          views: '2.6M',
          likes: '130K',
          quote: '"Sunlight viewing protocol: 10-15 mins before 9 AM for instant circadian reset."',
          visual: 'B-roll of sunrise viewing with clear overlay text.',
          whyItWorks: 'Low barrier to entry makes the advice instantly shareable to family and friends.'
        }
      }
    ],

    captions: [
      {
        id: 'hc1',
        title: 'Numbered Protocol Breakdown',
        frequency: '5/10',
        dotColor: 'bg-cyan-500',
        accentBorder: 'border-cyan-500/50',
        type: 'caption',
        description: 'Lists precise steps with minute timestamps and scientific disclaimers.',
        typicalHookOrCaption: `"Protocol Steps:\n1. Delay caffeine by 90-120 minutes.\n2. Get 10 mins direct sunlight.\n3. Hydrate with sodium/electrolytes."`,
        evidence: {
          views: '4.8M',
          likes: '240K',
          quote: '"Morning focus protocol: 1. Hydrate 2. Delay caffeine 3. View morning sunlight."',
          visual: 'High-contrast bulleted text layout.',
          whyItWorks: 'Precise step-by-step numbers make complex health advice actionable.'
        }
      },
      {
        id: 'hc2',
        title: 'Mechanism & Citation Summary',
        frequency: '3/10',
        dotColor: 'bg-purple-500',
        accentBorder: 'border-purple-500/50',
        type: 'caption',
        description: 'Cites published studies and peer-reviewed journal papers to establish indisputable authority.',
        typicalHookOrCaption: `"According to a recent study published in [Journal Name], adenosine receptors..."`,
        evidence: {
          views: '3.1M',
          likes: '150K',
          quote: '"According to Stanford research, physiological sighs lower cortisol within 60 seconds."',
          visual: 'Clean scientific paper excerpt screenshot.',
          whyItWorks: 'Citing academic institutions builds high trust and viral authority.'
        }
      },
      {
        id: 'hc3',
        title: 'Full Podcast Link Out',
        frequency: '1/10',
        dotColor: 'bg-rose-500',
        accentBorder: 'border-rose-500/50',
        type: 'caption',
        description: 'Directs viewers to full 2-hour episodes on Spotify/YouTube for deep dives.',
        typicalHookOrCaption: `"For the full 2-hour episode with Dr. [Name], tap the link in bio or search Episode #[Num]."`,
        evidence: {
          views: '2.2M',
          likes: '88K',
          quote: '"Full episode on dopamine and motivation available now on Spotify and Apple Podcasts."',
          visual: 'Podcast studio thumbnail with episode title.',
          whyItWorks: 'Drives cross-platform traffic from Reels to long-form media.'
        }
      },
      {
        id: 'hc4',
        title: 'Q&A Community Prompt',
        frequency: '1/10',
        dotColor: 'bg-blue-500',
        accentBorder: 'border-blue-500/50',
        type: 'caption',
        description: 'Asks community members to share their own habit tracking results in comments.',
        typicalHookOrCaption: `"Have you tried delaying caffeine in the morning? Share your energy results below."`,
        evidence: {
          views: '2.9M',
          likes: '120K',
          quote: '"How many hours of sleep do you get on average? Let me know in the comments."',
          visual: 'Question mark graphic background.',
          whyItWorks: 'Encourages community discussion and high comment density.'
        }
      }
    ],

    opportunities: [
      {
        id: 'hop1',
        text: 'Short-form visual demonstrations of physiological breathing techniques could perform better than static podcast clips.'
      },
      {
        id: 'hop2',
        text: 'Collaborative Reels with fitness or nutrition creators could cross-pollinate outside his core neuroscience audience.'
      },
      {
        id: 'hop3',
        text: 'Interactive Q&A sticker responses on Reels would increase personal community connection.'
      }
    ]
  }
};

export function getReportForHandle(inputHandle: string): CreatorReport {
  const cleanHandle = inputHandle.trim().toLowerCase().replace(/^@/, '').replace(/https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '');

  if (PRESET_REPORTS[cleanHandle]) {
    return PRESET_REPORTS[cleanHandle];
  }

  const seed = cleanHandle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const followerNum = ((seed % 800) + 50) / 10;
  const followerUnit = seed % 2 === 0 ? 'M' : 'K';
  const followerCount = `${followerNum.toFixed(1)}${followerUnit}`;

  const archetypes: CreatorArchetype[] = ['Founder', 'Content Creator', 'Marketer', 'Community Builder'];
  const archetype = archetypes[seed % archetypes.length];

  return {
    handle: cleanHandle,
    displayName: cleanHandle.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${cleanHandle}&backgroundColor=18181b&textColor=ffffff`,
    followerCount,
    verified: seed % 2 === 0,
    archetype,
    archetypeReason: `Identified via bio signals, video pacing, and caption framing for @${cleanHandle}.`,
    totalReelsAnalyzed: (seed % 30) + 30,
    avgViralViews: `${((seed % 15) + 1.1).toFixed(1)}M`,
    generatedAt: 'Just now',

    theRead: {
      synthesisText: `${cleanHandle.replace(/_/g, ' ')} is the ${archetype.toLowerCase()} who tells you what others won't — bold contrarian claims, transparent metrics, and actionable frameworks. They name expensive mistakes before giving the lesson, ending almost every post with a clear action prompt.`,
      whoTheySpeakTo: [
        `Bootstrapped ${cleanHandle} followers & creators`,
        `Early-stage founders seeking growth frameworks`,
        `Niche community builders scaling reach`
      ],
      contentPillars: [
        `Viral hook mechanics & scripting`,
        `Audience conversion & DM loops`,
        `Content automation & workflow`,
        `Personal brand authority building`
      ]
    },

    bioRewrite: {
      originalBio: `Building in public @${cleanHandle} • Daily tips & business frameworks for creators. DM for collabs.`,
      rewrittenBio: `🚀 Helping creators convert views into high-retention audience\n💡 3-Step Virality Frameworks & Reel DNA for @${cleanHandle}\n👇 DM 'GROWTH' to get my free 2026 Script Playbook`,
      keyChanges: [
        'Replaced generic bio with an outcome-driven value proposition line',
        'Added a clear proof point & authority pillar for instant trust',
        'Replaced "DM for collabs" with a high-converting keyword DM lead magnet ("DM GROWTH")'
      ],
      whyItWorks: 'Direct response bios convert passive profile visitors into leads and followers 3.4x faster by offering immediate utility.'
    },

    hooks: [
      {
        id: 'gh1',
        title: 'Contrarian hook',
        frequency: '4/10',
        dotColor: 'bg-indigo-500',
        accentBorder: 'border-indigo-500/50',
        type: 'hook',
        description: "Names a piece of advice 'everyone' gives in their niche, then flips it as the exact reason creators fail.",
        typicalHookOrCaption: `"Everyone tells [audience] to [common advice], but that's usually the exact reason they [bad outcome]."`,
        evidence: {
          views: `${((seed % 15) + 1.2).toFixed(1)}M`,
          likes: `${((seed % 40) + 45)}K`,
          quote: `"Why 99% of creators fail in 2026 (and what @${cleanHandle} does instead)..."`,
          visual: 'Dynamic movement in first 0.5s with bold contrast text overlay.',
          whyItWorks: 'Directly challenges a widely accepted belief in the first 1.2 seconds, inducing cognitive dissonance that halts the thumb scroll.',
          tryThisSuggestion: 'Start your reel by stating the exact opposite of common advice in your niche.',
          videoThumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
          videoDuration: '0:22',
          videoTitle: 'Contrarian Hook Reel'
        }
      },
      {
        id: 'gh2',
        title: 'Founder confession story',
        frequency: '3/10',
        dotColor: 'bg-pink-500',
        accentBorder: 'border-pink-500/50',
        type: 'hook',
        description: 'A first-person story that leads with their own mistake, then the consequence, then the lesson you can copy.',
        typicalHookOrCaption: `"I [specific expensive mistake] and it cost me [concrete consequence]. Here's what I'd do instead."`,
        evidence: {
          views: `${((seed % 10) + 0.8).toFixed(1)}M`,
          likes: `${((seed % 30) + 25)}K`,
          quote: `"I almost quit 3 months ago after losing $10k. Here is what turned everything around..."`,
          visual: 'Close-up speaking shot with subtle ambient background score.',
          whyItWorks: 'Authentic vulnerability creates immediate trust and high watch time through story arc resolution.',
          tryThisSuggestion: 'Lead with a real mistake or failure before offering your solution.',
          videoThumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
          videoDuration: '0:38',
          videoTitle: 'Confession Reel'
        }
      },
      {
        id: 'gh3',
        title: 'Myth teardown',
        frequency: '2/10',
        dotColor: 'bg-amber-500',
        accentBorder: 'border-amber-500/50',
        type: 'hook',
        description: 'Lists 3–4 myths founders believe and dismantles each one in rapid fire.',
        typicalHookOrCaption: `"[Number] lies about [topic] that are quietly killing your [outcome]."`,
        evidence: {
          views: `${((seed % 12) + 1.1).toFixed(1)}M`,
          likes: `${((seed % 50) + 35)}K`,
          quote: `"3 lies about Instagram growth that keep you stuck under 1,000 views."`,
          visual: 'Natural lighting, candid expression, zero heavy filters.',
          whyItWorks: 'Categorized listicles trigger curiosity gap and high bookmark save rates for future reference.',
          tryThisSuggestion: 'Debunk 3 common myths back-to-back in under 30 seconds.',
          videoThumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
          videoDuration: '0:29',
          videoTitle: 'Myth Teardown'
        }
      },
      {
        id: 'gh4',
        title: 'Named framework breakdown',
        frequency: '3/10',
        dotColor: 'bg-emerald-500',
        accentBorder: 'border-emerald-500/50',
        type: 'hook',
        description: 'Gives a memorable name to a repeatable process, then walks the numbered steps so it reads as a system.',
        typicalHookOrCaption: `"The [named] framework I use to [desirable result] without [common cost]."`,
        evidence: {
          views: `${((seed % 8) + 0.9).toFixed(1)}M`,
          likes: `${((seed % 20) + 18)}K`,
          quote: `"The 3-step Reel viral engine formula that generated 1M views for @${cleanHandle}."`,
          visual: '3-part visual overlay on screen with fast transitions.',
          whyItWorks: 'Proprietary names make abstract concepts feel like concrete, reusable assets viewers want to save.',
          tryThisSuggestion: 'Give your method a catchy 2-word proprietary name.',
          videoThumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
          videoDuration: '0:48',
          videoTitle: 'Framework Breakdown'
        }
      }
    ],

    captions: [
      {
        id: 'gc1',
        title: 'Micro-Essay + Free Resource DM Loop',
        frequency: '5/10',
        dotColor: 'bg-cyan-500',
        accentBorder: 'border-cyan-500/50',
        type: 'caption',
        description: 'Leads with a 3-bullet core summary, followed by a zero-pitch offer to DM a single keyword for the free guide.',
        typicalHookOrCaption: `"Here's the exact breakdown:\n1. [Point A]\n2. [Point B]\n\nComment 'DNA' and I'll DM you the free guide."`,
        evidence: {
          views: `${((seed % 14) + 1.5).toFixed(1)}M`,
          likes: `${((seed % 60) + 50)}K`,
          quote: `"Comment 'DNA' below and my automation will send you the breakdown file instantly."`,
          visual: 'Screen recording of resource preview with animated arrow.',
          whyItWorks: 'Spikes comment velocity in the initial broadcast window, signalling algorithmic popularity to Instagram.',
          tryThisSuggestion: 'Ask for a specific 1-word comment to receive an automated DM.'
        }
      },
      {
        id: 'gc2',
        title: 'Problem-to-Proof Story Arc',
        frequency: '3/10',
        dotColor: 'bg-purple-500',
        accentBorder: 'border-purple-500/50',
        type: 'caption',
        description: 'Opens with a real metric, details the 3 decisions that changed it, and ends with a high-stakes question.',
        typicalHookOrCaption: `"I spent [time] testing [method]. Here are the 3 things that worked:\n• [Item 1]\n• [Item 2]"`,
        evidence: {
          views: `${((seed % 10) + 1.0).toFixed(1)}M`,
          likes: `${((seed % 30) + 30)}K`,
          quote: `"I spent 30 days analyzing 100 viral reels. Here are the 3 pattern interrupts that always work."`,
          visual: 'Clean bullet list overlay text.',
          whyItWorks: 'Proof-first framing eliminates skepticism before the viewer reaches line 3.',
          tryThisSuggestion: 'Lead your caption with concrete test data.'
        }
      },
      {
        id: 'gc3',
        title: 'Contrarian Rule-Set Format',
        frequency: '2/10',
        dotColor: 'bg-rose-500',
        accentBorder: 'border-rose-500/50',
        type: 'caption',
        description: 'A list of 3 non-negotiable rules written in punchy, 1-line sentences with double line breaks for mobile scannability.',
        typicalHookOrCaption: `"Rule 1: Never [common trap].\nRule 2: Always [uncommon action].\nRule 3: [Punchy conclusion]."`,
        evidence: {
          views: `${((seed % 12) + 0.8).toFixed(1)}M`,
          likes: `${((seed % 25) + 20)}K`,
          quote: `"3 rules for viral reels: 1. Hook in 1.2s. 2. Use kinetic captions. 3. Ask for a 1-word comment."`,
          visual: 'High contrast text on clean frame.',
          whyItWorks: 'Short single-line paragraphs drastically reduce cognitive friction on mobile screens.',
          tryThisSuggestion: 'Format your caption as 3 numbered rules with double line breaks.'
        }
      },
      {
        id: 'gc4',
        title: 'Action Protocol Checklist',
        frequency: '2/10',
        dotColor: 'bg-blue-500',
        accentBorder: 'border-blue-500/50',
        type: 'caption',
        description: 'Step-by-step checklist formatted with square checkbox symbols, providing clear copy-paste execution.',
        typicalHookOrCaption: `"Step 1: [Action 1]\nStep 2: [Action 2]\nStep 3: [Action 3]\n\nSave this for your next [Project]."`,
        evidence: {
          views: `${((seed % 9) + 0.9).toFixed(1)}M`,
          likes: `${((seed % 20) + 18)}K`,
          quote: `"Checklist before posting your next reel: Checkbox 1: Strong hook line. Checkbox 2: Clear CTA."`,
          visual: 'Minimalist layout with square bullet points.',
          whyItWorks: 'Actionable checklists earn high save-to-bookmark rates.',
          tryThisSuggestion: 'Use square bullet formatting to create an execution checklist.'
        }
      }
    ],

    opportunities: [
      {
        id: 'gop1',
        text: `They rarely use direct customer quotes as proof — testimonial-driven posts are an untapped angle for @${cleanHandle}'s audience.`
      },
      {
        id: 'gop2',
        text: 'Almost no posts feature a co-founder or teammate; "building in a team" content could expand beyond the solo lane.'
      },
      {
        id: 'gop3',
        text: 'Weekend posts underperform — contrarian hooks land best Tuesday–Thursday mornings.'
      }
    ]
  };
}
