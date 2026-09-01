import { customInvitationSchema } from '@/lib/custom-requests/schema';

describe('Custom Invitation Requests', () => {
  describe('Schema validation', () => {
    it('should accept valid input', () => {
      const result = customInvitationSchema.safeParse({
        name: 'Ada Okonkwo',
        phone: '08012345678',
        email: 'ada@example.com',
      });
      expect(result.success).toBe(true);
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
        phone: '080123',
        email: 'ada@example.com',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const result = customInvitationSchema.safeParse({
        name: 'Ada Okonkwo',
        phone: '08012345678',
        email: 'not-an-email',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing fields', () => {
      const result = customInvitationSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });
});
