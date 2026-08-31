// Package tiers and pricing
export const PACKAGE_TIERS = {
  ESSENTIAL: 'essential',
  PREMIUM: 'premium',
  ULTIMATE: 'ultimate',
} as const;

export type PackageTier = typeof PACKAGE_TIERS[keyof typeof PACKAGE_TIERS];

export const PACKAGE_PRICES = {
  [PACKAGE_TIERS.ESSENTIAL]: 50000,
  [PACKAGE_TIERS.PREMIUM]: 150000,
  [PACKAGE_TIERS.ULTIMATE]: 350000,
} as const;

export const PACKAGE_FEATURES = {
  [PACKAGE_TIERS.ESSENTIAL]: [
    'Basic 2D designs',
    'Basic animations',
    'Template selection',
    'Invitation customization',
    'Digital invitation link',
    'Guest access',
    'RSVP',
  ],
  [PACKAGE_TIERS.PREMIUM]: [
    'All Essential features',
    'Multiple event locations',
    'Map integration',
    'Media gallery',
    'Story/journey section',
    'Advanced animations',
    'Selected 3D elements',
    'Gift Registry',
    'Cash gift options',
  ],
  [PACKAGE_TIERS.ULTIMATE]: [
    'All Premium features',
    'Advanced 3D animations',
    'Guest photo uploads',
    'Guest media moderation',
    'Social sharing',
    'Livestream integration',
    'Event-day activation',
    'Customer event uploads',
  ],
} as const;

// Event types
export const EVENT_TYPES = {
  TRADITIONAL: 'traditional',
  WHITE_WEDDING: 'white_wedding',
  RECEPTION: 'reception',
  AFTER_PARTY: 'after_party',
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

export const EVENT_TYPE_LABELS = {
  [EVENT_TYPES.TRADITIONAL]: 'Traditional Wedding',
  [EVENT_TYPES.WHITE_WEDDING]: 'White Wedding',
  [EVENT_TYPES.RECEPTION]: 'Reception',
  [EVENT_TYPES.AFTER_PARTY]: 'After Party',
} as const;

// User roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Invitation status
export const INVITATION_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  LOCKED: 'locked',
} as const;

export type InvitationStatus = typeof INVITATION_STATUS[keyof typeof INVITATION_STATUS];
