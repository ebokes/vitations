'use client';

import * as React from 'react';
import { TemplateRendererProps } from '@/lib/templates/renderer-contract';

/**
 * Animated template renderer with CSS animations.
 * Extends base renderer with motion effects.
 */
export function AnimatedTemplateRenderer({
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
      {/* Animated Header */}
      <header
        className="animate-fade-in px-6 py-12 text-center"
        style={{ backgroundColor: visualConfig.secondaryColor }}
      >
        <p
          className="animate-slide-up text-sm uppercase tracking-widest"
          style={{ color: visualConfig.accentColor, animationDelay: '0.1s' }}
        >
          You&apos;re Invited
        </p>
        <h1
          className="animate-slide-up mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl"
          style={{ color: visualConfig.primaryColor, animationDelay: '0.2s' }}
        >
          {data.eventTitle}
        </h1>
        {data.coCelebrantName && (
          <p
            className="animate-slide-up mt-2 text-xl"
            style={{ color: visualConfig.accentColor, animationDelay: '0.3s' }}
          >
            {data.celebrantName} & {data.coCelebrantName}
          </p>
        )}
        {!data.coCelebrantName && (
          <p
            className="animate-slide-up mt-2 text-xl"
            style={{ color: visualConfig.accentColor, animationDelay: '0.3s' }}
          >
            {data.celebrantName}
          </p>
        )}
      </header>

      {/* Events with staggered animation */}
      <main className="px-6 py-12">
        {data.events.map((event, i) => (
          <div
            key={i}
            className="mb-12 animate-fade-in text-center"
            style={{ animationDelay: `${0.4 + i * 0.1}s` }}
          >
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
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer
        className="animate-fade-in px-6 py-8 text-center"
        style={{
          backgroundColor: visualConfig.secondaryColor,
          animationDelay: '0.6s',
        }}
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
