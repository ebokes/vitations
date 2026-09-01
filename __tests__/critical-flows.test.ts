import { customInvitationSchema } from '@/lib/custom-requests/schema';
import { calculateDaysUntilEvent, isEventPast, formatEventStatus, getPackageDisplay } from '@/lib/dashboard/types';
import type { DashboardInvitation } from '@/lib/dashboard/types';

describe('Critical User Flows', () => {
  describe('Custom invitation request flow', () => {
    it('should accept valid request data', () => {
      const result = customInvitationSchema.safeParse({
        name: 'Ada Okonkwo',
        phone: '08012345678',
        email: 'ada@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = customInvitationSchema.safeParse({
        name: 'Ada Okonkwo',
        phone: '08012345678',
        email: 'not-an-email',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short name', () => {
      const result = customInvitationSchema.safeParse({
        name: 'A',
        phone: '08012345678',
        email: 'ada@example.com',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short phone', () => {
      const result = customInvitationSchema.safeParse({
        name: 'Ada Okonkwo',
        phone: '080',
        email: 'ada@example.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Dashboard invitation status flow', () => {
    const baseInvitation: DashboardInvitation = {
      id: '1',
      status: 'draft',
      packageTier: 'essential',
      templateId: 't1',
      templateName: 'Classic',
      templatePreviewUrl: '',
      eventDate: '2099-12-31T00:00:00.000Z',
      eventType: 'traditional_wedding',
      celebrantNames: ['Ada', 'Emeka'],
      slug: 'ada-and-emeka',
      publicUrl: '/invitation/ada-and-emeka',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    it('should show Draft status for draft invitations', () => {
      const result = formatEventStatus({ ...baseInvitation, status: 'draft' });
      expect(result.label).toBe('Draft');
      expect(result.variant).toBe('secondary');
    });

    it('should show Under Review for submitted invitations', () => {
      const result = formatEventStatus({ ...baseInvitation, status: 'submitted' });
      expect(result.label).toBe('Under Review');
      expect(result.variant).toBe('warning');
    });

    it('should show Published for published invitations', () => {
      const result = formatEventStatus({ ...baseInvitation, status: 'published' });
      expect(result.label).toBe('Published');
      expect(result.variant).toBe('success');
    });

    it('should show Event Completed for past events', () => {
      const pastInvitation = {
        ...baseInvitation,
        status: 'published' as const,
        eventDate: '2020-01-01T00:00:00.000Z',
      };
      const result = formatEventStatus(pastInvitation);
      expect(result.label).toBe('Event Completed');
    });

    it('should show No Invitation for null', () => {
      const result = formatEventStatus(null);
      expect(result.label).toBe('No Invitation');
    });
  });

  describe('Package display', () => {
    it('should show correct Essential package info', () => {
      const result = getPackageDisplay('essential');
      expect(result.label).toBe('Essential');
      expect(result.price).toBe(50000);
    });

    it('should show correct Premium package info', () => {
      const result = getPackageDisplay('premium');
      expect(result.label).toBe('Premium');
      expect(result.price).toBe(150000);
    });

    it('should show correct Ultimate package info', () => {
      const result = getPackageDisplay('ultimate');
      expect(result.label).toBe('Ultimate');
      expect(result.price).toBe(350000);
    });
  });

  describe('Event date calculations', () => {
    it('should calculate days until event correctly', () => {
      const futureDate = '2099-06-15T00:00:00.000Z';
      const days = calculateDaysUntilEvent(futureDate);
      expect(days).toBeGreaterThan(0);
    });

    it('should detect past events', () => {
      expect(isEventPast('2020-01-01T00:00:00.000Z')).toBe(true);
    });

    it('should detect future events', () => {
      expect(isEventPast('2099-12-31T00:00:00.000Z')).toBe(false);
    });
  });
});
