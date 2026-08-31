'use client';

import * as React from 'react';
import { InvitationSectionProps } from '../types';

export function FooterSection({ context, className }: InvitationSectionProps) {
  const { invitation, template, entitlements } = context;
  const { visualConfig } = template;
  const { features } = invitation;

  return (
    <footer
      className={`px-6 py-8 text-center ${className || ''}`}
      style={{ backgroundColor: visualConfig.secondaryColor }}
    >
      {/* Song Link */}
      {entitlements.songLink && features.songLink && (
        <a
          href={features.songLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 inline-block text-sm underline"
          style={{ color: visualConfig.primaryColor }}
        >
          Listen to our song
        </a>
      )}

      {/* Special Instructions */}
      {invitation.features.specialInstructions && (
        <div className="mb-4">
          <p
            className="text-sm"
            style={{ color: visualConfig.accentColor }}
          >
            {invitation.features.specialInstructions}
          </p>
        </div>
      )}

      {/* Dress Code */}
      {invitation.features.dressCode && (
        <div className="mb-4">
          <p
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: visualConfig.accentColor }}
          >
            Dress Code
          </p>
          <p
            className="text-sm"
            style={{ color: visualConfig.primaryColor }}
          >
            {invitation.features.dressCode}
          </p>
        </div>
      )}

      {/* Countdown */}
      {invitation.events[0] && (
        <div className="mb-4">
          <p
            className="text-xs uppercase tracking-wide"
            style={{ color: visualConfig.accentColor }}
          >
            Countdown
          </p>
          <CountdownDisplay
            targetDate={invitation.events[0].date}
            primaryColor={visualConfig.primaryColor}
          />
        </div>
      )}

      {/* Powered By */}
      <p
        className="mt-6 text-xs"
        style={{ color: visualConfig.accentColor }}
      >
        Powered by Vitations
      </p>
    </footer>
  );
}

function CountdownDisplay({
  targetDate,
  primaryColor,
}: {
  targetDate: string;
  primaryColor: string;
}) {
  const [timeLeft, setTimeLeft] = React.useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - Date.now();
      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <p className="mt-2 text-lg font-bold" style={{ color: primaryColor }}>
        The celebration has begun!
      </p>
    );
  }

  return (
    <div className="mt-2 flex justify-center gap-4">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Sec' },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <p
            className="text-2xl font-bold"
            style={{ color: primaryColor }}
          >
            {item.value}
          </p>
          <p className="text-xs text-neutral-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
