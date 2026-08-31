'use client';

import * as React from 'react';
import { InvitationSectionProps } from '../types';

export function HeroSection({ context, className }: InvitationSectionProps) {
  const { invitation, template } = context;
  const { visualConfig } = template;
  const { celebrant, events } = invitation;

  const firstEvent = events[0];
  const eventDate = firstEvent
    ? new Date(firstEvent.date).toLocaleDateString('en-NG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <section
      className={`px-6 py-16 text-center sm:py-24 ${className || ''}`}
      style={{
        background: visualConfig.backgroundType === 'gradient'
          ? visualConfig.backgroundValue
          : visualConfig.backgroundValue,
      }}
    >
      <p
        className="text-sm uppercase tracking-widest"
        style={{ color: visualConfig.accentColor }}
      >
        You&apos;re Invited
      </p>
      <h1
        className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl"
        style={{ color: visualConfig.primaryColor }}
      >
        {celebrant.eventTitle}
      </h1>
      {celebrant.coCelebrantName && (
        <p
          className="mt-4 text-xl sm:text-2xl"
          style={{ color: visualConfig.accentColor }}
        >
          {celebrant.name} & {celebrant.coCelebrantName}
        </p>
      )}
      {!celebrant.coCelebrantName && (
        <p
          className="mt-4 text-xl sm:text-2xl"
          style={{ color: visualConfig.accentColor }}
        >
          {celebrant.name}
        </p>
      )}
      {eventDate && (
        <p
          className="mt-6 text-lg"
          style={{ color: visualConfig.primaryColor }}
        >
          {eventDate}
        </p>
      )}
    </section>
  );
}
