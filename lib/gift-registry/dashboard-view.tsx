'use client';

import * as React from 'react';
import {
  Gift,
  Users,
  CheckCircle,
  Package,
  Search,
  Plus,
  Trash2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  GiftItem,
  GiftClaim,
  GiftRegistryStats,
} from './types';
import {
  getGiftRegistry,
  getGiftRegistryWithStats,
  getAllGiftClaims,
  addGiftItem,
  removeGiftItem,
  markGiftReceived,
  updateGiftClaimStatus,
  seedDemoGiftRegistry,
} from './store';

interface GiftRegistryDashboardProps {
  invitationId: string;
}

export function GiftRegistryDashboard({ invitationId }: GiftRegistryDashboardProps) {
  const [gifts, setGifts] = React.useState<GiftItem[]>([]);
  const [claims, setClaims] = React.useState<GiftClaim[]>([]);
  const [stats, setStats] = React.useState<GiftRegistryStats | null>(null);
  const [filter, setFilter] = React.useState<string>('all');
  const [search, setSearch] = React.useState('');
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newGiftName, setNewGiftName] = React.useState('');
  const [newGiftDesc, setNewGiftDesc] = React.useState('');
  const [newGiftQty, setNewGiftQty] = React.useState(1);

  React.useEffect(() => {
    // Seed demo data
    seedDemoGiftRegistry(invitationId);
    loadData();
  }, [invitationId]);

  const loadData = () => {
    const result = getGiftRegistryWithStats(invitationId, {
      status: filter === 'all' ? undefined : filter as any,
      search: search || undefined,
    });

    if (result) {
      setGifts(result.gifts);
      setStats(result.stats);
    }

    const allClaims = getAllGiftClaims(invitationId);
    setClaims(allClaims);
  };

  const handleAddGift = () => {
    if (!newGiftName.trim()) return;

    addGiftItem(invitationId, {
      name: newGiftName,
      description: newGiftDesc || undefined,
      quantity: newGiftQty,
    });

    setNewGiftName('');
    setNewGiftDesc('');
    setNewGiftQty(1);
    setShowAddForm(false);
    loadData();
  };

  const handleRemoveGift = (giftId: string) => {
    if (confirm('Are you sure you want to remove this gift?')) {
      removeGiftItem(invitationId, giftId);
      loadData();
    }
  };

  const handleMarkReceived = (giftId: string) => {
    markGiftReceived(invitationId, giftId);
    loadData();
  };

  const handleUpdateClaimStatus = (claimId: string, status: GiftClaim['status']) => {
    updateGiftClaimStatus(invitationId, claimId, status);
    loadData();
  };

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                <Gift className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Gifts</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalGifts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Items</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                <Users className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Claimed</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.claimedItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Received</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.receivedItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {['all', 'available', 'partially_claimed', 'fully_claimed', 'received'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setFilter(status);
                loadData();
              }}
              className="capitalize"
            >
              {status === 'all' ? 'All' : status.replace(/_/g, ' ')}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loadData();
            }}
            className="flex gap-2"
          >
            <Input
              placeholder="Search gifts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-40"
            />
            <Button type="submit" size="sm" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Gift
          </Button>
        </div>
      </div>

      {/* Add Gift Form */}
      {showAddForm && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-neutral-900">Add New Gift</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Input
                placeholder="Gift name"
                value={newGiftName}
                onChange={(e) => setNewGiftName(e.target.value)}
              />
              <Input
                placeholder="Description (optional)"
                value={newGiftDesc}
                onChange={(e) => setNewGiftDesc(e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={1}
                  value={newGiftQty}
                  onChange={(e) => setNewGiftQty(parseInt(e.target.value) || 1)}
                  className="w-20"
                />
                <Button onClick={handleAddGift}>Add</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gift List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-200">
            {gifts.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">
                No gifts found
              </div>
            ) : (
              gifts.map((gift) => {
                const giftClaimsList = claims.filter(
                  (c) => c.giftId === gift.id && c.status !== 'cancelled'
                );

                return (
                  <div
                    key={gift.id}
                    className="p-4 hover:bg-neutral-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-neutral-900">{gift.name}</h4>
                          <Badge
                            variant={
                              gift.status === 'available'
                                ? 'success'
                                : gift.status === 'received'
                                ? 'default'
                                : 'warning'
                            }
                            className="capitalize"
                          >
                            {gift.status.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        {gift.description && (
                          <p className="mt-1 text-sm text-neutral-500">{gift.description}</p>
                        )}
                        <p className="mt-1 text-sm text-neutral-500">
                          {gift.claimedCount} of {gift.quantity} claimed
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {gift.status !== 'received' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkReceived(gift.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveGift(gift.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    {/* Claims */}
                    {giftClaimsList.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-neutral-500">Claims:</p>
                        {giftClaimsList.map((claim) => (
                          <div
                            key={claim.id}
                            className="flex items-center justify-between rounded-lg bg-neutral-50 p-2 text-sm"
                          >
                            <div>
                              <span className="font-medium">{claim.guestName}</span>
                              <span className="ml-2 text-neutral-500">
                                x{claim.quantity}
                              </span>
                              {claim.message && (
                                <span className="ml-2 text-neutral-400">
                                  &ldquo;{claim.message}&rdquo;
                                </span>
                              )}
                            </div>
                            <div className="flex gap-1">
                              {claim.status === 'intended' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs"
                                    onClick={() =>
                                      handleUpdateClaimStatus(claim.id, 'purchased')
                                    }
                                  >
                                    Purchased
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs text-red-500"
                                    onClick={() =>
                                      handleUpdateClaimStatus(claim.id, 'cancelled')
                                    }
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                              <Badge variant="secondary" className="text-xs">
                                {claim.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
