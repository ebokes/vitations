'use client';

import * as React from 'react';
import { InvitationSectionProps } from '../types';

export function GuestMediaSection({ context, className }: InvitationSectionProps) {
  const { invitation, template, entitlements } = context;
  const { visualConfig } = template;

  if (!entitlements.guestUploads) return null;

  return (
    <section
      className={`px-6 py-12 ${className || ''}`}
      style={{ backgroundColor: 'white' }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="text-2xl font-bold"
          style={{ color: visualConfig.primaryColor }}
        >
          Share Your Moments
        </h2>
        <p
          className="mt-4 text-sm"
          style={{ color: visualConfig.accentColor }}
        >
          Upload your photos and videos from the celebration.
        </p>

        <div
          className="mt-8 rounded-xl border-2 border-dashed p-8"
          style={{ borderColor: visualConfig.accentColor }}
        >
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke={visualConfig.accentColor}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p
            className="mt-4 text-sm"
            style={{ color: visualConfig.accentColor }}
          >
            Drag and drop your photos here, or click to select
          </p>
          <p
            className="mt-2 text-xs"
            style={{ color: visualConfig.accentColor }}
          >
            Maximum file size: 5MB
          </p>
          <button
            type="button"
            className="mt-4 rounded-lg px-6 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: visualConfig.primaryColor }}
          >
            Select Files
          </button>
        </div>
      </div>
    </section>
  );
}
