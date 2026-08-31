'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Sparkles, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth-provider';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Templates', href: '/templates' },
  { name: 'Packages', href: '/packages' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'Custom Invitation', href: '/custom-invitation' },
];

export function Header() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setMobileMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold text-neutral-900">Vitations</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-primary-600"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-4 md:flex">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
          ) : user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
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
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/custom-invitation">
                <Button variant="gold" size="sm">
                  Create Your Invitation
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">
            {mobileMenuOpen ? 'Close menu' : 'Open menu'}
          </span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-neutral-200 bg-white md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-base font-medium text-neutral-600 hover:bg-neutral-50 hover:text-primary-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 space-y-2 border-t border-neutral-200 pt-4">
              {loading ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                </div>
              ) : user ? (
                <>
                  <Link href="/dashboard" className="block" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={handleSignOut}
                    disabled={signingOut}
                  >
                    {signingOut ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="block" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/custom-invitation" className="block" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="gold" className="w-full">
                      Create Your Invitation
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
