'use client';

import { Lock, CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';
import type { InvitationStatus } from '@/types/database';

interface InvitationStatusBannerProps {
  status: InvitationStatus;
  submittedAt?: string;
  lockedAt?: string;
  eventDate?: string;
}

const statusConfig: Record<
  InvitationStatus,
  {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    variant: 'default' | 'success' | 'warning' | 'secondary';
    bgColor: string;
  }
> = {
  draft: {
    icon: AlertCircle,
    title: 'Draft',
    variant: 'secondary',
    bgColor: 'bg-neutral-50',
  },
  submitted: {
    icon: CheckCircle,
    title: 'Submitted',
    variant: 'success',
    bgColor: 'bg-green-50',
  },
  locked: {
    icon: Lock,
    title: 'Locked',
    variant: 'default',
    bgColor: 'bg-blue-50',
  },
  unlocked_by_admin: {
    icon: AlertCircle,
    title: 'Under Review',
    variant: 'warning',
    bgColor: 'bg-yellow-50',
  },
  approved: {
    icon: CheckCircle,
    title: 'Approved',
    variant: 'success',
    bgColor: 'bg-green-50',
  },
  published: {
    icon: Calendar,
    title: 'Published',
    variant: 'success',
    bgColor: 'bg-primary-50',
  },
  archived: {
    icon: Calendar,
    title: 'Archived',
    variant: 'secondary',
    bgColor: 'bg-neutral-50',
  },
  completed: {
    icon: Calendar,
    title: 'Event Complete',
    variant: 'success',
    bgColor: 'bg-primary-50',
  },
};

export function InvitationStatusBanner({
  status,
  submittedAt,
  lockedAt,
  eventDate,
}: InvitationStatusBannerProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const getMessage = () => {
    switch (status) {
      case 'draft':
        return 'Your invitation is in draft mode. Complete and submit it when ready.';
      case 'submitted':
        return submittedAt
          ? `Submitted on ${formatDateTime(submittedAt)}. Your invitation is being processed.`
          : 'Your invitation has been submitted successfully.';
      case 'locked':
        return lockedAt
          ? `Locked on ${formatDateTime(lockedAt)}. Your invitation is active and ready to share!`
          : 'Your invitation is locked and active.';
      case 'unlocked_by_admin':
        return 'Our admin team is making updates to your invitation. You will be notified when complete.';
      case 'completed':
        return eventDate
          ? `Your event took place on ${formatDateTime(eventDate)}. Thank you for using Vitations!`
          : 'Your event is complete. Thank you for using Vitations!';
    }
  };

  return (
    <Card className={config.bgColor}>
      <CardContent className="flex items-start gap-4 p-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
          <Icon className="h-5 w-5 text-neutral-700" />
        </div>
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="font-semibold text-neutral-900">
              Invitation Status
            </h3>
            <Badge variant={config.variant}>{config.title}</Badge>
          </div>
          <p className="text-sm text-neutral-700">{getMessage()}</p>
          {status === 'locked' && (
            <p className="mt-2 text-xs text-neutral-600">
              Need to make changes? Contact our support team for assistance.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
