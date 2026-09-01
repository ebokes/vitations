'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Upload, CheckCircle, XCircle, AlertCircle, Loader2, Image, Video, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MediaUploader, UploadQueueItem } from './upload-components';
import { createGuestUploadSession, getGuestUploadSession, getMediaConfig } from './store';
import { formatFileSize } from './types';
import { cn } from '@/lib/utils';

interface GuestUploadProps {
  invitationId: string;
  tier: 'essential' | 'premium' | 'ultimate';
  onUploadComplete?: () => void;
  sessionId?: string;
}

export function GuestUpload({
  invitationId,
  tier,
  onUploadComplete,
  sessionId,
}: GuestUploadProps) {
  const [session, setSession] = useState<{ id: string; guestName: string; guestPhone: string } | null>(null);
  const [step, setStep] = useState<'info' | 'upload' | 'complete'>('info');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const config = getMediaConfig(tier);

  // Load existing session if provided
  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [sessionId]);

  const loadSession = async (id: string) => {
    try {
      setLoading(true);
      const { getGuestUploadSession } = await import('./store');
      const sessionData = await getGuestUploadSession(id);
      if (sessionData) {
        setSession(sessionData);
        setGuestName(sessionData.guestName);
        setGuestPhone(sessionData.guestPhone);
        setStep('upload');
      } else {
        setError('Session not found');
      }
    } catch (err) {
      setError('Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    if (!guestName.trim() || !guestPhone.trim()) {
      setError('Please enter your name and phone number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newSessionId = await createGuestUploadSession(invitationId, guestName, guestPhone);
      setSession({ id: newSessionId, guestName, guestPhone });
      setStep('upload');
    } catch (err) {
      setError('Failed to create upload session');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = useCallback(() => {
    onUploadComplete?.();
    setStep('complete');
  }, [onUploadComplete]);

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-600" />
          <p className="mt-4 text-neutral-600">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (step === 'info') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <Camera className="mx-auto h-12 w-12 text-primary-600" />
          <CardTitle>Share Your Photos & Videos</CardTitle>
          <CardDescription>
            Upload media for the invitation. Your uploads will be reviewed before appearing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="guest-name">Your Name</Label>
            <Input
              id="guest-name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="John Doe"
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-phone">Phone Number</Label>
            <Input
              id="guest-phone"
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="+234 800 000 0000"
              autoComplete="tel"
            />
          </div>

          <Button onClick={handleCreateSession} disabled={loading} className="w-full" size="lg">
            <Upload className="mr-2 h-4 w-4" />
            Continue to Upload
          </Button>

          <p className="text-xs text-neutral-500 text-center">
            Max file size: {formatFileSize(config.maxFileSize)} &bull; 
            {config.allowedImageTypes.length > 0 && `Images: ${config.allowedImageTypes.map(t => t.split('/')[1]).join(', ')}`}
            {config.allowedVideoTypes.length > 0 && ` &bull; Videos: ${config.allowedVideoTypes.map(t => t.split('/')[1]).join(', ')}`}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (step === 'upload') {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upload Media</CardTitle>
              <CardDescription>
                Hello, {guestName}! Select photos and videos to share.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {tier.charAt(0).toUpperCase() + tier.slice(1)} Package
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <MediaUploader
            invitationId={invitationId}
            tier={tier}
            source="guest"
            uploaderId={session?.id}
            maxFiles={20}
            onAllUploadsComplete={handleUploadComplete}
          />
        </CardContent>
      </Card>
    );
  }

  // Complete step
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="mt-6 text-2xl font-bold text-neutral-900">Upload Complete!</h3>
        <p className="mt-2 text-neutral-600">
          Thank you, {guestName}! Your media has been submitted for review.
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          Approved photos and videos will appear on the invitation.
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Guest Media Gallery - displays approved guest uploads
 */
interface GuestMediaGalleryProps {
  invitationId: string;
  className?: string;
}

export function GuestMediaGallery({ invitationId, className }: GuestMediaGalleryProps) {
  const [media, setMedia] = useState<import('./types').MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      const { getApprovedMedia } = await import('./store');
      const data = await getApprovedMedia(invitationId);
      // Filter to only guest uploads
      const guestMedia = data.filter((m) => m.source === 'guest');
      setMedia(guestMedia);
      setLoading(false);
    };
    fetchMedia();
  }, [invitationId]);

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center h-64', className)}>
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className={cn('text-center py-12 text-neutral-500', className)}>
        <Image className="mx-auto h-12 w-12 text-neutral-300" />
        <p className="mt-2">No guest photos yet</p>
        <p className="text-sm">Be the first to share!</p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3', className)}>
      {media.map((item) => (
        <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
          {item.thumbnailUrl ? (
            <img
              src={item.thumbnailUrl}
              alt={item.caption || item.fileName}
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              {item.type === 'video' ? (
                <Video className="h-10 w-10 text-neutral-400" />
              ) : (
                <Image className="h-10 w-10 text-neutral-400" />
              )}
            </div>
          )}
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="rounded-full bg-white/90 p-2">
                <Video className="h-5 w-5 text-neutral-900" />
              </div>
            </div>
          )}
          {item.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-xs truncate">
              {item.caption}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Admin Media Moderation Component
 */
interface MediaModerationProps {
  invitationId: string;
  onUpdate?: () => void;
}

export function MediaModeration({ invitationId, onUpdate }: MediaModerationProps) {
  const [media, setMedia] = useState<import('./types').MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    const fetchMedia = async () => {
      const { getInvitationMedia } = await import('./store');
      const data = await getInvitationMedia(invitationId);
      // Filter to only guest uploads
      const guestMedia = data.filter((m) => m.source === 'guest');
      setMedia(guestMedia);
      setLoading(false);
    };
    fetchMedia();
  }, [invitationId]);

  const handleStatusChange = async (mediaId: string, status: 'approved' | 'rejected') => {
    const { updateMediaStatus } = await import('./store');
    await updateMediaStatus(mediaId, status);
    setMedia((prev) =>
      prev.map((m) => (m.id === mediaId ? { ...m, status } : m))
    );
    onUpdate?.();
  };

  const filteredMedia = media.filter((m) =>
    filter === 'all' ? true : m.status === filter
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Guest Media Moderation</CardTitle>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredMedia.length === 0 ? (
          <p className="text-center text-neutral-500 py-8">No media found</p>
        ) : (
          <div className="space-y-4">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-neutral-50"
              >
                <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.fileName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      {item.type === 'video' ? (
                        <Video className="h-8 w-8 text-neutral-400" />
                      ) : (
                        <Image className="h-8 w-8 text-neutral-400" />
                      )}
                    </div>
                  )}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 truncate">{item.fileName}</p>
                  <p className="text-sm text-neutral-500">
                    {item.caption || 'No caption'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        item.status === 'pending'
                          ? 'secondary'
                          : item.status === 'approved'
                          ? 'default'
                          : 'danger'
                      }
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                    <span className="text-xs text-neutral-500">
                      {formatFileSize(item.fileSize)} &bull; {item.type}
                    </span>
                  </div>
                </div>

                {item.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(item.id, 'approved')}
                      className="w-24"
                    >
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleStatusChange(item.id, 'rejected')}
                      className="w-24"
                    >
                      <XCircle className="mr-1 h-3 w-3" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}