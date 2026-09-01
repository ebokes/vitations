'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAdminStats,
  fetchCustomers,
  fetchInvitations,
  fetchInvitationDetail,
  fetchMediaForModeration,
  fetchCustomRequests,
  fetchAuditLogs,
  unlockInvitation,
  relockInvitation,
  approveInvitation,
  moderateMedia,
  updateCustomRequest,
} from './api';

// Dashboard stats
export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: fetchAdminStats,
    staleTime: 30_000,
  });
}

// Customers list
export function useCustomers(params?: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['admin', 'customers', params],
    queryFn: () => fetchCustomers(params),
    staleTime: 30_000,
  });
}

// Invitations list
export function useInvitations(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['admin', 'invitations', params],
    queryFn: () => fetchInvitations(params),
    staleTime: 30_000,
  });
}

// Invitation detail
export function useInvitationDetail(invitationId: string | null) {
  return useQuery({
    queryKey: ['admin', 'invitation', invitationId],
    queryFn: () => fetchInvitationDetail(invitationId!),
    enabled: !!invitationId,
    staleTime: 30_000,
  });
}

// Media for moderation
export function useMediaForModeration(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['admin', 'media', params],
    queryFn: () => fetchMediaForModeration(params),
    staleTime: 30_000,
  });
}

// Custom requests
export function useCustomRequests(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['admin', 'custom-requests', params],
    queryFn: () => fetchCustomRequests(params),
    staleTime: 30_000,
  });
}

// Audit logs
export function useAuditLogs(params?: {
  resourceType?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: () => fetchAuditLogs(params),
    staleTime: 30_000,
  });
}

// Unlock invitation mutation
export function useUnlockInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ invitationId, reason }: { invitationId: string; reason: string }) =>
      unlockInvitation(invitationId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'invitations'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

// Relock invitation mutation
export function useRelockInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) => relockInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'invitations'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

// Approve invitation mutation
export function useApproveInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) => approveInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'invitations'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

// Moderate media mutation
export function useModerateMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ mediaId, action }: { mediaId: string; action: 'approve' | 'reject' }) =>
      moderateMedia(mediaId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

// Update custom request mutation
export function useUpdateCustomRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, status, internalNotes }: { requestId: string; status: string; internalNotes?: string }) =>
      updateCustomRequest(requestId, status, internalNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'custom-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}
