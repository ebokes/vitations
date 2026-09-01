'use client';

import * as React from 'react';
import { useAuth } from '@/components/auth-provider';
import { DashboardLayout } from '@/lib/dashboard/layout';
import { DashboardLivestream } from '@/lib/dashboard/livestream';

export default function DashboardLivestreamPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout
      userName={user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer'}
      userEmail={user.email}
      packageTier="ultimate"
    >
      <DashboardLivestream />
    </DashboardLayout>
  );
}