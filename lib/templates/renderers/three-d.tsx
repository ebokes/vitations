'use client';

import * as React from 'react';
import { TemplateRendererProps } from '@/lib/templates/renderer-contract';

/**
 * 3D template renderer with CSS 3D transforms.
 * For production, this could be replaced with Three.js or React Three Fiber.
 */
export function Template3DRenderer({
  template,
  data,
  mode,
}: TemplateRendererProps) {
  const { visualConfig } = template;
  const [isHovered, setIsHovered] = React.useState(false);

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
    perspective: '1000px',
  };

  const cardStyle: React.CSSProperties = {
    transformStyle: 'preserve-3d',
    transform: isHovered
      ? 'rotateY(5deg) rotateX(5deg)'
      : 'rotateY(0deg) rotateX(0deg)',
    transition: 'transform 0.5s ease',
  };

  return (
    <div style={containerStyle} className="relative overflow-hidden">
      {/* 3D Card Container */}
      <div
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="mx-auto max-w-2xl"
      >
        {/* Header */}
        <header
          className="rounded-t-2xl px-6 py-12 text-center"
          style={{
            backgroundColor: visualConfig.secondaryColor,
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
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
        <main
          className="px-6 py-12"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          }}
        >
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
              </div>
            </div>
          ))}
        </main>

        {/* Footer */}
        <footer
          className="rounded-b-2xl px-6 py-8 text-center"
          style={{
            backgroundColor: visualConfig.secondaryColor,
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
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
    </div>
  );
}
