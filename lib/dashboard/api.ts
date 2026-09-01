import { createClient } from '@/lib/supabase/client';
import { 
  DashboardInvitation, 
  DashboardStats, 
  DashboardFeature, 
  PackageTier, 
  DASHBOARD_NAVIGATION, 
  PACKAGE_FEATURES,
  calculateDaysUntilEvent,
  isEventPast,
  formatEventStatus,
  getPackageDisplay
} from './types';

const supabase = createClient();

/**
 * Fetch the customer's invitation
 */
export async function fetchCustomerInvitation(userId: string): Promise<DashboardInvitation | null> {
  const { data, error } = await supabase
    .from('invitations')
    .select(`
      id,
      status,
      package_tier,
      template_id,
      template_name,
      template_preview_url,
      event_date,
      event_type,
      celebrant_names,
      slug,
      public_url,
      qr_code_url,
      created_at,
      updated_at,
      submitted_at,
      published_at
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching invitation:', error);
    return null;
  }

  return {
    id: data.id,
    status: data.status,
    packageTier: data.package_tier,
    templateId: data.template_id,
    templateName: data.template_name,
    templatePreviewUrl: data.template_preview_url,
    eventDate: data.event_date,
    eventType: data.event_type,
    celebrantNames: data.celebrant_names,
    slug: data.slug,
    publicUrl: data.public_url,
    qrCodeUrl: data.qr_code_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    submittedAt: data.submitted_at,
    publishedAt: data.published_at,
  };
}

/**
 * Fetch RSVP stats for an invitation
 */
export async function fetchRsvpStats(invitationId: string): Promise<{
  total: number;
  attending: number;
  declined: number;
  pending: number;
}> {
  const { data, error } = await supabase
    .from('rsvps')
    .select('status')
    .eq('invitation_id', invitationId);

  if (error || !data) {
    return { total: 0, attending: 0, declined: 0, pending: 0 };
  }

  return {
    total: data.length,
    attending: data.filter(r => r.status === 'attending').length,
    declined: data.filter(r => r.status === 'declined').length,
    pending: data.filter(r => r.status === 'pending').length,
  };
}

/**
 * Fetch gift registry stats
 */
export async function fetchGiftStats(invitationId: string): Promise<{
  total: number;
  claimed: number;
  received: number;
  totalValue?: number;
}> {
  const { data, error } = await supabase
    .from('gift_registry')
    .select('status, quantity')
    .eq('invitation_id', invitationId);

  if (error || !data) {
    return { total: 0, claimed: 0, received: 0 };
  }

  const total = data.reduce((sum, g) => sum + (g.quantity || 1), 0);
  const claimed = data.filter(g => g.status === 'claimed' || g.status === 'received')
    .reduce((sum, g) => sum + (g.quantity || 1), 0);
  const received = data.filter(g => g.status === 'received')
    .reduce((sum, g) => sum + (g.quantity || 1), 0);

  return { total, claimed, received };
}

/**
 * Fetch media stats
 */
export async function fetchMediaStats(invitationId: string): Promise<{
  total: number;
  customerUploads: number;
  guestUploads: number;
  pendingApproval: number;
}> {
  const { data, error } = await supabase
    .from('invitation_media')
    .select('source, status')
    .eq('invitation_id', invitationId);

  if (error || !data) {
    return { total: 0, customerUploads: 0, guestUploads: 0, pendingApproval: 0 };
  }

  return {
    total: data.length,
    customerUploads: data.filter(m => m.source === 'customer').length,
    guestUploads: data.filter(m => m.source === 'guest').length,
    pendingApproval: data.filter(m => m.status === 'pending').length,
  };
}

/**
 * Fetch livestream status
 */
export async function fetchLivestreamStatus(invitationId: string): Promise<{
  configured: boolean;
  status: 'upcoming' | 'active' | 'ended' | 'disabled';
}> {
  const { data, error } = await supabase
    .from('invitation_livestreams')
    .select('is_active, status')
    .eq('invitation_id', invitationId)
    .single();

  if (error || !data) {
    return { configured: false, status: 'disabled' };
  }

  return {
    configured: true,
    status: data.status,
  };
}

/**
 * Fetch all dashboard stats in parallel
 */
export async function fetchDashboardStats(userId: string): Promise<DashboardStats> {
  const invitation = await fetchCustomerInvitation(userId);
  
  if (!invitation) {
    return {
      invitation: null,
      rsvp: { total: 0, attending: 0, declined: 0, pending: 0 },
      gifts: { total: 0, claimed: 0, received: 0 },
      media: { total: 0, customerUploads: 0, guestUploads: 0, pendingApproval: 0 },
      livestream: { configured: false, status: 'disabled' },
      isEventPast: false,
      daysUntilEvent: null,
    };
  }

  const [rsvp, gifts, media, livestream] = await Promise.all([
    fetchRsvpStats(invitation.id),
    fetchGiftStats(invitation.id),
    fetchMediaStats(invitation.id),
    fetchLivestreamStatus(invitation.id),
  ]);

  const daysUntilEvent = calculateDaysUntilEvent(invitation.eventDate);
  const eventIsPast = isEventPast(invitation.eventDate);

  return {
    invitation,
    rsvp,
    gifts,
    media,
    livestream,
    isEventPast: eventIsPast,
    daysUntilEvent,
  };
}

/**
 * Get available features for package tier
 */
export function getFeaturesForTier(tier: PackageTier): DashboardFeature[] {
  return PACKAGE_FEATURES[tier] ?? PACKAGE_FEATURES.essential;
}

/**
 * Get navigation items filtered by package tier
 */
export function getNavigationForTier(tier: PackageTier): typeof DASHBOARD_NAVIGATION {
  return DASHBOARD_NAVIGATION.map(item => ({
    ...item,
    disabled: item.packageRequired ? !isTierEnabled(tier, item.packageRequired) : false,
  }));
}

function isTierEnabled(current: PackageTier, required: PackageTier): boolean {
  const order: PackageTier[] = ['essential', 'premium', 'ultimate'];
  return order.indexOf(current) >= order.indexOf(required);
}

/**
 * Copy invitation link to clipboard
 */
export async function copyInvitationLink(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate QR code for invitation (placeholder - would use a QR library)
 */
export async function generateQrCode(url: string): Promise<string> {
  // In production, use a QR code generation service
  // For now, return a placeholder
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
}

// Re-export helper functions
export { calculateDaysUntilEvent, isEventPast, formatEventStatus, getPackageDisplay };