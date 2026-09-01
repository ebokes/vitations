'use client';

import { useSuperAdminStats } from '@/lib/super-admin/hooks';
import { LoadingSpinner } from '@/components/ui/loading';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function SuperAdminOverviewPage() {
  const { data: stats, isLoading } = useSuperAdminStats();

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>;
  }

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      href: '/super-admin/users',
      color: 'text-purple-600',
    },
    {
      label: 'Admins',
      value: (stats?.usersByRole.admin || 0) + (stats?.usersByRole.super_admin || 0),
      href: '/super-admin/users?role=admin',
      color: 'text-red-600',
    },
    {
      label: 'Total Invitations',
      value: stats?.totalInvitations || 0,
      href: '/super-admin/platform',
      color: 'text-blue-600',
    },
    {
      label: 'Total Revenue',
      value: `₦${(stats?.totalRevenue || 0).toLocaleString()}`,
      href: '/super-admin/platform',
      color: 'text-green-600',
      noLink: true,
    },
    {
      label: 'Active Packages',
      value: stats?.activePackages || 0,
      href: '/super-admin/packages',
      color: 'text-amber-600',
    },
    {
      label: 'Active Templates',
      value: stats?.activeTemplates || 0,
      href: '/super-admin/templates',
      color: 'text-indigo-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Super Admin Dashboard</h1>
        <p className="text-neutral-500">Platform-wide management and configuration</p>
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
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Users by Role</h2>
            <div className="space-y-3">
              {Object.entries(stats?.usersByRole || {}).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 capitalize">{role.replace(/_/g, ' ')}</span>
                  <span className="font-medium text-neutral-900">{count as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/super-admin/users?role=admin"
                className="block p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
              >
                <p className="font-medium text-neutral-900">Manage Admins</p>
                <p className="text-sm text-neutral-500">Assign or revoke admin roles</p>
              </Link>
              <Link
                href="/super-admin/packages"
                className="block p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
              >
                <p className="font-medium text-neutral-900">Package Configuration</p>
                <p className="text-sm text-neutral-500">Manage pricing and features</p>
              </Link>
              <Link
                href="/super-admin/templates"
                className="block p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
              >
                <p className="font-medium text-neutral-900">Template Management</p>
                <p className="text-sm text-neutral-500">Publish or retire templates</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
