import Link from 'next/link';
import { ArrowRight, Sparkles, Eye, Settings, CheckCircle, Send, LinkIcon, Share2 } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Learn how to create your digital invitation in 7 simple steps with Vitations.',
};

const steps = [
  {
    number: '01',
    title: 'Choose a Template',
    description: 'Browse our curated collection of elegant templates designed for Nigerian celebrations. Filter by event type, design style, or capability.',
    details: [
      'Filter by Traditional Wedding, White Wedding, Birthday, and more',
      'Preview templates in mobile and desktop modes',
      'Each template shows its minimum package requirement',
    ],
    icon: Sparkles,
  },
  {
    number: '02',
    title: 'Select Your Package',
    description: 'Choose from Essential, Premium, or Ultimate packages based on your needs and guest count.',
    details: [
      'Essential (₦50,000) — up to 50 guests, 2D basic',
      'Premium (₦150,000) — up to 100 guests, animated/3D selected',
      'Ultimate (₦350,000) — up to 200 guests, 3D advanced + all features',
    ],
    icon: Settings,
  },
  {
    number: '03',
    title: 'Enter Event Details',
    description: 'Fill in your celebration information using our guided multi-step form.',
    details: [
      'Celebrant names, event type, date and time',
      'Venue details with map links',
      'RSVP deadline and contact information',
    ],
    icon: Eye,
  },
  {
    number: '04',
    title: 'Review Your Invitation',
    description: 'Preview your invitation exactly as guests will see it before confirming.',
    details: [
      'Mobile and desktop preview modes',
      'See how all sections appear together',
      'Make final adjustments before submission',
    ],
    icon: CheckCircle,
  },
  {
    number: '05',
    title: 'Confirm and Submit',
    description: 'Finalize your invitation and submit it for processing.',
    details: [
      'Review all details one final time',
      'Agree to terms and conditions',
      'Submit for admin review and processing',
    ],
    icon: Send,
  },
  {
    number: '06',
    title: 'Receive Your Link',
    description: 'After approval, receive your unique invitation URL.',
    details: [
      'Unique URL: vitations.ng/v/your-custom-slug',
      'Instant access to your invitation',
      'Shareable across all platforms',
    ],
    icon: LinkIcon,
  },
  {
    number: '07',
    title: 'Share with Guests',
    description: 'Send your invitation to guests through your preferred channels.',
    details: [
      'WhatsApp, SMS, or email sharing',
      'One-tap sharing buttons',
      'Guests can RSVP directly from the link',
    ],
    icon: Share2,
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Hero */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              How It Works
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
              Create your digital invitation in 7 simple steps. From template selection to guest sharing, we guide you through every stage.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-12 h-full w-0.5 bg-primary-200 sm:left-1/2 sm:-translate-x-px" />
                )}

                <div className="relative flex gap-6">
                  {/* Step number */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                    <step.icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-primary-600">Step {step.number}</span>
                    </div>
                    <h2 className="mt-1 text-xl font-bold text-neutral-900">{step.title}</h2>
                    <p className="mt-2 text-neutral-600">{step.description}</p>
                    <ul className="mt-4 space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-neutral-900">Ready to Get Started?</h2>
            <p className="mt-4 text-neutral-600">
              Choose a template and begin creating your invitation today.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/templates">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Templates
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/custom-invitation">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Request Custom Design
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
