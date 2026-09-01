'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AdminTab, ADMIN_NAVIGATION } from './types';

interface AdminLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

export function AdminLayout({ children, userName, userEmail }: AdminLayoutProps) {
  const pathname = usePathname();

  const getCurrentTab = (): AdminTab => {
    const segments = pathname.split('/');
    const tab = segments[segments.length - 1];
    if (tab === 'admin') return 'overview';
    return (tab as AdminTab) || 'overview';
  };

  const currentTab = getCurrentTab();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200">
        <div className="grid grid-cols-3 gap-1 p-2">
          {ADMIN_NAVIGATION.map((item) => {
            const Icon = getIcon(item.icon);
            const isActive = currentTab === item.id;
            return (
              <Link
                key={item.id}
                href={`/admin/${item.id === 'overview' ? '' : item.id}`}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors',
                  isActive ? 'bg-red-50 text-red-600' : 'text-neutral-500 hover:bg-neutral-100'
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
              <Link href="/admin" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <span className="font-semibold text-xl text-neutral-900">Vitations</span>
                <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                  Admin
                </span>
              </Link>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-neutral-200">
              <p className="font-medium text-neutral-900 truncate">{userName || 'Admin'}</p>
              <p className="text-sm text-neutral-500 truncate">{userEmail}</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
              {ADMIN_NAVIGATION.map((item) => {
                const Icon = getIcon(item.icon);
                const isActive = currentTab === item.id;
                return (
                  <Link
                    key={item.id}
                    href={`/admin/${item.id === 'overview' ? '' : item.id}`}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-red-50 text-red-600'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
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
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700"
              >
                <span>Back to Customer View</span>
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
    Mail: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    Image: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    FileText: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    Shield: () => (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  };

  return icons[name] || icons.LayoutDashboard;
}
