'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInvitationForm } from '@/components/invitation-form-provider';
import { EVENT_TYPE_LABELS } from '@/lib/validations/invitation';
import { formatCurrency } from '@/lib/utils';
import { PACKAGE_PRICES } from '@/lib/constants';

export function ReviewStep() {
  const { formData, setStep } = useInvitationForm();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Review Your Invitation</h2>
        <p className="mt-1 text-neutral-600">
          Please review all details before submitting.
        </p>
      </div>

      {/* Confirmation Notice */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
        <div className="text-sm text-amber-800">
          <p className="font-medium">Please take a moment to review your details.</p>
          <p className="mt-1">
            Once your invitation is submitted, changes can only be made by our admin team.
          </p>
        </div>
      </div>

      {/* Template & Package */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-neutral-900">Template & Package</h3>
              <p className="text-sm text-neutral-600">Template ID: {formData.templateId}</p>
            </div>
            <Badge className="capitalize">{formData.packageTier}</Badge>
          </div>
          <p className="mt-2 text-sm text-neutral-600">
            Package Price: {formatCurrency(PACKAGE_PRICES[formData.packageTier || 'essential'])}
          </p>
        </CardContent>
      </Card>

      {/* Celebrant Info */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-neutral-900">Celebrant Information</h3>
          <div className="mt-3 space-y-2 text-sm">
            <p>
              <span className="text-neutral-500">Celebrant:</span>{' '}
              <span className="font-medium text-neutral-900">
                {formData.celebrant?.celebrantName}
                {formData.celebrant?.coCelebrantName && ` & ${formData.celebrant.coCelebrantName}`}
              </span>
            </p>
            <p>
              <span className="text-neutral-500">Event Title:</span>{' '}
              <span className="font-medium text-neutral-900">{formData.celebrant?.eventTitle}</span>
            </p>
            <p>
              <span className="text-neutral-500">Contact:</span>{' '}
              <span className="font-medium text-neutral-900">
                {formData.celebrant?.contactName} ({formData.celebrant?.contactEmail})
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Event Types */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-neutral-900">Event Types</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.eventTypes?.map((type) => (
              <Badge key={type} variant="secondary">
                {EVENT_TYPE_LABELS[type] || type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Details */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-neutral-900">Event Details</h3>
          <div className="mt-3 space-y-4">
            {formData.events?.map((event, i) => (
              <div key={i} className="border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
                <p className="font-medium text-neutral-900">
                  {EVENT_TYPE_LABELS[event.type] || event.type}
                </p>
                <p className="text-sm text-neutral-600">
                  {event.date}
                  {event.time && ` at ${event.time}`}
                </p>
                {event.venue && (
                  <p className="text-sm text-neutral-600">
                    {event.venue}
                    {event.address && `, ${event.address}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-neutral-900">Configured Features</h3>
          <div className="mt-3 space-y-2 text-sm">
            {formData.features?.songLink && (
              <p>
                <span className="text-neutral-500">Song Link:</span>{' '}
                <span className="font-medium text-neutral-900">{formData.features.songLink}</span>
              </p>
            )}
            {formData.features?.giftRegistryEnabled && (
              <Badge variant="secondary">Gift Registry Enabled</Badge>
            )}
            {formData.features?.cashGiftEnabled && (
              <Badge variant="secondary">Cash Gifts Enabled</Badge>
            )}
            {formData.features?.guestUploadsEnabled && (
              <Badge variant="secondary">Guest Uploads Enabled</Badge>
            )}
            {formData.features?.livestreamUrl && (
              <p>
                <span className="text-neutral-500">Livestream:</span>{' '}
                <span className="font-medium text-neutral-900">{formData.features.livestreamUrl}</span>
              </p>
            )}
            {formData.features?.privatePageEnabled && (
              <Badge variant="secondary">Private Page Enabled</Badge>
            )}
            {!formData.features?.songLink &&
              !formData.features?.giftRegistryEnabled &&
              !formData.features?.cashGiftEnabled &&
              !formData.features?.guestUploadsEnabled &&
              !formData.features?.livestreamUrl &&
              !formData.features?.privatePageEnabled && (
                <p className="text-neutral-500 italic">No additional features configured</p>
              )}
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="flex justify-start">
        <Button variant="ghost" onClick={() => setStep('features')}>
          Back to Edit
        </Button>
      </div>
    </div>
  );
}
