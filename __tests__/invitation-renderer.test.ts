import {
  getEntitlementsForTier,
  isFeatureEnabled,
  getEnabledFeatures,
} from '@/lib/invitation-renderer/entitlements';
import { getSection, shouldRenderSection, getRenderableSections } from '@/lib/invitation-renderer/section-registry';
import { InvitationContext, InvitationData } from '@/lib/invitation-renderer/types';
import { getTemplateById } from '@/lib/templates';

describe('Invitation Renderer - Entitlements', () => {
  describe('getEntitlementsForTier', () => {
    it('should return essential entitlements', () => {
      const entitlements = getEntitlementsForTier('essential');
      expect(entitlements.songLink).toBe(true);
      expect(entitlements.giftRegistry).toBe(false);
      expect(entitlements.gallery).toBe(false);
      expect(entitlements.livestream).toBe(false);
      expect(entitlements.guestUploads).toBe(false);
    });

    it('should return premium entitlements', () => {
      const entitlements = getEntitlementsForTier('premium');
      expect(entitlements.songLink).toBe(true);
      expect(entitlements.giftRegistry).toBe(true);
      expect(entitlements.cashGifts).toBe(true);
      expect(entitlements.gallery).toBe(true);
      expect(entitlements.stories).toBe(true);
      expect(entitlements.livestream).toBe(false);
      expect(entitlements.guestUploads).toBe(false);
    });

    it('should return ultimate entitlements', () => {
      const entitlements = getEntitlementsForTier('ultimate');
      expect(entitlements.songLink).toBe(true);
      expect(entitlements.giftRegistry).toBe(true);
      expect(entitlements.cashGifts).toBe(true);
      expect(entitlements.gallery).toBe(true);
      expect(entitlements.stories).toBe(true);
      expect(entitlements.livestream).toBe(true);
      expect(entitlements.guestUploads).toBe(true);
      expect(entitlements.privatePage).toBe(true);
      expect(entitlements.videoMessages).toBe(true);
    });
  });

  describe('isFeatureEnabled', () => {
    it('should return false if entitlement is disabled', () => {
      const entitlements = getEntitlementsForTier('essential');
      expect(isFeatureEnabled(entitlements, 'gallery')).toBe(false);
    });

    it('should return true if entitlement is enabled and no user feature required', () => {
      const entitlements = getEntitlementsForTier('ultimate');
      expect(isFeatureEnabled(entitlements, 'gallery')).toBe(true);
    });

    it('should check user feature flag for gift registry', () => {
      const entitlements = getEntitlementsForTier('premium');
      expect(isFeatureEnabled(entitlements, 'giftRegistry', { giftRegistryEnabled: false })).toBe(false);
      expect(isFeatureEnabled(entitlements, 'giftRegistry', { giftRegistryEnabled: true })).toBe(true);
    });
  });

  describe('getEnabledFeatures', () => {
    it('should return only enabled features for essential', () => {
      const entitlements = getEntitlementsForTier('essential');
      const features = getEnabledFeatures(entitlements);
      expect(features).toContain('songLink');
      expect(features).not.toContain('gallery');
      expect(features).not.toContain('livestream');
    });

    it('should return all features for ultimate', () => {
      const entitlements = getEntitlementsForTier('ultimate');
      const features = getEnabledFeatures(entitlements);
      expect(features).toContain('songLink');
      expect(features).toContain('gallery');
      expect(features).toContain('livestream');
      expect(features).toContain('guestUploads');
    });
  });
});

describe('Invitation Renderer - Section Registry', () => {
  describe('getSection', () => {
    it('should return hero section', () => {
      const section = getSection('hero');
      expect(section).toBeDefined();
      expect(section?.type).toBe('hero');
    });

    it('should return undefined for invalid section', () => {
      const section = getSection('invalid' as any);
      expect(section).toBeUndefined();
    });
  });

  describe('shouldRenderSection', () => {
    it('should render section without entitlement requirement', () => {
      const section = getSection('hero')!;
      const entitlements = getEntitlementsForTier('essential');
      expect(shouldRenderSection(section, entitlements)).toBe(true);
    });

    it('should not render section when entitlement is disabled', () => {
      const section = getSection('gallery')!;
      const entitlements = getEntitlementsForTier('essential');
      expect(shouldRenderSection(section, entitlements)).toBe(false);
    });

    it('should render section when entitlement is enabled', () => {
      const section = getSection('gallery')!;
      const entitlements = getEntitlementsForTier('premium');
      expect(shouldRenderSection(section, entitlements)).toBe(true);
    });
  });

  describe('getRenderableSections', () => {
    it('should return only essential sections for essential tier', () => {
      const entitlements = getEntitlementsForTier('essential');
      const sections = getRenderableSections(entitlements);
      const types = sections.map((s) => s.type);
      expect(types).toContain('hero');
      expect(types).toContain('events');
      expect(types).toContain('rsvp');
      expect(types).toContain('footer');
      expect(types).not.toContain('gallery');
      expect(types).not.toContain('livestream');
    });

    it('should return more sections for premium tier', () => {
      const entitlements = getEntitlementsForTier('premium');
      const sections = getRenderableSections(entitlements);
      const types = sections.map((s) => s.type);
      expect(types).toContain('gallery');
      expect(types).toContain('gifts');
      expect(types).not.toContain('livestream');
    });

    it('should return all sections for ultimate tier', () => {
      const entitlements = getEntitlementsForTier('ultimate');
      const sections = getRenderableSections(entitlements);
      const types = sections.map((s) => s.type);
      expect(types).toContain('gallery');
      expect(types).toContain('gifts');
      expect(types).toContain('livestream');
      expect(types).toContain('guest-media');
    });
  });
});

describe('Invitation Renderer - Template Integration', () => {
  it('should load template by ID', () => {
    const template = getTemplateById('tpl-elegant-001');
    expect(template).toBeDefined();
    expect(template?.name).toBe('Elegant Gold');
  });

  it('should have visual config for all templates', () => {
    const templateIds = ['tpl-elegant-001', 'tpl-floral-002', 'tpl-modern-003', 'tpl-traditional-004', 'tpl-luxury-005'];
    templateIds.forEach((id) => {
      const template = getTemplateById(id);
      expect(template?.visualConfig).toBeDefined();
      expect(template?.visualConfig.primaryColor).toBeDefined();
      expect(template?.visualConfig.secondaryColor).toBeDefined();
    });
  });
});
