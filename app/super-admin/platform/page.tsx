'use client';

import { useSuperAdminStats, useSuperAdminUsers } from '@/lib/super-admin/hooks';
import { LoadingSpinner } from '@/components/ui/loading';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SuperAdminPlatformPage() {
  const { data: stats, isLoading: statsLoading } = useSuperAdminStats();
  const { data: recentUsers, isLoading: usersLoading } = useSuperAdminUsers({ limit: 10 });

  if (statsLoading || usersLoading) {
    return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Platform Overview</h1>
        <p className="text-neutral-500">Operational metrics and recent activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-neutral-500">Total Users</p>
            <p className="text-3xl font-bold text-purple-600">{stats?.totalUsers || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-neutral-500">Total Invitations</p>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalInvitations || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-neutral-500">Total Payments</p>
            <p className="text-3xl font-bold text-amber-600">{stats?.totalPayments || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-neutral-500">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">₦{(stats?.totalRevenue || 0).toLocaleString()}</p>
          </CardContent>
        </Card>
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
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Users</h2>
            <div className="space-y-3">
              {(recentUsers?.data || []).slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{user.fullName || user.email}</p>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>
                  <Badge variant={user.role === 'super_admin' ? 'danger' : user.role === 'admin' ? 'warning' : 'secondary'}>
                    {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Customer'}
                  </Badge>
                </div>
              ))}
              {(!recentUsers?.data || recentUsers.data.length === 0) && (
                <p className="text-sm text-neutral-500">No users yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">System Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-neutral-500">Active Packages</p>
              <p className="font-medium text-neutral-900">{stats?.activePackages || 0}</p>
            </div>
            <div>
              <p className="text-neutral-500">Active Templates</p>
              <p className="font-medium text-neutral-900">{stats?.activeTemplates || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
