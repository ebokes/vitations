'use client';

import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  name: string;
  review: string;
  eventType?: string;
  imageUrl?: string;
  socialHandle?: string;
  className?: string;
}

export function ReviewCard({
  name,
  review,
  eventType,
  imageUrl,
  socialHandle,
  className,
}: ReviewCardProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardContent className="p-6">
        {/* Rating */}
        <div className="mb-4 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-gold-500 text-gold-500"
            />
          ))}
        </div>

        {/* Review */}
        <blockquote className="mb-4 text-neutral-700">
          &ldquo;{review}&rdquo;
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-3">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700">
              {name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-semibold text-neutral-900">{name}</p>
            {eventType && (
              <p className="text-sm text-neutral-600">{eventType}</p>
            )}
            {socialHandle && (
              <p className="text-xs text-neutral-500">{socialHandle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Demo review notice
export function DemoReviewNotice() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <p className="text-xs text-neutral-600">
        <strong>Note:</strong> The reviews shown are demonstration examples for preview purposes only.
      </p>
    </div>
  );
}
