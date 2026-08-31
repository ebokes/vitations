import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const footerNavigation = {
  product: [
    { name: 'Templates', href: '/templates' },
    { name: 'Packages', href: '/packages' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Custom Invitation', href: '/custom-invitation' },
  ],
  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
  social: [
    { name: 'Instagram', href: '#' },
    { name: 'TikTok', href: '#' },
    { name: 'Facebook', href: '#' },
    { name: 'WhatsApp', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary-600" />
              <span className="text-lg font-bold text-neutral-900">Vitations</span>
            </Link>
            <p className="mt-4 text-sm text-neutral-600">
              Premium digital invitations for Nigerian celebrations.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Product</h3>
            <ul className="mt-4 space-y-2">
              {footerNavigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-600 hover:text-primary-600"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Support</h3>
            <ul className="mt-4 space-y-2">
              {footerNavigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-600 hover:text-primary-600"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Follow Us</h3>
            <ul className="mt-4 space-y-2">
              {footerNavigation.social.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-600 hover:text-primary-600"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-8 text-center">
          <p className="text-sm text-neutral-600">
            &copy; {new Date().getFullYear()} Vitations. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
