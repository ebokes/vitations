'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchSuperAdminStats,
  fetchSuperAdminUsers,
  changeUserRole,
  fetchSuperAdminPackages,
  updatePackage,
  addPackageFeature,
  removePackageFeature,
  fetchSuperAdminTemplates,
  fetchTemplateVersions,
  updateTemplateStatus,
  setTemplateVersionCurrent,
} from './api';

// Platform stats
export function useSuperAdminStats() {
  return useQuery({
    queryKey: ['super-admin', 'stats'],
    queryFn: fetchSuperAdminStats,
    staleTime: 30_000,
  });
}

// Users
export function useSuperAdminUsers(params?: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['super-admin', 'users', params],
    queryFn: () => fetchSuperAdminUsers(params),
    staleTime: 30_000,
  });
}

// Change role mutation
export function useChangeUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, newRole, reason }: { userId: string; newRole: string; reason: string }) =>
      changeUserRole(userId, newRole, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'stats'] });
    },
  });
}

// Packages
export function useSuperAdminPackages() {
  return useQuery({
    queryKey: ['super-admin', 'packages'],
    queryFn: fetchSuperAdminPackages,
    staleTime: 30_000,
  });
}

// Update package mutation
export function useUpdatePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ packageId, updates }: { packageId: string; updates: { name?: string; description?: string; priceNgn?: number; isActive?: boolean } }) =>
      updatePackage(packageId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'packages'] });
    },
  });
}

// Add feature mutation
export function useAddPackageFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ packageId, featureKey, featureName, featureDescription }: {
      packageId: string;
      featureKey: string;
      featureName: string;
      featureDescription?: string;
    }) => addPackageFeature(packageId, featureKey, featureName, featureDescription),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'packages'] });
    },
  });
}

// Remove feature mutation
export function useRemovePackageFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ featureId, packageId }: { featureId: string; packageId: string }) =>
      removePackageFeature(featureId, packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'packages'] });
    },
  });
}

// Templates
export function useSuperAdminTemplates() {
  return useQuery({
    queryKey: ['super-admin', 'templates'],
    queryFn: fetchSuperAdminTemplates,
    staleTime: 30_000,
  });
}

// Template versions
export function useTemplateVersions(templateId: string | null) {
  return useQuery({
    queryKey: ['super-admin', 'template-versions', templateId],
    queryFn: () => fetchTemplateVersions(templateId!),
    enabled: !!templateId,
    staleTime: 30_000,
  });
}

// Update template status mutation
export function useUpdateTemplateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, status, reason }: { templateId: string; status: string; reason?: string }) =>
      updateTemplateStatus(templateId, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'templates'] });
    },
  });
}

// Set version current mutation
export function useSetTemplateVersionCurrent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, versionId }: { templateId: string; versionId: string }) =>
      setTemplateVersionCurrent(templateId, versionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'template-versions'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'templates'] });
    },
  });
}
