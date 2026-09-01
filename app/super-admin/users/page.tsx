'use client';

import { useState } from 'react';
import { useSuperAdminUsers, useChangeUserRole } from '@/lib/super-admin/hooks';
import { formatUserRole } from '@/lib/admin/types';
import { LoadingSpinner } from '@/components/ui/loading';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Search, Shield } from 'lucide-react';

export default function SuperAdminUsersPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState<{ id: string; name: string; currentRole: string } | null>(null);
  const [newRole, setNewRole] = useState('');
  const [reason, setReason] = useState('');

  const { data, isLoading } = useSuperAdminUsers({ search, role, page, limit: 20 });
  const changeRoleMutation = useChangeUserRole();

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>;
  }

  const users = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  const handleRoleChange = async () => {
    if (!editingUser || !newRole || !reason.trim()) return;
    await changeRoleMutation.mutateAsync({
      userId: editingUser.id,
      newRole,
      reason,
    });
    setEditingUser(null);
    setNewRole('');
    setReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
        <p className="text-neutral-500">{total} total users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1); }}
          options={[
            { value: '', label: 'All Roles' },
            { value: 'customer', label: 'Customer' },
            { value: 'admin', label: 'Admin' },
            { value: 'super_admin', label: 'Super Admin' },
          ]}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">User</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Role</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Joined</th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-neutral-900">{user.fullName || 'No Name'}</p>
                        <p className="text-sm text-neutral-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === 'super_admin' ? 'danger' : user.role === 'admin' ? 'warning' : 'secondary'}>
                        {formatUserRole(user.role)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingUser({ id: user.id, name: user.fullName || user.email, currentRole: user.role });
                          setNewRole(user.role);
                        }}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Change Role
                      </Button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                      No users found
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
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Change Role</h2>
            <p className="text-sm text-neutral-500 mb-4">
              Changing role for <span className="font-medium text-neutral-900">{editingUser.name}</span>
            </p>
            <div className="space-y-4">
              <Select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                options={[
                  { value: 'customer', label: 'Customer' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'super_admin', label: 'Super Admin' },
                ]}
              />
              <Textarea
                placeholder="Reason for role change (required)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleRoleChange}
                  disabled={!reason.trim() || changeRoleMutation.isPending}
                  className="flex-1"
                >
                  {changeRoleMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
