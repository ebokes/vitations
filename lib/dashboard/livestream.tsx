'use client';

import * as React from 'react';
import { LivestreamConfigPanel } from '@/lib/livestream/components';
import { useCustomerInvitation } from './hooks';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Video,
  Settings,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export function DashboardLivestream() {
  const { data: invitation } = useCustomerInvitation();

  if (!invitation) {
    return (
      <div className="text-center py-16">
        <Video className="mx-auto h-16 w-16 text-neutral-300" />
        <h2 className="mt-4 text-2xl font-bold text-neutral-900">No Invitation</h2>
        <p className="mt-2 text-neutral-500">Create an invitation to configure livestream.</p>
      </div>
    );
  }

  if (invitation.packageTier !== 'ultimate') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Livestream</h1>
          <p className="text-neutral-500">Stream your event live for guests who can&apos;t attend</p>
        </div>

        {/* Upgrade Notice */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                <Video className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800">Livestream requires Ultimate package</h3>
                <p className="mt-1 text-sm text-amber-700">
                  Upgrade to Ultimate (₦350,000) to enable live streaming for your event.
                </p>
                <div className="mt-4 flex gap-2">
                  <Badge variant="outline" className="text-xs">Essential: Not available</Badge>
                  <Badge variant="outline" className="text-xs">Premium: Not available</Badge>
                  <Badge variant="default" className="text-xs bg-gradient-to-r from-gold-500 to-gold-600 text-white">Ultimate: Included ✓</Badge>
                </div>
              </div>
              <div className="flex-shrink-0">
                <a href="/packages" className="text-primary-600 hover:underline text-sm font-medium">
                  View Packages →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              What You Get with Ultimate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FeatureRow icon={<Settings className="h-5 w-5" />} title="External URL Support" desc="YouTube Live, Zoom, Google Meet, or custom streaming URLs" />
            <FeatureRow icon={<Calendar className="h-5 w-5" />} title="Scheduled Activation" desc="Set start/end times - stream activates automatically on event day" />
            <FeatureRow icon={<CheckCircle className="h-5 w-5 text-green-600" />} title="Manual Override" desc="Activate/deactivate anytime with a single toggle" />
            <FeatureRow icon={<ExternalLink className="h-5 w-5" />} title="Guest View" desc="Embedded player for YouTube, redirect links for others" />
            <FeatureRow icon={<AlertCircle className="h-5 w-5 text-amber-600" />} title="State Indicators" desc="Upcoming, Live, Ended states with countdown timers" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ultimate package - show config panel
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Livestream</h1>
          <p className="text-neutral-500">Configure and manage your event live stream</p>
        </div>
        <Badge variant="default" className="bg-gradient-to-r from-gold-500 to-gold-600 text-white">
          Ultimate Package
        </Badge>
      </div>

      {/* Config Panel */}
      <LivestreamConfigPanel
        invitationId={invitation.id}
        packageTier={invitation.packageTier}
      />

      {/* Help Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            Livestream Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <GuideItem icon={<Video className="h-4 w-4" />} title="YouTube Live" desc="Best for public streams. Provides embed support and automatic recording." />
          <GuideItem icon={<Settings className="h-4 w-4" />} title="Zoom/Google Meet" desc="For private streams. Guests will be redirected to the platform." />
          <GuideItem icon={<Calendar className="h-4 w-4" />} title="Schedule It" desc="Set start/end times. Stream activates automatically on event day." />
          <GuideItem icon={<CheckCircle className="h-4 w-4 text-green-600" />} title="Go Live Early" desc="Activate 15-30 mins before event to test audio/video." />
          <GuideItem icon={<XCircle className="h-4 w-4 text-red-600" />} title="End Stream" desc="Deactivate after event to prevent unauthorized access." />
        </CardContent>
      </Card>
    </div>
  );
}

function FeatureRow({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-primary-100 rounded-lg text-primary-600 flex-shrink-0">{icon}</div>
      <div>
        <p className="font-medium text-neutral-900">{title}</p>
        <p className="text-sm text-neutral-500">{desc}</p>
      </div>
    </div>
  );
}

function GuideItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">{icon}</div>
      <div>
        <p className="font-medium text-blue-800">{title}</p>
        <p className="text-sm text-blue-700">{desc}</p>
      </div>
    </div>
  );
}