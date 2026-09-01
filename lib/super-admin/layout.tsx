'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SuperAdminTab, SUPER_ADMIN_NAVIGATION } from './types';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

export function SuperAdminLayout({ children, userName, userEmail }: SuperAdminLayoutProps) {
  const pathname = usePathname();

  const getCurrentTab = (): SuperAdminTab => {
    const segments = pathname.split('/');
    const tab = segments[segments.length - 1];
    if (tab === 'super-admin') return 'overview';
    return (tab as SuperAdminTab) || 'overview';
  };

  const currentTab = getCurrentTab();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200">
        <div className="grid grid-cols-4 gap-1 p-2">
          {SUPER_ADMIN_NAVIGATION.map((item) => {
            const Icon = getIcon(item.icon);
            const isActive = currentTab === item.id;
            return (
              <Link
                key={item.id}
                href={`/super-admin/${item.id === 'overview' ? '' : item.id}`}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors',
                  isActive ? 'bg-purple-50 text-purple-600' : 'text-neutral-500 hover:bg-neutral-100'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
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
              <Link href="/super-admin" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <span className="font-semibold text-xl text-neutral-900">Vitations</span>
                <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                  Super Admin
                </span>
              </Link>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-neutral-200">
              <p className="font-medium text-neutral-900 truncate">{userName || 'Super Admin'}</p>
              <p className="text-sm text-neutral-500 truncate">{userEmail}</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Super Admin navigation">
              {SUPER_ADMIN_NAVIGATION.map((item) => {
                const Icon = getIcon(item.icon);
                const isActive = currentTab === item.id;
                return (
                  <Link
                    key={item.id}
                    href={`/super-admin/${item.id === 'overview' ? '' : item.id}`}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200 space-y-2">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700"
              >
                <span>Admin Dashboard</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700"
              >
                <span>Customer View</span>
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

function getIcon(name: string) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    Users: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    CreditCard: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    Palette: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    Settings: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };

  return icons[name] || icons.LayoutDashboard;
}
