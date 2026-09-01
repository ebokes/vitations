import {
  validateLivestreamUrl,
  getEmbedUrl,
  supportsEmbed,
  computeLivestreamState,
  formatTimeUntil,
  createEmptyLivestreamConfig,
  LivestreamConfig,
  LivestreamStatus,
  LivestreamProvider,
} from '@/lib/livestream/types';

describe('Livestream System', () => {
  describe('URL Validation', () => {
    it('should validate YouTube URLs', () => {
      expect(validateLivestreamUrl('https://www.youtube.com/watch?v=abc123', 'youtube')).toBe(true);
      expect(validateLivestreamUrl('https://youtu.be/abc123', 'youtube')).toBe(true);
      expect(validateLivestreamUrl('https://youtube.com/embed/abc123', 'youtube')).toBe(true);
      expect(validateLivestreamUrl('https://invalid.com', 'youtube')).toBe(false);
    });

    it('should validate Zoom URLs', () => {
      expect(validateLivestreamUrl('https://zoom.us/j/123456789', 'zoom')).toBe(true);
      expect(validateLivestreamUrl('https://www.zoom.us/j/123456789?pwd=abc', 'zoom')).toBe(true);
      expect(validateLivestreamUrl('https://youtube.com', 'zoom')).toBe(false);
    });

    it('should validate Google Meet URLs', () => {
      expect(validateLivestreamUrl('https://meet.google.com/abc-def-ghi', 'google_meet')).toBe(true);
      expect(validateLivestreamUrl('https://meet.google.com/abc', 'google_meet')).toBe(true);
      expect(validateLivestreamUrl('https://zoom.us', 'google_meet')).toBe(false);
    });

    it('should allow any HTTPS URL for custom', () => {
      expect(validateLivestreamUrl('https://any-site.com/stream', 'custom')).toBe(true);
      expect(validateLivestreamUrl('https://example.com', 'custom')).toBe(true);
      expect(validateLivestreamUrl('http://insecure.com', 'custom')).toBe(true); // custom allows http too
    });
  });

  describe('Embed URL', () => {
    it('should convert YouTube URLs to embed', () => {
      const embed = getEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube');
      expect(embed).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
    });

    it('should convert youtu.be URLs to embed', () => {
      const embed = getEmbedUrl('https://youtu.be/dQw4w9WgXcQ', 'youtube');
      expect(embed).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
    });

    it('should return original URL for non-YouTube', () => {
      const zoomUrl = 'https://zoom.us/j/123456789';
      expect(getEmbedUrl(zoomUrl, 'zoom')).toBe(zoomUrl);
    });
  });

  describe('Embed Support', () => {
    it('should support embed for YouTube', () => {
      expect(supportsEmbed('youtube')).toBe(true);
    });

    it('should not support embed for others', () => {
      expect(supportsEmbed('zoom')).toBe(false);
      expect(supportsEmbed('google_meet')).toBe(false);
      expect(supportsEmbed('custom')).toBe(false);
    });
  });

  describe('State Computation', () => {
    const baseConfig: LivestreamConfig = {
      id: 'ls-001',
      invitationId: 'inv-001',
      title: 'Test Stream',
      url: 'https://youtube.com/watch?v=test',
      provider: 'youtube',
      isActive: true,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    it('should return disabled when not active', () => {
      const config = { ...baseConfig, isActive: false, status: 'upcoming' as LivestreamStatus };
      const state = computeLivestreamState(config);
      expect(state.status).toBe('disabled');
      expect(state.isLive).toBe(false);
    });

    it('should return upcoming when scheduled for future', () => {
      const future = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
      const config = { ...baseConfig, scheduledStart: future, isActive: true };
      const state = computeLivestreamState(config);
      expect(state.status).toBe('upcoming');
      expect(state.timeUntilStart).toBeGreaterThan(0);
    });

    it('should return active when in scheduled window', () => {
      const past = new Date(Date.now() - 1800000).toISOString(); // 30 min ago
      const future = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
      const config = { ...baseConfig, scheduledStart: past, scheduledEnd: future, isActive: true };
      const state = computeLivestreamState(config);
      expect(state.status).toBe('active');
      expect(state.isLive).toBe(true);
      expect(state.timeUntilEnd).toBeGreaterThan(0);
    });

    it('should return ended when past scheduled end', () => {
      const past = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago
      const morePast = new Date(Date.now() - 7200000).toISOString(); // 2 hours ago
      const config = { ...baseConfig, scheduledStart: morePast, scheduledEnd: past, isActive: true };
      const state = computeLivestreamState(config);
      expect(state.status).toBe('ended');
      expect(state.isLive).toBe(false);
    });

    it('should return active when no schedule but isActive', () => {
      const config = { ...baseConfig, scheduledStart: undefined, scheduledEnd: undefined, isActive: true };
      const state = computeLivestreamState(config);
      expect(state.status).toBe('active');
      expect(state.isLive).toBe(true);
    });
  });

  describe('Time Formatting', () => {
    it('should format seconds', () => {
      expect(formatTimeUntil(500)).toBe('Now');
      expect(formatTimeUntil(1000)).toBe('Now');
      expect(formatTimeUntil(30000)).toBe('30s');
      expect(formatTimeUntil(59000)).toBe('59s');
    });

    it('should format minutes', () => {
      expect(formatTimeUntil(60000)).toBe('1m 0s');
      expect(formatTimeUntil(120000)).toBe('2m 0s');
      expect(formatTimeUntil(3540000)).toBe('59m 0s');
    });

    it('should format hours', () => {
      expect(formatTimeUntil(3600000)).toBe('1h 0m');
      expect(formatTimeUntil(7200000)).toBe('2h 0m');
      expect(formatTimeUntil(86340000)).toBe('23h 59m');
    });

    it('should format days', () => {
      expect(formatTimeUntil(86400000)).toBe('1d 0h');
      expect(formatTimeUntil(172800000)).toBe('2d 0h');
      expect(formatTimeUntil(90000000)).toBe('1d 1h');
    });
  });

  describe('Empty Config', () => {
    it('should create empty config with defaults', () => {
      const config = createEmptyLivestreamConfig('inv-001');
      expect(config.invitationId).toBe('inv-001');
      expect(config.title).toBe('');
      expect(config.url).toBe('');
      expect(config.provider).toBe('youtube');
      expect(config.status).toBe('disabled');
      expect(config.isActive).toBe(false);
    });
  });
});