import type {
  UserRole,
  InvitationStatus,
  PackageTier,
  PaymentStatus,
  MediaModerationStatus,
  CustomRequestStatus,
} from '@/types/database';

// Admin tab navigation
export type AdminTab =
  | 'overview'
  | 'customers'
  | 'invitations'
  | 'media'
  | 'custom-requests'
  | 'audit-log';

export interface AdminNavigationItem {
  id: AdminTab;
  label: string;
  icon: string;
  badge?: number;
}

export const ADMIN_NAVIGATION: AdminNavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'customers', label: 'Customers', icon: 'Users' },
  { id: 'invitations', label: 'Invitations', icon: 'Mail' },
  { id: 'media', label: 'Media', icon: 'Image' },
  { id: 'custom-requests', label: 'Custom Requests', icon: 'FileText' },
  { id: 'audit-log', label: 'Audit Log', icon: 'Shield' },
];

// Admin user profile
export interface AdminProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: 'admin' | 'super_admin';
  createdAt: string;
}

// Customer summary for admin list
export interface AdminCustomer {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: UserRole;
  createdAt: string;
  invitationCount: number;
  activeInvitationStatus: InvitationStatus | null;
  packageTier: PackageTier | null;
  totalSpent: number;
}

// Invitation summary for admin list
export interface AdminInvitation {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string | null;
  status: InvitationStatus;
  packageTier: PackageTier;
  templateName: string;
  coupleNamePrimary: string | null;
  coupleNameSecondary: string | null;
  eventDate: string | null;
  slug: string | null;
  submittedAt: string | null;
  lockedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Invitation detail for admin review
export interface AdminInvitationDetail extends AdminInvitation {
  customData: Record<string, unknown> | null;
  events: Array<{
    id: string;
    eventType: string;
    title: string;
    address: string;
    eventDatetime: string | null;
  }>;
  rsvpCount: number;
  mediaCount: number;
  giftRegistryCount: number;
}

// Media item for admin moderation
export interface AdminMediaItem {
  id: string;
  invitationId: string;
  customerName: string | null;
  customerEmail: string;
  uploaderType: 'customer' | 'guest';
  mediaType: 'image' | 'video' | 'document';
  storagePath: string;
  originalFilename: string | null;
  fileSizeBytes: number | null;
  moderationStatus: MediaModerationStatus;
  processingStatus: string;
  isVisible: boolean;
  createdAt: string;
}

// Custom invitation request
export interface AdminCustomRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: CustomRequestStatus;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Audit log entry
export interface AdminAuditLog {
  id: string;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
}

// Admin dashboard stats
export interface AdminDashboardStats {
  totalCustomers: number;
  totalInvitations: number;
  pendingReview: number;
  pendingMedia: number;
  pendingCustomRequests: number;
  totalRevenue: number;
  recentSignups: number;
  invitationsByStatus: Record<InvitationStatus, number>;
  revenueByPackage: Record<PackageTier, number>;
}

// Unlock workflow
export interface UnlockRequest {
  invitationId: string;
  reason: string;
}

export interface RelockRequest {
  invitationId: string;
}

// Moderation action
export interface ModerateMediaRequest {
  mediaId: string;
  action: 'approve' | 'reject';
  reason?: string;
}

// Custom request update
export interface UpdateCustomRequestRequest {
  requestId: string;
  status: CustomRequestStatus;
  internalNotes?: string;
}

// Format helpers
export function formatUserRole(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    customer: 'Customer',
    admin: 'Admin',
    super_admin: 'Super Admin',
  };
  return labels[role] || role;
}

export function formatPaymentStatus(status: PaymentStatus): { label: string; variant: 'default' | 'success' | 'warning' | 'danger' } {
  const map: Record<PaymentStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
    pending: { label: 'Pending', variant: 'warning' },
    completed: { label: 'Completed', variant: 'success' },
    failed: { label: 'Failed', variant: 'danger' },
    refunded: { label: 'Refunded', variant: 'default' },
  };
  return map[status] || { label: status, variant: 'default' };
}

export function formatCustomRequestStatus(status: CustomRequestStatus): { label: string; variant: 'default' | 'success' | 'warning' | 'danger' } {
  const map: Record<CustomRequestStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
    new: { label: 'New', variant: 'warning' },
    contacted: { label: 'Contacted', variant: 'default' },
    quoted: { label: 'Quoted', variant: 'default' },
    accepted: { label: 'Accepted', variant: 'success' },
    in_progress: { label: 'In Progress', variant: 'default' },
    completed: { label: 'Completed', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'danger' },
  };
  return map[status] || { label: status, variant: 'default' };
}

export function formatModerationStatus(status: MediaModerationStatus): { label: string; variant: 'default' | 'success' | 'warning' | 'danger' } {
  const map: Record<MediaModerationStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
    pending: { label: 'Pending Review', variant: 'warning' },
    approved: { label: 'Approved', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'danger' },
  };
  return map[status] || { label: status, variant: 'default' };
}
