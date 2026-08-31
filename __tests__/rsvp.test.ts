import {
  submitRSVP,
  getRSVPById,
  getRSVPByPhone,
  getRSVPsForInvitation,
  deleteRSVP,
  validateRSVPSubmission,
  calculateStats,
} from '@/lib/rsvp/store';
import { RSVPRecord, RSVPSubmission } from '@/lib/rsvp/types';

describe('RSVP System', () => {
  const testInvitationId = 'test-invitation-001';

  beforeEach(() => {
    // Clean up by using a unique invitation ID for each test
  });

  describe('validateRSVPSubmission', () => {
    it('should reject missing invitation ID', () => {
      const result = validateRSVPSubmission({
        invitationId: '',
        guestName: 'John',
        guestPhone: '08012345678',
        status: 'attending',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invitation ID');
    });

    it('should reject short name', () => {
      const result = validateRSVPSubmission({
        invitationId: 'test-001',
        guestName: 'J',
        guestPhone: '08012345678',
        status: 'attending',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('name');
    });

    it('should reject short phone', () => {
      const result = validateRSVPSubmission({
        invitationId: 'test-001',
        guestName: 'John Doe',
        guestPhone: '0801234',
        status: 'attending',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('phone');
    });

    it('should reject invalid status', () => {
      const result = validateRSVPSubmission({
        invitationId: 'test-001',
        guestName: 'John Doe',
        guestPhone: '08012345678',
        status: 'invalid' as any,
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('status');
    });

    it('should accept valid submission', () => {
      const result = validateRSVPSubmission({
        invitationId: 'test-001',
        guestName: 'John Doe',
        guestPhone: '08012345678',
        status: 'attending',
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('submitRSVP', () => {
    it('should create new RSVP', () => {
      const result = submitRSVP({
        invitationId: testInvitationId,
        guestName: 'Test Guest',
        guestPhone: '08011111111',
        status: 'attending',
        attendeeCount: 2,
      });

      expect(result.success).toBe(true);
      expect(result.rsvp).toBeDefined();
      expect(result.rsvp?.guestName).toBe('Test Guest');
      expect(result.rsvp?.status).toBe('attending');
      expect(result.rsvp?.attendeeCount).toBe(2);
      expect(result.updated).toBeFalsy();
    });

    it('should update existing RSVP', () => {
      const phone = '08022222222';

      // First submission
      submitRSVP({
        invitationId: testInvitationId,
        guestName: 'First Submission',
        guestPhone: phone,
        status: 'attending',
      });

      // Second submission (update)
      const result = submitRSVP({
        invitationId: testInvitationId,
        guestName: 'Updated Name',
        guestPhone: phone,
        status: 'not_attending',
      });

      expect(result.success).toBe(true);
      expect(result.updated).toBe(true);
      expect(result.rsvp?.guestName).toBe('Updated Name');
      expect(result.rsvp?.status).toBe('not_attending');
    });

    it('should reject invalid submission', () => {
      const result = submitRSVP({
        invitationId: '',
        guestName: 'J',
        guestPhone: '123',
        status: 'attending',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getRSVPById', () => {
    it('should return RSVP by ID', () => {
      const submission = submitRSVP({
        invitationId: testInvitationId,
        guestName: 'Find Me',
        guestPhone: '08033333333',
        status: 'maybe',
      });

      if (submission.rsvp) {
        const found = getRSVPById(testInvitationId, submission.rsvp.id);
        expect(found).toBeDefined();
        expect(found?.guestName).toBe('Find Me');
      }
    });

    it('should return null for non-existent RSVP', () => {
      const found = getRSVPById(testInvitationId, 'non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('getRSVPByPhone', () => {
    it('should return RSVP by phone', () => {
      submitRSVP({
        invitationId: testInvitationId,
        guestName: 'Phone Lookup',
        guestPhone: '08044444444',
        status: 'attending',
      });

      const found = getRSVPByPhone(testInvitationId, '08044444444');
      expect(found).toBeDefined();
      expect(found?.guestName).toBe('Phone Lookup');
    });

    it('should return null for non-existent phone', () => {
      const found = getRSVPByPhone(testInvitationId, '08099999999');
      expect(found).toBeNull();
    });
  });

  describe('getRSVPsForInvitation', () => {
    it('should return all RSVPs for invitation', () => {
      const result = getRSVPsForInvitation(testInvitationId);
      expect(result.rsvps).toBeDefined();
      expect(result.stats).toBeDefined();
      expect(result.total).toBeGreaterThanOrEqual(0);
    });

    it('should filter by status', () => {
      const result = getRSVPsForInvitation(testInvitationId, {
        status: 'attending',
      });
      expect(result.rsvps.every((r) => r.status === 'attending')).toBe(true);
    });
  });

  describe('deleteRSVP', () => {
    it('should delete RSVP', () => {
      const submission = submitRSVP({
        invitationId: testInvitationId,
        guestName: 'Delete Me',
        guestPhone: '08055555555',
        status: 'attending',
      });

      if (submission.rsvp) {
        const result = deleteRSVP(testInvitationId, submission.rsvp.id);
        expect(result.success).toBe(true);

        const found = getRSVPById(testInvitationId, submission.rsvp.id);
        expect(found).toBeNull();
      }
    });

    it('should fail for non-existent RSVP', () => {
      const result = deleteRSVP(testInvitationId, 'non-existent-id');
      expect(result.success).toBe(false);
    });
  });

  describe('calculateStats', () => {
    it('should calculate correct stats', () => {
      const rsvps: RSVPRecord[] = [
        {
          id: '1',
          invitationId: testInvitationId,
          guestName: 'A',
          guestPhone: '1',
          status: 'attending',
          attendeeCount: 3,
          createdAt: '',
          updatedAt: '',
        },
        {
          id: '2',
          invitationId: testInvitationId,
          guestName: 'B',
          guestPhone: '2',
          status: 'attending',
          attendeeCount: 1,
          createdAt: '',
          updatedAt: '',
        },
        {
          id: '3',
          invitationId: testInvitationId,
          guestName: 'C',
          guestPhone: '3',
          status: 'not_attending',
          createdAt: '',
          updatedAt: '',
        },
        {
          id: '4',
          invitationId: testInvitationId,
          guestName: 'D',
          guestPhone: '4',
          status: 'maybe',
          createdAt: '',
          updatedAt: '',
        },
      ];

      const stats = calculateStats(rsvps);
      expect(stats.total).toBe(4);
      expect(stats.attending).toBe(2);
      expect(stats.notAttending).toBe(1);
      expect(stats.maybe).toBe(1);
      expect(stats.totalAttendees).toBe(4); // 3 + 1
    });
  });
});
