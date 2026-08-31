'use client';

import * as React from 'react';
import { TemplateRendererProps } from '@/lib/templates/renderer-contract';

/**
 * Base template renderer that applies template visual config.
 * Individual templates can extend this for custom styling.
 */
export function BaseTemplateRenderer({
  template,
  data,
  mode,
}: TemplateRendererProps) {
  const { visualConfig } = template;

  const containerStyle: React.CSSProperties = {
    fontFamily: visualConfig.fontFamily,
    background:
      visualConfig.backgroundType === 'gradient'
        ? visualConfig.backgroundValue
        : visualConfig.backgroundType === 'solid'
        ? visualConfig.backgroundValue
        : undefined,
    color: visualConfig.primaryColor,
    minHeight: mode === 'full' ? '100vh' : undefined,
  };

  return (
    <div style={containerStyle} className="relative overflow-hidden">
      {/* Header */}
      <header
        className="px-6 py-12 text-center"
        style={{ backgroundColor: visualConfig.secondaryColor }}
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
          {data.eventTitle}
        </h1>
        {data.coCelebrantName && (
          <p
            className="mt-2 text-xl"
            style={{ color: visualConfig.accentColor }}
          >
            {data.celebrantName} & {data.coCelebrantName}
          </p>
        )}
        {!data.coCelebrantName && (
          <p
            className="mt-2 text-xl"
            style={{ color: visualConfig.accentColor }}
          >
            {data.celebrantName}
          </p>
        )}
      </header>

      {/* Events */}
      <main className="px-6 py-12">
        {data.events.map((event, i) => (
          <div key={i} className="mb-12 text-center">
            <h2
              className="text-lg font-semibold uppercase tracking-wide"
              style={{ color: visualConfig.accentColor }}
            >
              {event.type.replace(/_/g, ' ')}
            </h2>
            <div className="mt-4 space-y-2">
              <p
                className="text-2xl font-bold"
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
            </div>
          </div>
        ))}
      </main>

      {/* Features Footer */}
      <footer
        className="px-6 py-8 text-center"
        style={{ backgroundColor: visualConfig.secondaryColor }}
      >
        {data.features.songLink && (
          <a
            href={data.features.songLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 inline-block underline"
            style={{ color: visualConfig.primaryColor }}
          >
            Listen to our song
          </a>
        )}
        {data.features.giftRegistryEnabled && (
          <p
            className="text-sm"
            style={{ color: visualConfig.accentColor }}
          >
            Gift registry available
          </p>
        )}
        {data.features.livestreamUrl && (
          <a
            href={data.features.livestreamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm underline"
            style={{ color: visualConfig.primaryColor }}
          >
            Join livestream
          </a>
        )}
        <p
          className="mt-6 text-xs"
          style={{ color: visualConfig.accentColor }}
        >
          Powered by Vitations
        </p>
      </footer>
    </div>
  );
}
