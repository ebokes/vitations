import Link from 'next/link';
import { CheckCircle, X, ArrowRight } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { PACKAGE_PRICES, PACKAGE_FEATURES } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Packages',
  description: 'Choose the perfect package for your digital invitation. Essential, Premium, and Ultimate options available.',
};

const packages = [
  { tier: 'essential' as const, popular: false },
  { tier: 'premium' as const, popular: true },
  { tier: 'ultimate' as const, popular: false },
];

const comparisonFeatures = [
  { name: 'Guest Capacity', essential: '50 guests', premium: '100 guests', ultimate: '200 guests' },
  { name: 'Design Type', essential: '2D Basic', premium: '2D Animated / 3D Selected', ultimate: '3D Advanced / Interactive' },
  { name: 'Template Switch', essential: 'Before submission', premium: 'Before submission', ultimate: 'Before submission' },
  { name: 'Video Messages', essential: '✗', premium: '✗', ultimate: '✓ (15s / 100MB)' },
  { name: 'Photos', essential: '✗', premium: 'Gallery & Stories', ultimate: 'Gallery, Stories & Guest Upload' },
  { name: 'Photo Upload Limit', essential: '—', premium: '—', ultimate: '5MB per file' },
  { name: 'Guest Photo Sharing', essential: '✗', premium: '✗', ultimate: 'Select & Share to Social' },
  { name: 'Livestream', essential: '✗', premium: '✗', ultimate: 'YouTube, Zoom, Instagram, Twitch' },
  { name: 'Song Link', essential: '✓', premium: '✓', ultimate: '✓' },
  { name: 'RSVP', essential: '✓', premium: '✓', ultimate: '✓' },
  { name: 'Gift Tracker', essential: '✗', premium: '✓', ultimate: '✓' },
  { name: 'Cash Gift Option', essential: '✗', premium: '✓ (Manual Verification)', ultimate: '✓ (Paystack/Flutterwave)' },
  { name: 'Guest Timezone', essential: '✗', premium: '✓', ultimate: '✓' },
  { name: 'Location & Maps', essential: '✗', premium: '✓ (Multiple)', ultimate: '✓ (Multiple)' },
  { name: 'AI Chatbot', essential: '✗', premium: '✓', ultimate: '✓' },
  { name: 'Private Page', essential: '✗', premium: '✗', ultimate: '✓' },
];

export default function PackagesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Hero */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              Choose Your Package
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
              Select the perfect package for your celebration. All packages include beautiful templates and a seamless guest experience.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Package cards */}
          <div className="grid gap-8 lg:grid-cols-3">
            {packages.map((pkg) => (
              <Card
                key={pkg.tier}
                className={`relative flex flex-col ${pkg.popular ? 'border-primary-600 shadow-lg' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl font-bold capitalize text-neutral-900">{pkg.tier}</h2>
                  <p className="mt-2 text-3xl font-bold text-primary-600">
                    {formatCurrency(PACKAGE_PRICES[pkg.tier])}
                  </p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {PACKAGE_FEATURES[pkg.tier].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
                        <span className="text-sm text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/templates" className="mt-6">
                    <Button
                      variant={pkg.tier === 'ultimate' ? 'gold' : pkg.popular ? 'primary' : 'outline'}
                      className="w-full"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison table */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-neutral-900 text-center">Feature Comparison</h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="py-4 text-left text-sm font-medium text-neutral-900">Feature</th>
                    <th className="py-4 text-center text-sm font-medium text-neutral-900">Essential</th>
                    <th className="py-4 text-center text-sm font-medium text-primary-600">Premium</th>
                    <th className="py-4 text-center text-sm font-medium text-neutral-900">Ultimate</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, i) => (
                    <tr key={i} className="border-b border-neutral-100">
                      <td className="py-4 text-sm text-neutral-700">{feature.name}</td>
                      <td className="py-4 text-center text-sm text-neutral-600">
                        {feature.essential === '✓' ? (
                          <CheckCircle className="mx-auto h-5 w-5 text-primary-600" />
                        ) : feature.essential === '✗' ? (
                          <X className="mx-auto h-5 w-5 text-neutral-300" />
                        ) : (
                          feature.essential
                        )}
                      </td>
                      <td className="py-4 text-center text-sm text-neutral-600">
                        {feature.premium === '✓' ? (
                          <CheckCircle className="mx-auto h-5 w-5 text-primary-600" />
                        ) : feature.premium === '✗' ? (
                          <X className="mx-auto h-5 w-5 text-neutral-300" />
                        ) : (
                          feature.premium
                        )}
                      </td>
                      <td className="py-4 text-center text-sm text-neutral-600">
                        {feature.ultimate === '✓' ? (
                          <CheckCircle className="mx-auto h-5 w-5 text-primary-600" />
                        ) : feature.ultimate === '✗' ? (
                          <X className="mx-auto h-5 w-5 text-neutral-300" />
                        ) : (
                          feature.ultimate
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-neutral-900 text-center">Package FAQ</h2>
            <div className="mt-8 space-y-4">
              <details className="rounded-lg border border-neutral-200 bg-white" open>
                <summary className="cursor-pointer p-4 font-medium text-neutral-900">
                  Can I upgrade my package later?
                </summary>
                <div className="border-t border-neutral-200 px-4 pb-4 pt-3 text-sm text-neutral-600">
                  Package upgrades are handled by the admin team. Contact support to discuss upgrading your package. Features from your original package are retained.
                </div>
              </details>
              <details className="rounded-lg border border-neutral-200 bg-white">
                <summary className="cursor-pointer p-4 font-medium text-neutral-900">
                  What happens if my guest count exceeds the limit?
                </summary>
                <div className="border-t border-neutral-200 px-4 pb-4 pt-3 text-sm text-neutral-600">
                  Guest count exceeding your package limit triggers a notification. You can upgrade to a higher tier or manage your guest list.
                </div>
              </details>
              <details className="rounded-lg border border-neutral-200 bg-white">
                <summary className="cursor-pointer p-4 font-medium text-neutral-900">
                  Do expired invitations stay accessible?
                </summary>
                <div className="border-t border-neutral-200 px-4 pb-4 pt-3 text-sm text-neutral-600">
                  Yes. When the event date arrives, the countdown reaches zero but the invitation remains accessible. You retain access to all subscribed features.
                </div>
              </details>
              <details className="rounded-lg border border-neutral-200 bg-white">
                <summary className="cursor-pointer p-4 font-medium text-neutral-900">
                  Can I switch templates after selecting one?
                </summary>
                <div className="border-t border-neutral-200 px-4 pb-4 pt-3 text-sm text-neutral-600">
                  Yes, you can switch between templates available to your paid tier before final submission. Once submitted, changes require admin assistance.
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
