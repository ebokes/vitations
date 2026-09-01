'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Video, Settings, Calendar, Clock, CheckCircle, AlertCircle, XCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  LivestreamConfig,
  LivestreamFormData,
  LivestreamDisplayState,
  LivestreamProvider,
  LIVESTREAM_PROVIDERS,
  validateLivestreamUrl,
  computeLivestreamState,
  formatTimeUntil,
} from './types';
import { upsertLivestreamConfig, setLivestreamActive, getLivestreamConfig, seedDemoLivestream } from './store';

interface LivestreamConfigProps {
  invitationId: string;
  packageTier: 'essential' | 'premium' | 'ultimate';
  onConfigChange?: () => void;
}

export function LivestreamConfigPanel({
  invitationId,
  packageTier,
  onConfigChange,
}: LivestreamConfigProps) {
  const [config, setConfig] = useState<LivestreamConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [embedPreview, setEmbedPreview] = useState<string>('');

  // Load existing config
  useEffect(() => {
    loadConfig();
  }, [invitationId]);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const data = await getLivestreamConfig(invitationId);
      setConfig(data);
    } catch (err) {
      console.error('Failed to load livestream config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: LivestreamFormData) => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate URL
      if (data.url && !validateLivestreamUrl(data.url, data.provider)) {
        throw new Error(`Invalid URL for ${LIVESTREAM_PROVIDERS[data.provider].name}`);
      }

      const result = await upsertLivestreamConfig(invitationId, data);
      if (result) {
        setConfig(result);
        setSuccess('Livestream configuration saved');
        onConfigChange?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (isActive: boolean) => {
    try {
      const result = await setLivestreamActive(invitationId, isActive);
      if (result) {
        setConfig(result);
        setSuccess(isActive ? 'Livestream activated' : 'Livestream deactivated');
        onConfigChange?.();
      }
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleSeedDemo = async () => {
    setSaving(true);
    try {
      const result = await seedDemoLivestream(invitationId);
      if (result) {
        setConfig(result);
        setSuccess('Demo livestream added');
        onConfigChange?.();
      }
    } catch (err) {
      setError('Failed to add demo');
    } finally {
      setSaving(false);
    }
  };

  // Update embed preview when URL changes
  const formData = React.useMemo((): LivestreamFormData => ({
    title: config?.title || '',
    url: config?.url || '',
    provider: config?.provider || 'youtube',
    scheduledStart: config?.scheduledStart ? config.scheduledStart.slice(0, 16) : '',
    scheduledEnd: config?.scheduledEnd ? config.scheduledEnd.slice(0, 16) : '',
    isActive: config?.isActive || false,
  }), [config]);

  useEffect(() => {
    if (formData.url && formData.provider) {
      const providerConfig = LIVESTREAM_PROVIDERS[formData.provider];
      setEmbedPreview(providerConfig.getEmbedUrl(formData.url));
    } else {
      setEmbedPreview('');
    }
  }, [formData.url, formData.provider]);

  if (packageTier !== 'ultimate') {
    return (
      <Card className="border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-amber-600" />
            <div>
              <p className="font-medium text-neutral-900">Livestream requires Ultimate package</p>
              <p className="text-sm text-neutral-500">
                Upgrade to Ultimate (₦350,000) to enable livestream for your event.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto" />
        </CardContent>
      </Card>
    );
  }

  const displayState = config ? computeLivestreamState(config) : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary-600" />
            <CardTitle>Livestream Settings</CardTitle>
          </div>
          {config && displayState && (
            <Badge
              variant={
                displayState.status === 'active' ? 'success' :
                displayState.status === 'upcoming' ? 'default' :
                displayState.status === 'ended' ? 'secondary' : 'secondary'
              }
            >
              {displayState.status.charAt(0).toUpperCase() + displayState.status.slice(1)}
            </Badge>
          )}
        </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              {success}
            </div>
          )}

          {/* Status & Activation */}
          <div className="rounded-lg bg-neutral-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">Livestream Status</p>
                <p className="text-sm text-neutral-500">
                  {displayState?.isLive ? '🔴 LIVE' :
                  displayState?.status === 'upcoming' ? `Starting in ${displayState.timeUntilStart ? formatTimeUntil(displayState.timeUntilStart) : 'soon'}` :
                  displayState?.status === 'ended' ? 'Ended' :
                  'Inactive'}
                </p>
              </div>
              <Switch
                checked={config?.isActive || false}
                onChange={(e) => handleToggleActive(e.target.checked)}
                disabled={saving}
              />
            </div>
          </div>

          {/* Configuration Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="livestream-title">Stream Title</Label>
              <Input
                id="livestream-title"
                value={formData.title}
                onChange={(e) => handleSave({ ...formData, title: e.target.value })}
                placeholder="e.g., Wedding Ceremony Live"
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="livestream-provider">Platform</Label>
              <Select
                id="livestream-provider"
                value={formData.provider}
                onChange={(e) => handleSave({ ...formData, provider: e.target.value as LivestreamProvider })}
                disabled={saving}
                options={Object.entries(LIVESTREAM_PROVIDERS).map(([key, provider]) => ({
                  value: key,
                  label: provider.name,
                }))}
                placeholder="Select platform"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="livestream-url">Stream URL</Label>
              <Input
                id="livestream-url"
                type="url"
                value={formData.url}
                onChange={(e) => handleSave({ ...formData, url: e.target.value })}
                placeholder="Paste your livestream URL here"
                disabled={saving}
              />
              <p className="text-xs text-neutral-500">
                {LIVESTREAM_PROVIDERS[formData.provider].name} URL
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="scheduled-start">Scheduled Start</Label>
                <Input
                  id="scheduled-start"
                  type="datetime-local"
                  value={formData.scheduledStart || ''}
                  onChange={(e) => handleSave({ ...formData, scheduledStart: e.target.value || undefined })}
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduled-end">Scheduled End</Label>
                <Input
                  id="scheduled-end"
                  type="datetime-local"
                  value={formData.scheduledEnd || ''}
                  onChange={(e) => handleSave({ ...formData, scheduledEnd: e.target.value || undefined })}
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* Embed Preview */}
          {embedPreview && (
            <div className="space-y-2 rounded-lg border border-neutral-200 p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-neutral-900">Embed Preview</p>
                <a
                  href={formData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open on {LIVESTREAM_PROVIDERS[formData.provider].name}
                </a>
              </div>
              {LIVESTREAM_PROVIDERS[formData.provider].name === 'YouTube Live' ? (
                <iframe
                  src={embedPreview}
                  title={formData.title}
                  className="w-full aspect-video rounded-lg border border-neutral-200"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="aspect-video rounded-lg bg-neutral-100 flex items-center justify-center">
                  <p className="text-neutral-500">
                    {LIVESTREAM_PROVIDERS[formData.provider].name} does not support iframe embed.
                    <br />
                    Guests will be redirected to the platform.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-200">
            <Button onClick={handleSeedDemo} variant="outline" disabled={saving}>
              <Settings className="mr-2 h-4 w-4" />
              Add Demo Stream
            </Button>
            <Button onClick={() => handleSave(formData)} disabled={saving}>
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </CardContent>
      </Card>
  );
}

/**
 * Guest-facing Livestream Section
 */
interface LivestreamGuestViewProps {
  invitationId: string;
  className?: string;
}

export function LivestreamGuestView({ invitationId, className }: LivestreamGuestViewProps) {
  const [state, setState] = useState<LivestreamDisplayState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadState = async () => {
      setLoading(true);
      try {
        const { getLivestreamDisplayState } = await import('./store');
        const data = await getLivestreamDisplayState(invitationId);
        setState(data);
      } catch (err) {
        setError('Failed to load livestream');
      } finally {
        setLoading(false);
      }
    };
    loadState();
  }, [invitationId]);

  if (loading) {
    return (
      <div className={cn('aspect-video rounded-xl bg-neutral-100 flex items-center justify-center', className)}>
        <div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!state || state.status === 'disabled') {
    return null; // Don't show anything if no livestream or disabled
  }

  const providerConfig = LIVESTREAM_PROVIDERS[state.provider];

  return (
    <section className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Video className="h-5 w-5 text-primary-600" />
        <h3 className="font-semibold text-neutral-900">{state.title}</h3>
        <Badge
          variant={
            state.status === 'active' ? 'success' :
            state.status === 'upcoming' ? 'default' :
            'secondary'
          }
        >
          {state.status.charAt(0).toUpperCase() + state.status.slice(1)}
        </Badge>
      </div>

      {state.status === 'upcoming' && state.timeUntilStart && (
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Clock className="h-4 w-4" />
          <span>Starting in {formatTimeUntil(state.timeUntilStart)}</span>
          {state.scheduledStart && (
            <>
              <span>•</span>
              <span>on {new Date(state.scheduledStart).toLocaleDateString()}</span>
              <span>at {new Date(state.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </>
          )}
        </div>
      )}

      {state.status === 'active' && state.timeUntilEnd && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span>LIVE - Ends in {formatTimeUntil(state.timeUntilEnd)}</span>
        </div>
      )}

      {state.status === 'ended' && (
        <div className="text-sm text-neutral-500">
          This livestream has ended.
        </div>
      )}

      {state.status === 'active' && (
        <div className="aspect-video rounded-xl overflow-hidden bg-black">
          {providerConfig.name === 'YouTube Live' ? (
            <iframe
              src={providerConfig.getEmbedUrl(state.url)}
              title={state.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <a
              href={state.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full w-full items-center justify-center gap-3 text-white"
            >
              <Video className="h-10 w-10" />
              <span>Watch on {providerConfig.name}</span>
              <ExternalLink className="h-5 w-5" />
            </a>
          )}
        </div>
      )}

      {state.status === 'upcoming' && (
        <div className="aspect-video rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center">
          <div className="text-center p-8">
            <Video className="mx-auto h-16 w-16 text-neutral-300" />
            <p className="mt-4 text-neutral-600">Livestream will appear here when it starts</p>
            {state.scheduledStart && (
              <p className="mt-2 text-sm text-neutral-500">
                Scheduled for {new Date(state.scheduledStart).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}

      {state.status === 'ended' && (
        <div className="aspect-video rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center">
          <div className="text-center p-8">
            <XCircle className="mx-auto h-16 w-16 text-neutral-300" />
            <p className="mt-4 text-neutral-600">This livestream has ended</p>
            <a
              href={state.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-primary-600 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Watch recording on {providerConfig.name}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}