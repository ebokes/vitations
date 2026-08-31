'use client';

import * as React from 'react';
import { InvitationRenderer } from '@/lib/invitation-renderer';
import {
  InvitationContext,
  InvitationData,
  getEntitlementsForTier,
} from '@/lib/invitation-renderer';
import { getTemplateById } from '@/lib/templates';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock invitation data for demo
const mockInvitation: InvitationData = {
  id: 'demo-001',
  templateId: 'tpl-elegant-001',
  templateVersion: 1,
  packageTier: 'ultimate',
  celebrant: {
    name: 'Adaeze Okonkwo',
    coCelebrantName: 'Emeka Nwosu',
    eventTitle: "Adaeze & Emeka's Wedding Celebration",
  },
  eventTypes: ['traditional_wedding', 'white_wedding', 'reception'],
  events: [
    {
      type: 'traditional_wedding',
      date: '2024-12-25',
      time: '10:00 AM',
      venue: 'Eko Hotels & Suites',
      address: '14 Adetokunbo Ademola St, Victoria Island, Lagos',
      mapUrl: 'https://maps.google.com',
      description: 'Join us for a beautiful traditional Nigerian wedding ceremony.',
    },
    {
      type: 'reception',
      date: '2024-12-25',
      time: '4:00 PM',
      venue: 'Eko Hotels & Suites',
      address: '14 Adetokunbo Ademola St, Victoria Island, Lagos',
      description: 'Celebration continues with dinner, music, and dancing.',
    },
  ],
  features: {
    songLink: 'https://open.spotify.com/track/example',
    giftRegistryEnabled: true,
    cashGiftEnabled: true,
    gallery: [
      '/photos/1.jpg',
      '/photos/2.jpg',
      '/photos/3.jpg',
    ],
    stories: [
      'We met at a mutual friend\'s party in 2019.',
      'Our first date was at a small café in Victoria Island.',
      'After 3 years of love and laughter, Emeka proposed!',
    ],
    livestreamUrl: 'https://youtube.com/live/example',
    livestreamPlatform: 'youtube',
    guestUploadsEnabled: true,
    dressCode: 'Traditional attire encouraged',
    specialInstructions: 'Please arrive 30 minutes before the ceremony.',
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  status: 'submitted',
};

export default function DemoInvitationPage() {
  const [selectedTier, setSelectedTier] = React.useState<'essential' | 'premium' | 'ultimate'>('ultimate');

  const template = getTemplateById(mockInvitation.templateId);
  const entitlements = getEntitlementsForTier(selectedTier);

  if (!template) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <p>Template not found</p>
        </main>
        <Footer />
      </>
    );
  }

  const context: InvitationContext = {
    invitation: { ...mockInvitation, packageTier: selectedTier },
    template,
    entitlements,
    mode: 'preview',
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50">
        {/* Controls */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Invitation Demo</h1>
                <p className="text-sm text-neutral-600">
                  Preview how the invitation renders with different packages
                </p>
              </div>
              <div className="flex gap-2">
                {(['essential', 'premium', 'ultimate'] as const).map((tier) => (
                  <Button
                    key={tier}
                    variant={selectedTier === tier ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTier(tier)}
                    className="capitalize"
                  >
                    {tier}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Invitation Preview */}
        <div className="mx-auto max-w-2xl py-8">
          <InvitationRenderer context={context} />
        </div>

        {/* Feature Info */}
        <div className="mx-auto max-w-2xl px-4 pb-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-neutral-900">Enabled Features</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(entitlements).map(([key, value]) => (
                  <Badge
                    key={key}
                    variant={value ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
