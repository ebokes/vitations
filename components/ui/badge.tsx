import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { PackageTier } from '@/types/database';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-neutral-900 text-white',
        secondary:
          'border-transparent bg-neutral-100 text-neutral-900',
        outline: 'text-neutral-900',
        success:
          'border-transparent bg-green-100 text-green-800',
        warning:
          'border-transparent bg-yellow-100 text-yellow-800',
        danger:
          'border-transparent bg-red-100 text-red-800',
        essential:
          'border-transparent bg-blue-100 text-blue-800',
        premium:
          'border-transparent bg-purple-100 text-purple-800',
        ultimate:
          'border-transparent bg-gradient-to-r from-gold-500 to-gold-600 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// Package-specific badge component
export function PackageBadge({ tier }: { tier: PackageTier }) {
  const variants: Record<PackageTier, { variant: BadgeProps['variant']; label: string }> = {
    essential: { variant: 'essential', label: 'Essential' },
    premium: { variant: 'premium', label: 'Premium' },
    ultimate: { variant: 'ultimate', label: 'Ultimate' },
  };

  const config = variants[tier];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export { Badge, badgeVariants };
