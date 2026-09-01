'use client';

import * as React from 'react';
import { useCustomerInvitation } from './hooks';
import type { DashboardInvitation } from './types';
import { formatEventStatus, calculateDaysUntilEvent, isEventPast } from './types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Mail,
  Calendar,
  MapPin,
  Users,
  Clock,
  Link as LinkIcon,
  QrCode,
  ExternalLink,
  Edit,
  AlertCircle,
  CheckCircle,
  XCircle,
  Tag,
  Image,
  Gift,
  Video,
  Share2,
  Package,
} from 'lucide-react';

interface DetailRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  copyable?: boolean;
}

function DetailRow({ label, value, icon, copyable }: DetailRowProps) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-neutral-100 last:border-0">
      {icon && <div className="flex-shrink-0 w-6 h-6 text-neutral-400 mt-0.5">{icon}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-500">{label}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-neutral-900 truncate font-mono text-sm">{value || 'Not set'}</p>
          {copyable && value && (
            <Button variant="ghost" size="icon" className="h-7 w-7 p-0" onClick={() => navigator.clipboard.writeText(value)}>
              <span className="sr-only">Copy</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureBadge({ enabled, icon, label, comingSoon }: { 
  enabled: boolean; 
  icon: React.ReactNode; 
  label: string;
  comingSoon?: boolean;
}) {
  return (
    <div className={cn('flex items-center gap-3 p-3 rounded-lg', enabled ? 'bg-green-50' : 'bg-neutral-50')}>
      <div className={cn('p-2 rounded-lg', enabled ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-400')}>
        {icon}
      </div>
      <div>
        <p className={cn('font-medium', enabled ? 'text-neutral-900' : 'text-neutral-500')}>{label}</p>
        <p className="text-xs text-neutral-500">
          {enabled ? 'Included in your package' : comingSoon ? 'Available in Premium/Ultimate' : 'Upgrade to unlock'}
        </p>
      </div>
      {enabled ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-neutral-300" />}
    </div>
  );
}

export function DashboardInvitation() {
  const { data: invitation, isLoading, error, refetch } = useCustomerInvitation();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card><CardContent className="p-6"><div className="h-6 bg-neutral-200 rounded w-1/4 animate-pulse mb-4"/><div className="h-8 bg-neutral-200 rounded w-1/2 animate-pulse"/></CardContent></Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-neutral-900">Failed to load invitation</h3>
          <Button onClick={() => refetch()} className="mt-4">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  if (!invitation) {
    return (
      <div className="text-center py-16">
        <Mail className="mx-auto h-16 w-16 text-neutral-300" />
        <h2 className="mt-4 text-2xl font-bold text-neutral-900">No Invitation Found</h2>
        <p className="mt-2 text-neutral-500 max-w-md mx-auto">
          You haven&apos;t created an invitation yet.
        </p>
        <Button asChild className="mt-6" size="lg">
          <a href="/setup">
            <Mail className="mr-2 h-4 w-4" />
            Create Your Invitation
          </a>
        </Button>
      </div>
    );
  }

  const { label: statusLabel, variant: statusVariant } = formatEventStatus(invitation);
  const daysUntilEvent = calculateDaysUntilEvent(invitation.eventDate);
  const eventPast = isEventPast(invitation.eventDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Invitation</h1>
          <p className="text-neutral-500">View your invitation details (read-only)</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={statusVariant} className="text-sm">{statusLabel}</Badge>
          <PackageBadge tier={invitation.packageTier} />
        </div>
      </div>

      {/* Status Banner */}
      {invitation.status !== 'published' && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800">Invitation is {invitation.status}</p>
              <p className="text-sm text-amber-700">
                {invitation.status === 'draft' && 'Complete the setup wizard to submit for review.'}
                {invitation.status === 'submitted' && 'Your invitation is under admin review. You\'ll be notified when approved.'}
                {invitation.status === 'approved' && 'Your invitation is approved but not yet published.'}
                {invitation.status === 'archived' && 'This invitation has been archived.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invitation Details */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Invitation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <DetailRow label="Template" value={invitation.templateName} icon={<Tag className="h-4 w-4" />} />
              <DetailRow label="Event Type" value={invitation.eventType} icon={<Calendar className="h-4 w-4" />} />
              <DetailRow label="Celebrant(s)" value={invitation.celebrantNames.join(' & ')} icon={<Users className="h-4 w-4" />} />
              {invitation.eventDate && (
                <DetailRow 
                  label="Event Date" 
                  value={new Date(invitation.eventDate).toLocaleDateString('en-NG', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  icon={<Calendar className="h-4 w-4" />}
                />
              )}
              <DetailRow 
                label="Days Until Event" 
                value={eventPast ? 'Event completed' : daysUntilEvent !== null ? `${daysUntilEvent} day${daysUntilEvent !== 1 ? 's' : ''} left` : 'Not set'} 
                icon={<Clock className="h-4 w-4" />} 
              />
            </CardContent>
          </Card>

          {/* Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share Your Invitation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow 
                label="Public Link" 
                value={invitation.publicUrl} 
                icon={<LinkIcon className="h-4 w-4" />}
                copyable
              />
              {invitation.qrCodeUrl && (
                <DetailRow 
                  label="QR Code" 
                  value="Available" 
                  icon={<QrCode className="h-4 w-4" />}
                />
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(invitation.publicUrl)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
                {invitation.qrCodeUrl && (
                  <a href={invitation.qrCodeUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <QrCode className="mr-2 h-4 w-4" />
                      View QR Code
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Template Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Template Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invitation.templatePreviewUrl ? (
                <div className="aspect-video rounded-lg bg-neutral-100 overflow-hidden">
                  <iframe
                    src={invitation.templatePreviewUrl}
                    className="w-full h-full border-0"
                    title={`Preview of ${invitation.templateName}`}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-neutral-100 flex items-center justify-center">
                  <Image className="h-12 w-12 text-neutral-300" />
                </div>
              )}
              <p className="mt-3 text-sm text-neutral-500">
                This is a read-only preview. To make changes, contact support or use the setup wizard.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Package Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Your Package
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PackageBadge tier={invitation.packageTier} />
              <div className="space-y-2">
                <p className="text-sm text-neutral-600">
                  {invitation.packageTier === 'essential' && 'Essential package includes basic invitation and RSVP collection.'}
                  {invitation.packageTier === 'premium' && 'Premium package adds gift registry and photo gallery.'}
                  {invitation.packageTier === 'ultimate' && 'Ultimate package includes all features: livestream, guest uploads, 3D templates, and collages.'}
                </p>
                <Button variant="outline" asChild className="w-full">
                  <a href="/packages">View Package Comparison</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Available Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <FeatureBadge enabled={true} icon={<Mail className="h-4 w-4" />} label="Digital Invitation" />
              <FeatureBadge enabled={true} icon={<Users className="h-4 w-4" />} label="RSVP Collection" />
              <FeatureBadge enabled={true} icon={<Share2 className="h-4 w-4" />} label="Share via Link/QR" />
              <FeatureBadge 
                enabled={invitation.packageTier !== 'essential'} 
                comingSoon={invitation.packageTier === 'essential'}
                icon={<Gift className="h-4 w-4" />} 
                label="Gift Registry" 
              />
              <FeatureBadge 
                enabled={invitation.packageTier !== 'essential'} 
                comingSoon={invitation.packageTier === 'essential'}
                icon={<Image className="h-4 w-4" />} 
                label="Photo Gallery" 
              />
              <FeatureBadge 
                enabled={invitation.packageTier === 'ultimate'} 
                comingSoon={invitation.packageTier !== 'ultimate'}
                icon={<Video className="h-4 w-4" />} 
                label="Livestream" 
              />
              <FeatureBadge 
                enabled={invitation.packageTier === 'ultimate'} 
                comingSoon={invitation.packageTier !== 'ultimate'}
                icon={<Image className="h-4 w-4" />} 
                label="Guest Media Uploads" 
              />
              <FeatureBadge 
                enabled={invitation.packageTier === 'ultimate'} 
                comingSoon={invitation.packageTier !== 'ultimate'}
                icon={<Video className="h-4 w-4" />} 
                label="3D Templates" 
              />
            </CardContent>
          </Card>

          {/* Read-only Notice */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Read-Only View</p>
                  <p className="text-sm text-blue-700 mt-1">
                    This is a read-only view of your invitation. To make changes, please contact our support team 
                    or use the setup wizard to submit a new version for review.
                  </p>
                  <Button variant="outline" asChild className="mt-3" size="sm">
                    <a href="/contact">Contact Support</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PackageBadge({ tier }: { tier: 'essential' | 'premium' | 'ultimate' }) {
  const configs = {
    essential: 'bg-blue-100 text-blue-700',
    premium: 'bg-purple-100 text-purple-700',
    ultimate: 'bg-gradient-to-r from-gold-500 to-gold-600 text-white',
  };
  const labels = { essential: 'Essential', premium: 'Premium', ultimate: 'Ultimate' };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', configs[tier])}>
      {labels[tier]}
    </span>
  );
}