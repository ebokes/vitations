'use server';

import { createClient } from '@/lib/supabase/server';
import type { Notification, NotificationType } from './types';
import { getNotificationTemplate } from './types';

// Create a notification (admin or system only)
export async function createNotification(
  userId: string,
  type: NotificationType,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Verify caller is authenticated and is admin/super_admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
    return { success: false, error: 'Unauthorized' };
  }

  const template = getNotificationTemplate(type);

  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title: template.title,
      message: template.message,
      is_read: false,
      metadata: metadata || null,
    });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// Fetch notifications for the current user
export async function fetchNotifications(params?: {
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ data: Notification[]; total: number; unreadCount: number }> {
  const supabase = await createClient();
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], total: 0, unreadCount: 0 };
  const userId = user.id;

  let query = supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (params?.unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data, count } = await query;

  // Get unread count
  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (!data) return { data: [], total: 0, unreadCount: unreadCount || 0 };

  return {
    data: data.map((n) => ({
      id: n.id,
      userId: n.user_id,
      type: n.type as NotificationType,
      title: n.title,
      message: n.message,
      isRead: n.is_read,
      metadata: n.metadata as Record<string, unknown> | null,
      createdAt: n.created_at,
    })),
    total: count || 0,
    unreadCount: unreadCount || 0,
  };
}

// Mark notification as read
export async function markNotificationRead(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// Mark all notifications as read
export async function markAllNotificationsRead(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// Delete a notification
export async function deleteNotification(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
