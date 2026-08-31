'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth-provider';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    const result = await resetPassword(data.email);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <CheckCircle className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-neutral-900">Check your email</h1>
            <p className="mt-4 text-neutral-600">
              We&apos;ve sent a password reset link to your email address. Please follow the instructions to reset your password.
            </p>
            <Link href="/auth/signin" className="mt-6 inline-block">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-neutral-900">Vitations</span>
            </Link>
            <h1 className="mt-6 text-2xl font-bold text-neutral-900">Reset your password</h1>
            <p className="mt-2 text-neutral-600">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-900">
                Email Address
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Remember your password?{' '}
            <Link href="/auth/signin" className="font-medium text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
