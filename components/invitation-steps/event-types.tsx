'use client';

import * as React from 'react';
import { Heart, Music, PartyPopper, GlassWater } from 'lucide-react';
import { useInvitationForm } from '@/components/invitation-form-provider';
import { cn } from '@/lib/utils';

const eventTypes = [
  {
    id: 'traditional_wedding' as const,
    label: 'Traditional Wedding',
    description: 'Traditional Nigerian wedding ceremony',
    icon: Heart,
  },
  {
    id: 'white_wedding' as const,
    label: 'White Wedding',
    description: 'Church or civil wedding ceremony',
    icon: Heart,
  },
  {
    id: 'reception' as const,
    label: 'Reception',
    description: 'Wedding reception celebration',
    icon: PartyPopper,
  },
  {
    id: 'after_party' as const,
    label: 'After Party',
    description: 'Post-reception celebration',
    icon: GlassWater,
  },
];

export function EventTypesStep() {
  const { formData, updateFormData } = useInvitationForm();
  const [selected, setSelected] = React.useState<string[]>(formData.eventTypes || []);

  const toggleType = (id: string) => {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id];
      updateFormData({ eventTypes: next as any });
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Select Event Types</h2>
        <p className="mt-1 text-neutral-600">
          Choose which events to include in your invitation. Only selected events will appear.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {eventTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => toggleType(type.id)}
            className={cn(
              'flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all',
              selected.includes(type.id)
                ? 'border-primary-600 bg-primary-50'
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            )}
          >
            <div
              className={cn(
                'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
                selected.includes(type.id) ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600'
              )}
            >
              <type.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">{type.label}</h3>
              <p className="text-sm text-neutral-600">{type.description}</p>
            </div>
          </button>
        ))}
      </div>

      {selected.length === 0 && (
        <p className="text-sm text-neutral-500 italic">
          Please select at least one event type to continue.
        </p>
      )}
    </div>
  );
}
