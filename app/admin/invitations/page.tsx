'use client';

import { useState } from 'react';
import { useInvitations, useUnlockInvitation, useRelockInvitation, useApproveInvitation, useInvitationDetail } from '@/lib/admin/hooks';
import { LoadingSpinner } from '@/components/ui/loading';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Search, Lock, Unlock, CheckCircle, Eye } from 'lucide-react';

function InvitationDetailModal({
  invitationId,
  onClose,
}: {
  invitationId: string;
  onClose: () => void;
}) {
  const { data: detail, isLoading } = useInvitationDetail(invitationId);
  const unlockMutation = useUnlockInvitation();
  const relockMutation = useRelockInvitation();
  const approveMutation = useApproveInvitation();
  const [reason, setReason] = useState('');

  if (isLoading) return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>;

  if (!detail) return null;

  const handleUnlock = async () => {
    if (!reason.trim()) return;
    await unlockMutation.mutateAsync({ invitationId: detail.id, reason });
    setReason('');
  };

  const handleRelock = async () => {
    await relockMutation.mutateAsync(detail.id);
  };

  const handleApprove = async () => {
    await approveMutation.mutateAsync(detail.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">Invitation Details</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-500">Customer</p>
              <p className="font-medium">{detail.customerName || 'No Name'}</p>
              <p className="text-sm text-neutral-500">{detail.customerEmail}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Status</p>
              <Badge variant={detail.status === 'published' ? 'success' : detail.status === 'submitted' ? 'warning' : 'secondary'}>
                {detail.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Package</p>
              <p className="font-medium capitalize">{detail.packageTier}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Event Date</p>
              <p className="font-medium">
                {detail.eventDate ? new Date(detail.eventDate).toLocaleDateString() : 'Not set'}
              </p>
            </div>
          </div>

          {detail.coupleNamePrimary && (
            <div>
              <p className="text-sm text-neutral-500">Couple</p>
              <p className="font-medium">
                {detail.coupleNamePrimary}
                {detail.coupleNameSecondary && ` & ${detail.coupleNameSecondary}`}
              </p>
            </div>
          )}

          {detail.events.length > 0 && (
            <div>
              <p className="text-sm text-neutral-500 mb-2">Events</p>
              <div className="space-y-2">
                {detail.events.map((event) => (
                  <div key={event.id} className="p-3 bg-neutral-50 rounded-lg">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-neutral-500">{event.address}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <p className="text-2xl font-bold text-neutral-900">{detail.rsvpCount}</p>
              <p className="text-sm text-neutral-500">RSVPs</p>
            </div>
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <p className="text-2xl font-bold text-neutral-900">{detail.mediaCount}</p>
              <p className="text-sm text-neutral-500">Media</p>
            </div>
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <p className="text-2xl font-bold text-neutral-900">{detail.giftRegistryCount}</p>
              <p className="text-sm text-neutral-500">Gifts</p>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <h3 className="font-semibold text-neutral-900 mb-3">Admin Actions</h3>

            {detail.status === 'submitted' && (
              <div className="space-y-3">
                <Button onClick={handleApprove} className="w-full bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Invitation
                </Button>
              </div>
            )}

            {detail.status === 'locked' && (
              <div className="space-y-3">
                <Textarea
                  placeholder="Reason for unlocking (required)..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                />
                <Button
                  onClick={handleUnlock}
                  disabled={!reason.trim() || unlockMutation.isPending}
                  className="w-full"
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  {unlockMutation.isPending ? 'Unlocking...' : 'Unlock for Editing'}
                </Button>
              </div>
            )}

            {detail.status === 'unlocked_by_admin' && (
              <div className="space-y-3">
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  This invitation is currently unlocked for admin editing.
                </p>
                <Button onClick={handleRelock} className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Relock Invitation
                </Button>
              </div>
            )}

            {detail.status !== 'submitted' && detail.status !== 'locked' && detail.status !== 'unlocked_by_admin' && (
              <p className="text-sm text-neutral-500">No actions available for this status.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminInvitationsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useInvitations({ search, status, page, limit: 20 });

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>;
  }

  const invitations = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Invitations</h1>
        <p className="text-neutral-500">{total} total invitations</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search by name or slug..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'draft', label: 'Draft' },
            { value: 'submitted', label: 'Submitted' },
            { value: 'approved', label: 'Approved' },
            { value: 'published', label: 'Published' },
            { value: 'locked', label: 'Locked' },
            { value: 'unlocked_by_admin', label: 'Unlocked' },
          ]}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Customer</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Couple</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Package</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Event Date</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {invitations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-neutral-900">{inv.customerName || 'No Name'}</p>
                        <p className="text-sm text-neutral-500">{inv.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {inv.coupleNamePrimary}
                      {inv.coupleNameSecondary && ` & ${inv.coupleNameSecondary}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm capitalize">{inv.packageTier}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          inv.status === 'published'
                            ? 'success'
                            : inv.status === 'submitted'
                            ? 'warning'
                            : inv.status === 'locked'
                            ? 'danger'
                            : inv.status === 'unlocked_by_admin'
                            ? 'outline'
                            : 'secondary'
                        }
                      >
                        {inv.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {inv.eventDate ? new Date(inv.eventDate).toLocaleDateString() : 'Not set'}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedId(inv.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
                {invitations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                      No invitations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {selectedId && (
        <InvitationDetailModal
          invitationId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
