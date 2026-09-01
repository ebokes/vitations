import {
  formatFileSize,
  isFileTypeAllowed,
  isFileSizeAllowed,
  getFileExtension,
  generateStoragePath,
  generateThumbnailPath,
  MediaType,
  MediaSource,
  MediaStatus,
  MediaUploadConfig,
} from '@/lib/media/types';
import {
  getMediaConfig,
  getDefaultGalleryConfig,
} from '@/lib/media/store';

describe('Media System', () => {
  describe('Media Config by Tier', () => {
    it('should return correct config for essential tier', () => {
      const config = getMediaConfig('essential');
      expect(config.maxFileSize).toBe(5 * 1024 * 1024);
      expect(config.allowedImageTypes).toContain('image/jpeg');
      expect(config.allowedVideoTypes).toHaveLength(0);
    });

    it('should return correct config for premium tier', () => {
      const config = getMediaConfig('premium');
      expect(config.maxFileSize).toBe(20 * 1024 * 1024);
      expect(config.allowedImageTypes).toContain('image/heic');
      expect(config.allowedVideoTypes).toContain('video/mp4');
    });

    it('should return correct config for ultimate tier', () => {
      const config = getMediaConfig('ultimate');
      expect(config.maxFileSize).toBe(50 * 1024 * 1024);
      expect(config.allowedVideoTypes).toContain('video/quicktime');
    });

    it('should fallback to essential for unknown tier', () => {
      const config = getMediaConfig('unknown');
      expect(config.maxFileSize).toBe(5 * 1024 * 1024);
    });
  });

  describe('File Size Formatting', () => {
    it('should format bytes', () => {
      expect(formatFileSize(500)).toBe('500 B');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(2 * 1024 * 1024)).toBe('2.0 MB');
    });
  });

  describe('File Type Validation', () => {
    const config: MediaUploadConfig = {
      maxFileSize: 10 * 1024 * 1024,
      allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
      allowedVideoTypes: ['video/mp4'],
    };

    it('should allow allowed image types', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      expect(isFileTypeAllowed(file, config)).toBe(true);
    });

    it('should allow allowed video types', () => {
      const file = new File([''], 'test.mp4', { type: 'video/mp4' });
      expect(isFileTypeAllowed(file, config)).toBe(true);
    });

    it('should reject disallowed types', () => {
      const file = new File([''], 'test.gif', { type: 'image/gif' });
      expect(isFileTypeAllowed(file, config)).toBe(false);
    });
  });

  describe('File Size Validation', () => {
    const config: MediaUploadConfig = {
      maxFileSize: 5 * 1024 * 1024,
      allowedImageTypes: ['image/jpeg'],
      allowedVideoTypes: [],
    };

    it('should allow files under max size', () => {
      const file = new File(['a'.repeat(1024)], 'test.jpg', { type: 'image/jpeg' });
      expect(isFileSizeAllowed(file, config)).toBe(true);
    });

    it('should reject files over max size', () => {
      const file = new File(['a'.repeat(6 * 1024 * 1024)], 'test.jpg', { type: 'image/jpeg' });
      expect(isFileSizeAllowed(file, config)).toBe(false);
    });
  });

  describe('File Extension', () => {
    it('should return correct extension for images', () => {
      expect(getFileExtension('image/jpeg')).toBe('jpg');
      expect(getFileExtension('image/png')).toBe('png');
      expect(getFileExtension('image/webp')).toBe('webp');
      expect(getFileExtension('image/heic')).toBe('heic');
    });

    it('should return correct extension for videos', () => {
      expect(getFileExtension('video/mp4')).toBe('mp4');
      expect(getFileExtension('video/webm')).toBe('webm');
      expect(getFileExtension('video/quicktime')).toBe('mov');
    });

    it('should return bin for unknown types', () => {
      expect(getFileExtension('application/pdf')).toBe('bin');
    });
  });

  describe('Storage Path Generation', () => {
    it('should generate customer storage path', () => {
      const path = generateStoragePath('inv-001', 'customer', 'photo.jpg', 'user-123');
      expect(path).toMatch(/^customer-media\/inv-001\/user-123\/\d+-[a-z0-9]+\.jpg$/);
    });

    it('should generate guest storage path', () => {
      const path = generateStoragePath('inv-001', 'guest', 'photo.jpg', 'session-456');
      expect(path).toMatch(/^guest-uploads\/inv-001\/session-456\/\d+-[a-z0-9]+\.jpg$/);
    });

    it('should use customer as default uploaderId', () => {
      const path = generateStoragePath('inv-001', 'customer', 'photo.jpg');
      expect(path).toContain('/customer/');
    });
  });

  describe('Thumbnail Path Generation', () => {
    it('should generate thumbnail path', () => {
      const path = generateThumbnailPath('customer-media/inv-001/user-123/123-abc.jpg');
      expect(path).toBe('customer-media/inv-001/user-123/123-abc_thumb.webp');
    });
  });

  describe('Gallery Config', () => {
    it('should return correct config for essential', () => {
      const config = getDefaultGalleryConfig('essential');
      expect(config.layout).toBe('grid');
      expect(config.columns).toBe(2);
    });

    it('should return correct config for premium', () => {
      const config = getDefaultGalleryConfig('premium');
      expect(config.layout).toBe('masonry');
      expect(config.columns).toBe(3);
    });

    it('should return correct config for ultimate', () => {
      const config = getDefaultGalleryConfig('ultimate');
      expect(config.layout).toBe('collage');
      expect(config.columns).toBe(4);
    });
  });
});