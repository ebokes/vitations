'use client';

import { Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PackageBadge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { PackageTier } from '@/types/database';

interface PackageCardProps {
  tier: PackageTier;
  name: string;
  description: string;
  price: number;
  features: string[];
  isSelected?: boolean;
  isPopular?: boolean;
  onSelect?: (tier: PackageTier) => void;
  className?: string;
}

export function PackageCard({
  tier,
  name,
  description,
  price,
  features,
  isSelected = false,
  isPopular = false,
  onSelect,
  className,
}: PackageCardProps) {
  return (
    <Card
      className={cn(
        'relative flex flex-col transition-all hover:shadow-lg',
        isSelected && 'ring-2 ring-primary-600',
        isPopular && 'border-primary-600 shadow-md',
        className
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="rounded-full bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-1 text-xs font-semibold text-white shadow-md">
            Most Popular
          </div>
        </div>
      )}

      <CardHeader className={cn('pb-4', isPopular && 'pt-6')}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{name}</CardTitle>
          <PackageBadge tier={tier} />
        </div>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-neutral-900">
              {formatCurrency(price)}
            </span>
          </div>
          <p className="text-sm text-neutral-600">One-time payment</p>
        </div>

        {/* Features */}
        <ul className="mb-6 flex-1 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                <Check className="h-3 w-3 text-primary-600" />
              </div>
              <span className="text-sm text-neutral-700">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {onSelect && (
          <Button
            variant={isSelected ? 'secondary' : tier === 'ultimate' ? 'gold' : 'primary'}
            size="lg"
            className="w-full"
            onClick={() => onSelect(tier)}
          >
            {isSelected ? (
              <>
                <Check className="h-4 w-4" />
                Selected
              </>
            ) : (
              'Select Package'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Package comparison feature list
interface PackageFeature {
  name: string;
  essential: boolean;
  premium: boolean;
  ultimate: boolean;
}

interface PackageComparisonProps {
  features: PackageFeature[];
}

export function PackageComparison({ features }: PackageComparisonProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-4 pr-4 text-left font-semibold">Feature</th>
            <th className="px-4 py-4 text-center font-semibold">Essential</th>
            <th className="px-4 py-4 text-center font-semibold">Premium</th>
            <th className="px-4 py-4 text-center font-semibold">Ultimate</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className="border-b last:border-0">
              <td className="py-3 pr-4 text-sm">{feature.name}</td>
              <td className="px-4 py-3 text-center">
                {feature.essential ? (
                  <Check className="inline h-5 w-5 text-green-600" />
                ) : (
                  <X className="inline h-5 w-5 text-neutral-300" />
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {feature.premium ? (
                  <Check className="inline h-5 w-5 text-green-600" />
                ) : (
                  <X className="inline h-5 w-5 text-neutral-300" />
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {feature.ultimate ? (
                  <Check className="inline h-5 w-5 text-green-600" />
                ) : (
                  <X className="inline h-5 w-5 text-neutral-300" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
