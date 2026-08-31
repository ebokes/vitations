'use client';

import * as React from 'react';
import { InvitationSectionProps } from '../types';

export function CelebrantInfoSection({ context, className }: InvitationSectionProps) {
  const { invitation, template } = context;
  const { visualConfig } = template;
  const { celebrant } = invitation;

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
          {celebrant.eventTitle}
        </h2>
        <div className="mt-6 space-y-4">
          <div>
            <p
              className="text-lg font-medium"
              style={{ color: visualConfig.primaryColor }}
            >
              {celebrant.name}
            </p>
            {celebrant.coCelebrantName && (
              <p
                className="text-lg"
                style={{ color: visualConfig.accentColor }}
              >
                & {celebrant.coCelebrantName}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
