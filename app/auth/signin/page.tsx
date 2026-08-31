'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth-provider';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setError(null);
    const result = await signIn(data.email, data.password);
    if (result.error) {
      setError(result.error);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-neutral-900">Vitations</span>
            </Link>
            <h1 className="mt-6 text-2xl font-bold text-neutral-900">Welcome back</h1>
            <p className="mt-2 text-neutral-600">
              Sign in to manage your invitations
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-900">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="mt-1"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-primary-600 hover:text-primary-700">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
