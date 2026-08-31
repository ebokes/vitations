'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ChevronLeft, ChevronRight, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  InvitationFormProvider,
  useInvitationForm,
  STEPS,
} from '@/components/invitation-form-provider';
import { TemplateSelectionStep } from '@/components/invitation-steps/template-selection';
import { PackageSelectionStep } from '@/components/invitation-steps/package-selection';
import { CelebrantInfoStep } from '@/components/invitation-steps/celebrant-info';
import { EventTypesStep } from '@/components/invitation-steps/event-types';
import { EventDetailsStep } from '@/components/invitation-steps/event-details';
import { PackageFeaturesStep } from '@/components/invitation-steps/package-features';
import { ReviewStep } from '@/components/invitation-steps/review';
import { useAuth } from '@/components/auth-provider';
import { cn } from '@/lib/utils';

function StepContent() {
  const { currentStep } = useInvitationForm();

  switch (currentStep) {
    case 'template':
      return <TemplateSelectionStep />;
    case 'package':
      return <PackageSelectionStep />;
    case 'celebrant':
      return <CelebrantInfoStep />;
    case 'event-types':
      return <EventTypesStep />;
    case 'event-details':
      return <EventDetailsStep />;
    case 'features':
      return <PackageFeaturesStep />;
    case 'review':
      return <ReviewStep />;
    default:
      return null;
  }
}

function StepNavigation() {
  const router = useRouter();
  const {
    currentStepIndex,
    canGoBack,
    isLastStep,
    formData,
    prevStep,
    nextStep,
  } = useInvitationForm();
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const canProceed = React.useMemo(() => {
    switch (currentStepIndex) {
      case 0:
        return !!formData.templateId;
      case 1:
        return !!formData.packageTier;
      case 2:
        return !!formData.celebrant?.celebrantName && !!formData.celebrant?.contactEmail;
      case 3:
        return (formData.eventTypes?.length ?? 0) > 0;
      case 4:
        return (formData.events?.length ?? 0) > 0;
      case 5:
        return true;
      case 6:
        return true;
      default:
        return false;
    }
  }, [currentStepIndex, formData]);

  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          <CheckCircle className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-neutral-900">Invitation Submitted!</h2>
        <p className="mt-4 text-neutral-600">
          Your invitation has been submitted for review. You&apos;ll receive a confirmation email shortly with your unique invitation link.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-6 py-4">
      <Button
        variant="ghost"
        onClick={prevStep}
        disabled={!canGoBack}
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="text-sm text-neutral-500">
        Step {currentStepIndex + 1} of {STEPS.length}
      </div>

      {isLastStep ? (
        <Button
          onClick={handleSubmit}
          disabled={!canProceed || submitting}
          className="gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Confirm & Submit'
          )}
        </Button>
      ) : (
        <Button
          onClick={nextStep}
          disabled={!canProceed}
          className="gap-2"
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

function SetupPageContent() {
  const { user, loading } = useAuth();
  const { currentStepIndex } = useInvitationForm();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-bold text-neutral-900">Vitations</span>
          </Link>
          {user && (
            <Link href="/dashboard" className="text-sm text-neutral-600 hover:text-primary-600">
              Dashboard
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                    index < currentStepIndex
                      ? 'bg-primary-600 text-white'
                      : index === currentStepIndex
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  )}
                >
                  {index < currentStepIndex ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="ml-2 hidden text-sm text-neutral-600 sm:block">
                  {step.label}
                </span>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'mx-2 h-0.5 w-8 sm:w-12',
                      index < currentStepIndex ? 'bg-primary-600' : 'bg-neutral-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-6">
          <StepContent />
        </div>

        {/* Navigation */}
        <StepNavigation />
      </main>
    </div>
  );
}

export default function InvitationSetupPage() {
  return (
    <InvitationFormProvider>
      <SetupPageContent />
    </InvitationFormProvider>
  );
}
