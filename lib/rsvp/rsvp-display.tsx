'use client';

import * as React from 'react';
import { Users, UserCheck, UserX, HelpCircle, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  RSVPRecord,
  RSVPStats,
  RSVPStatus,
} from '@/lib/rsvp/types';
import { getRSVPsForInvitation, seedDemoRSVPs } from '@/lib/rsvp/store';
import { cn } from '@/lib/utils';

interface RSVPDisplayProps {
  invitationId: string;
}

export function RSVPDisplay({ invitationId }: RSVPDisplayProps) {
  const [rsvps, setRsvps] = React.useState<RSVPRecord[]>([]);
  const [stats, setStats] = React.useState<RSVPStats | null>(null);
  const [filter, setFilter] = React.useState<RSVPStatus | 'all'>('all');
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    // Seed demo data for testing
    seedDemoRSVPs(invitationId);
    loadData();
  }, [invitationId, filter, search, page]);

  const loadData = () => {
    const result = getRSVPsForInvitation(invitationId, {
      status: filter === 'all' ? undefined : filter,
      search: search || undefined,
      page,
      limit: 10,
    });
    setRsvps(result.rsvps);
    setStats(result.stats);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
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
                <Users className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total RSVPs</p>
                <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Attending</p>
                <p className="text-2xl font-bold text-green-600">{stats.attending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Not Attending</p>
                <p className="text-2xl font-bold text-red-600">{stats.notAttending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                <HelpCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Maybe</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.maybe}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total Expected */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Expected Guests</p>
              <p className="text-3xl font-bold text-primary-600">{stats.totalAttendees}</p>
            </div>
            <p className="text-sm text-neutral-500">
              (including {stats.attending} confirmed {stats.attending === 1 ? 'party' : 'parties'})
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(['all', 'attending', 'not_attending', 'maybe'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setFilter(status);
                setPage(1);
              }}
              className="capitalize"
            >
              {status === 'all' ? 'All' : status.replace(/_/g, ' ')}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search guests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
          />
          <Button type="submit" size="sm" variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* RSVP List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-200">
            {rsvps.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">
                No RSVPs found
              </div>
            ) : (
              rsvps.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="flex items-center justify-between p-4 hover:bg-neutral-50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white',
                        rsvp.status === 'attending'
                          ? 'bg-green-500'
                          : rsvp.status === 'not_attending'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      )}
                    >
                      {rsvp.guestName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{rsvp.guestName}</p>
                      <p className="text-sm text-neutral-500">{rsvp.guestPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {rsvp.attendeeCount && rsvp.attendeeCount > 1 && (
                      <Badge variant="secondary">
                        +{rsvp.attendeeCount - 1} guest{rsvp.attendeeCount > 2 ? 's' : ''}
                      </Badge>
                    )}
                    <Badge
                      variant={
                        rsvp.status === 'attending'
                          ? 'success'
                          : rsvp.status === 'not_attending'
                          ? 'danger'
                          : 'warning'
                      }
                      className="capitalize"
                    >
                      {rsvp.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
