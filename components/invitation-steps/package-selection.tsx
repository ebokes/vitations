'use client';

import * as React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInvitationForm } from '@/components/invitation-form-provider';
import { formatCurrency } from '@/lib/utils';
import { PACKAGE_PRICES, PACKAGE_FEATURES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const packages = [
  { tier: 'essential' as const, popular: false },
  { tier: 'premium' as const, popular: true },
  { tier: 'ultimate' as const, popular: false },
];

export function PackageSelectionStep() {
  const { formData, updateFormData } = useInvitationForm();
  const [selected, setSelected] = React.useState<string>(formData.packageTier || '');

  const handleSelect = (tier: string) => {
    setSelected(tier);
    updateFormData({ packageTier: tier as 'essential' | 'premium' | 'ultimate' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Select Your Package</h2>
        <p className="mt-1 text-neutral-600">
          Choose the package that best fits your needs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {packages.map((pkg) => (
          <button
            key={pkg.tier}
            type="button"
            onClick={() => handleSelect(pkg.tier)}
            className={cn(
              'relative text-left rounded-xl border-2 p-6 transition-all',
              selected === pkg.tier
                ? 'border-primary-600 bg-primary-50'
                : 'border-neutral-200 bg-white hover:border-neutral-300',
              pkg.popular && selected !== pkg.tier && 'border-primary-200'
            )}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-4">
                <Badge className="bg-primary-600 text-white">Most Popular</Badge>
              </div>
            )}
            <h3 className="text-xl font-bold capitalize text-neutral-900">{pkg.tier}</h3>
            <p className="mt-2 text-2xl font-bold text-primary-600">
              {formatCurrency(PACKAGE_PRICES[pkg.tier])}
            </p>
            <ul className="mt-4 space-y-2">
              {PACKAGE_FEATURES[pkg.tier].slice(0, 5).map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
                  <span className="text-sm text-neutral-700">{feature}</span>
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
}
