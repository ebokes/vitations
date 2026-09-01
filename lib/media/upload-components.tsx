'use client';

import * as React from 'react';
import { useState, useCallback, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatFileSize, isFileTypeAllowed, isFileSizeAllowed, MediaUploadConfig } from './types';

export interface UploadQueueItem {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
  mediaId?: string;
}

interface MediaUploaderProps {
  invitationId: string;
  tier: 'essential' | 'premium' | 'ultimate';
  source?: 'customer' | 'guest';
  uploaderId?: string;
  maxFiles?: number;
  onUploadComplete?: (mediaId: string) => void;
  onAllUploadsComplete?: () => void;
  disabled?: boolean;
}

export function MediaUploader({
  invitationId,
  tier,
  source = 'customer',
  uploaderId,
  maxFiles = 10,
  onUploadComplete,
  onAllUploadsComplete,
  disabled = false,
}: MediaUploaderProps) {
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const config = getConfigForTier(tier);

  const handleFiles = useCallback(
    async (files: FileList) => {
      const newItems: UploadQueueItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file
        if (!isFileTypeAllowed(file, config)) {
          newItems.push({
            id: `${Date.now()}-${i}`,
            file,
            progress: 0,
            status: 'error',
            error: `File type not allowed: ${file.type}`,
          });
          continue;
        }

        if (!isFileSizeAllowed(file, config)) {
          newItems.push({
            id: `${Date.now()}-${i}`,
            file,
            progress: 0,
            status: 'error',
            error: `File too large. Max: ${formatFileSize(config.maxFileSize)}`,
          });
          continue;
        }

        // Create preview for images
        let preview: string | undefined;
        if (file.type.startsWith('image/')) {
          preview = URL.createObjectURL(file);
        }

        newItems.push({
          id: `${Date.now()}-${i}`,
          file,
          preview,
          progress: 0,
          status: 'idle',
        });
      }

      setQueue((prev) => [...prev, ...newItems].slice(0, maxFiles));
    },
    [config, maxFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (!disabled && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [disabled, handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
      e.target.value = '';
    },
    [handleFiles]
  );

  const removeFile = useCallback((id: string) => {
    setQueue((prev) => {
      const item = prev.find((q) => q.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((q) => q.id !== id);
    });
  }, []);

  const uploadFile = useCallback(
    async (item: UploadQueueItem) => {
      // Import dynamically to avoid SSR issues
      const { uploadMediaFile } = await import('./store');

      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id ? { ...q, status: 'uploading', progress: 0 } : q
        )
      );

      const result = await uploadMediaFile(
        invitationId,
        item.file,
        source,
        uploaderId,
        (progress) => {
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, progress } : q
            )
          );
        }
      );

      if (result.success && result.media) {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: 'success', progress: 100, mediaId: result.media!.id }
              : q
          )
        );
        onUploadComplete?.(result.media.id);
      } else {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: 'error', error: result.error }
              : q
          )
        );
      }

      // Check if all uploads complete
      setQueue((prev) => {
        const allDone = prev.every(
          (q) => q.status === 'success' || q.status === 'error'
        );
        if (allDone && prev.length > 0) {
          onAllUploadsComplete?.();
        }
        return prev;
      });
    },
    [invitationId, source, uploaderId, onUploadComplete, onAllUploadsComplete]
  );

  const uploadAll = useCallback(async () => {
    const pendingItems = queue.filter((q) => q.status === 'idle' || q.status === 'error');
    for (const item of pendingItems) {
      await uploadFile(item);
    }
  }, [queue, uploadFile]);

  const clearCompleted = useCallback(() => {
    setQueue((prev) => {
      prev
        .filter((q) => q.status === 'success')
        .forEach((q) => {
          if (q.preview) URL.revokeObjectURL(q.preview);
        });
      return prev.filter((q) => q.status !== 'success');
    });
  }, []);

  const retryFailed = useCallback(() => {
    setQueue((prev) =>
      prev.map((q) =>
        q.status === 'error' ? { ...q, status: 'idle', progress: 0, error: undefined } : q
      )
    );
  }, []);

  // Auto-upload on add
  React.useEffect(() => {
    const newItems = queue.filter((q) => q.status === 'idle');
    if (newItems.length > 0) {
      uploadAll();
    }
  }, [queue, uploadAll]);

  const hasErrors = queue.some((q) => q.status === 'error');
  const hasPending = queue.some((q) => q.status === 'idle' || q.status === 'uploading');
  const allComplete = queue.length > 0 && queue.every((q) => q.status === 'success' || q.status === 'error');

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-neutral-300 hover:border-primary-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={getAcceptTypes(config)}
          onChange={handleFileInputChange}
          disabled={disabled || queue.length >= maxFiles}
          className="hidden"
        />

        <Upload className="mx-auto h-12 w-12 text-neutral-400" />
        <p className="mt-4 text-lg font-medium text-neutral-900">
          {isDragging ? 'Drop files here' : 'Drag & drop or click to upload'}
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          {getAcceptDescription(config)} &bull; Max {formatFileSize(config.maxFileSize)} per file
        </p>
        {queue.length >= maxFiles && (
          <p className="mt-2 text-sm text-amber-600">Maximum files reached</p>
        )}
      </div>

      {/* Upload Queue */}
      {queue.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900">Upload Queue ({queue.length})</h3>
              <div className="flex gap-2">
                {hasPending && (
                  <Button onClick={uploadAll} disabled={disabled} size="sm">
                    Upload All
                  </Button>
                )}
                {allComplete && (
                  <Button variant="outline" onClick={clearCompleted} size="sm">
                    Clear Completed
                  </Button>
                )}
                {hasErrors && (
                  <Button variant="outline" onClick={retryFailed} size="sm">
                    Retry Failed
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {queue.map((item) => (
                <UploadQueueItemComponent
                  key={item.id}
                  item={item}
                  onRemove={removeFile}
                  config={config}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function UploadQueueItemComponent({
  item,
  onRemove,
  config,
}: {
  item: UploadQueueItem;
  onRemove: (id: string) => void;
  config: MediaUploadConfig;
}) {
  const [previewError, setPreviewError] = useState(false);

  const getStatusIcon = () => {
    switch (item.status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-primary-600" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Upload className="h-4 w-4 text-neutral-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (item.status) {
      case 'uploading':
        return <Badge variant="secondary">Uploading</Badge>;
      case 'success':
        return <Badge variant="default">Done</Badge>;
      case 'error':
        return <Badge variant="danger">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-neutral-50">
      {/* Preview */}
      <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
        {item.preview && !previewError && item.file.type.startsWith('image/') ? (
          <img
            src={item.preview}
            alt={item.file.name}
            className="h-full w-full object-cover"
            onError={() => setPreviewError(true)}
          />
        ) : item.file.type.startsWith('video/') ? (
          <div className="h-full w-full flex items-center justify-center">
            <Video className="h-8 w-8 text-neutral-400" />
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Image className="h-8 w-8 text-neutral-400" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          {getStatusIcon()}
        </div>
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="truncate font-medium text-neutral-900">{item.file.name}</p>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-neutral-500">{formatFileSize(item.file.size)}</p>
        {item.status === 'uploading' && (
          <Progress value={item.progress} className="mt-2 h-1" />
        )}
        {item.error && (
          <p className="mt-1 text-sm text-red-600">{item.error}</p>
        )}
      </div>

      {/* Actions */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.id)}
        className="text-neutral-400 hover:text-red-600"
        disabled={item.status === 'uploading'}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

function getConfigForTier(tier: string): MediaUploadConfig {
  const configs: Record<string, MediaUploadConfig> = {
    essential: { maxFileSize: 5 * 1024 * 1024, allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'], allowedVideoTypes: [] },
    premium: { maxFileSize: 20 * 1024 * 1024, allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'], allowedVideoTypes: ['video/mp4', 'video/webm'] },
    ultimate: { maxFileSize: 50 * 1024 * 1024, allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'], allowedVideoTypes: ['video/mp4', 'video/webm', 'video/quicktime'] },
  };
  return configs[tier] || configs.essential;
}

function getAcceptTypes(config: MediaUploadConfig): string {
  return [...config.allowedImageTypes, ...config.allowedVideoTypes].join(',');
}

function getAcceptDescription(config: MediaUploadConfig): string {
  const imageTypes = config.allowedImageTypes.map((t) => t.split('/')[1].toUpperCase()).join(', ');
  const videoTypes = config.allowedVideoTypes.map((t) => t.split('/')[1].toUpperCase()).join(', ');
  const parts = [];
  if (imageTypes) parts.push(`Images: ${imageTypes}`);
  if (videoTypes) parts.push(`Videos: ${videoTypes}`);
  return parts.join(' &bull; ');
}

/**
 * Simple image upload for single file (e.g., profile, hero)
 */
export function useImageUpload(
  invitationId: string,
  tier: 'essential' | 'premium' | 'ultimate',
  source: 'customer' | 'guest' = 'customer'
) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      const config = getConfigForTier(tier);

      if (!isFileTypeAllowed(file, config)) {
        setError('File type not allowed');
        return null;
      }

      if (!isFileSizeAllowed(file, config)) {
        setError(`File too large. Max: ${formatFileSize(config.maxFileSize)}`);
        return null;
      }

      setUploading(true);
      setError(null);

      try {
        const { uploadMediaFile } = await import('./store');
        const result = await uploadMediaFile(invitationId, file, source);

        if (result.success && result.media) {
          return result.media.publicUrl;
        }
        setError(result.error || 'Upload failed');
        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
        return null;
      } finally {
        setUploading(false);
      }
    },
    [invitationId, tier, source]
  );

  return { upload, uploading, error };
}