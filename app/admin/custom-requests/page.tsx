'use client';

import { useState } from 'react';
import { useCustomRequests, useUpdateCustomRequest } from '@/lib/admin/hooks';
import { formatCustomRequestStatus } from '@/lib/admin/types';
import { LoadingSpinner } from '@/components/ui/loading';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

export default function AdminCustomRequestsPage() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const { data, isLoading } = useCustomRequests({ status, page, limit: 20 });
  const updateMutation = useUpdateCustomRequest();

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>;
  }

  const requests = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    await updateMutation.mutateAsync({ requestId, status: newStatus });
  };

  const handleNotesUpdate = async (requestId: string) => {
    await updateMutation.mutateAsync({ requestId, status: '', internalNotes: notes });
    setEditingId(null);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Custom Requests</h1>
        <p className="text-neutral-500">{total} total requests</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'new', label: 'New' },
            { value: 'contacted', label: 'Contacted' },
            { value: 'quoted', label: 'Quoted' },
            { value: 'accepted', label: 'Accepted' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
        />
      </div>

      <div className="space-y-4">
        {requests.map((request) => {
          const statusInfo = formatCustomRequestStatus(request.status);
          return (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-neutral-900">{request.name}</h3>
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    </div>
                    <div className="text-sm text-neutral-500 space-y-1">
                      <p>Email: {request.email}</p>
                      <p>Phone: {request.phone}</p>
                      <p>Created: {new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>

                    {request.internalNotes && (
                      <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
                        <p className="text-sm text-neutral-600">{request.internalNotes}</p>
                      </div>
                    )}

                    {editingId === request.id && (
                      <div className="mt-3 space-y-2">
                        <Textarea
                          placeholder="Add internal notes..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleNotesUpdate(request.id)}
                            disabled={updateMutation.isPending}
                          >
                            Save Notes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { setEditingId(null); setNotes(''); }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Select
                      value={request.status}
                      onChange={(e) => handleStatusUpdate(request.id, e.target.value)}
                      options={[
                        { value: 'new', label: 'New' },
                        { value: 'contacted', label: 'Contacted' },
                        { value: 'quoted', label: 'Quoted' },
                        { value: 'accepted', label: 'Accepted' },
                        { value: 'in_progress', label: 'In Progress' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'cancelled', label: 'Cancelled' },
                      ]}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setEditingId(request.id); setNotes(request.internalNotes || ''); }}
                    >
                      Edit Notes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {requests.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            No custom requests found
          </div>
        )}
      </div>

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
    </div>
  );
}
