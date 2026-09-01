export type LivestreamStatus = 'upcoming' | 'active' | 'ended' | 'disabled';
export type LivestreamProvider = 'youtube' | 'zoom' | 'google_meet' | 'custom';

export interface LivestreamConfig {
  id: string;
  invitationId: string;
  title: string;
  url: string;
  provider: LivestreamProvider;
  scheduledStart?: string; // ISO timestamp
  scheduledEnd?: string;
  status: LivestreamStatus;
  isActive: boolean; // manual activation toggle
  createdAt: string;
  updatedAt: string;
}

export interface LivestreamFormData {
  title: string;
  url: string;
  provider: LivestreamProvider;
  scheduledStart?: string;
  scheduledEnd?: string;
  isActive: boolean;
}

export interface LivestreamDisplayState {
  status: LivestreamStatus;
  title: string;
  url: string;
  provider: LivestreamProvider;
  scheduledStart?: string;
  scheduledEnd?: string;
  isLive: boolean;
  timeUntilStart?: number; // milliseconds
  timeUntilEnd?: number; // milliseconds
}

// Supported providers with validation patterns
export const LIVESTREAM_PROVIDERS: Record<LivestreamProvider, {
  name: string;
  pattern: RegExp;
  embedPattern?: RegExp;
  getEmbedUrl: (url: string) => string;
}> = {
  youtube: {
    name: 'YouTube Live',
    pattern: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
    embedPattern: /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    getEmbedUrl: (url) => {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    },
  },
  zoom: {
    name: 'Zoom',
    pattern: /^(https?:\/\/)?(www\.)?zoom\.us\/j\/\d+/,
    getEmbedUrl: (url) => url, // Zoom doesn't support iframe embed easily
  },
  google_meet: {
    name: 'Google Meet',
    pattern: /^(https?:\/\/)?(meet\.google\.com|meet\.google\.com\/[a-z-]+)/,
    getEmbedUrl: (url) => url, // Google Meet doesn't support iframe embed easily
  },
  custom: {
    name: 'Custom URL',
    pattern: /^https?:\/\/.+/,
    getEmbedUrl: (url) => url,
  },
};

// Validate livestream URL
export function validateLivestreamUrl(url: string, provider: LivestreamProvider): boolean {
  const providerConfig = LIVESTREAM_PROVIDERS[provider];
  if (provider === 'custom') return true; // Allow any HTTPS URL for custom
  return providerConfig.pattern.test(url);
}

// Get embed URL for iframe
export function getEmbedUrl(url: string, provider: LivestreamProvider): string {
  const providerConfig = LIVESTREAM_PROVIDERS[provider];
  return providerConfig.getEmbedUrl(url);
}

// Check if provider supports iframe embed
export function supportsEmbed(provider: LivestreamProvider): boolean {
  return provider === 'youtube';
}

// Compute display state from config
export function computeLivestreamState(config: LivestreamConfig): LivestreamDisplayState {
  const now = new Date();
  const scheduledStart = config.scheduledStart ? new Date(config.scheduledStart) : null;
  const scheduledEnd = config.scheduledEnd ? new Date(config.scheduledEnd) : null;

  let status: LivestreamStatus = config.status;
  let isLive = false;
  let timeUntilStart: number | undefined;
  let timeUntilEnd: number | undefined;

  if (!config.isActive) {
    status = 'disabled';
  } else if (scheduledStart && scheduledEnd) {
    if (now < scheduledStart) {
      status = 'upcoming';
      timeUntilStart = scheduledStart.getTime() - now.getTime();
    } else if (now >= scheduledStart && now <= scheduledEnd) {
      status = 'active';
      isLive = true;
      timeUntilEnd = scheduledEnd.getTime() - now.getTime();
    } else {
      status = 'ended';
    }
  } else if (scheduledStart && !scheduledEnd) {
    if (now < scheduledStart) {
      status = 'upcoming';
      timeUntilStart = scheduledStart.getTime() - now.getTime();
    } else {
      status = config.isActive ? 'active' : 'disabled';
      isLive = config.isActive;
    }
  } else {
    // No schedule - purely manual
    status = config.isActive ? 'active' : 'disabled';
    isLive = config.isActive;
  }

  return {
    status,
    title: config.title,
    url: config.url,
    provider: config.provider,
    scheduledStart: config.scheduledStart,
    scheduledEnd: config.scheduledEnd,
    isLive,
    timeUntilStart,
    timeUntilEnd,
  };
}

// Format time until
export function formatTimeUntil(ms: number): string {
  if (ms <= 1000) return 'Now';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

// Default empty config
export function createEmptyLivestreamConfig(invitationId: string): LivestreamConfig {
  return {
    id: `ls-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    invitationId,
    title: '',
    url: '',
    provider: 'youtube',
    status: 'disabled',
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}