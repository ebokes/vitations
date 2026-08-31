import { PackageTier, Template, EventType } from '@/lib/templates/types';

// Feature Entitlements
export interface FeatureEntitlement {
  id: string;
  name: string;
  enabled: boolean;
  tier: PackageTier;
}

export interface FeatureEntitlements {
  songLink: boolean;
  giftRegistry: boolean;
  cashGifts: boolean;
  gallery: boolean;
  stories: boolean;
  livestream: boolean;
  guestUploads: boolean;
  privatePage: boolean;
  videoMessages: boolean;
  mapIntegration: boolean;
}

// Invitation Data
export interface InvitationEvent {
  type: EventType;
  date: string;
  time?: string;
  venue?: string;
  address?: string;
  mapUrl?: string;
  description?: string;
}

export interface InvitationCelebrant {
  name: string;
  coCelebrantName?: string;
  eventTitle: string;
}

export interface InvitationFeatures {
  songLink?: string;
  giftRegistryEnabled?: boolean;
  cashGiftEnabled?: boolean;
  gallery?: string[];
  stories?: string[];
  livestreamUrl?: string;
  livestreamPlatform?: string;
  guestUploadsEnabled?: boolean;
  privatePageEnabled?: boolean;
  dressCode?: string;
  specialInstructions?: string;
}

export interface InvitationData {
  id: string;
  templateId: string;
  templateVersion: number;
  packageTier: PackageTier;
  celebrant: InvitationCelebrant;
  eventTypes: EventType[];
  events: InvitationEvent[];
  features: InvitationFeatures;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'submitted' | 'locked' | 'expired';
}

// Invitation Context (passed to renderer)
export interface InvitationContext {
  invitation: InvitationData;
  template: Template;
  entitlements: FeatureEntitlements;
  mode: 'preview' | 'full' | 'embedded';
  baseUrl?: string;
}

// Section Types
export type SectionType =
  | 'hero'
  | 'celebrant'
  | 'story'
  | 'events'
  | 'gallery'
  | 'gifts'
  | 'rsvp'
  | 'livestream'
  | 'guest-media'
  | 'footer';

export interface InvitationSectionProps {
  context: InvitationContext;
  className?: string;
}

export interface InvitationSection {
  type: SectionType;
  component: React.ComponentType<InvitationSectionProps>;
  requiredEntitlement?: keyof FeatureEntitlements;
  requiredEventTypes?: EventType[];
}

// Renderer Contract
export interface InvitationRendererProps {
  context: InvitationContext;
  sections?: SectionType[];
  className?: string;
}

// Section Order
export const DEFAULT_SECTION_ORDER: SectionType[] = [
  'hero',
  'celebrant',
  'story',
  'events',
  'gallery',
  'gifts',
  'rsvp',
  'livestream',
  'guest-media',
  'footer',
];
