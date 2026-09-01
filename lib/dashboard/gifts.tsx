'use client';

import * as React from 'react';
import { useGiftStats } from './hooks';
import { useCustomerInvitation } from './hooks';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Gift,
  CheckCircle,
  Clock,
  Package,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  Filter,
  Search,
  Download,
} from 'lucide-react';

interface GiftItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  claimedQuantity: number;
  price?: number;
  status: 'available' | 'partially_claimed' | 'fully_claimed' | 'received';
  isCashGift: boolean;
  bankDetails?: string;
  paystackLink?: string;
  deliveryAddress?: string;
  createdAt: string;
}

function StatCard({ title, value, icon, color, trend, trendUp }: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
  color: string;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">{title}</p>
            <p className="mt-1 text-3xl font-bold text-neutral-900">{value}</p>
            {trend && <p className={cn('mt-1 text-sm', trendUp ? 'text-green-600' : 'text-red-600')}>{trend}</p>}
          </div>
          <div className={cn('p-3 rounded-xl', color)}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardGifts() {
  const { data: invitation } = useCustomerInvitation();
  const { data: stats, isLoading } = useGiftStats(invitation?.id || null);

  // Hooks must be called unconditionally
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'available' | 'partially_claimed' | 'fully_claimed' | 'received'>('all');

  if (!invitation) {
    return (
      <div className="text-center py-16">
        <Gift className="mx-auto h-16 w-16 text-neutral-300" />
        <h2 className="mt-4 text-2xl font-bold text-neutral-900">No Invitation</h2>
        <p className="mt-2 text-neutral-500">Create an invitation to set up your gift registry.</p>
      </div>
    );
  }

  if (invitation.packageTier === 'essential') {
    return (
      <div className="text-center py-16">
        <Gift className="mx-auto h-16 w-16 text-neutral-300" />
        <h2 className="mt-4 text-2xl font-bold text-neutral-900">Gift Registry Requires Premium</h2>
        <p className="mt-2 text-neutral-500 max-w-md mx-auto">
          Upgrade to Premium (₦150,000) or Ultimate (₦350,000) to enable gift registry for your event.
        </p>
        <Button asChild className="mt-6" size="lg">
          <a href="/packages">View Packages</a>
        </Button>
      </div>
    );
  }

  // Mock gift data
  const mockGifts: GiftItem[] = [
    { id: '1', name: 'Kitchen Appliances', description: 'Blender, mixer, toaster set', quantity: 1, claimedQuantity: 1, price: 150000, status: 'fully_claimed', isCashGift: false, createdAt: '2024-01-10T10:00:00Z' },
    { id: '2', name: 'Home Decor', description: 'Vases, frames, decorative items', quantity: 5, claimedQuantity: 2, price: 25000, status: 'partially_claimed', isCashGift: false, createdAt: '2024-01-11T10:00:00Z' },
    { id: '3', name: 'Honeymoon Fund', description: 'Contribute to our Maldives trip', quantity: 10, claimedQuantity: 7, price: 50000, status: 'partially_claimed', isCashGift: true, paystackLink: 'https://paystack.com/pay/honeymoon', createdAt: '2024-01-12T10:00:00Z' },
    { id: '4', name: 'Wedding Outfit', description: 'Traditional Aso-Oke attire', quantity: 2, claimedQuantity: 2, price: 200000, status: 'received', isCashGift: false, createdAt: '2024-01-13T10:00:00Z' },
    { id: '5', name: 'Electronics', description: 'Smart TV or laptop', quantity: 1, claimedQuantity: 0, price: 300000, status: 'available', isCashGift: false, createdAt: '2024-01-14T10:00:00Z' },
  ];

  const filteredGifts = mockGifts.filter(g => {
    if (statusFilter !== 'all' && g.status !== statusFilter) return false;
    if (searchQuery && !g.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalValue = mockGifts.reduce((sum, g) => sum + (g.price || 0) * g.claimedQuantity, 0);
  const claimedCount = mockGifts.filter(g => g.claimedQuantity > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Gift Registry</h1>
          <p className="text-neutral-500">Track gift claims and contributions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Gift
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Gifts" value={mockGifts.length} icon={<Gift className="h-6 w-6" />} color="bg-blue-100 text-blue-600" />
        <StatCard title="Claimed" value={claimedCount} icon={<CheckCircle className="h-6 w-6" />} color="bg-green-100 text-green-600" trend={`${claimedCount} of ${mockGifts.length}`} trendUp />
        <StatCard title="Total Value" value={`₦${totalValue.toLocaleString()}`} icon={<DollarSign className="h-6 w-6" />} color="bg-purple-100 text-purple-600" trend="Claimed value" />
        <StatCard title="Received" value={mockGifts.filter(g => g.status === 'received').length} icon={<Package className="h-6 w-6" />} color="bg-amber-100 text-amber-600" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input placeholder="Search gifts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'available', label: 'Available' },
                { value: 'partially_claimed', label: 'Partially Claimed' },
                { value: 'fully_claimed', label: 'Fully Claimed' },
                { value: 'received', label: 'Received' },
              ]}
              placeholder="All Statuses"
            />
          </div>
        </CardContent>
      </Card>

      {/* Gifts Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : filteredGifts.length === 0 ? (
            <div className="p-8 text-center">
              <Gift className="mx-auto h-12 w-12 text-neutral-300" />
              <h3 className="mt-4 text-lg font-medium text-neutral-900">No gifts added yet</h3>
              <p className="mt-1 text-neutral-500">Add gifts to your registry for guests to claim.</p>
              <Button className="mt-4"><Plus className="mr-2 h-4 w-4" /> Add First Gift</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Gift</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Progress</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Value</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredGifts.map((gift) => (
                    <tr key={gift.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-4">
                        <div className="font-medium text-neutral-900">{gift.name}</div>
                        {gift.isCashGift && <span className="text-xs text-primary-600">Cash Gift</span>}
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell text-neutral-500 text-sm">
                        {gift.description || '—'}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={gift.isCashGift ? 'default' : 'outline'} className="gap-1">
                          {gift.isCashGift ? <DollarSign className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                          {gift.isCashGift ? 'Cash' : 'Physical'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={
                          gift.status === 'received' ? 'success' :
                          gift.status === 'fully_claimed' ? 'default' :
                          gift.status === 'partially_claimed' ? 'secondary' : 'outline'
                        }>
                          {gift.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-32">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary-600 rounded-full transition-all" 
                                style={{ width: `${(gift.claimedQuantity / gift.quantity) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-neutral-500 w-16 text-right">
                              {gift.claimedQuantity}/{gift.quantity}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell text-neutral-600">
                        {gift.price ? `₦${(gift.price * gift.claimedQuantity).toLocaleString()}` : '—'}
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cash Gift Details */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl text-green-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Cash Gift Contributions</h3>
              <p className="text-sm text-green-700">Guests can contribute directly via Paystack</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg">
              <p className="text-green-600 font-medium">Total Contributions</p>
              <p className="text-2xl font-bold text-green-800">₦{mockGifts.filter(g => g.isCashGift).reduce((sum, g) => sum + (g.price || 0) * g.claimedQuantity, 0).toLocaleString()}</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-green-600 font-medium">Contributors</p>
              <p className="text-2xl font-bold text-green-800">{mockGifts.filter(g => g.isCashGift).reduce((sum, g) => sum + g.claimedQuantity, 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}