'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });
    if (error) {
      setError(error.message);
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
            <h1 className="mt-6 text-2xl font-bold text-neutral-900">Password updated</h1>
            <p className="mt-4 text-neutral-600">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
            <Link href="/auth/signin" className="mt-6 inline-block">
              <Button className="w-full">
                Sign In
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
            <h1 className="mt-6 text-2xl font-bold text-neutral-900">Set new password</h1>
            <p className="mt-2 text-neutral-600">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-900">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                className="mt-1"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-900">
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                className="mt-1"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating password...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
