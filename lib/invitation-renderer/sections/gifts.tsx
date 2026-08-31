'use client';

import * as React from 'react';
import { InvitationSectionProps } from '../types';

export function GiftSection({ context, className }: InvitationSectionProps) {
  const { invitation, template, entitlements } = context;
  const { visualConfig } = template;
  const { features } = invitation;

  if (!entitlements.giftRegistry && !entitlements.cashGifts) return null;

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
          Gift Registry
        </h2>
        <p
          className="mt-4 text-sm"
          style={{ color: visualConfig.accentColor }}
        >
          Your presence is the greatest gift. However, if you wish to honor us with a gift,
          here are some options.
        </p>

        <div className="mt-8 space-y-6">
          {entitlements.cashGifts && features.cashGiftEnabled && (
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: 'white' }}
            >
              <h3
                className="font-semibold"
                style={{ color: visualConfig.primaryColor }}
              >
                Cash Gift
              </h3>
              <p
                className="mt-2 text-sm"
                style={{ color: visualConfig.accentColor }}
              >
                You can send your gift via bank transfer or mobile payment.
              </p>
              <div
                className="mt-4 rounded-lg p-4"
                style={{ backgroundColor: visualConfig.secondaryColor }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: visualConfig.primaryColor }}
                >
                  Account Details
                </p>
                <p
                  className="mt-1 text-sm"
                  style={{ color: visualConfig.accentColor }}
                >
                  Will be provided upon request
                </p>
              </div>
            </div>
          )}

          {entitlements.giftRegistry && features.giftRegistryEnabled && (
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: 'white' }}
            >
              <h3
                className="font-semibold"
                style={{ color: visualConfig.primaryColor }}
              >
                Gift List
              </h3>
              <p
                className="mt-2 text-sm"
                style={{ color: visualConfig.accentColor }}
              >
                Select a gift from our registry below.
              </p>
              <div
                className="mt-4 rounded-lg p-4"
                style={{ backgroundColor: visualConfig.secondaryColor }}
              >
                <p
                  className="text-sm italic"
                  style={{ color: visualConfig.accentColor }}
                >
                  Gift registry coming soon...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
