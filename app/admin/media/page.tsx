'use client';

import { useState } from 'react';
import { useMediaForModeration, useModerateMedia } from '@/lib/admin/hooks';
import { formatModerationStatus } from '@/lib/admin/types';
import { LoadingSpinner } from '@/components/ui/loading';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';

function formatFileSize(bytes: number | null): string {
  if (!bytes) return 'Unknown';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useMediaForModeration({ status, page, limit: 20 });
  const moderateMutation = useModerateMedia();

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>;
  }

  const mediaItems = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  const handleModerate = async (mediaId: string, action: 'approve' | 'reject') => {
    await moderateMutation.mutateAsync({ mediaId, action });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Media Moderation</h1>
        <p className="text-neutral-500">{total} total media items</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'pending', label: 'Pending Review' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaItems.map((item) => {
          const statusInfo = formatModerationStatus(item.moderationStatus);
          return (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center mb-3">
                  <ImageIcon className="h-12 w-12 text-neutral-300" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    <span className="text-xs text-neutral-500 capitalize">{item.mediaType}</span>
                  </div>

                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {item.originalFilename || 'Unnamed file'}
                  </p>

                  <p className="text-xs text-neutral-500">
                    {item.customerName || item.customerEmail} &middot; {formatFileSize(item.fileSizeBytes)}
                  </p>

                  <p className="text-xs text-neutral-400">
                    {item.uploaderType === 'guest' ? 'Guest upload' : 'Customer upload'} &middot;{' '}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>

                  {item.moderationStatus === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleModerate(item.id, 'approve')}
                        disabled={moderateMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="flex-1"
                        onClick={() => handleModerate(item.id, 'reject')}
                        disabled={moderateMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {mediaItems.length === 0 && (
          <div className="col-span-full text-center py-12 text-neutral-500">
            No media items found
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
