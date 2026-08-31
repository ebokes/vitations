'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Sparkles } from 'lucide-react';

const customInvitationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  eventType: z.string().optional(),
  message: z.string().optional(),
});

type CustomInvitationFormData = z.infer<typeof customInvitationSchema>;

export default function CustomInvitationPage() {
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomInvitationFormData>({
    resolver: zodResolver(customInvitationSchema),
  });

  const onSubmit = async (data: CustomInvitationFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Hero */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              Custom Invitation Request
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
              Have a unique vision? Our team will create a bespoke invitation tailored to your celebration.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          {submitted ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                  <CheckCircle className="h-8 w-8 text-primary-600" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-neutral-900">Request Submitted!</h2>
                <p className="mt-4 text-neutral-600">
                  Thank you for your interest. Our team will contact you within 24 hours to discuss your custom invitation.
                </p>
                <p className="mt-2 text-sm text-neutral-500">
                  Check your email for a confirmation.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-900">
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
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-900">
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

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-900">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="mt-1"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="eventType" className="block text-sm font-medium text-neutral-900">
                      Event Type (Optional)
                    </label>
                    <Input
                      id="eventType"
                      placeholder="e.g., Wedding, Birthday, Anniversary"
                      className="mt-1"
                      {...register('eventType')}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-900">
                      Additional Details (Optional)
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your vision, preferred colors, theme, or any specific requirements..."
                      rows={4}
                      className="mt-1"
                      {...register('message')}
                    />
                  </div>

                  <div className="rounded-lg bg-primary-50 p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600" />
                      <div className="text-sm text-neutral-700">
                        <p className="font-medium">What happens next?</p>
                        <p className="mt-1">
                          Our team will review your request and contact you within 24 hours to discuss your custom invitation design.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
