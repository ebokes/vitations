'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { InvitationData } from '@/lib/invitation-renderer/types';
import { getTemplateById } from '@/lib/templates';

const guestFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .max(15, 'Phone number is too long'),
});

type GuestFormData = z.infer<typeof guestFormSchema>;

interface GuestFormProps {
  invitation: InvitationData;
  onSubmit: (name: string, phone: string) => Promise<void>;
}

export function GuestForm({ invitation, onSubmit }: GuestFormProps) {
  const template = getTemplateById(invitation.templateId);
  const { visualConfig } = template || {};

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
  });

  const handleFormSubmit = async (data: GuestFormData) => {
    await onSubmit(data.name, data.phone);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: visualConfig?.fontFamily,
        background: visualConfig?.backgroundType === 'gradient'
          ? visualConfig.backgroundValue
          : visualConfig?.backgroundValue || '#faf8f5',
      }}
    >
      {/* Header */}
      <header
        className="py-4 text-center"
        style={{ backgroundColor: visualConfig?.secondaryColor }}
      >
        <Sparkles
          className="mx-auto h-8 w-8"
          style={{ color: visualConfig?.primaryColor }}
        />
      </header>

      {/* Form Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Invitation Summary */}
          <div className="mb-8 text-center">
            <Badge
              variant="secondary"
              className="mb-4"
              style={{ backgroundColor: visualConfig?.secondaryColor }}
            >
              RSVP
            </Badge>
            <h1
              className="text-2xl font-bold"
              style={{ color: visualConfig?.primaryColor }}
            >
              {invitation.celebrant.eventTitle}
            </h1>
            <p
              className="mt-2 text-sm"
              style={{ color: visualConfig?.accentColor }}
            >
              Please confirm your attendance
            </p>
          </div>

          {/* Guest Form */}
          <div
            className="rounded-xl p-6 shadow-lg"
            style={{ backgroundColor: 'white' }}
          >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium"
                  style={{ color: visualConfig?.primaryColor }}
                >
                  Your Name *
                </label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  className="mt-1"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium"
                  style={{ color: visualConfig?.primaryColor }}
                >
                  Phone Number *
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., 08012345678"
                  className="mt-1"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-6"
                disabled={isSubmitting}
                style={{ backgroundColor: visualConfig?.primaryColor }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Accept Invitation'
                )}
              </Button>
            </form>

            <p
              className="mt-4 text-center text-xs"
              style={{ color: visualConfig?.accentColor }}
            >
              Guests do not need to create an account
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="py-4 text-center"
        style={{ backgroundColor: visualConfig?.secondaryColor }}
      >
        <p
          className="text-xs"
          style={{ color: visualConfig?.accentColor }}
        >
          Powered by Vitations
        </p>
      </footer>
    </div>
  );
}
