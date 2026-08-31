'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InvitationContext, getEntitlementsForTier } from '@/lib/invitation-renderer';
import { getTemplateById } from '@/lib/templates';
import { InvitationData } from '@/lib/invitation-renderer/types';

interface GuestPreviewProps {
  invitation: InvitationData;
  onAccept: () => void;
}

export function GuestPreview({ invitation, onAccept }: GuestPreviewProps) {
  const template = getTemplateById(invitation.templateId);
  const { visualConfig } = template || {};

  const firstEvent = invitation.events[0];
  const eventDate = firstEvent
    ? new Date(firstEvent.date).toLocaleDateString('en-NG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: visualConfig?.fontFamily,
        background: visualConfig?.backgroundType === 'gradient'
          ? visualConfig.backgroundValue
          : visualConfig?.backgroundValue || '#faf8f5',
      }}
    >
      {/* Preview Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          {/* Logo */}
          <div className="mb-8">
            <Sparkles
              className="mx-auto h-10 w-10"
              style={{ color: visualConfig?.primaryColor }}
            />
          </div>

          {/* Invitation Badge */}
          <Badge
            variant="secondary"
            className="mb-4"
            style={{ backgroundColor: visualConfig?.secondaryColor }}
          >
            You&apos;re Invited
          </Badge>

          {/* Event Title */}
          <h1
            className="text-2xl font-bold sm:text-3xl"
            style={{ color: visualConfig?.primaryColor }}
          >
            {invitation.celebrant.eventTitle}
          </h1>

          {/* Celebrant Names */}
          <div className="mt-4">
            <p
              className="text-lg sm:text-xl"
              style={{ color: visualConfig?.accentColor }}
            >
              {invitation.celebrant.name}
            </p>
            {invitation.celebrant.coCelebrantName && (
              <p
                className="text-lg sm:text-xl"
                style={{ color: visualConfig?.accentColor }}
              >
                & {invitation.celebrant.coCelebrantName}
              </p>
            )}
          </div>

          {/* Event Date */}
          {eventDate && (
            <p
              className="mt-6 text-lg font-medium"
              style={{ color: visualConfig?.primaryColor }}
            >
              {eventDate}
            </p>
          )}

          {/* Event Type Badges */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {invitation.eventTypes.map((type) => (
              <Badge
                key={type}
                variant="outline"
                className="capitalize"
                style={{ borderColor: visualConfig?.accentColor, color: visualConfig?.primaryColor }}
              >
                {type.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>

          {/* Accept Button */}
          <div className="mt-10">
            <Button
              size="lg"
              onClick={onAccept}
              className="w-full sm:w-auto"
              style={{ backgroundColor: visualConfig?.primaryColor }}
            >
              View Full Invitation
            </Button>
          </div>

          {/* Preview Note */}
          <p
            className="mt-6 text-xs"
            style={{ color: visualConfig?.accentColor }}
          >
            This is a preview of your invitation
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="py-4 text-center"
        style={{ backgroundColor: visualConfig?.secondaryColor }}
      >
        <p
          className="text-xs"
          style={{ color: visualConfig?.accentColor }}
        >
          Powered by Vitations
        </p>
      </footer>
    </div>
  );
}
