'use client';

import * as React from 'react';
import { useRsvpStats } from './hooks';
import { useCustomerInvitation } from './hooks';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  Filter,
  Mail,
  Phone,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface RSVP {
  id: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  status: 'attending' | 'declined' | 'pending';
  attendeeCount: number;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

function StatCard({ title, value, icon, color, trend }: { 
  title: string; 
  value: number; 
  icon: React.ReactNode;
  color: string;
  trend?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">{title}</p>
            <p className="mt-1 text-3xl font-bold text-neutral-900">{value}</p>
            {trend && <p className="mt-1 text-sm text-green-600">{trend}</p>}
          </div>
          <div className={cn('p-3 rounded-xl', color)}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardGuests() {
  const { data: invitation } = useCustomerInvitation();
  const { data: stats, isLoading } = useRsvpStats(invitation?.id || null);

  // Mock RSVP data for demonstration
  const mockRsvps: RSVP[] = [
    { id: '1', guestName: 'Adebayo Johnson', guestPhone: '+234 801 234 5678', guestEmail: 'adebayo@example.com', status: 'attending', attendeeCount: 2, message: 'Looking forward to it!', createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
    { id: '2', guestName: 'Fatima Abubakar', guestPhone: '+234 802 345 6789', status: 'attending', attendeeCount: 1, createdAt: '2024-01-16T14:20:00Z', updatedAt: '2024-01-16T14:20:00Z' },
    { id: '3', guestName: 'Chinedu Okafor', guestPhone: '+234 803 456 7890', guestEmail: 'chinedu@example.com', status: 'declined', attendeeCount: 0, message: 'Unfortunately cannot make it.', createdAt: '2024-01-17T09:15:00Z', updatedAt: '2024-01-17T09:15:00Z' },
    { id: '4', guestName: 'Amina Yusuf', guestPhone: '+234 804 567 8901', status: 'pending', attendeeCount: 3, createdAt: '2024-01-18T16:45:00Z', updatedAt: '2024-01-18T16:45:00Z' },
    { id: '5', guestName: 'Tunde Bakare', guestPhone: '+234 805 678 9012', guestEmail: 'tunde@example.com', status: 'attending', attendeeCount: 4, message: 'Bringing the whole family!', createdAt: '2024-01-19T11:00:00Z', updatedAt: '2024-01-19T11:00:00Z' },
  ];

  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'attending' | 'declined' | 'pending'>('all');
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof RSVP; direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });

  const filteredRsvps = mockRsvps
    .filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (searchQuery && !r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !r.guestPhone.includes(searchQuery)) return false;
      return true;
    })
    .sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal === undefined || bVal === undefined) return 0;
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  if (!invitation) {
    return (
      <div className="text-center py-16">
        <Users className="mx-auto h-16 w-16 text-neutral-300" />
        <h2 className="mt-4 text-2xl font-bold text-neutral-900">No Invitation</h2>
        <p className="mt-2 text-neutral-500">Create an invitation to start collecting RSVPs.</p>
      </div>
    );
  }

  const handleSort = (key: keyof RSVP) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const SortableHeader = ({ children, key }: { children: React.ReactNode; key: keyof RSVP }) => (
    <button onClick={() => handleSort(key)} className="flex items-center gap-1 hover:text-primary-600">
      {children}
      {sortConfig.key === key && (sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Guests & RSVPs</h1>
          <p className="text-neutral-500">Manage your guest list and track responses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Responses" value={stats?.total || 0} icon={<Users className="h-6 w-6" />} color="bg-blue-100 text-blue-600" />
        <StatCard title="Attending" value={stats?.attending || 0} icon={<CheckCircle className="h-6 w-6" />} color="bg-green-100 text-green-600" trend={`${stats?.attending || 0} guests`} />
        <StatCard title="Declined" value={stats?.declined || 0} icon={<XCircle className="h-6 w-6" />} color="bg-red-100 text-red-600" />
        <StatCard title="Pending" value={stats?.pending || 0} icon={<Clock className="h-6 w-6" />} color="bg-amber-100 text-amber-600" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'attending', label: 'Attending' },
                { value: 'declined', label: 'Declined' },
                { value: 'pending', label: 'Pending' },
              ]}
              placeholder="All Statuses"
            />
          </div>
        </CardContent>
      </Card>

      {/* RSVP Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : filteredRsvps.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="mx-auto h-12 w-12 text-neutral-300" />
              <h3 className="mt-4 text-lg font-medium text-neutral-900">No RSVPs yet</h3>
              <p className="mt-1 text-neutral-500">Guest responses will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      <SortableHeader key="guestName">Guest Name</SortableHeader>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      <SortableHeader key="guestPhone">Phone</SortableHeader>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">
                      <SortableHeader key="guestEmail">Email</SortableHeader>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">
                      <SortableHeader key="attendeeCount">Guests</SortableHeader>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">
                      <SortableHeader key="createdAt">Submitted</SortableHeader>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredRsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-4">
                        <div className="font-medium text-neutral-900">{rsvp.guestName}</div>
                        {rsvp.message && <p className="text-sm text-neutral-500 italic">&ldquo;{rsvp.message}&rdquo;</p>}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-neutral-600">
                          <Phone className="h-3.5 w-3.5" />
                          <span className="text-sm">{rsvp.guestPhone}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        {rsvp.guestEmail ? (
                          <div className="flex items-center gap-1 text-neutral-600">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="text-sm">{rsvp.guestEmail}</span>
                          </div>
                        ) : (
                          <span className="text-neutral-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={
                          rsvp.status === 'attending' ? 'success' :
                          rsvp.status === 'declined' ? 'danger' : 'secondary'
                        } className="gap-1">
                          {rsvp.status === 'attending' && <CheckCircle className="h-3 w-3" />}
                          {rsvp.status === 'declined' && <XCircle className="h-3 w-3" />}
                          {rsvp.status === 'pending' && <Clock className="h-3 w-3" />}
                          {rsvp.status.charAt(0).toUpperCase() + rsvp.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-neutral-600">{rsvp.attendeeCount}</span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell text-neutral-500 text-sm">
                        {new Date(rsvp.createdAt).toLocaleDateString('en-NG', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-neutral-50">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-neutral-900">{mockRsvps.reduce((sum, r) => sum + r.attendeeCount, 0)}</p>
              <p className="text-sm text-neutral-500">Total Attendees</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{mockRsvps.filter(r => r.status === 'attending').length}</p>
              <p className="text-sm text-neutral-500">Confirmed Guests</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{Math.round((mockRsvps.filter(r => r.status === 'attending').length / mockRsvps.length) * 100)}%</p>
              <p className="text-sm text-neutral-500">Response Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{mockRsvps.filter(r => r.message).length}</p>
              <p className="text-sm text-neutral-500">With Messages</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}