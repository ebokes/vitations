import { z } from 'zod';

// Step 1: Template Selection
export const templateSelectionSchema = z.object({
  templateId: z.string().min(1, 'Please select a template'),
});

// Step 2: Package Selection
export const packageSelectionSchema = z.object({
  packageTier: z.enum(['essential', 'premium', 'ultimate'], {
    required_error: 'Please select a package',
  }),
});

// Step 3: Celebrant & Event Information
export const celebrantInfoSchema = z.object({
  celebrantName: z
    .string()
    .min(2, 'Celebrant name must be at least 2 characters')
    .max(100, 'Celebrant name must be at most 100 characters'),
  coCelebrantName: z.string().optional(),
  eventTitle: z
    .string()
    .min(2, 'Event title must be at least 2 characters')
    .max(100, 'Event title must be at most 100 characters'),
  contactName: z
    .string()
    .min(2, 'Contact name must be at least 2 characters')
    .max(100, 'Contact name must be at most 100 characters'),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .max(15, 'Phone number is too long'),
});

// Step 4: Event Types
export const eventTypesSchema = z.object({
  eventTypes: z
    .array(z.enum(['traditional_wedding', 'white_wedding', 'reception', 'after_party']))
    .min(1, 'Please select at least one event type'),
});

// Step 5: Event Details
export const eventDetailsSchema = z.object({
  events: z
    .array(
      z.object({
        type: z.enum(['traditional_wedding', 'white_wedding', 'reception', 'after_party']),
        date: z.string().min(1, 'Event date is required'),
        time: z.string().optional(),
        venue: z.string().optional(),
        address: z.string().optional(),
        mapUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
        description: z.string().optional(),
      })
    )
    .min(1, 'Please provide details for at least one event'),
  dressCode: z.string().optional(),
  specialInstructions: z.string().optional(),
});

// Step 6: Package Features Configuration
export const packageFeaturesSchema = z.object({
  // Essential features
  songLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),

  // Premium features
  galleryPhotos: z.array(z.string()).optional(),
  stories: z.array(z.string()).optional(),
  giftRegistryEnabled: z.boolean().optional(),
  cashGiftEnabled: z.boolean().optional(),
  cashGiftDetails: z.string().optional(),

  // Ultimate features
  videoMessagesEnabled: z.boolean().optional(),
  guestUploadsEnabled: z.boolean().optional(),
  livestreamUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  livestreamPlatform: z.enum(['youtube', 'zoom', 'instagram', 'twitch', 'other']).optional(),
  privatePageEnabled: z.boolean().optional(),

  // Additional info
  dressCode: z.string().optional(),
  specialInstructions: z.string().optional(),
});

// Complete invitation schema
export const invitationSetupSchema = z.object({
  templateId: templateSelectionSchema.shape.templateId,
  packageTier: packageSelectionSchema.shape.packageTier,
  celebrant: celebrantInfoSchema,
  eventTypes: eventTypesSchema.shape.eventTypes,
  events: eventDetailsSchema.shape.events,
  features: packageFeaturesSchema,
});

export type TemplateSelectionData = z.infer<typeof templateSelectionSchema>;
export type PackageSelectionData = z.infer<typeof packageSelectionSchema>;
export type CelebrantInfoData = z.infer<typeof celebrantInfoSchema>;
export type EventTypesData = z.infer<typeof eventTypesSchema>;
export type EventDetailsData = z.infer<typeof eventDetailsSchema>;
export type PackageFeaturesData = z.infer<typeof packageFeaturesSchema>;
export type InvitationSetupData = z.infer<typeof invitationSetupSchema>;

// Event type labels
export const EVENT_TYPE_LABELS: Record<string, string> = {
  traditional_wedding: 'Traditional Wedding',
  white_wedding: 'White Wedding',
  reception: 'Reception',
  after_party: 'After Party',
};

// Livestream platform labels
export const LIVESTREAM_PLATFORM_LABELS: Record<string, string> = {
  youtube: 'YouTube',
  zoom: 'Zoom',
  instagram: 'Instagram Live',
  twitch: 'Twitch',
  other: 'Other',
};
