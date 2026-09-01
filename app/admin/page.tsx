'use client';

import { useAdminStats } from '@/lib/admin/hooks';
import { LoadingSpinner } from '@/components/ui/loading';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>;
  }

  const statCards = [
    {
      label: 'Total Customers',
      value: stats?.totalCustomers || 0,
      href: '/admin/customers',
      color: 'text-blue-600',
    },
    {
      label: 'Pending Review',
      value: stats?.pendingReview || 0,
      href: '/admin/invitations?status=submitted',
      color: 'text-amber-600',
    },
    {
      label: 'Pending Media',
      value: stats?.pendingMedia || 0,
      href: '/admin/media?status=pending',
      color: 'text-purple-600',
    },
    {
      label: 'Custom Requests',
      value: stats?.pendingCustomRequests || 0,
      href: '/admin/custom-requests?status=new',
      color: 'text-orange-600',
    },
    {
      label: 'Total Revenue',
      value: `₦${(stats?.totalRevenue || 0).toLocaleString()}`,
      href: '/admin/invitations',
      color: 'text-green-600',
      noLink: true,
    },
    {
      label: 'Recent Signups (30d)',
      value: stats?.recentSignups || 0,
      href: '/admin/customers',
      color: 'text-indigo-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
        <p className="text-neutral-500">Overview of platform activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-6">
              {card.noLink ? (
                <div>
                  <p className="text-sm font-medium text-neutral-500">{card.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                </div>
              ) : (
                <Link href={card.href} className="block hover:opacity-80 transition-opacity">
                  <p className="text-sm font-medium text-neutral-500">{card.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Invitations by Status</h2>
            <div className="space-y-3">
              {Object.entries(stats?.invitationsByStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 capitalize">{status.replace(/_/g, ' ')}</span>
                  <span className="font-medium text-neutral-900">{count as number}</span>
                </div>
              ))}
              {Object.keys(stats?.invitationsByStatus || {}).length === 0 && (
                <p className="text-sm text-neutral-500">No invitations yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/admin/invitations?status=submitted"
                className="block p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
              >
                <p className="font-medium text-neutral-900">Review Invitations</p>
                <p className="text-sm text-neutral-500">{stats?.pendingReview || 0} pending review</p>
              </Link>
              <Link
                href="/admin/media?status=pending"
                className="block p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
              >
                <p className="font-medium text-neutral-900">Moderate Media</p>
                <p className="text-sm text-neutral-500">{stats?.pendingMedia || 0} pending moderation</p>
              </Link>
              <Link
                href="/admin/custom-requests?status=new"
                className="block p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
              >
                <p className="font-medium text-neutral-900">Custom Requests</p>
                <p className="text-sm text-neutral-500">{stats?.pendingCustomRequests || 0} new requests</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
