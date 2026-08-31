'use client';

import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-200 bg-white p-6 shadow-sm',
        className
      )}
    >
      <Sparkles className="mx-auto mb-4 h-8 w-8 text-primary-600" />
      <h3 className="mb-2 text-h4 font-bold">{title}</h3>
      <p className="text-sm text-neutral-600">{description}</p>
    </div>
  );
}
