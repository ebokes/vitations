import type { UserRole, PackageTier, TemplateStatus, DesignType } from '@/types/database';

// Super admin tab navigation
export type SuperAdminTab =
  | 'overview'
  | 'users'
  | 'packages'
  | 'templates'
  | 'platform';

export interface SuperAdminNavigationItem {
  id: SuperAdminTab;
  label: string;
  icon: string;
}

export const SUPER_ADMIN_NAVIGATION: SuperAdminNavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
  { id: 'users', label: 'User Management', icon: 'Users' },
  { id: 'packages', label: 'Packages', icon: 'CreditCard' },
  { id: 'templates', label: 'Templates', icon: 'Palette' },
  { id: 'platform', label: 'Platform', icon: 'Settings' },
];

// User management
export interface SuperAdminUser {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: UserRole;
  createdAt: string;
  lastSignInAt: string | null;
}

// Package management
export interface SuperAdminPackage {
  id: string;
  tier: PackageTier;
  name: string;
  description: string | null;
  priceNgn: number;
  isActive: boolean;
  features: PackageFeature[];
  createdAt: string;
  updatedAt: string;
}

export interface PackageFeature {
  id: string;
  featureKey: string;
  featureName: string;
  featureDescription: string | null;
}

// Template management
export interface SuperAdminTemplate {
  id: string;
  name: string;
  description: string | null;
  designType: DesignType;
  category: string | null;
  minimumPackage: PackageTier;
  previewUrl: string | null;
  thumbnailUrl: string | null;
  status: TemplateStatus;
  currentVersion: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SuperAdminTemplateVersion {
  id: string;
  templateId: string;
  versionNumber: number;
  config: Record<string, unknown>;
  isCurrent: boolean;
  createdAt: string;
}

// Platform stats
export interface SuperAdminPlatformStats {
  totalUsers: number;
  usersByRole: Record<UserRole, number>;
  totalInvitations: number;
  totalRevenue: number;
  totalPayments: number;
  activePackages: number;
  activeTemplates: number;
}

// Role change request
export interface RoleChangeRequest {
  userId: string;
  newRole: UserRole;
  reason: string;
}

// Package update request
export interface PackageUpdateRequest {
  packageId: string;
  name?: string;
  description?: string;
  priceNgn?: number;
  isActive?: boolean;
}

// Template status update
export interface TemplateStatusRequest {
  templateId: string;
  status: TemplateStatus;
  reason?: string;
}

// Format helpers
export function formatDesignType(type: DesignType): string {
  const labels: Record<DesignType, string> = {
    '2d_basic': '2D Basic',
    '2d_animated': '2D Animated',
    '2d_advanced': '2D Advanced',
    '3d_selected': '3D Selected',
    '3d_advanced': '3D Advanced',
  };
  return labels[type] || type;
}

export function formatTemplateStatus(status: TemplateStatus): { label: string; variant: 'default' | 'success' | 'warning' | 'danger' } {
  const map: Record<TemplateStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
    draft: { label: 'Draft', variant: 'default' },
    active: { label: 'Active', variant: 'success' },
    retired: { label: 'Retired', variant: 'danger' },
  };
  return map[status] || { label: status, variant: 'default' };
}
