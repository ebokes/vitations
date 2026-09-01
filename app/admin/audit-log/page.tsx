'use client';

import { useState } from 'react';
import { useAuditLogs } from '@/lib/admin/hooks';
import { LoadingSpinner } from '@/components/ui/loading';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Shield } from 'lucide-react';

function formatAction(action: string): { label: string; variant: 'default' | 'success' | 'warning' | 'danger' } {
  const map: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
    unlock_invitation: { label: 'Unlock', variant: 'warning' },
    relock_invitation: { label: 'Relock', variant: 'default' },
    approve_invitation: { label: 'Approve', variant: 'success' },
    moderate_media_approve: { label: 'Media Approved', variant: 'success' },
    moderate_media_reject: { label: 'Media Rejected', variant: 'danger' },
    update_custom_request: { label: 'Update Request', variant: 'default' },
  };
  return map[action] || { label: action, variant: 'default' };
}

export default function AdminAuditLogPage() {
  const [resourceType, setResourceType] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAuditLogs({ resourceType, page, limit: 50 });

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>;
  }

  const logs = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Audit Log</h1>
        <p className="text-neutral-500">{total} total entries</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select
          value={resourceType}
          onChange={(e) => { setResourceType(e.target.value); setPage(1); }}
          options={[
            { value: '', label: 'All Resources' },
            { value: 'invitation', label: 'Invitations' },
            { value: 'media', label: 'Media' },
            { value: 'custom_invitation_request', label: 'Custom Requests' },
          ]}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Action</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Resource</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Actor</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Details</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {logs.map((log) => {
                  const actionInfo = formatAction(log.action);
                  return (
                    <tr key={log.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <Badge variant={actionInfo.variant}>{actionInfo.label}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-neutral-900 capitalize">
                            {log.resourceType.replace(/_/g, ' ')}
                          </p>
                          {log.resourceId && (
                            <p className="text-xs text-neutral-400 font-mono">{log.resourceId.slice(0, 8)}...</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {log.actorEmail || 'System'}
                      </td>
                      <td className="px-6 py-4">
                        {log.newData && typeof log.newData === 'object' && (
                          <div className="text-xs text-neutral-500">
                            {Object.entries(log.newData).map(([key, value]) => (
                              <p key={key}>
                                <span className="font-medium">{key}:</span>{' '}
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </p>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                      <Shield className="h-12 w-12 mx-auto text-neutral-300 mb-3" />
                      No audit log entries found
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
    </div>
  );
}
