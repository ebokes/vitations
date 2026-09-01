import {
  NOTIFICATION_TEMPLATES,
  getNotificationTemplate,
} from '@/lib/notifications/types';
import type { NotificationType } from '@/lib/notifications/types';

describe('Notification System', () => {
  describe('Notification Templates', () => {
    it('should have templates for all notification types', () => {
      const types: NotificationType[] = [
        'payment_successful',
        'payment_failed',
        'invitation_submitted',
        'invitation_approved',
        'invitation_ready',
        'admin_unlock',
        'admin_update',
        'guest_rsvp',
        'gift_claimed',
        'gift_received',
        'media_approved',
        'media_rejected',
        'livestream_activation',
        'custom_request_new',
        'custom_request_update',
      ];

      types.forEach((type) => {
        expect(NOTIFICATION_TEMPLATES[type]).toBeDefined();
        expect(NOTIFICATION_TEMPLATES[type].title).toBeTruthy();
        expect(NOTIFICATION_TEMPLATES[type].message).toBeTruthy();
        expect(NOTIFICATION_TEMPLATES[type].icon).toBeTruthy();
        expect(NOTIFICATION_TEMPLATES[type].color).toBeTruthy();
      });
    });

    it('should have correct templates for payment types', () => {
      expect(NOTIFICATION_TEMPLATES.payment_successful.title).toBe('Payment Successful');
      expect(NOTIFICATION_TEMPLATES.payment_successful.color).toContain('green');
      expect(NOTIFICATION_TEMPLATES.payment_failed.title).toBe('Payment Failed');
      expect(NOTIFICATION_TEMPLATES.payment_failed.color).toContain('red');
    });

    it('should have correct templates for invitation types', () => {
      expect(NOTIFICATION_TEMPLATES.invitation_submitted.title).toBe('Invitation Submitted');
      expect(NOTIFICATION_TEMPLATES.invitation_approved.title).toBe('Invitation Approved');
      expect(NOTIFICATION_TEMPLATES.invitation_ready.title).toBe('Invitation Ready');
    });

    it('should have correct templates for admin types', () => {
      expect(NOTIFICATION_TEMPLATES.admin_unlock.title).toBe('Invitation Unlocked');
      expect(NOTIFICATION_TEMPLATES.admin_update.title).toBe('Invitation Updated');
    });

    it('should have correct templates for guest/gift types', () => {
      expect(NOTIFICATION_TEMPLATES.guest_rsvp.title).toBe('New RSVP');
      expect(NOTIFICATION_TEMPLATES.gift_claimed.title).toBe('Gift Claimed');
      expect(NOTIFICATION_TEMPLATES.gift_received.title).toBe('Gift Received');
    });

    it('should have correct templates for media types', () => {
      expect(NOTIFICATION_TEMPLATES.media_approved.title).toBe('Media Approved');
      expect(NOTIFICATION_TEMPLATES.media_rejected.title).toBe('Media Rejected');
    });
  });

  describe('getNotificationTemplate', () => {
    it('should return correct template for known type', () => {
      const template = getNotificationTemplate('payment_successful');
      expect(template.title).toBe('Payment Successful');
      expect(template.icon).toBe('CheckCircle');
    });

    it('should return default template for unknown type', () => {
      const template = getNotificationTemplate('unknown_type' as NotificationType);
      expect(template.title).toBe('Notification');
      expect(template.icon).toBe('Bell');
    });
  });

  describe('Notification type completeness', () => {
    it('should cover all specified notification scenarios', () => {
      const requiredTypes = [
        'payment_successful',
        'payment_failed',
        'invitation_submitted',
        'invitation_ready',
        'admin_unlock',
        'admin_update',
        'guest_rsvp',
        'gift_claimed',
        'gift_received',
        'media_approved',
        'media_rejected',
        'livestream_activation',
      ];

      requiredTypes.forEach((type) => {
        expect(NOTIFICATION_TEMPLATES[type as NotificationType]).toBeDefined();
      });
    });
  });
});
