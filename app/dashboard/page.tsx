'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, LogOut, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth-provider';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [signingOut, setSigningOut] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-bold text-neutral-900">Vitations</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">{user.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="mt-1 text-neutral-600">
            Manage your invitations and account settings
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-neutral-900">Create Invitation</h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    Start creating your digital invitation
                  </p>
                </div>
                <Plus className="h-5 w-5 text-primary-600" />
              </div>
              <Link href="/templates" className="mt-4 block">
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div>
                <h3 className="font-semibold text-neutral-900">My Invitations</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  View and manage your invitations
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500 italic">No invitations yet</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div>
                <h3 className="font-semibold text-neutral-900">Account Settings</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Update your profile and preferences
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                {user.user_metadata?.name && (
                  <p className="text-sm text-neutral-500">
                    <span className="font-medium">Name:</span> {user.user_metadata.name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="mt-12 rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-neutral-900">Welcome to Vitations</h2>
          <p className="mt-2 text-neutral-600">
            You&apos;re signed in and ready to create beautiful digital invitations.
            Start by browsing our templates or requesting a custom design.
          </p>
          <div className="mt-4 flex gap-4">
            <Link href="/templates">
              <Button>Browse Templates</Button>
            </Link>
            <Link href="/custom-invitation">
              <Button variant="outline">Custom Design</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
