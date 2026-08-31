'use client';

import * as React from 'react';
import { InvitationSectionProps } from '../types';
import { EVENT_TYPE_LABELS } from '@/lib/validations/invitation';

export function EventsSection({ context, className }: InvitationSectionProps) {
  const { invitation, template, entitlements } = context;
  const { visualConfig } = template;
  const { events } = invitation;

  if (events.length === 0) return null;

  return (
    <section
      className={`px-6 py-12 ${className || ''}`}
      style={{ backgroundColor: visualConfig.secondaryColor }}
    >
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-center text-2xl font-bold"
          style={{ color: visualConfig.primaryColor }}
        >
          Event Details
        </h2>
        <div className="mt-8 space-y-8">
          {events.map((event, i) => (
            <div
              key={i}
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: 'white' }}
            >
              <h3
                className="text-lg font-semibold uppercase tracking-wide"
                style={{ color: visualConfig.accentColor }}
              >
                {EVENT_TYPE_LABELS[event.type] || event.type.replace(/_/g, ' ')}
              </h3>
              <div className="mt-4 space-y-2">
                <p
                  className="text-xl font-bold"
                  style={{ color: visualConfig.primaryColor }}
                >
                  {new Date(event.date).toLocaleDateString('en-NG', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                {event.time && (
                  <p
                    className="text-lg"
                    style={{ color: visualConfig.accentColor }}
                  >
                    {event.time}
                  </p>
                )}
                {event.venue && (
                  <p
                    className="text-lg font-medium"
                    style={{ color: visualConfig.primaryColor }}
                  >
                    {event.venue}
                  </p>
                )}
                {event.address && (
                  <p
                    className="text-sm"
                    style={{ color: visualConfig.accentColor }}
                  >
                    {event.address}
                  </p>
                )}
                {event.description && (
                  <p
                    className="mx-auto mt-4 max-w-md text-sm"
                    style={{ color: visualConfig.accentColor }}
                  >
                    {event.description}
                  </p>
                )}
                {entitlements.mapIntegration && event.mapUrl && (
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm underline"
                    style={{ color: visualConfig.primaryColor }}
                  >
                    View on Map
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
