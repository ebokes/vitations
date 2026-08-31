'use client';

import * as React from 'react';
import { InvitationSectionProps } from '../types';

export function RSVPSection({ context, className }: InvitationSectionProps) {
  const { invitation, template } = context;
  const { visualConfig } = template;
  const [submitted, setSubmitted] = React.useState(false);
  const [name, setName] = React.useState('');
  const [attending, setAttending] = React.useState<'yes' | 'no' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section
        className={`px-6 py-12 ${className || ''}`}
        style={{ backgroundColor: 'white' }}
      >
        <div className="mx-auto max-w-md text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: visualConfig.secondaryColor }}
          >
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke={visualConfig.primaryColor}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2
            className="mt-6 text-2xl font-bold"
            style={{ color: visualConfig.primaryColor }}
          >
            Thank You!
          </h2>
          <p
            className="mt-4 text-sm"
            style={{ color: visualConfig.accentColor }}
          >
            Your RSVP has been recorded. We look forward to celebrating with you!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`px-6 py-12 ${className || ''}`}
      style={{ backgroundColor: 'white' }}
    >
      <div className="mx-auto max-w-md text-center">
        <h2
          className="text-2xl font-bold"
          style={{ color: visualConfig.primaryColor }}
        >
          RSVP
        </h2>
        <p
          className="mt-2 text-sm"
          style={{ color: visualConfig.accentColor }}
        >
          Please respond by the event date.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border px-4 py-3 text-sm"
              style={{
                borderColor: visualConfig.accentColor,
                color: visualConfig.primaryColor,
              }}
            />
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setAttending('yes')}
              className="rounded-lg px-6 py-3 text-sm font-medium transition-colors"
              style={{
                backgroundColor:
                  attending === 'yes' ? visualConfig.primaryColor : visualConfig.secondaryColor,
                color: attending === 'yes' ? 'white' : visualConfig.primaryColor,
              }}
            >
              Accept with Pleasure
            </button>
            <button
              type="button"
              onClick={() => setAttending('no')}
              className="rounded-lg px-6 py-3 text-sm font-medium transition-colors"
              style={{
                backgroundColor:
                  attending === 'no' ? visualConfig.primaryColor : visualConfig.secondaryColor,
                color: attending === 'no' ? 'white' : visualConfig.primaryColor,
              }}
            >
              Decline with Regret
            </button>
          </div>

          <button
            type="submit"
            disabled={!name || !attending}
            className="w-full rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: visualConfig.primaryColor }}
          >
            Send RSVP
          </button>
        </form>
      </div>
    </section>
  );
}
