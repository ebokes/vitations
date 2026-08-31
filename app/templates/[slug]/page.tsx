'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Box, Eye, Smartphone, Monitor } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface TemplatePreviewPageProps {
  params: { slug: string };
}

export default function TemplatePreviewPage({ params }: TemplatePreviewPageProps) {
  const [previewMode, setPreviewMode] = React.useState<'mobile' | 'desktop'>('mobile');

  // Mock template data
  const template = {
    id: params.slug,
    name: 'Royal Elegance',
    category: 'Traditional Wedding',
    designType: '2d_basic',
    minimumPackage: 'essential',
    description: 'A beautiful template inspired by traditional Nigerian royalty. Features elegant gold accents and warm earth tones.',
  };

  const hasAnimation = template.designType.includes('animated') || template.designType.includes('advanced');
  const has3D = template.designType.includes('3d');

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
                    className={`bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center ${
                      previewMode === 'mobile' ? 'aspect-[9/16]' : 'aspect-video'
                    }`}
                  >
                    <div className="text-center">
                      <Sparkles className="mx-auto h-16 w-16 text-primary-600/30" />
                      <p className="mt-4 text-sm text-primary-600/50">Template Preview</p>
                    </div>
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
                <p className="mt-2 text-neutral-600">{template.category}</p>
              </div>

              <p className="text-neutral-700">{template.description}</p>

              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <h3 className="font-medium text-neutral-900">Minimum Package Required</h3>
                <p className="mt-1 text-sm text-neutral-600 capitalize">
                  {template.minimumPackage}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-neutral-900">Features</h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary-600" />
                    Mobile and desktop preview
                  </li>
                  {hasAnimation && (
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary-600" />
                      Animated elements
                    </li>
                  )}
                  {has3D && (
                    <li className="flex items-center gap-2">
                      <Box className="h-4 w-4 text-primary-600" />
                      3D interactive elements
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex gap-4">
                <Link href="/packages" className="flex-1">
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
