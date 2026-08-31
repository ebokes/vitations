import { SectionType, InvitationSection, FeatureEntitlements } from './types';
import {
  HeroSection,
  CelebrantInfoSection,
  StorySection,
  EventsSection,
  GallerySection,
  GiftSection,
  RSVPSection,
  LivestreamSection,
  GuestMediaSection,
  FooterSection,
} from './sections';

/**
 * Registry of all available invitation sections.
 */
export const sectionRegistry: InvitationSection[] = [
  {
    type: 'hero',
    component: HeroSection,
  },
  {
    type: 'celebrant',
    component: CelebrantInfoSection,
  },
  {
    type: 'story',
    component: StorySection,
  },
  {
    type: 'events',
    component: EventsSection,
  },
  {
    type: 'gallery',
    component: GallerySection,
    requiredEntitlement: 'gallery',
  },
  {
    type: 'gifts',
    component: GiftSection,
    requiredEntitlement: 'giftRegistry',
  },
  {
    type: 'rsvp',
    component: RSVPSection,
  },
  {
    type: 'livestream',
    component: LivestreamSection,
    requiredEntitlement: 'livestream',
  },
  {
    type: 'guest-media',
    component: GuestMediaSection,
    requiredEntitlement: 'guestUploads',
  },
  {
    type: 'footer',
    component: FooterSection,
  },
];

/**
 * Get a section by type.
 */
export function getSection(type: SectionType): InvitationSection | undefined {
  return sectionRegistry.find((s) => s.type === type);
}

/**
 * Check if a section should be rendered based on entitlements.
 */
export function shouldRenderSection(
  section: InvitationSection,
  entitlements: FeatureEntitlements
): boolean {
  if (!section.requiredEntitlement) return true;
  return entitlements[section.requiredEntitlement] === true;
}

/**
 * Get all renderable sections for given entitlements.
 */
export function getRenderableSections(
  entitlements: FeatureEntitlements,
  sectionOrder?: SectionType[]
): InvitationSection[] {
  const order = sectionOrder || sectionRegistry.map((s) => s.type);
  return order
    .map((type) => getSection(type))
    .filter((section): section is InvitationSection => {
      if (!section) return false;
      return shouldRenderSection(section, entitlements);
    });
}
