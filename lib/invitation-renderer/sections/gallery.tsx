'use client';

import * as React from 'react';
import { InvitationSectionProps } from '../types';

export function GallerySection({ context, className }: InvitationSectionProps) {
  const { invitation, template, entitlements } = context;
  const { visualConfig } = template;
  const { features } = invitation;

  if (!entitlements.gallery) return null;

  const photos = features.gallery || [];
  const stories = features.stories || [];

  if (photos.length === 0 && stories.length === 0) return null;

  return (
    <section
      className={`px-6 py-12 ${className || ''}`}
      style={{ backgroundColor: 'white' }}
    >
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-center text-2xl font-bold"
          style={{ color: visualConfig.primaryColor }}
        >
          Gallery
        </h2>

        {/* Photos Grid */}
        {photos.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {photos.map((photo, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg overflow-hidden"
                style={{ backgroundColor: visualConfig.secondaryColor }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={`Gallery photo ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* Stories Timeline */}
        {stories.length > 0 && (
          <div className="mt-12">
            <h3
              className="text-center text-lg font-semibold"
              style={{ color: visualConfig.primaryColor }}
            >
              Our Journey
            </h3>
            <div className="mt-6 space-y-6">
              {stories.map((story, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4"
                >
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: visualConfig.primaryColor }}
                  >
                    {i + 1}
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: visualConfig.accentColor }}
                  >
                    {story}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
