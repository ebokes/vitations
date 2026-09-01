import {
  calculateDaysUntilEvent,
  isEventPast,
  formatEventStatus,
  getPackageDisplay,
  DashboardInvitation,
} from '@/lib/dashboard/types';

describe('Dashboard System', () => {
  describe('Date Calculations', () => {
    it('should calculate days until future event', () => {
      // Use a date far in the future to ensure it's positive regardless of timezone
      const futureDate = '2099-12-31T23:59:59.999Z';
      const days = calculateDaysUntilEvent(futureDate);
      expect(days).toBeGreaterThan(0);
    });

    it('should return 0 for today', () => {
      // Use today's date at local midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString();
      const days = calculateDaysUntilEvent(todayStr);
      expect(days).toBe(0);
    });

    it('should return negative for past event', () => {
      // Use a fixed past date
      const pastDate = '2020-01-15T00:00:00.000Z';
      const days = calculateDaysUntilEvent(pastDate);
      expect(days).toBeLessThan(0);
    });

    it('should return null for undefined date', () => {
      expect(calculateDaysUntilEvent(undefined)).toBeNull();
    });

    it('should detect past event', () => {
      const pastDate = '2020-01-15T00:00:00.000Z';
      expect(isEventPast(pastDate)).toBe(true);
    });

    it('should not detect future event as past', () => {
      const futureDate = '2099-12-31T23:59:59.999Z';
      expect(isEventPast(futureDate)).toBe(false);
    });

    it('should return false for undefined date', () => {
      expect(isEventPast(undefined)).toBe(false);
    });
  });

  describe('Event Status Formatting', () => {
    const baseInvitation: DashboardInvitation = {
      id: 'inv-001',
      status: 'published',
      packageTier: 'ultimate',
      templateId: 'tpl-001',
      templateName: 'Elegant Gold',
      templatePreviewUrl: '',
      eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      eventType: 'wedding',
      celebrantNames: ['John', 'Jane'],
      slug: 'john-jane-wedding',
      publicUrl: 'https://example.com/inv/john-jane-wedding',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    it('should show published status for published invitation', () => {
      const result = formatEventStatus(baseInvitation);
      expect(result.label).toBe('Published');
      expect(result.variant).toBe('success');
    });

    it('should show draft status', () => {
      const invitation = { ...baseInvitation, status: 'draft' as any };
      const result = formatEventStatus(invitation);
      expect(result.label).toBe('Draft');
      expect(result.variant).toBe('secondary');
    });

    it('should show submitted status', () => {
      const invitation = { ...baseInvitation, status: 'submitted' as any };
      const result = formatEventStatus(invitation);
      expect(result.label).toBe('Under Review');
      expect(result.variant).toBe('warning');
    });

    it('should show approved status', () => {
      const invitation = { ...baseInvitation, status: 'approved' as any };
      const result = formatEventStatus(invitation);
      expect(result.label).toBe('Approved');
      expect(result.variant).toBe('default');
    });

    it('should show archived status', () => {
      const invitation = { ...baseInvitation, status: 'archived' as any };
      const result = formatEventStatus(invitation);
      expect(result.label).toBe('Archived');
      expect(result.variant).toBe('secondary');
    });

    it('should show event completed for past event', () => {
      const pastInvitation = { ...baseInvitation, eventDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() };
      const result = formatEventStatus(pastInvitation);
      expect(result.label).toBe('Event Completed');
      expect(result.variant).toBe('success');
    });

    it('should handle null invitation', () => {
      const result = formatEventStatus(null);
      expect(result.label).toBe('No Invitation');
      expect(result.variant).toBe('secondary');
    });
  });

  describe('Package Display', () => {
    it('should return correct display for essential', () => {
      const display = getPackageDisplay('essential');
      expect(display.label).toBe('Essential');
      expect(display.color).toContain('blue');
      expect(display.price).toBe(50000);
    });

    it('should return correct display for premium', () => {
      const display = getPackageDisplay('premium');
      expect(display.label).toBe('Premium');
      expect(display.color).toContain('purple');
      expect(display.price).toBe(150000);
    });

    it('should return correct display for ultimate', () => {
      const display = getPackageDisplay('ultimate');
      expect(display.label).toBe('Ultimate');
      expect(display.color).toContain('gold');
      expect(display.price).toBe(350000);
    });
  });
});