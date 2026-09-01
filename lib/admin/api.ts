'use server';

import { createClient } from '@/lib/supabase/server';
import type {
  AdminDashboardStats,
  AdminCustomer,
  AdminInvitation,
  AdminInvitationDetail,
  AdminMediaItem,
  AdminCustomRequest,
  AdminAuditLog,
} from './types';
import type { InvitationStatus } from '@/types/database';

// Helper: verify current user is admin or super_admin
async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
    throw new Error('Unauthorized: admin role required');
  }

  return supabase;
}

// Fetch admin dashboard stats
export async function fetchAdminStats(): Promise<AdminDashboardStats> {
  const supabase = await verifyAdmin();

  const [customersRes, invitationsRes, mediaRes, customRes, paymentsRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('invitations').select('id, status, package_id'),
    supabase.from('media').select('id, moderation_status'),
    supabase.from('custom_invitation_requests').select('id, status'),
    supabase.from('payments').select('amount_ngn, status'),
  ]);

  const customers = customersRes.data || [];
  const invitations = invitationsRes.data || [];
  const mediaItems = mediaRes.data || [];
  const customRequests = customRes.data || [];
  const payments = paymentsRes.data || [];

  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount_ngn || 0), 0);

  const pendingReview = invitations.filter((i) => i.status === 'submitted').length;
  const pendingMediaCount = mediaItems.filter((m) => m.moderation_status === 'pending').length;
  const pendingCustomCount = customRequests.filter((c) => c.status === 'new').length;

  const recentDate = new Date();
  recentDate.setDate(recentDate.getDate() - 30);
  const recentIso = recentDate.toISOString();

  const { count: recentSignups } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', recentIso);

  const invitationsByStatus: Record<string, number> = {};
  invitations.forEach((i) => {
    invitationsByStatus[i.status] = (invitationsByStatus[i.status] || 0) + 1;
  });

  return {
    totalCustomers: customersRes.count || 0,
    totalInvitations: invitations.length,
    pendingReview,
    pendingMedia: pendingMediaCount,
    pendingCustomRequests: pendingCustomCount,
    totalRevenue,
    recentSignups: recentSignups || 0,
    invitationsByStatus: invitationsByStatus as Record<InvitationStatus, number>,
    revenueByPackage: { essential: 0, premium: 0, ultimate: 0 },
  };
}

// Fetch customers list
export async function fetchCustomers(params?: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: AdminCustomer[]; total: number }> {
  const supabase = await verifyAdmin();
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (params?.search) {
    query = query.or(`email.ilike.%${params.search}%,full_name.ilike.%${params.search}%`);
  }
  if (params?.role) {
    query = query.eq('role', params.role);
  }

  const { data: profiles, count } = await query;
  if (!profiles) return { data: [], total: 0 };

  const customerIds = profiles.map((p) => p.id);

  const [invitationsRes, paymentsRes] = await Promise.all([
    supabase
      .from('invitations')
      .select('customer_id, status, package_id')
      .in('customer_id', customerIds),
    supabase
      .from('payments')
      .select('order_id, amount_ngn, status')
      .in('order_id', customerIds),
  ]);

  const invitations = invitationsRes.data || [];
  const payments = paymentsRes.data || [];

  const packageMap: Record<string, string> = {};
  const { data: packages } = await supabase.from('packages').select('id, tier');
  packages?.forEach((p) => { packageMap[p.id] = p.tier; });

  const customerMap = new Map<string, AdminCustomer>();
  profiles.forEach((p) => {
    customerMap.set(p.id, {
      id: p.id,
      email: p.email,
      fullName: p.full_name,
      phone: p.phone,
      role: p.role,
      createdAt: p.created_at,
      invitationCount: 0,
      activeInvitationStatus: null,
      packageTier: null,
      totalSpent: 0,
    });
  });

  invitations.forEach((inv) => {
    const customer = customerMap.get(inv.customer_id);
    if (customer) {
      customer.invitationCount++;
      if (!customer.activeInvitationStatus) {
        customer.activeInvitationStatus = inv.status;
      }
      if (!customer.packageTier && packageMap[inv.package_id]) {
        customer.packageTier = packageMap[inv.package_id] as 'essential' | 'premium' | 'ultimate';
      }
    }
  });

  return {
    data: Array.from(customerMap.values()),
    total: count || 0,
  };
}

// Fetch invitations list
export async function fetchInvitations(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: AdminInvitation[]; total: number }> {
  const supabase = await verifyAdmin();
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('invitations')
    .select('*, profiles!invitations_customer_id_fkey(email, full_name), packages!invitations_package_id_fkey(tier)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (params?.search) {
    query = query.or(`couple_name_primary.ilike.%${params.search}%,couple_name_secondary.ilike.%${params.search}%,slug.ilike.%${params.search}%`);
  }
  if (params?.status) {
    query = query.eq('status', params.status);
  }

  const { data: invitations, count } = await query;
  if (!invitations) return { data: [], total: 0 };

  const formatted: AdminInvitation[] = invitations.map((inv) => ({
    id: inv.id,
    customerId: inv.customer_id,
    customerEmail: (inv.profiles as Record<string, string>)?.email || '',
    customerName: (inv.profiles as Record<string, string>)?.full_name || null,
    status: inv.status,
    packageTier: ((inv.packages as Record<string, string>)?.tier || 'essential') as 'essential' | 'premium' | 'ultimate',
    templateName: '',
    coupleNamePrimary: inv.couple_name_primary,
    coupleNameSecondary: inv.couple_name_secondary,
    eventDate: inv.event_date,
    slug: inv.slug,
    submittedAt: inv.submitted_at,
    lockedAt: inv.locked_at,
    createdAt: inv.created_at,
    updatedAt: inv.updated_at,
  }));

  return { data: formatted, total: count || 0 };
}

// Fetch invitation detail
export async function fetchInvitationDetail(invitationId: string): Promise<AdminInvitationDetail | null> {
  const supabase = await verifyAdmin();

  const { data: invitation } = await supabase
    .from('invitations')
    .select('*, profiles!invitations_customer_id_fkey(email, full_name), packages!invitations_package_id_fkey(tier)')
    .eq('id', invitationId)
    .single();

  if (!invitation) return null;

  const [eventsRes, rsvpRes, mediaRes, giftRes] = await Promise.all([
    supabase.from('events').select('*').eq('invitation_id', invitationId),
    supabase.from('rsvps').select('id', { count: 'exact', head: true }).eq('invitation_id', invitationId),
    supabase.from('media').select('id', { count: 'exact', head: true }).eq('invitation_id', invitationId),
    supabase.from('gift_registries').select('id', { count: 'exact', head: true }).eq('invitation_id', invitationId),
  ]);

  return {
    id: invitation.id,
    customerId: invitation.customer_id,
    customerEmail: (invitation.profiles as Record<string, string>)?.email || '',
    customerName: (invitation.profiles as Record<string, string>)?.full_name || null,
    status: invitation.status,
    packageTier: ((invitation.packages as Record<string, string>)?.tier || 'essential') as 'essential' | 'premium' | 'ultimate',
    templateName: '',
    coupleNamePrimary: invitation.couple_name_primary,
    coupleNameSecondary: invitation.couple_name_secondary,
    eventDate: invitation.event_date,
    slug: invitation.slug,
    submittedAt: invitation.submitted_at,
    lockedAt: invitation.locked_at,
    createdAt: invitation.created_at,
    updatedAt: invitation.updated_at,
    customData: invitation.custom_data as Record<string, unknown> | null,
    events: (eventsRes.data || []).map((e) => ({
      id: e.id,
      eventType: e.event_type,
      title: e.title,
      address: e.address,
      eventDatetime: e.event_datetime,
    })),
    rsvpCount: rsvpRes.count || 0,
    mediaCount: mediaRes.count || 0,
    giftRegistryCount: giftRes.count || 0,
  };
}

// Fetch media for moderation
export async function fetchMediaForModeration(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: AdminMediaItem[]; total: number }> {
  const supabase = await verifyAdmin();
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('media')
    .select('*, invitations!media_invitation_id_fkey(customer_id, profiles!invitations_customer_id_fkey(email, full_name))', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (params?.status) {
    query = query.eq('moderation_status', params.status);
  }

  const { data: mediaItems, count } = await query;
  if (!mediaItems) return { data: [], total: 0 };

  const formatted: AdminMediaItem[] = mediaItems.map((m) => {
    const invitation = m.invitations as Record<string, unknown> | null;
    const profile = invitation?.profiles as Record<string, string> | null;
    return {
      id: m.id,
      invitationId: m.invitation_id,
      customerName: profile?.full_name || null,
      customerEmail: profile?.email || '',
      uploaderType: m.guest_id ? 'guest' : 'customer',
      mediaType: m.media_type,
      storagePath: m.storage_path,
      originalFilename: m.original_filename,
      fileSizeBytes: m.file_size_bytes,
      moderationStatus: m.moderation_status,
      processingStatus: m.processing_status,
      isVisible: m.is_visible,
      createdAt: m.created_at,
    };
  });

  return { data: formatted, total: count || 0 };
}

// Fetch custom requests
export async function fetchCustomRequests(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: AdminCustomRequest[]; total: number }> {
  const supabase = await verifyAdmin();
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('custom_invitation_requests')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (params?.status) {
    query = query.eq('status', params.status);
  }

  const { data: requests, count } = await query;
  if (!requests) return { data: [], total: 0 };

  return {
    data: requests.map((r) => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      email: r.email,
      status: r.status,
      internalNotes: r.internal_notes,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    })),
    total: count || 0,
  };
}

// Fetch audit logs
export async function fetchAuditLogs(params?: {
  resourceType?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: AdminAuditLog[]; total: number }> {
  const supabase = await verifyAdmin();
  const page = params?.page || 1;
  const limit = params?.limit || 50;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('audit_logs')
    .select('*, profiles!audit_logs_actor_id_fkey(email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (params?.resourceType) {
    query = query.eq('resource_type', params.resourceType);
  }

  const { data: logs, count } = await query;
  if (!logs) return { data: [], total: 0 };

  return {
    data: logs.map((l) => ({
      id: l.id,
      actorId: l.actor_id,
      actorEmail: (l.profiles as Record<string, string>)?.email || null,
      action: l.action,
      resourceType: l.resource_type,
      resourceId: l.resource_id,
      oldData: l.old_data as Record<string, unknown> | null,
      newData: l.new_data as Record<string, unknown> | null,
      metadata: l.metadata as Record<string, unknown> | null,
      ipAddress: l.ip_address,
      createdAt: l.created_at,
    })),
    total: count || 0,
  };
}

// Unlock invitation
export async function unlockInvitation(invitationId: string, reason: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

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

  const { data: invitation } = await supabase
    .from('invitations')
    .select('status')
    .eq('id', invitationId)
    .single();

  if (!invitation) return { success: false, error: 'Invitation not found' };
  if (invitation.status !== 'locked') return { success: false, error: 'Invitation is not locked' };

  const { error: updateError } = await supabase
    .from('invitations')
    .update({
      status: 'unlocked_by_admin',
      updated_at: new Date().toISOString(),
    })
    .eq('id', invitationId);

  if (updateError) return { success: false, error: updateError.message };

  await supabase.rpc('create_audit_log', {
    p_actor_id: user.id,
    p_action: 'unlock_invitation',
    p_resource_type: 'invitation',
    p_resource_id: invitationId,
    p_old_data: { status: 'locked' },
    p_new_data: { status: 'unlocked_by_admin', reason },
  });

  return { success: true };
}

// Relock invitation
export async function relockInvitation(invitationId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

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

  const { data: invitation } = await supabase
    .from('invitations')
    .select('status')
    .eq('id', invitationId)
    .single();

  if (!invitation) return { success: false, error: 'Invitation not found' };
  if (invitation.status !== 'unlocked_by_admin') return { success: false, error: 'Invitation is not unlocked' };

  const now = new Date().toISOString();
  const { error: updateError } = await supabase
    .from('invitations')
    .update({
      status: 'locked',
      locked_at: now,
      updated_at: now,
    })
    .eq('id', invitationId);

  if (updateError) return { success: false, error: updateError.message };

  await supabase.rpc('create_audit_log', {
    p_actor_id: user.id,
    p_action: 'relock_invitation',
    p_resource_type: 'invitation',
    p_resource_id: invitationId,
    p_old_data: { status: 'unlocked_by_admin' },
    p_new_data: { status: 'locked' },
  });

  return { success: true };
}

// Approve invitation
export async function approveInvitation(invitationId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

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

  const { error: updateError } = await supabase
    .from('invitations')
    .update({
      status: 'approved',
      updated_at: new Date().toISOString(),
    })
    .eq('id', invitationId);

  if (updateError) return { success: false, error: updateError.message };

  await supabase.rpc('create_audit_log', {
    p_actor_id: user.id,
    p_action: 'approve_invitation',
    p_resource_type: 'invitation',
    p_resource_id: invitationId,
    p_new_data: { status: 'approved' },
  });

  return { success: true };
}

// Moderate media
export async function moderateMedia(mediaId: string, action: 'approve' | 'reject'): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

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

  const moderationStatus = action === 'approve' ? 'approved' : 'rejected';
  const isVisible = action === 'approve';

  const { error: updateError } = await supabase
    .from('media')
    .update({
      moderation_status: moderationStatus,
      is_visible: isVisible,
      updated_at: new Date().toISOString(),
    })
    .eq('id', mediaId);

  if (updateError) return { success: false, error: updateError.message };

  await supabase.rpc('create_audit_log', {
    p_actor_id: user.id,
    p_action: `moderate_media_${action}`,
    p_resource_type: 'media',
    p_resource_id: mediaId,
    p_new_data: { moderation_status: moderationStatus, is_visible: isVisible },
  });

  return { success: true };
}

// Update custom request status
export async function updateCustomRequest(
  requestId: string,
  status: string,
  internalNotes?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

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

  const update: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (internalNotes !== undefined) {
    update.internal_notes = internalNotes;
  }

  const { error: updateError } = await supabase
    .from('custom_invitation_requests')
    .update(update)
    .eq('id', requestId);

  if (updateError) return { success: false, error: updateError.message };

  await supabase.rpc('create_audit_log', {
    p_actor_id: user.id,
    p_action: 'update_custom_request',
    p_resource_type: 'custom_invitation_request',
    p_resource_id: requestId,
    p_new_data: { status, internal_notes: internalNotes },
  });

  return { success: true };
}
