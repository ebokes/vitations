'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { DashboardTab, DashboardNavigationItem, DASHBOARD_NAVIGATION } from './types';
import { useDashboardNavigation } from './hooks';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
  packageTier: 'essential' | 'premium' | 'ultimate';
}

export function DashboardLayout({ children, userName, userEmail, packageTier }: DashboardLayoutProps) {
  const pathname = usePathname();
  const navigation = useDashboardNavigation(packageTier);

  const getCurrentTab = (): DashboardTab => {
    const segments = pathname.split('/');
    const tab = segments[segments.length - 1];
    return (tab as DashboardTab) || 'overview';
  };

  const currentTab = getCurrentTab();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigation.map((item) => {
            const Icon = getIcon(item.icon);
            const isActive = currentTab === item.id;
            return (
              <Link
                key={item.id}
                href={`/dashboard/${item.id}`}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors',
                  isActive ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-100',
                  item.disabled && 'opacity-50 pointer-events-none'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="text-[10px] bg-red-500 text-white rounded-full px-1.5 min-w-[16px] text-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="lg:pl-64 pt-16 pb-16 lg:pb-0 min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 bg-white border-r border-neutral-200">
          <div className="flex flex-col h-full">
            {/* Logo/Brand */}
            <div className="p-6 border-b border-neutral-200">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <span className="font-semibold text-xl text-neutral-900">Vitations</span>
              </Link>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-neutral-200">
              <p className="font-medium text-neutral-900 truncate">{userName || 'Customer'}</p>
              <p className="text-sm text-neutral-500 truncate">{userEmail}</p>
              <PackageBadge tier={packageTier} className="mt-2 inline-block" />
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Dashboard navigation">
              {navigation.map((item) => {
                const Icon = getIcon(item.icon);
                const isActive = currentTab === item.id;
                return (
                  <Link
                    key={item.id}
                    href={`/dashboard/${item.id}`}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                      item.disabled && 'opacity-50 pointer-events-none cursor-not-allowed'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto text-[11px] bg-red-500 text-white rounded-full px-2 min-w-[18px] text-center">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                    {item.disabled && (
                      <span className="ml-auto text-[10px] text-neutral-400">Pro</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200">
              <Link
                href="/setup"
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
              >
                <span>Edit Invitation</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:ml-64 p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile top padding */}
      <div className="lg:hidden h-16" />
    </div>
  );
}

/**
 * Package badge component
 */
interface PackageBadgeProps {
  tier: 'essential' | 'premium' | 'ultimate';
  className?: string;
}

export function PackageBadge({ tier, className }: PackageBadgeProps) {
  const configs = {
    essential: 'bg-blue-100 text-blue-700',
    premium: 'bg-purple-100 text-purple-700',
    ultimate: 'bg-gradient-to-r from-gold-500 to-gold-600 text-white',
  };

  const labels = {
    essential: 'Essential',
    premium: 'Premium',
    ultimate: 'Ultimate',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', configs[tier], className)}>
      {labels[tier]}
    </span>
  );
}

/**
 * Get Lucide icon component by name
 */
function getIcon(name: string) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    Mail: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    Users: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    Gift: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    Image: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    Video: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    User: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  };

  return icons[name] || icons.LayoutDashboard;
}