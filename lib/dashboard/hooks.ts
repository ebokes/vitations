'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/auth-provider';
import {
  fetchDashboardStats,
  fetchCustomerInvitation,
  fetchRsvpStats,
  fetchGiftStats,
  fetchMediaStats,
  fetchLivestreamStatus,
  copyInvitationLink,
  getFeaturesForTier,
  getNavigationForTier,
} from './api';
import type { DashboardStats, DashboardInvitation, DashboardFeature, PackageTier } from './types';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: (userId: string) => [...dashboardKeys.all, 'stats', userId] as const,
  invitation: (userId: string) => [...dashboardKeys.all, 'invitation', userId] as const,
  rsvp: (invitationId: string) => [...dashboardKeys.all, 'rsvp', invitationId] as const,
  gifts: (invitationId: string) => [...dashboardKeys.all, 'gifts', invitationId] as const,
  media: (invitationId: string) => [...dashboardKeys.all, 'media', invitationId] as const,
  livestream: (invitationId: string) => [...dashboardKeys.all, 'livestream', invitationId] as const,
};

/**
 * Hook to fetch all dashboard stats
 */
export function useDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: dashboardKeys.stats(user?.id || ''),
    queryFn: () => fetchDashboardStats(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch invitation only
 */
export function useCustomerInvitation() {
  const { user } = useAuth();

  return useQuery({
    queryKey: dashboardKeys.invitation(user?.id || ''),
    queryFn: () => fetchCustomerInvitation(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch RSVP stats
 */
export function useRsvpStats(invitationId: string | null) {
  return useQuery({
    queryKey: dashboardKeys.rsvp(invitationId || ''),
    queryFn: () => fetchRsvpStats(invitationId!),
    enabled: !!invitationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch gift stats
 */
export function useGiftStats(invitationId: string | null) {
  return useQuery({
    queryKey: dashboardKeys.gifts(invitationId || ''),
    queryFn: () => fetchGiftStats(invitationId!),
    enabled: !!invitationId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch media stats
 */
export function useMediaStats(invitationId: string | null) {
  return useQuery({
    queryKey: dashboardKeys.media(invitationId || ''),
    queryFn: () => fetchMediaStats(invitationId!),
    enabled: !!invitationId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch livestream status
 */
export function useLivestreamStatus(invitationId: string | null) {
  return useQuery({
    queryKey: dashboardKeys.livestream(invitationId || ''),
    queryFn: () => fetchLivestreamStatus(invitationId!),
    enabled: !!invitationId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to copy invitation link
 */
export function useCopyInvitationLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: copyInvitationLink,
    onSuccess: () => {
      // Could show toast notification
    },
  });
}

/**
 * Hook to get features for package tier
 */
export function usePackageFeatures(tier: PackageTier): DashboardFeature[] {
  return getFeaturesForTier(tier);
}

/**
 * Hook to get navigation for package tier
 */
export function useDashboardNavigation(tier: PackageTier) {
  return getNavigationForTier(tier);
}

/**
 * Hook to invalidate all dashboard queries
 */
export function useInvalidateDashboard() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return () => {
    queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    if (user) {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.stats(user.id) });
    }
  };
}