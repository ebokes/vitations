'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        'transition-opacity',
        prefersReducedMotion ? 'opacity-100' : 'animate-fade-in',
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
    >
      {children}
    </div>
  );
}

interface SlideUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}

export function SlideUp({
  children,
  className,
  delay = 0,
  distance = 20,
}: SlideUpProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        'transition-all',
        prefersReducedMotion ? 'opacity-100 translate-y-0' : 'animate-slide-up',
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
        '--slide-distance': `${distance}px`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

interface ScaleInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScaleIn({ children, className, delay = 0 }: ScaleInProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        'transition-transform',
        prefersReducedMotion ? 'opacity-100 scale-100' : 'animate-scale-in',
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
    >
      {children}
    </div>
  );
}

interface AnimatePresenceWrapperProps {
  children: React.ReactNode;
  show: boolean;
}

export function AnimatePresenceWrapper({ children, show }: AnimatePresenceWrapperProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        'transition-opacity',
        show ? 'opacity-100' : 'opacity-0',
        prefersReducedMotion && 'transition-none'
      )}
    >
      {children}
    </div>
  );
}
