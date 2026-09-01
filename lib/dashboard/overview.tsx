'use client';

import * as React from 'react';
import Link from 'next/link';
import { useDashboardStats } from './hooks';
import {
  DashboardStats,
  DashboardInvitation,
  formatEventStatus,
  getPackageDisplay,
  calculateDaysUntilEvent,
  isEventPast,
} from './types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Gift,
  Image,
  Video,
  Calendar,
  Link as LinkIcon,
  Share2,
  QrCode,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Mail,
  TrendingUp,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  href?: string;
  className?: string;
  disabled?: boolean;
}

function StatCard({ title, value, icon, trend, trendUp, href, className, disabled }: StatCardProps) {
  return (
    <Card className={cn('hover:shadow-md transition-shadow cursor-pointer', href && 'hover:bg-primary-50', className, disabled && 'opacity-50 pointer-events-none cursor-not-allowed')}>
      <CardContent className="p-6">
        {href && !disabled ? (
          <Link href={href} className="block">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">{title}</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900">{value}</p>
                {trend && (
                  <p className={cn('mt-1 text-sm flex items-center gap-1', trendUp ? 'text-green-600' : 'text-red-600')}>
                    <TrendingUp className={cn('h-3 w-3', !trendUp && 'rotate-180')} />
                    {trend}
                  </p>
                )}
              </div>
              <div className={cn('p-3 rounded-xl', disabled ? 'bg-neutral-100 text-neutral-400' : 'bg-primary-100 text-primary-600')}>
                {icon}
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">{title}</p>
              <p className="mt-1 text-3xl font-bold text-neutral-900">{value}</p>
              {trend && (
                <p className={cn('mt-1 text-sm flex items-center gap-1', trendUp ? 'text-green-600' : 'text-red-600')}>
                  <TrendingUp className={cn('h-3 w-3', !trendUp && 'rotate-180')} />
                  {trend}
                </p>
              )}
            </div>
            <div className={cn('p-3 rounded-xl', disabled ? 'bg-neutral-100 text-neutral-400' : 'bg-primary-100 text-primary-600')}>
              {icon}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
}

function QuickActionCard({ title, description, icon, href, variant = 'primary', disabled }: QuickActionCardProps) {
  return (
    <Link href={href} className="block">
      <Card className={cn(
        'h-full hover:shadow-md transition-all duration-200',
        disabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : 'hover:-translate-y-1'
      )}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="p-3 bg-primary-100 rounded-xl text-primary-600 mb-4">
                {icon}
              </div>
              <h3 className="font-semibold text-neutral-900">{title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{description}</p>
            </div>
            <ExternalLink className="h-5 w-5 text-neutral-400" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function InvitationCard({ invitation, daysUntilEvent, isEventPast }: { 
  invitation: DashboardInvitation; 
  daysUntilEvent: number | null; 
  isEventPast: boolean;
}) {
  const { label, variant } = formatEventStatus(invitation);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">{invitation.templateName}</h2>
            <p className="text-sm text-neutral-500 mt-1">{invitation.eventType} • {invitation.celebrantNames.join(' & ')}</p>
          </div>
          <Badge variant={variant}>{label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Event Countdown */}
        <div className={cn('rounded-xl p-4 flex items-center justify-between', isEventPast ? 'bg-green-50' : 'bg-primary-50')}>
          <div className="flex items-center gap-3">
            <Calendar className={cn('h-6 w-6', isEventPast ? 'text-green-600' : 'text-primary-600')} />
            <div>
              <p className="text-sm font-medium text-neutral-500">Event Date</p>
              <p className="font-semibold text-neutral-900">
                {invitation.eventDate ? new Date(invitation.eventDate).toLocaleDateString('en-NG', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : 'Not set'}
              </p>
            </div>
          </div>
          {!isEventPast && daysUntilEvent !== null && (
            <div className="text-right">
              <p className="text-3xl font-bold text-primary-600">{daysUntilEvent}</p>
              <p className="text-sm text-neutral-500">{daysUntilEvent === 1 ? 'day' : 'days'} left</p>
            </div>
          )}
          {isEventPast && (
            <div className="text-right">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <p className="text-sm text-green-600 mt-1">Event completed</p>
            </div>
          )}
        </div>

        {/* Invitation Link & QR */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50">
            <LinkIcon className="h-5 w-5 text-neutral-400 flex-shrink-0" />
            <input
              type="text"
              value={invitation.publicUrl}
              readOnly
              className="flex-1 bg-transparent border-none text-sm text-neutral-600 font-mono"
              placeholder="Invitation link"
            />
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(invitation.publicUrl)}>
              Copy
            </Button>
          </div>
          {invitation.qrCodeUrl && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50">
              <QrCode className="h-5 w-5 text-neutral-400 flex-shrink-0" />
              <span className="text-sm font-medium text-neutral-900">QR Code</span>
              <Link
                href={invitation.qrCodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-primary-600 hover:underline text-sm"
              >
                View QR Code
              </Link>
            </div>
          )}
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-200">
          <PackageBadge tier={invitation.packageTier as any} />
        </div>
      </CardContent>
    </Card>
  );
}

function PackageBadge({ tier }: { tier: 'essential' | 'premium' | 'ultimate' }) {
  const configs = {
    essential: 'bg-blue-100 text-blue-700',
    premium: 'bg-purple-100 text-purple-700',
    ultimate: 'bg-gradient-to-r from-gold-500 to-gold-600 text-white',
  };
  const labels = {
    essential: 'Essential',
    premium: 'Premium',
    ultimate: 'Ultimate',
  };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">
      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold', configs[tier])}>
        {labels[tier]}
      </span>
    </span>
  );
}

export function DashboardOverview() {
  const { data: stats, isLoading, error, refetch } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}><CardContent className="p-6"><div className="h-6 bg-neutral-200 rounded w-1/4 animate-pulse mb-4"/><div className="h-8 bg-neutral-200 rounded w-1/2 animate-pulse"/></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-neutral-900">Failed to load dashboard</h3>
          <Button onClick={() => refetch()} className="mt-4">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  if (!stats?.invitation) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <Mail className="mx-auto h-16 w-16 text-neutral-300" />
          <h2 className="mt-4 text-2xl font-bold text-neutral-900">No Invitation Yet</h2>
          <p className="mt-2 text-neutral-500 max-w-md mx-auto">
            You haven&apos;t created an invitation yet. Start by setting up your event.
          </p>
          <Link href="/setup" className="mt-6 inline-block">
            <Button size="lg">
              <Mail className="mr-2 h-4 w-4" />
              Create Invitation
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const invitation = stats.invitation;
  const daysUntilEvent = stats.daysUntilEvent;
  const eventPast = stats.isEventPast;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-500">Welcome back! Here&apos;s your invitation overview.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Guests"
          value={stats.rsvp.total}
          icon={<Users className="h-6 w-6" />}
          href="/dashboard/guests"
          trend={`${stats.rsvp.attending} attending`}
          trendUp={stats.rsvp.attending > stats.rsvp.declined}
        />
        <StatCard
          title="Gifts Claimed"
          value={stats.gifts.claimed}
          icon={<Gift className="h-6 w-6" />}
          href="/dashboard/gifts"
          disabled={invitation.packageTier === 'essential'}
        />
        <StatCard
          title="Photos & Videos"
          value={stats.media.total}
          icon={<Image className="h-6 w-6" />}
          href="/dashboard/media"
          disabled={invitation.packageTier === 'essential'}
        />
        <StatCard
          title="Livestream"
          value={stats.livestream.configured ? 'Configured' : 'Not Set'}
          icon={<Video className="h-6 w-6" />}
          href="/dashboard/livestream"
          disabled={invitation.packageTier !== 'ultimate'}
        />
      </div>

      {/* Invitation Card */}
      <InvitationCard 
        invitation={invitation} 
        daysUntilEvent={daysUntilEvent} 
        isEventPast={eventPast} 
      />

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="View Invitation"
            description="Preview your live invitation"
            icon={<ExternalLink className="h-5 w-5" />}
            href={invitation.publicUrl}
            variant="outline"
          />
          <QuickActionCard
            title="Manage Guests"
            description="View RSVPs and guest list"
            icon={<Users className="h-5 w-5" />}
            href="/dashboard/guests"
          />
          <QuickActionCard
            title="Gift Registry"
            description="Manage gift items and claims"
            icon={<Gift className="h-5 w-5" />}
            href="/dashboard/gifts"
            disabled={invitation.packageTier === 'essential'}
          />
          <QuickActionCard
            title="Upload Media"
            description="Add photos and videos"
            icon={<Image className="h-5 w-5" />}
            href="/dashboard/media"
            disabled={invitation.packageTier === 'essential'}
          />
        </div>
      </div>

      {/* Feature Availability */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Your Package Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {({
            essential: [
              { key: 'basic_invitation', label: 'Digital Invitation', icon: Mail, enabled: true },
              { key: 'rsvp', label: 'RSVP Collection', icon: Users, enabled: true },
              { key: 'share', label: 'Share via Link/QR', icon: Share2, enabled: true },
              { key: 'gift_registry', label: 'Gift Registry', icon: Gift, enabled: false },
              { key: 'media_gallery', label: 'Photo Gallery', icon: Image, enabled: false },
              { key: 'livestream', label: 'Livestream', icon: Video, enabled: false },
            ],
            premium: [
              { key: 'basic_invitation', label: 'Digital Invitation', icon: Mail, enabled: true },
              { key: 'rsvp', label: 'RSVP Collection', icon: Users, enabled: true },
              { key: 'share', label: 'Share via Link/QR', icon: Share2, enabled: true },
              { key: 'gift_registry', label: 'Gift Registry', icon: Gift, enabled: true },
              { key: 'media_gallery', label: 'Photo Gallery', icon: Image, enabled: true },
              { key: 'livestream', label: 'Livestream', icon: Video, enabled: false },
            ],
            ultimate: [
              { key: 'basic_invitation', label: 'Digital Invitation', icon: Mail, enabled: true },
              { key: 'rsvp', label: 'RSVP Collection', icon: Users, enabled: true },
              { key: 'share', label: 'Share via Link/QR', icon: Share2, enabled: true },
              { key: 'gift_registry', label: 'Gift Registry', icon: Gift, enabled: true },
              { key: 'media_gallery', label: 'Photo Gallery', icon: Image, enabled: true },
              { key: 'livestream', label: 'Livestream', icon: Video, enabled: true },
              { key: 'guest_media', label: 'Guest Uploads', icon: Image, enabled: true },
              { key: '3d_template', label: '3D Templates', icon: Video, enabled: true },
            ],
          } as Record<string, Array<{key: string, label: string, icon: any, enabled: boolean}>>)[invitation.packageTier].map((feature) => (
            <Card key={feature.key} className="p-4 flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', feature.enabled ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-400')}>
                <feature.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className={cn('font-medium', feature.enabled ? 'text-neutral-900' : 'text-neutral-500')}>{feature.label}</p>
                <p className="text-xs text-neutral-500">
                  {feature.enabled ? 'Available' : 'Upgrade to unlock'}
                </p>
              </div>
              {feature.enabled ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-neutral-300" />
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}