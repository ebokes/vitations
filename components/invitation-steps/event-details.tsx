'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useInvitationForm } from '@/components/invitation-form-provider';
import { eventDetailsSchema, EventDetailsData, EVENT_TYPE_LABELS } from '@/lib/validations/invitation';

export function EventDetailsStep() {
  const { formData, updateFormData, nextStep } = useInvitationForm();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventDetailsData>({
    resolver: zodResolver(eventDetailsSchema),
    defaultValues: {
      events: formData.eventTypes?.map((type) => {
        const existing = formData.events?.find((e) => e.type === type);
        return {
          type: type as any,
          date: existing?.date || '',
          time: existing?.time || '',
          venue: existing?.venue || '',
          address: existing?.address || '',
          mapUrl: existing?.mapUrl || '',
          description: existing?.description || '',
        };
      }) || [],
      dressCode: formData.features?.dressCode || '',
      specialInstructions: formData.features?.specialInstructions || '',
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'events',
  });

  const onSubmit = (data: EventDetailsData) => {
    updateFormData({
      events: data.events,
      features: {
        ...formData.features,
        dressCode: data.dressCode,
        specialInstructions: data.specialInstructions,
      },
    });
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Event Details</h2>
        <p className="mt-1 text-neutral-600">
          Provide details for each selected event.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-xl border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-neutral-900">
              {EVENT_TYPE_LABELS[field.type] || field.type}
            </h3>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-neutral-900">
                    Event Date *
                  </label>
                  <Input
                    type="date"
                    className="mt-1"
                    {...register(`events.${index}.date`)}
                  />
                  {errors.events?.[index]?.date && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.events[index]?.date?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-900">
                    Event Time
                  </label>
                  <Input
                    type="time"
                    className="mt-1"
                    {...register(`events.${index}.time`)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900">
                  Venue Name
                </label>
                <Input
                  placeholder="e.g., Eko Hotels & Suites"
                  className="mt-1"
                  {...register(`events.${index}.venue`)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900">
                  Venue Address
                </label>
                <Input
                  placeholder="e.g., 14 Adetokunbo Ademola St, Victoria Island, Lagos"
                  className="mt-1"
                  {...register(`events.${index}.address`)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900">
                  Google Maps URL
                </label>
                <Input
                  placeholder="https://maps.google.com/..."
                  className="mt-1"
                  {...register(`events.${index}.mapUrl`)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900">
                  Event Description
                </label>
                <Textarea
                  placeholder="Any additional details about this event..."
                  rows={2}
                  className="mt-1"
                  {...register(`events.${index}.description`)}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">Additional Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-900">
                Dress Code
              </label>
              <Input
                placeholder="e.g., Traditional attire, Black tie, Smart casual"
                className="mt-1"
                {...register('dressCode')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-900">
                Special Instructions
              </label>
              <Textarea
                placeholder="Any special instructions for guests..."
                rows={3}
                className="mt-1"
                {...register('specialInstructions')}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </div>
  );
}
