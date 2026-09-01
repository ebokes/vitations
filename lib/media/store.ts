import { createClient } from '@/lib/supabase/client';
import {
  MediaFile,
  MediaUploadConfig,
  MediaStatus,
  MediaType,
  MediaSource,
  UploadProgress,
  MediaUploadResult,
  generateStoragePath,
  generateThumbnailPath,
  MEDIA_CONFIG_BY_TIER,
  MediaFilters,
  GalleryConfig,
} from './types';

// Storage bucket names
const STORAGE_BUCKETS = {
  customer: 'invitation-media',
  guest: 'guest-uploads',
} as const;

const TABLE_NAME = 'invitation_media';

/**
 * Get media configuration for a package tier
 */
export function getMediaConfig(tier: string): MediaUploadConfig {
  return MEDIA_CONFIG_BY_TIER[tier] || MEDIA_CONFIG_BY_TIER.essential;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadMediaFile(
  invitationId: string,
  file: File,
  source: MediaSource,
  uploaderId?: string,
  onProgress?: (progress: number) => void
): Promise<MediaUploadResult> {
  try {
    const supabase = createClient();
    const bucket = source === 'guest' ? STORAGE_BUCKETS.guest : STORAGE_BUCKETS.customer;
    const storagePath = generateStoragePath(invitationId, source, file.name, uploaderId);

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    const publicUrl = urlData.publicUrl;

    // Generate thumbnail for images/videos
    let thumbnailUrl: string | undefined;
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const thumbnailPath = generateThumbnailPath(data.path);
      // In production, this would trigger a thumbnail generation function
      // For now, we'll use the original as thumbnail
      thumbnailUrl = publicUrl;
    }

    // Get image dimensions for images
    let width: number | undefined;
    let height: number | undefined;
    if (file.type.startsWith('image/')) {
      const dimensions = await getImageDimensions(file);
      width = dimensions.width;
      height = dimensions.height;
    }

    // Get video duration
    let duration: number | undefined;
    if (file.type.startsWith('video/')) {
      duration = await getVideoDuration(file);
    }

    const media: MediaFile = {
      id: data.id,
      invitationId,
      uploaderId,
      source,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      storagePath: data.path,
      publicUrl,
      thumbnailPath: thumbnailUrl ? generateThumbnailPath(data.path) : undefined,
      thumbnailUrl,
      width,
      height,
      duration,
      status: source === 'guest' ? 'pending' : 'approved',
      sortOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to database
    const { error: dbError } = await supabase.from(TABLE_NAME).insert({
      id: media.id,
      invitation_id: media.invitationId,
      uploader_id: media.uploaderId,
      source: media.source,
      type: media.type,
      file_name: media.fileName,
      file_size: media.fileSize,
      mime_type: media.mimeType,
      storage_path: media.storagePath,
      public_url: media.publicUrl,
      thumbnail_path: media.thumbnailPath,
      thumbnail_url: media.thumbnailUrl,
      width: media.width,
      height: media.height,
      duration: media.duration,
      status: media.status,
      sort_order: media.sortOrder,
    });

    if (dbError) {
      // Clean up storage on DB error
      await supabase.storage.from(bucket).remove([data.path]);
      return { success: false, error: dbError.message };
    }

    return { success: true, media };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Get image dimensions from file
 */
async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Get video duration from file
 */
async function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      resolve(video.duration);
      URL.revokeObjectURL(video.src);
    };
    video.onerror = () => {
      resolve(0);
      URL.revokeObjectURL(video.src);
    };
    video.src = URL.createObjectURL(file);
  });
}

/**
 * Get media files for an invitation
 */
export async function getInvitationMedia(
  invitationId: string,
  filters?: MediaFilters
): Promise<MediaFile[]> {
  const supabase = createClient();

  let query = supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('invitation_id', invitationId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  if (filters?.source) {
    query = query.eq('source', filters.source);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching media:', error);
    return [];
  }

  return (data || []).map(mapDbToMedia);
}

/**
 * Get approved media for public display
 */
export async function getApprovedMedia(invitationId: string): Promise<MediaFile[]> {
  return getInvitationMedia(invitationId, { status: 'approved' });
}

/**
 * Update media status
 */
export async function updateMediaStatus(
  mediaId: string,
  status: MediaStatus
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', mediaId);

  return !error;
}

/**
 * Update media caption
 */
export async function updateMediaCaption(
  mediaId: string,
  caption: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ caption, updated_at: new Date().toISOString() })
    .eq('id', mediaId);

  return !error;
}

/**
 * Update media sort order
 */
export async function updateMediaSortOrder(
  mediaId: string,
  sortOrder: number
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ sort_order: sortOrder, updated_at: new Date().toISOString() })
    .eq('id', mediaId);

  return !error;
}

/**
 * Delete media
 */
export async function deleteMedia(mediaId: string): Promise<boolean> {
  const supabase = createClient();

  // Get media first to know the storage path
  const { data: media, error: fetchError } = await supabase
    .from(TABLE_NAME)
    .select('storage_path, source')
    .eq('id', mediaId)
    .single();

  if (fetchError || !media) return false;

  // Delete from storage
  const bucket = media.source === 'guest' ? STORAGE_BUCKETS.guest : STORAGE_BUCKETS.customer;
  await supabase.storage.from(bucket).remove([media.storage_path]);

  // Delete from database
  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', mediaId);

  return !error;
}

/**
 * Bulk update media status (for admin approval)
 */
export async function bulkUpdateMediaStatus(
  mediaIds: string[],
  status: MediaStatus
): Promise<number> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({ status, updated_at: new Date().toISOString() })
    .in('id', mediaIds)
    .select('id');

  return data?.length || 0;
}

/**
 * Reorder media
 */
export async function reorderMedia(
  mediaIds: string[]
): Promise<boolean> {
  const supabase = createClient();

  const updates = mediaIds.map((id, index) =>
    supabase
      .from(TABLE_NAME)
      .update({ sort_order: index, updated_at: new Date().toISOString() })
      .eq('id', id)
  );

  const results = await Promise.all(updates);
  return results.every((r) => !r.error);
}

/**
 * Map database row to MediaFile
 */
function mapDbToMedia(row: any): MediaFile {
  return {
    id: row.id,
    invitationId: row.invitation_id,
    uploaderId: row.uploader_id,
    source: row.source,
    type: row.type,
    fileName: row.file_name,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    storagePath: row.storage_path,
    publicUrl: row.public_url,
    thumbnailPath: row.thumbnail_path,
    thumbnailUrl: row.thumbnail_url,
    width: row.width,
    height: row.height,
    duration: row.duration,
    status: row.status,
    caption: row.caption,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Create guest upload session
 */
export async function createGuestUploadSession(
  invitationId: string,
  guestName: string,
  guestPhone: string
): Promise<string> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('guest_upload_sessions')
    .insert({
      invitation_id: invitationId,
      guest_name: guestName,
      guest_phone: guestPhone,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}

/**
 * Get guest upload session
 */
export async function getGuestUploadSession(sessionId: string): Promise<{
  id: string;
  invitationId: string;
  guestName: string;
  guestPhone: string;
} | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('guest_upload_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    invitationId: data.invitation_id,
    guestName: data.guest_name,
    guestPhone: data.guest_phone,
  };
}

/**
 * Get default gallery config by tier
 */
export function getDefaultGalleryConfig(tier: string): GalleryConfig {
  const configs: Record<string, GalleryConfig> = {
    essential: {
      layout: 'grid',
      columns: 2,
      gap: 8,
      aspectRatio: '4/3',
      showCaptions: false,
      enableLightbox: true,
    },
    premium: {
      layout: 'masonry',
      columns: 3,
      gap: 12,
      aspectRatio: 'auto',
      showCaptions: true,
      enableLightbox: true,
    },
    ultimate: {
      layout: 'collage',
      columns: 4,
      gap: 8,
      aspectRatio: 'auto',
      showCaptions: true,
      enableLightbox: true,
    },
  };
  return configs[tier] || configs.essential;
}