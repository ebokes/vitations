import { PackageTier } from '@/lib/templates/types';
import { FeatureEntitlements, InvitationFeatures } from './types';

/**
 * Get feature entitlements based on package tier.
 */
export function getEntitlementsForTier(tier: PackageTier): FeatureEntitlements {
  const base: FeatureEntitlements = {
    songLink: true,
    giftRegistry: false,
    cashGifts: false,
    gallery: false,
    stories: false,
    livestream: false,
    guestUploads: false,
    privatePage: false,
    videoMessages: false,
    mapIntegration: false,
  };

  switch (tier) {
    case 'premium':
      return {
        ...base,
        giftRegistry: true,
        cashGifts: true,
        gallery: true,
        stories: true,
        mapIntegration: true,
      };
    case 'ultimate':
      return {
        ...base,
        giftRegistry: true,
        cashGifts: true,
        gallery: true,
        stories: true,
        livestream: true,
        guestUploads: true,
        privatePage: true,
        videoMessages: true,
        mapIntegration: true,
      };
    case 'essential':
    default:
      return base;
  }
}

/**
 * Check if a feature is enabled for the given entitlements and user configuration.
 */
export function isFeatureEnabled(
  entitlements: FeatureEntitlements,
  feature: keyof FeatureEntitlements,
  userFeatures?: InvitationFeatures
): boolean {
  if (!entitlements[feature]) return false;

  // Check user-specific feature flags
  if (userFeatures) {
    switch (feature) {
      case 'giftRegistry':
        return userFeatures.giftRegistryEnabled === true;
      case 'cashGifts':
        return userFeatures.cashGiftEnabled === true;
      case 'guestUploads':
        return userFeatures.guestUploadsEnabled === true;
      case 'privatePage':
        return userFeatures.privatePageEnabled === true;
      case 'livestream':
        return !!userFeatures.livestreamUrl;
      case 'songLink':
        return !!userFeatures.songLink;
      default:
        return true;
    }
  }

  return true;
}

/**
 * Get all enabled features for rendering.
 */
export function getEnabledFeatures(
  entitlements: FeatureEntitlements,
  userFeatures?: InvitationFeatures
): string[] {
  const features: string[] = [];

  if (isFeatureEnabled(entitlements, 'songLink', userFeatures)) features.push('songLink');
  if (isFeatureEnabled(entitlements, 'giftRegistry', userFeatures)) features.push('giftRegistry');
  if (isFeatureEnabled(entitlements, 'cashGifts', userFeatures)) features.push('cashGifts');
  if (isFeatureEnabled(entitlements, 'gallery', userFeatures)) features.push('gallery');
  if (isFeatureEnabled(entitlements, 'stories', userFeatures)) features.push('stories');
  if (isFeatureEnabled(entitlements, 'livestream', userFeatures)) features.push('livestream');
  if (isFeatureEnabled(entitlements, 'guestUploads', userFeatures)) features.push('guestUploads');
  if (isFeatureEnabled(entitlements, 'privatePage', userFeatures)) features.push('privatePage');
  if (isFeatureEnabled(entitlements, 'videoMessages', userFeatures)) features.push('videoMessages');
  if (isFeatureEnabled(entitlements, 'mapIntegration', userFeatures)) features.push('mapIntegration');

  return features;
}

/**
 * Get entitlement description for UI display.
 */
export function getEntitlementDescription(feature: keyof FeatureEntitlements): string {
  const descriptions: Record<keyof FeatureEntitlements, string> = {
    songLink: 'Add a song link to your invitation',
    giftRegistry: 'Enable gift tracking for your guests',
    cashGifts: 'Allow cash gift contributions',
    gallery: 'Photo gallery with albums and stories',
    stories: 'Share your love story timeline',
    livestream: 'Live stream your event',
    guestUploads: 'Allow guests to upload photos',
    privatePage: 'Create a private invitation page',
    videoMessages: 'Receive video messages from guests',
    mapIntegration: 'Interactive venue maps',
  };
  return descriptions[feature];
}
