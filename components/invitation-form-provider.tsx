'use client';

import * as React from 'react';
import {
  InvitationSetupData,
  TemplateSelectionData,
  PackageSelectionData,
  CelebrantInfoData,
  EventTypesData,
  EventDetailsData,
  PackageFeaturesData,
} from '@/lib/validations/invitation';

export type StepId =
  | 'template'
  | 'package'
  | 'celebrant'
  | 'event-types'
  | 'event-details'
  | 'features'
  | 'review';

export interface Step {
  id: StepId;
  label: string;
  description: string;
}

export const STEPS: Step[] = [
  { id: 'template', label: 'Template', description: 'Choose a design' },
  { id: 'package', label: 'Package', description: 'Select your package' },
  { id: 'celebrant', label: 'Info', description: 'Enter details' },
  { id: 'event-types', label: 'Events', description: 'Select event types' },
  { id: 'event-details', label: 'Details', description: 'Event information' },
  { id: 'features', label: 'Features', description: 'Configure features' },
  { id: 'review', label: 'Review', description: 'Confirm & submit' },
];

interface InvitationFormContextType {
  currentStep: StepId;
  currentStepIndex: number;
  formData: Partial<InvitationSetupData>;
  setStep: (step: StepId) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<InvitationSetupData>) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isLastStep: boolean;
  isFirstStep: boolean;
}

const InvitationFormContext = React.createContext<InvitationFormContextType | undefined>(
  undefined
);

export function InvitationFormProvider({ children }: { children: React.ReactNode }) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [formData, setFormData] = React.useState<Partial<InvitationSetupData>>({});

  const currentStep = STEPS[currentStepIndex].id;
  const canGoBack = currentStepIndex > 0;
  const canGoForward = currentStepIndex < STEPS.length - 1;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const setStep = React.useCallback((step: StepId) => {
    const index = STEPS.findIndex((s) => s.id === step);
    if (index !== -1) {
      setCurrentStepIndex(index);
    }
  }, []);

  const nextStep = React.useCallback(() => {
    if (canGoForward) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [canGoForward]);

  const prevStep = React.useCallback(() => {
    if (canGoBack) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [canGoBack]);

  const updateFormData = React.useCallback((data: Partial<InvitationSetupData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  return (
    <InvitationFormContext.Provider
      value={{
        currentStep,
        currentStepIndex,
        formData,
        setStep,
        nextStep,
        prevStep,
        updateFormData,
        canGoBack,
        canGoForward,
        isFirstStep,
        isLastStep,
      }}
    >
      {children}
    </InvitationFormContext.Provider>
  );
}

export function useInvitationForm() {
  const context = React.useContext(InvitationFormContext);
  if (context === undefined) {
    throw new Error('useInvitationForm must be used within an InvitationFormProvider');
  }
  return context;
}
