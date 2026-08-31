'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInvitationForm } from '@/components/invitation-form-provider';
import { celebrantInfoSchema, CelebrantInfoData } from '@/lib/validations/invitation';

export function CelebrantInfoStep() {
  const { formData, updateFormData, nextStep } = useInvitationForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CelebrantInfoData>({
    resolver: zodResolver(celebrantInfoSchema),
    defaultValues: {
      celebrantName: formData.celebrant?.celebrantName || '',
      coCelebrantName: formData.celebrant?.coCelebrantName || '',
      eventTitle: formData.celebrant?.eventTitle || '',
      contactName: formData.celebrant?.contactName || '',
      contactEmail: formData.celebrant?.contactEmail || '',
      contactPhone: formData.celebrant?.contactPhone || '',
    },
  });

  const onSubmit = (data: CelebrantInfoData) => {
    updateFormData({ celebrant: data });
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Celebrant & Contact Information</h2>
        <p className="mt-1 text-neutral-600">
          Enter the details for your invitation.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="celebrantName" className="block text-sm font-medium text-neutral-900">
            Celebrant Name *
          </label>
          <Input
            id="celebrantName"
            placeholder="e.g., Adaeze Okonkwo"
            className="mt-1"
            {...register('celebrantName')}
          />
          {errors.celebrantName && (
            <p className="mt-1 text-sm text-red-600">{errors.celebrantName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="coCelebrantName" className="block text-sm font-medium text-neutral-900">
            Co-Celebrant Name (Optional)
          </label>
          <Input
            id="coCelebrantName"
            placeholder="e.g., Emeka Nwosu"
            className="mt-1"
            {...register('coCelebrantName')}
          />
        </div>

        <div>
          <label htmlFor="eventTitle" className="block text-sm font-medium text-neutral-900">
            Event Title *
          </label>
          <Input
            id="eventTitle"
            placeholder="e.g., Adaeze & Emeka's Wedding"
            className="mt-1"
            {...register('eventTitle')}
          />
          {errors.eventTitle && (
            <p className="mt-1 text-sm text-red-600">{errors.eventTitle.message}</p>
          )}
        </div>

        <div className="border-t border-neutral-200 pt-4">
          <h3 className="text-sm font-medium text-neutral-900">Contact Person</h3>
          <p className="text-xs text-neutral-500">This person will receive updates about the invitation.</p>
        </div>

        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-neutral-900">
            Contact Name *
          </label>
          <Input
            id="contactName"
            placeholder="Enter contact name"
            className="mt-1"
            {...register('contactName')}
          />
          {errors.contactName && (
            <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-neutral-900">
              Contact Email *
            </label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="email@example.com"
              className="mt-1"
              {...register('contactEmail')}
            />
            {errors.contactEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-neutral-900">
              Contact Phone *
            </label>
            <Input
              id="contactPhone"
              type="tel"
              placeholder="e.g., 08012345678"
              className="mt-1"
              {...register('contactPhone')}
            />
            {errors.contactPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
