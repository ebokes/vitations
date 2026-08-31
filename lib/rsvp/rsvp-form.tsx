'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitRSVP, getRSVPByPhone } from '@/lib/rsvp/store';
import { RSVPStatus } from '@/lib/rsvp/types';
import { cn } from '@/lib/utils';

const rsvpFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .max(15, 'Phone number is too long'),
  status: z.enum(['attending', 'not_attending', 'maybe'], {
    required_error: 'Please select your RSVP status',
  }),
  attendeeCount: z.number().min(1).max(20).optional(),
  message: z.string().optional(),
});

type RSVPFormData = z.infer<typeof rsvpFormSchema>;

interface RSVPFormProps {
  invitationId: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  onSuccess?: () => void;
}

export function RSVPForm({
  invitationId,
  primaryColor = '#b88360',
  secondaryColor = '#f5f0ea',
  accentColor = '#a96a44',
  onSuccess,
}: RSVPFormProps) {
  const [submitted, setSubmitted] = React.useState(false);
  const [updated, setUpdated] = React.useState(false);
  const [initialData, setInitialData] = React.useState<{
    name: string;
    phone: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      status: undefined,
      attendeeCount: 1,
    },
  });

  const watchStatus = watch('status');

  // Check for existing RSVP on mount
  React.useEffect(() => {
    // This would be done server-side in production
    // For demo, we check local storage
    const savedPhone = localStorage?.getItem(`rsvp_phone_${invitationId}`);
    if (savedPhone) {
      const existing = getRSVPByPhone(invitationId, savedPhone);
      if (existing) {
        setInitialData({
          name: existing.guestName,
          phone: existing.guestPhone,
        });
      }
    }
  }, [invitationId]);

  const onSubmit = async (data: RSVPFormData) => {
    const result = submitRSVP({
      invitationId,
      guestName: data.name,
      guestPhone: data.phone,
      status: data.status as RSVPStatus,
      attendeeCount: data.attendeeCount,
      message: data.message,
    });

    if (result.success) {
      // Save phone to local storage for return visits
      localStorage?.setItem(`rsvp_phone_${invitationId}`, data.phone);
      setUpdated(result.updated || false);
      setSubmitted(true);
      onSuccess?.();
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl p-6 text-center" style={{ backgroundColor: 'white' }}>
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: secondaryColor }}
        >
          <CheckCircle className="h-8 w-8" style={{ color: primaryColor }} />
        </div>
        <h3
          className="mt-4 text-xl font-bold"
          style={{ color: primaryColor }}
        >
          {updated ? 'RSVP Updated!' : 'Thank You!'}
        </h3>
        <p
          className="mt-2 text-sm"
          style={{ color: accentColor }}
        >
          {watchStatus === 'attending'
            ? "We look forward to celebrating with you!"
            : watchStatus === 'maybe'
            ? "We hope you can make it!"
            : "Thank you for letting us know. You'll be missed!"}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl p-6 shadow-lg"
      style={{ backgroundColor: 'white' }}
    >
      <h3
        className="text-lg font-bold"
        style={{ color: primaryColor }}
      >
        RSVP
      </h3>
      <p
        className="mt-1 text-sm"
        style={{ color: accentColor }}
      >
        Please respond by the event date
      </p>

      <div className="mt-6 space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="rsvp-name"
            className="block text-sm font-medium"
            style={{ color: primaryColor }}
          >
            Your Name *
          </label>
          <Input
            id="rsvp-name"
            placeholder="Enter your full name"
            className="mt-1"
            defaultValue={initialData?.name}
            {...register('name')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="rsvp-phone"
            className="block text-sm font-medium"
            style={{ color: primaryColor }}
          >
            Phone Number *
          </label>
          <Input
            id="rsvp-phone"
            type="tel"
            placeholder="e.g., 08012345678"
            className="mt-1"
            defaultValue={initialData?.phone}
            {...register('phone')}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Status Selection */}
        <div>
          <label
            className="block text-sm font-medium"
            style={{ color: primaryColor }}
          >
            Will you attend? *
          </label>
          <div className="mt-2 flex flex-wrap gap-3">
            {[
              { value: 'attending', label: 'Accept with Pleasure' },
              { value: 'not_attending', label: 'Decline with Regret' },
              { value: 'maybe', label: 'Maybe' },
            ].map((option) => (
              <label
                key={option.value}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 transition-colors',
                  watchStatus === option.value
                    ? 'border-transparent text-white'
                    : 'border-neutral-200 hover:border-neutral-300'
                )}
                style={{
                  backgroundColor:
                    watchStatus === option.value ? primaryColor : 'transparent',
                  color: watchStatus === option.value ? 'white' : primaryColor,
                }}
              >
                <input
                  type="radio"
                  value={option.value}
                  className="sr-only"
                  {...register('status')}
                />
                {option.label}
              </label>
            ))}
          </div>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        {/* Attendee Count (only for attending) */}
        {watchStatus === 'attending' && (
          <div>
            <label
              htmlFor="attendee-count"
              className="block text-sm font-medium"
              style={{ color: primaryColor }}
            >
              Number of Attendees (including yourself)
            </label>
            <Input
              id="attendee-count"
              type="number"
              min={1}
              max={20}
              className="mt-1 w-24"
              {...register('attendeeCount', { valueAsNumber: true })}
            />
            {errors.attendeeCount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.attendeeCount.message}
              </p>
            )}
          </div>
        )}

        {/* Message */}
        <div>
          <label
            htmlFor="rsvp-message"
            className="block text-sm font-medium"
            style={{ color: primaryColor }}
          >
            Message (Optional)
          </label>
          <Textarea
            id="rsvp-message"
            placeholder="Add a message for the hosts..."
            rows={3}
            className="mt-1"
            {...register('message')}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
          style={{ backgroundColor: primaryColor }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit RSVP'
          )}
        </Button>
      </div>
    </form>
  );
}
