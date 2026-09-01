import type { PackageTier as PackageTierType, InvitationStatus as InvitationStatusType } from '@/types/database';

export type PackageTier = PackageTierType;
export type InvitationStatus = InvitationStatusType;

export type DashboardTab = 
  | 'overview' 
  | 'invitation' 
  | 'guests' 
  | 'gifts' 
  | 'media' 
  | 'livestream' 
  | 'account';

export interface DashboardInvitation {
  id: string;
  status: InvitationStatus;
  packageTier: PackageTier;
  templateId: string;
  templateName: string;
  templatePreviewUrl: string;
  eventDate?: string;
  eventType: string;
  celebrantNames: string[];
  slug: string;
  publicUrl: string;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  publishedAt?: string;
}

export interface DashboardStats {
  invitation: DashboardInvitation | null;
  rsvp: {
    total: number;
    attending: number;
    declined: number;
    pending: number;
  };
  gifts: {
    total: number;
    claimed: number;
    received: number;
    totalValue?: number;
  };
  media: {
    total: number;
    customerUploads: number;
    guestUploads: number;
    pendingApproval: number;
  };
  livestream: {
    configured: boolean;
    status: 'upcoming' | 'active' | 'ended' | 'disabled';
  };
  isEventPast: boolean;
  daysUntilEvent: number | null;
}

export interface DashboardFeature {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  comingSoon?: boolean;
}

export interface DashboardNavigationItem {
  id: DashboardTab;
  label: string;
  icon: string; // Lucide icon name
  badge?: number;
  disabled?: boolean;
  packageRequired?: PackageTier;
}

export const DASHBOARD_NAVIGATION: DashboardNavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', badge: undefined },
  { id: 'invitation', label: 'My Invitation', icon: 'Mail' },
  { id: 'guests', label: 'Guests & RSVPs', icon: 'Users', badge: 0 },
  { id: 'gifts', label: 'Gift Registry', icon: 'Gift', badge: 0, packageRequired: 'premium' },
  { id: 'media', label: 'Photos & Videos', icon: 'Image', badge: 0, packageRequired: 'premium' },
  { id: 'livestream', label: 'Livestream', icon: 'Video', badge: 0, packageRequired: 'ultimate' },
  { id: 'account', label: 'Account', icon: 'User' },
];

export const PACKAGE_FEATURES: Record<PackageTier, DashboardFeature[]> = {
  essential: [
    { key: 'basic_invitation', label: 'Digital Invitation', description: 'Beautiful single-page invitation', enabled: true },
    { key: 'rsvp', label: 'RSVP Collection', description: 'Collect guest responses', enabled: true },
    { key: 'share', label: 'Share via Link/QR', description: 'Easy sharing with guests', enabled: true },
    { key: 'gift_registry', label: 'Gift Registry', description: 'Allow guests to claim gifts', enabled: false, comingSoon: true },
    { key: 'media_gallery', label: 'Photo Gallery', description: 'Upload and display photos', enabled: false, comingSoon: true },
    { key: 'livestream', label: 'Livestream', description: 'Stream your event live', enabled: false, comingSoon: true },
  ],
  premium: [
    { key: 'basic_invitation', label: 'Digital Invitation', description: 'Beautiful single-page invitation', enabled: true },
    { key: 'rsvp', label: 'RSVP Collection', description: 'Collect guest responses', enabled: true },
    { key: 'share', label: 'Share via Link/QR', description: 'Easy sharing with guests', enabled: true },
    { key: 'gift_registry', label: 'Gift Registry', description: 'Allow guests to claim gifts', enabled: true },
    { key: 'media_gallery', label: 'Photo Gallery', description: 'Upload and display photos', enabled: true },
    { key: 'livestream', label: 'Livestream', description: 'Stream your event live', enabled: false, comingSoon: true },
  ],
  ultimate: [
    { key: 'basic_invitation', label: 'Digital Invitation', description: 'Beautiful single-page invitation', enabled: true },
    { key: 'rsvp', label: 'RSVP Collection', description: 'Collect guest responses', enabled: true },
    { key: 'share', label: 'Share via Link/QR', description: 'Easy sharing with guests', enabled: true },
    { key: 'gift_registry', label: 'Gift Registry', description: 'Allow guests to claim gifts', enabled: true },
    { key: 'media_gallery', label: 'Photo Gallery', description: 'Upload and display photos', enabled: true },
    { key: 'livestream', label: 'Livestream', description: 'Stream your event live', enabled: true },
    { key: 'guest_media', label: 'Guest Uploads', description: 'Guests can upload photos/videos', enabled: true },
    { key: '3d_template', label: '3D Templates', description: 'Immersive 3D invitation experience', enabled: true },
    { key: 'collages', label: 'Photo Collages', description: 'Beautiful photo collages', enabled: true },
  ],
};

// Calculate days until event
export function calculateDaysUntilEvent(eventDate?: string): number | null {
  if (!eventDate) return null;
  const event = new Date(eventDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = event.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Check if event is past
export function isEventPast(eventDate?: string): boolean {
  const days = calculateDaysUntilEvent(eventDate);
  return days !== null && days < 0;
}

// Format event status for display
export function formatEventStatus(invitation: DashboardInvitation | null): {
  label: string;
  variant: 'default' | 'success' | 'warning' | 'danger' | 'secondary';
} {
  if (!invitation) {
    return { label: 'No Invitation', variant: 'secondary' };
  }

  if (isEventPast(invitation.eventDate)) {
    return { label: 'Event Completed', variant: 'success' };
  }

  switch (invitation.status) {
    case 'draft':
      return { label: 'Draft', variant: 'secondary' };
    case 'submitted':
      return { label: 'Under Review', variant: 'warning' };
    case 'approved':
      return { label: 'Approved', variant: 'default' };
    case 'published':
      return { label: 'Published', variant: 'success' };
    case 'archived':
      return { label: 'Archived', variant: 'secondary' };
    default:
      return { label: invitation.status, variant: 'secondary' };
  }
}

// Get package tier display info
export function getPackageDisplay(tier: PackageTier): {
  label: string;
  color: string;
  price: number;
} {
  const configs: Record<PackageTier, { label: string; color: string; price: number }> = {
    essential: { label: 'Essential', color: 'bg-blue-100 text-blue-700', price: 50000 },
    premium: { label: 'Premium', color: 'bg-purple-100 text-purple-700', price: 150000 },
    ultimate: { label: 'Ultimate', color: 'bg-gradient-to-r from-gold-500 to-gold-600 text-white', price: 350000 },
  };
  return configs[tier];
}