export type MediaType = 'image' | 'video';
export type MediaSource = 'customer' | 'guest';
export type MediaStatus = 'pending' | 'approved' | 'rejected' | 'removed';
export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export interface MediaFile {
  id: string;
  invitationId: string;
  uploaderId?: string; // customer user ID or guest session ID
  source: MediaSource;
  type: MediaType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  publicUrl: string;
  thumbnailPath?: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number; // for videos in seconds
  status: MediaStatus;
  caption?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaUploadConfig {
  maxFileSize: number; // in bytes
  allowedImageTypes: string[];
  allowedVideoTypes: string[];
  maxImageWidth?: number;
  maxImageHeight?: number;
  maxVideoDuration?: number; // in seconds
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number; // 0-100
  status: UploadStatus;
  error?: string;
  uploadedUrl?: string;
}

export interface MediaUploadResult {
  success: boolean;
  media?: MediaFile;
  error?: string;
}

export interface GuestUploadSession {
  id: string;
  invitationId: string;
  guestName: string;
  guestPhone: string;
  createdAt: string;
}

// Media configuration by package tier
export const MEDIA_CONFIG_BY_TIER: Record<string, MediaUploadConfig> = {
  essential: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedVideoTypes: [],
  },
  premium: {
    maxFileSize: 20 * 1024 * 1024, // 20MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
    allowedVideoTypes: ['video/mp4', 'video/webm'],
    maxImageWidth: 4096,
    maxImageHeight: 4096,
    maxVideoDuration: 60, // 1 minute
  },
  ultimate: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
    allowedVideoTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxImageWidth: 4096,
    maxImageHeight: 4096,
    maxVideoDuration: 300, // 5 minutes
  },
};

// Gallery layout types
export type GalleryLayout = 'grid' | 'masonry' | 'carousel' | 'collage';

export interface GalleryConfig {
  layout: GalleryLayout;
  columns?: number;
  gap?: number;
  aspectRatio?: 'auto' | '1/1' | '4/3' | '16/9' | '3/4';
  showCaptions?: boolean;
  enableLightbox?: boolean;
  autoplay?: boolean; // for carousel
}

export interface MediaFilters {
  type?: MediaType;
  source?: MediaSource;
  status?: MediaStatus;
  invitationId?: string;
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Check if file type is allowed
export function isFileTypeAllowed(file: File, config: MediaUploadConfig): boolean {
  if (file.type.startsWith('image/')) {
    return config.allowedImageTypes.includes(file.type);
  }
  if (file.type.startsWith('video/')) {
    return config.allowedVideoTypes.includes(file.type);
  }
  return false;
}

// Check if file size is allowed
export function isFileSizeAllowed(file: File, config: MediaUploadConfig): boolean {
  return file.size <= config.maxFileSize;
}

// Get file extension from mime type
export function getFileExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/heic': 'heic',
    'image/heif': 'heif',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
  };
  return extensions[mimeType] || 'bin';
}

// Generate storage path
export function generateStoragePath(
  invitationId: string,
  source: MediaSource,
  fileName: string,
  uploaderId?: string
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = fileName.split('.').pop() || 'bin';
  const prefix = source === 'guest' ? 'guest-uploads' : 'customer-media';
  return `${prefix}/${invitationId}/${uploaderId || 'customer'}/${timestamp}-${random}.${ext}`;
}

// Generate thumbnail path
export function generateThumbnailPath(storagePath: string): string {
  return storagePath.replace(/\.[^.]+$/, '_thumb.webp');
}