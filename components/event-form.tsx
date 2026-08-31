'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, type EventFormData } from '@/lib/validations';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  isLoading?: boolean;
}

export function EventForm({ onSubmit, isLoading = false }: EventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      celebrantName: '',
      eventTitle: '',
      eventDate: '',
      eventTime: '',
      eventVenue: '',
      eventDescription: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Input
        label="Celebrant Name"
        placeholder="Enter celebrant name"
        required
        error={errors.celebrantName?.message}
        {...register('celebrantName')}
      />

      <Input
        label="Event Title"
        placeholder="Enter event title"
        required
        error={errors.eventTitle?.message}
        {...register('eventTitle')}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Event Date"
          type="date"
          required
          error={errors.eventDate?.message}
          {...register('eventDate')}
        />

        <Input
          label="Event Time"
          type="time"
          error={errors.eventTime?.message}
          {...register('eventTime')}
        />
      </div>

      <Input
        label="Event Venue"
        placeholder="Enter event venue"
        error={errors.eventVenue?.message}
        {...register('eventVenue')}
      />

      <Textarea
        label="Event Description"
        placeholder="Enter event description (optional)"
        error={errors.eventDescription?.message}
        {...register('eventDescription')}
      />

      <Button
        type="submit"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Save Event Details
      </Button>
    </form>
  );
}
