'use client';

import * as React from 'react';
import { InvitationSectionProps } from '../types';

export function StorySection({ context, className }: InvitationSectionProps) {
  const { template } = context;
  const { visualConfig } = template;

  // Story section placeholder - can be populated with actual story data
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
          Our Story
        </h2>
        <p
          className="mt-4 text-neutral-600"
          style={{ color: visualConfig.accentColor }}
        >
          Every love story is beautiful, but ours is our favorite.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: visualConfig.secondaryColor }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: visualConfig.accentColor }}
            >
              How We Met
            </p>
            <p
              className="mt-2 text-sm"
              style={{ color: visualConfig.primaryColor }}
            >
              A beautiful journey began...
            </p>
          </div>
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: visualConfig.secondaryColor }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: visualConfig.accentColor }}
            >
              The Proposal
            </p>
            <p
              className="mt-2 text-sm"
              style={{ color: visualConfig.primaryColor }}
            >
              The moment that changed everything...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
