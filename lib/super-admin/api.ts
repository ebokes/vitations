'use server';

import { createClient } from '@/lib/supabase/server';
import type {
  SuperAdminUser,
  SuperAdminPackage,
  SuperAdminTemplate,
  SuperAdminTemplateVersion,
  SuperAdminPlatformStats,
  PackageFeature,
} from './types';

// Helper: verify current user is super_admin
async function verifySuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'super_admin') {
    throw new Error('Unauthorized: super_admin required');
  }

  return { supabase, user };
}

// Platform stats
export async function fetchSuperAdminStats(): Promise<SuperAdminPlatformStats> {
  const { supabase } = await verifySuperAdmin();

  const [usersRes, invitationsRes, paymentsRes, packagesRes, templatesRes] = await Promise.all([
    supabase.from('profiles').select('id, role'),
    supabase.from('invitations').select('id'),
    supabase.from('payments').select('amount_ngn, status'),
    supabase.from('packages').select('id, is_active'),
    supabase.from('templates').select('id, status'),
  ]);

  const users = usersRes.data || [];
  const payments = paymentsRes.data || [];
  const packages = packagesRes.data || [];
  const templates = templatesRes.data || [];

  const usersByRole = { customer: 0, admin: 0, super_admin: 0 };
  users.forEach((u) => {
    usersByRole[u.role as keyof typeof usersByRole]++;
  });

  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount_ngn || 0), 0);

  return {
    totalUsers: users.length,
    usersByRole,
    totalInvitations: invitationsRes.data?.length || 0,
    totalRevenue,
    totalPayments: payments.length,
    activePackages: packages.filter((p) => p.is_active).length,
    activeTemplates: templates.filter((t) => t.status === 'active').length,
  };
}

// User management
export async function fetchSuperAdminUsers(params?: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: SuperAdminUser[]; total: number }> {
  const { supabase } = await verifySuperAdmin();
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

  const { data, count } = await query;
  if (!data) return { data: [], total: 0 };

  return {
    data: data.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.full_name,
      phone: u.phone,
      role: u.role,
      createdAt: u.created_at,
      lastSignInAt: null,
    })),
    total: count || 0,
  };
}

// Change user role
export async function changeUserRole(
  userId: string,
  newRole: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const { supabase, user } = await verifySuperAdmin();

  // Prevent self-demotion
  if (userId === user.id) {
    return { success: false, error: 'Cannot change your own role' };
  }

  // Get current role for audit log
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (!currentProfile) {
    return { success: false, error: 'User not found' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      role: newRole,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) return { success: false, error: error.message };

  await supabase.rpc('create_audit_log', {
    p_actor_id: user.id,
    p_action: 'change_user_role',
    p_resource_type: 'profile',
    p_resource_id: userId,
    p_old_data: { role: currentProfile.role },
    p_new_data: { role: newRole, reason },
  });

  return { success: true };
}

// Package management
export async function fetchSuperAdminPackages(): Promise<SuperAdminPackage[]> {
  const { supabase } = await verifySuperAdmin();

  const { data: packages } = await supabase
    .from('packages')
    .select('*')
    .order('price_ngn', { ascending: true });

  if (!packages) return [];

  const packageIds = packages.map((p) => p.id);
  const { data: features } = await supabase
    .from('package_features')
    .select('*')
    .in('package_id', packageIds);

  const featureMap = new Map<string, PackageFeature[]>();
  (features || []).forEach((f) => {
    const list = featureMap.get(f.package_id) || [];
    list.push({
      id: f.id,
      featureKey: f.feature_key,
      featureName: f.feature_name,
      featureDescription: f.feature_description,
    });
    featureMap.set(f.package_id, list);
  });

  return packages.map((p) => ({
    id: p.id,
    tier: p.tier,
    name: p.name,
    description: p.description,
    priceNgn: p.price_ngn,
    isActive: p.is_active,
    features: featureMap.get(p.id) || [],
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));
}

// Update package
export async function updatePackage(
  packageId: string,
  updates: { name?: string; description?: string; priceNgn?: number; isActive?: boolean }
): Promise<{ success: boolean; error?: string }> {
  const { supabase, user } = await verifySuperAdmin();

  const { data: currentPkg } = await supabase
    .from('packages')
    .select('*')
    .eq('id', packageId)
    .single();

  if (!currentPkg) return { success: false, error: 'Package not found' };

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.priceNgn !== undefined) updateData.price_ngn = updates.priceNgn;
  if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

  const { error } = await supabase
    .from('packages')
    .update(updateData)
    .eq('id', packageId);

  if (error) return { success: false, error: error.message };

  await supabase.rpc('create_audit_log', {
    p_actor_id: user.id,
    p_action: 'update_package',
    p_resource_type: 'package',
    p_resource_id: packageId,
    p_old_data: { name: currentPkg.name, price_ngn: currentPkg.price_ngn, is_active: currentPkg.is_active },
    p_new_data: updates,
  });

  return { success: true };
}

// Add package feature
export async function addPackageFeature(
  packageId: string,
  featureKey: string,
  featureName: string,
  featureDescription?: string
): Promise<{ success: boolean; error?: string }> {
  const { supabase, user } = await verifySuperAdmin();

  const { error } = await supabase
    .from('package_features')
    .insert({
      package_id: packageId,
      feature_key: featureKey,
      feature_name: featureName,
      feature_description: featureDescription || null,
    });

  if (error) return { success: false, error: error.message };

  await supabase.rpc('create_audit_log', {
    p_actor_id: user.id,
    p_action: 'add_package_feature',
    p_resource_type: 'package',
    p_resource_id: packageId,
    p_new_data: { feature_key: featureKey, feature_name: featureName },
  });

  return { success: true };
}

// Remove package feature
export async function removePackageFeature(
  featureId: string,
  packageId: string
): Promise<{ success: boolean; error?: string }> {
  const { supabase, user } = await verifySuperAdmin();

  const { error } = await supabase
    .from('package_features')
    .delete()
    .eq('id', featureId);

  if (error) return { success: false, error: error.message };

  await supabase.rpc('create_audit_log', {
    p_actor_id: user.id,
    p_action: 'remove_package_feature',
    p_resource_type: 'package',
    p_resource_id: packageId,
    p_old_data: { feature_id: featureId },
  });

  return { success: true };
}

// Template management
export async function fetchSuperAdminTemplates(): Promise<SuperAdminTemplate[]> {
  const { supabase } = await verifySuperAdmin();

  const { data: templates } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (!templates) return [];

  const templateIds = templates.map((t) => t.id);
  const { data: versions } = await supabase
    .from('template_versions')
    .select('template_id, version_number, is_current')
    .in('template_id', templateIds)
    .eq('is_current', true);

  const currentVersionMap = new Map<string, number>();
  (versions || []).forEach((v) => {
    currentVersionMap.set(v.template_id, v.version_number);
  });

  return templates.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    designType: t.design_type,
    category: t.category,
    minimumPackage: t.minimum_package,
    previewUrl: t.preview_url,
    thumbnailUrl: t.thumbnail_url,
    status: t.status,
    currentVersion: currentVersionMap.get(t.id) || null,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  }));
}

// Fetch template versions
export async function fetchTemplateVersions(
  templateId: string
): Promise<SuperAdminTemplateVersion[]> {
  const { supabase } = await verifySuperAdmin();

  const { data: versions } = await supabase
    .from('template_versions')
    .select('*')
    .eq('template_id', templateId)
    .order('version_number', { ascending: false });

  if (!versions) return [];

  return versions.map((v) => ({
    id: v.id,
    templateId: v.template_id,
    versionNumber: v.version_number,
    config: (v.config as Record<string, unknown>) || {},
    isCurrent: v.is_current,
    createdAt: v.created_at,
  }));
}

// Update template status
export async function updateTemplateStatus(
  templateId: string,
  status: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const { supabase, user } = await verifySuperAdmin();

  const { data: current } = await supabase
    .from('templates')
    .select('status, name')
    .eq('id', templateId)
    .single();

  if (!current) return { success: false, error: 'Template not found' };

  const { error } = await supabase
    .from('templates')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', templateId);

  if (error) return { success: false, error: error.message };

  await supabase.rpc('create_audit_log', {
    p_actor_id: user.id,
    p_action: 'update_template_status',
    p_resource_type: 'template',
    p_resource_id: templateId,
    p_old_data: { status: current.status, name: current.name },
    p_new_data: { status, reason },
  });

  return { success: true };
}

// Set template version as current
export async function setTemplateVersionCurrent(
  templateId: string,
  versionId: string
): Promise<{ success: boolean; error?: string }> {
  const { supabase, user } = await verifySuperAdmin();

  // Unset all current versions for this template
  await supabase
    .from('template_versions')
    .update({ is_current: false })
    .eq('template_id', templateId);

  // Set the selected version as current
  const { error } = await supabase
    .from('template_versions')
    .update({ is_current: true })
    .eq('id', versionId);

  if (error) return { success: false, error: error.message };

  await supabase.rpc('create_audit_log', {
    p_actor_id: user.id,
    p_action: 'set_template_version_current',
    p_resource_type: 'template_version',
    p_resource_id: versionId,
    p_new_data: { template_id: templateId },
  });

  return { success: true };
}
