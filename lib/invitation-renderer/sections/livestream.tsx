'use client';

import * as React from 'react';
import { InvitationSectionProps } from '../types';
import { LIVESTREAM_PLATFORM_LABELS } from '@/lib/validations/invitation';

export function LivestreamSection({ context, className }: InvitationSectionProps) {
  const { invitation, template, entitlements } = context;
  const { visualConfig } = template;
  const { features } = invitation;

  if (!entitlements.livestream || !features.livestreamUrl) return null;

  return (
    <section
      className={`px-6 py-12 ${className || ''}`}
      style={{ backgroundColor: visualConfig.secondaryColor }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="text-2xl font-bold"
          style={{ color: visualConfig.primaryColor }}
        >
          Join Us Live
        </h2>
        <p
          className="mt-4 text-sm"
          style={{ color: visualConfig.accentColor }}
        >
          Can&apos;t make it in person? Watch our celebration live!
        </p>

        <div
          className="mt-8 rounded-xl p-6"
          style={{ backgroundColor: 'white' }}
        >
          {features.livestreamPlatform && (
            <p
              className="text-sm font-medium"
              style={{ color: visualConfig.accentColor }}
            >
              Streaming on{' '}
              {LIVESTREAM_PLATFORM_LABELS[features.livestreamPlatform] ||
                features.livestreamPlatform}
            </p>
          )}
          <a
            href={features.livestreamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: visualConfig.primaryColor }}
          >
            Join Livestream
          </a>
        </div>
      </div>
    </section>
  );
}
