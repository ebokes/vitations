'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Smartphone, Monitor, Box, Sparkles, Loader2 } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getTemplateBySlug,
  loadTemplateRenderer,
  TemplateRendererContract,
  Template,
} from '@/lib/templates';

interface TemplatePreviewPageProps {
  params: { slug: string };
}

export default function TemplatePreviewPage({ params }: TemplatePreviewPageProps) {
  const [previewMode, setPreviewMode] = React.useState<'mobile' | 'desktop'>('mobile');
  const [template, setTemplate] = React.useState<Template | null>(null);
  const [Renderer, setRenderer] = React.useState<TemplateRendererContract | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = getTemplateBySlug(params.slug);
    if (t) {
      setTemplate(t);
      loadTemplateRenderer(t.rendererType).then((R) => {
        setRenderer(() => R);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [params.slug]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-neutral-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </main>
        <Footer />
      </>
    );
  }

  if (!template) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50">
          <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-neutral-900">Template Not Found</h1>
            <p className="mt-4 text-neutral-600">
              The template you&apos;re looking for doesn&apos;t exist or has been retired.
            </p>
            <Link href="/templates" className="mt-8 inline-block">
              <Button>Browse Templates</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const hasAnimation = template.rendererType === 'animated';
  const has3D = template.rendererType === '3d';

  // Mock data for preview
  const previewData = {
    celebrantName: 'Adaeze Okonkwo',
    coCelebrantName: 'Emeka Nwosu',
    eventTitle: 'Adaeze & Emeka\'s Wedding',
    events: [
      {
        type: 'traditional_wedding',
        date: '2024-12-25',
        time: '10:00 AM',
        venue: 'Eko Hotels & Suites',
        address: '14 Adetokunbo Ademola St, Victoria Island, Lagos',
      },
      {
        type: 'reception',
        date: '2024-12-25',
        time: '4:00 PM',
        venue: 'Eko Hotels & Suites',
        address: '14 Adetokunbo Ademola St, Victoria Island, Lagos',
      },
    ],
    features: {
      songLink: '#',
      giftRegistryEnabled: true,
      livestreamUrl: '',
    },
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Back navigation */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Templates
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Preview */}
            <div className="space-y-4">
              {/* Preview mode toggle */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant={previewMode === 'mobile' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                  className="gap-2"
                >
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </Button>
                <Button
                  variant={previewMode === 'desktop' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                  className="gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  Desktop
                </Button>
              </div>

              {/* Preview container */}
              <div className="flex justify-center">
                <div
                  className={`overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg ${
                    previewMode === 'mobile' ? 'w-full max-w-sm' : 'w-full'
                  }`}
                >
                  <div
                    className={`overflow-y-auto ${
                      previewMode === 'mobile' ? 'aspect-[9/16]' : 'aspect-video'
                    }`}
                  >
                    {Renderer && (
                      <Renderer template={template} data={previewData} mode="preview" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Template info */}
            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-neutral-900">{template.name}</h1>
                  {hasAnimation && (
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      Animated
                    </Badge>
                  )}
                  {has3D && (
                    <Badge variant="secondary" className="gap-1">
                      <Box className="h-3 w-3" />
                      3D
                    </Badge>
                  )}
                </div>
                <p className="mt-2 text-neutral-600 capitalize">{template.designStyle}</p>
              </div>

              <p className="text-neutral-700">{template.description}</p>

              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <h3 className="font-medium text-neutral-900">Supported Packages</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {template.supportedPackages.map((pkg) => (
                    <Badge key={pkg} variant="secondary" className="capitalize">
                      {pkg}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <h3 className="font-medium text-neutral-900">Supported Events</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {template.supportedEventTypes.map((et) => (
                    <Badge key={et} variant="outline" className="capitalize">
                      {et.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Link href="/setup" className="flex-1">
                  <Button variant="gold" size="lg" className="w-full">
                    Use This Template
                  </Button>
                </Link>
                <Link href="/templates" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full">
                    Browse More
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-neutral-500">
                Selecting this template will not create an invitation until you complete the booking process.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
