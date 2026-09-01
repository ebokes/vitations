import { createClient } from '@/lib/supabase/client';
import {
  LivestreamConfig,
  LivestreamFormData,
  LivestreamDisplayState,
  LivestreamStatus,
  computeLivestreamState,
  validateLivestreamUrl,
  createEmptyLivestreamConfig,
} from './types';

const TABLE_NAME = 'invitation_livestreams';

/**
 * Convert camelCase config to snake_case for database
 */
function toDbConfig(config: Partial<LivestreamConfig>): Record<string, any> {
  const dbConfig: Record<string, any> = {};
  if (config.id !== undefined) dbConfig.id = config.id;
  if (config.invitationId !== undefined) dbConfig.invitation_id = config.invitationId;
  if (config.title !== undefined) dbConfig.title = config.title;
  if (config.url !== undefined) dbConfig.url = config.url;
  if (config.provider !== undefined) dbConfig.provider = config.provider;
  if (config.scheduledStart !== undefined) dbConfig.scheduled_start = config.scheduledStart;
  if (config.scheduledEnd !== undefined) dbConfig.scheduled_end = config.scheduledEnd;
  if (config.status !== undefined) dbConfig.status = config.status;
  if (config.isActive !== undefined) dbConfig.is_active = config.isActive;
  if (config.createdAt !== undefined) dbConfig.created_at = config.createdAt;
  if (config.updatedAt !== undefined) dbConfig.updated_at = config.updatedAt;
  return dbConfig;
}

/**
 * Get livestream config for an invitation
 */
export async function getLivestreamConfig(invitationId: string): Promise<LivestreamConfig | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('invitation_id', invitationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching livestream:', error);
    return null;
  }

  return mapDbToConfig(data);
}

/**
 * Create or update livestream config
 */
export async function upsertLivestreamConfig(
  invitationId: string,
  data: Partial<LivestreamFormData>
): Promise<LivestreamConfig | null> {
  const supabase = createClient();

  // Validate URL if provided
  if (data.url && data.provider && !validateLivestreamUrl(data.url, data.provider)) {
    throw new Error(`Invalid URL for ${data.provider}`);
  }

  const now = new Date().toISOString();
  const existing = await getLivestreamConfig(invitationId);

  const config: Partial<LivestreamConfig> = {
    invitationId: invitationId,
    title: data.title,
    url: data.url,
    provider: data.provider || 'youtube',
    scheduledStart: data.scheduledStart,
    scheduledEnd: data.scheduledEnd,
    isActive: data.isActive ?? false,
    status: data.isActive ? 'upcoming' : 'disabled',
    updatedAt: now,
  };

  const dbConfig = toDbConfig(config);

  if (!existing) {
    dbConfig.id = `ls-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    dbConfig.created_at = now;
    dbConfig.status = 'disabled';

    const { data: inserted, error } = await supabase
      .from(TABLE_NAME)
      .insert(dbConfig)
      .select()
      .single();

    if (error) {
      console.error('Error creating livestream:', error);
      return null;
    }
    return mapDbToConfig(inserted);
  }

  const { data: updated, error } = await supabase
    .from(TABLE_NAME)
    .update(dbConfig)
    .eq('invitation_id', invitationId)
    .select()
    .single();

  if (error) {
    console.error('Error updating livestream:', error);
    return null;
  }

  return mapDbToConfig(updated);
}

/**
 * Update livestream activation status
 */
export async function setLivestreamActive(
  invitationId: string,
  isActive: boolean
): Promise<LivestreamConfig | null> {
  const supabase = createClient();

  const status: LivestreamStatus = isActive ? 'upcoming' : 'disabled';

  const dbConfig = toDbConfig({ isActive, status, updatedAt: new Date().toISOString() });

  const { data: updated, error } = await supabase
    .from(TABLE_NAME)
    .update(dbConfig)
    .eq('invitation_id', invitationId)
    .select()
    .single();

  if (error) {
    console.error('Error updating livestream status:', error);
    return null;
  }

  return mapDbToConfig(updated);
}

/**
 * Delete livestream config
 */
export async function deleteLivestreamConfig(invitationId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('invitationId', invitationId);

  return !error;
}

/**
 * Get display state for guest view
 */
export async function getLivestreamDisplayState(invitationId: string): Promise<LivestreamDisplayState | null> {
  const config = await getLivestreamConfig(invitationId);
  if (!config) return null;
  return computeLivestreamState(config);
}

/**
 * Check if invitation has livestream (Ultimate only)
 */
export async function hasLivestreamAccess(invitationId: string): Promise<boolean> {
  const config = await getLivestreamConfig(invitationId);
  return config !== null && config.isActive;
}

/**
 * Map database row to LivestreamConfig
 */
function mapDbToConfig(row: any): LivestreamConfig {
  return {
    id: row.id,
    invitationId: row.invitation_id,
    title: row.title,
    url: row.url,
    provider: row.provider,
    scheduledStart: row.scheduled_start,
    scheduledEnd: row.scheduled_end,
    status: row.status,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Create default livestream config (for demo/setup)
 */
export async function seedDemoLivestream(invitationId: string): Promise<LivestreamConfig | null> {
  return upsertLivestreamConfig(invitationId, {
    title: 'Wedding Ceremony Live',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    provider: 'youtube',
    scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    scheduledEnd: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // Tomorrow + 2h
    isActive: true,
  });
}