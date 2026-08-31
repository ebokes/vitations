'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GuestPreview } from '@/lib/guest/guest-preview';
import { InvitationRenderer } from '@/lib/invitation-renderer';
import {
  InvitationContext,
  getEntitlementsForTier,
} from '@/lib/invitation-renderer';
import { getTemplateById } from '@/lib/templates';
import { getPublicInvitation, isInvitationAccessible } from '@/lib/guest/invitations';
import { submitRSVP, getRSVPByPhone } from '@/lib/rsvp/store';
import { InvitationData } from '@/lib/invitation-renderer/types';
import { RSVPForm } from '@/lib/rsvp/rsvp-form';
import Link from 'next/link';

type ViewState = 'loading' | 'preview' | 'form' | 'full' | 'error';

export default function GuestInvitationPage() {
  const params = useParams();
  const invitationId = params.id as string;

  const [viewState, setViewState] = React.useState<ViewState>('loading');
  const [invitation, setInvitation] = React.useState<InvitationData | null>(null);
  const [errorType, setErrorType] = React.useState<'not-found' | 'inactive' | 'expired'>('not-found');

  React.useEffect(() => {
    // Check for existing RSVP in local storage
    const savedPhone = localStorage?.getItem(`rsvp_phone_${invitationId}`);

    // Simulate loading invitation data
    const timer = setTimeout(() => {
      const inv = getPublicInvitation(invitationId);

      if (!inv) {
        setErrorType('not-found');
        setViewState('error');
        return;
      }

      if (!isInvitationAccessible(inv)) {
        setErrorType('inactive');
        setViewState('error');
        return;
      }

      setInvitation(inv);

      // If returning guest with existing RSVP, go to full view
      if (savedPhone) {
        const existingRsvp = getRSVPByPhone(invitationId, savedPhone);
        if (existingRsvp) {
          setViewState('full');
          return;
        }
      }

      setViewState('preview');
    }, 500);

    return () => clearTimeout(timer);
  }, [invitationId]);

  const handleAccept = () => {
    setViewState('form');
  };

  const handleRSVPSuccess = () => {
    setViewState('full');
  };

  // Loading state
  if (viewState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-600" />
          <p className="mt-4 text-neutral-600">Loading invitation...</p>
        </div>
      </div>
    );
  }

  // Error states
  if (viewState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-neutral-900">
              {errorType === 'not-found' && 'Invitation Not Found'}
              {errorType === 'inactive' && 'Invitation Unavailable'}
              {errorType === 'expired' && 'Invitation Expired'}
            </h1>
            <p className="mt-4 text-neutral-600">
              {errorType === 'not-found' &&
                'The invitation you are looking for does not exist or may have been removed.'}
              {errorType === 'inactive' &&
                'This invitation is currently not available. Please contact the event organizer.'}
              {errorType === 'expired' &&
                'This invitation has expired. Please contact the event organizer.'}
            </p>
            <Link href="/" className="mt-8 inline-block">
              <Button variant="outline">Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Preview state
  if (viewState === 'preview' && invitation) {
    return <GuestPreview invitation={invitation} onAccept={handleAccept} />;
  }

  // Form state - Use new RSVP form
  if (viewState === 'form' && invitation) {
    const template = getTemplateById(invitation.templateId);

    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          fontFamily: template?.visualConfig.fontFamily,
          background: template?.visualConfig.backgroundType === 'gradient'
            ? template.visualConfig.backgroundValue
            : template?.visualConfig.backgroundValue || '#faf8f5',
        }}
      >
        {/* Header */}
        <header
          className="py-4 text-center"
          style={{ backgroundColor: template?.visualConfig.secondaryColor }}
        >
          <Sparkles
            className="mx-auto h-8 w-8"
            style={{ color: template?.visualConfig.primaryColor }}
          />
        </header>

        {/* Form Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <RSVPForm
              invitationId={invitationId}
              primaryColor={template?.visualConfig.primaryColor}
              secondaryColor={template?.visualConfig.secondaryColor}
              accentColor={template?.visualConfig.accentColor}
              onSuccess={handleRSVPSuccess}
            />
          </div>
        </main>

        {/* Footer */}
        <footer
          className="py-4 text-center"
          style={{ backgroundColor: template?.visualConfig.secondaryColor }}
        >
          <p
            className="text-xs"
            style={{ color: template?.visualConfig.accentColor }}
          >
            Powered by Vitations
          </p>
        </footer>
      </div>
    );
  }

  // Full invitation state
  if (viewState === 'full' && invitation) {
    const template = getTemplateById(invitation.templateId);
    if (!template) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <p>Template not found</p>
        </div>
      );
    }

    const entitlements = getEntitlementsForTier(invitation.packageTier);
    const context: InvitationContext = {
      invitation,
      template,
      entitlements,
      mode: 'full',
    };

    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Thank You Banner */}
        <div className="bg-primary-600 py-4 text-center text-white">
          <p className="text-sm font-medium">
            Thank you for your RSVP! Enjoy the celebration.
          </p>
        </div>

        {/* Full Invitation */}
        <InvitationRenderer context={context} />
      </div>
    );
  }

  return null;
}
