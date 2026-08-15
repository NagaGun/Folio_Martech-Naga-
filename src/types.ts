export type CreatorArchetype = 'Founder' | 'Content Creator' | 'Marketer' | 'Community Builder';

export interface EvidenceDetail {
  views: string;
  likes: string;
  quote: string;
  visual: string;
  whyItWorks: string;
  tryThisSuggestion?: string;
  videoThumbnail?: string;
  videoUrl?: string;
  videoDuration?: string;
  videoTitle?: string;
}

export interface ContentDnaPattern {
  id: string;
  title: string;
  frequency: string; // e.g. "4/10"
  dotColor: string; // Tailwind class e.g. "bg-indigo-500"
  accentBorder: string; // e.g. "border-indigo-500/40"
  type: 'hook' | 'caption';
  description: string;
  typicalHookOrCaption: string; // The dark container text e.g. "Everyone tells [audience] to..."
  evidence: EvidenceDetail;
}

export interface TheReadSection {
  synthesisText: string;
  whoTheySpeakTo: string[];
  contentPillars: string[];
}

export interface OpportunityItem {
  id: string;
  text: string;
}

export interface BioRewrite {
  originalBio: string;
  rewrittenBio: string;
  keyChanges: string[];
  whyItWorks: string;
}

export interface TopViralExample {
  id: string;
  title: string;
  caption: string;
  videoUrl?: string;
  videoThumbnail?: string;
  views?: string;
  likes?: string;
  sourceReelId?: string;
}

export interface CreatorReport {
  handle: string;
  displayName: string;
  avatarUrl: string;
  followerCount: string;
  verified: boolean;
  archetype: CreatorArchetype;
  archetypeReason: string;
  totalReelsAnalyzed: number;
  avgViralViews: string;
  theRead: TheReadSection;
  bioRewrite?: BioRewrite;
  topViralExamples?: TopViralExample[];
  hooks: ContentDnaPattern[]; // Exactly 4 hooks
  captions: ContentDnaPattern[]; // Exactly 4 captions
  opportunities: OpportunityItem[]; // Opportunities section
  generatedAt: string;
}
