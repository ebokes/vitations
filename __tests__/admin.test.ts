import {
  formatUserRole,
  formatPaymentStatus,
  formatCustomRequestStatus,
  formatModerationStatus,
  ADMIN_NAVIGATION,
} from '@/lib/admin/types';
import type {
  AdminDashboardStats,
  AdminCustomer,
  AdminInvitation,
  AdminAuditLog,
  AdminTab,
} from '@/lib/admin/types';

describe('Admin System', () => {
  describe('Navigation', () => {
    it('should define admin navigation items', () => {
      expect(ADMIN_NAVIGATION).toHaveLength(6);
      expect(ADMIN_NAVIGATION.map((n) => n.id)).toEqual([
        'overview',
        'customers',
        'invitations',
        'media',
        'custom-requests',
        'audit-log',
      ]);
    });

    it('should have labels for all navigation items', () => {
      ADMIN_NAVIGATION.forEach((item) => {
        expect(item.label).toBeTruthy();
        expect(item.icon).toBeTruthy();
      });
    });
  });

  describe('formatUserRole', () => {
    it('should format customer role', () => {
      expect(formatUserRole('customer')).toBe('Customer');
    });

    it('should format admin role', () => {
      expect(formatUserRole('admin')).toBe('Admin');
    });

    it('should format super_admin role', () => {
      expect(formatUserRole('super_admin')).toBe('Super Admin');
    });
  });

  describe('formatPaymentStatus', () => {
    it('should format pending status', () => {
      const result = formatPaymentStatus('pending');
      expect(result.label).toBe('Pending');
      expect(result.variant).toBe('warning');
    });

    it('should format completed status', () => {
      const result = formatPaymentStatus('completed');
      expect(result.label).toBe('Completed');
      expect(result.variant).toBe('success');
    });

    it('should format failed status', () => {
      const result = formatPaymentStatus('failed');
      expect(result.label).toBe('Failed');
      expect(result.variant).toBe('danger');
    });

    it('should format refunded status', () => {
      const result = formatPaymentStatus('refunded');
      expect(result.label).toBe('Refunded');
      expect(result.variant).toBe('default');
    });
  });

  describe('formatCustomRequestStatus', () => {
    it('should format new status', () => {
      const result = formatCustomRequestStatus('new');
      expect(result.label).toBe('New');
      expect(result.variant).toBe('warning');
    });

    it('should format contacted status', () => {
      const result = formatCustomRequestStatus('contacted');
      expect(result.label).toBe('Contacted');
    });

    it('should format accepted status', () => {
      const result = formatCustomRequestStatus('accepted');
      expect(result.label).toBe('Accepted');
      expect(result.variant).toBe('success');
    });

    it('should format cancelled status', () => {
      const result = formatCustomRequestStatus('cancelled');
      expect(result.label).toBe('Cancelled');
      expect(result.variant).toBe('danger');
    });
  });

  describe('formatModerationStatus', () => {
    it('should format pending status', () => {
      const result = formatModerationStatus('pending');
      expect(result.label).toBe('Pending Review');
      expect(result.variant).toBe('warning');
    });

    it('should format approved status', () => {
      const result = formatModerationStatus('approved');
      expect(result.label).toBe('Approved');
      expect(result.variant).toBe('success');
    });

    it('should format rejected status', () => {
      const result = formatModerationStatus('rejected');
      expect(result.label).toBe('Rejected');
      expect(result.variant).toBe('danger');
    });
  });

  describe('AdminDashboardStats', () => {
    it('should have required fields', () => {
      const stats: AdminDashboardStats = {
        totalCustomers: 0,
        totalInvitations: 0,
        pendingReview: 0,
        pendingMedia: 0,
        pendingCustomRequests: 0,
        totalRevenue: 0,
        recentSignups: 0,
        invitationsByStatus: {
          draft: 0,
          submitted: 0,
          approved: 0,
          published: 0,
          archived: 0,
          locked: 0,
          unlocked_by_admin: 0,
          completed: 0,
        },
        revenueByPackage: {
          essential: 0,
          premium: 0,
          ultimate: 0,
        },
      };

      expect(stats.totalCustomers).toBe(0);
      expect(stats.totalInvitations).toBe(0);
      expect(stats.pendingReview).toBe(0);
      expect(stats.invitationsByStatus.draft).toBe(0);
    });
  });

  describe('AdminCustomer', () => {
    it('should have required fields', () => {
      const customer: AdminCustomer = {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
        phone: '+2341234567890',
        role: 'customer',
        createdAt: '2024-01-01T00:00:00.000Z',
        invitationCount: 1,
        activeInvitationStatus: 'published',
        packageTier: 'premium',
        totalSpent: 150000,
      };

      expect(customer.id).toBe('1');
      expect(customer.email).toBe('test@example.com');
      expect(customer.role).toBe('customer');
      expect(customer.totalSpent).toBe(150000);
    });
  });

  describe('AdminInvitation', () => {
    it('should have required fields', () => {
      const invitation: AdminInvitation = {
        id: '1',
        customerId: 'c1',
        customerEmail: 'test@example.com',
        customerName: 'Test User',
        status: 'submitted',
        packageTier: 'ultimate',
        templateName: 'Classic Elegance',
        coupleNamePrimary: 'Ada',
        coupleNameSecondary: 'Emeka',
        eventDate: '2024-06-15T00:00:00.000Z',
        slug: 'ada-and-emeka',
        submittedAt: '2024-01-15T00:00:00.000Z',
        lockedAt: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z',
      };

      expect(invitation.status).toBe('submitted');
      expect(invitation.packageTier).toBe('ultimate');
      expect(invitation.coupleNamePrimary).toBe('Ada');
    });
  });

  describe('AdminAuditLog', () => {
    it('should have required fields', () => {
      const log: AdminAuditLog = {
        id: '1',
        actorId: 'admin1',
        actorEmail: 'admin@example.com',
        action: 'unlock_invitation',
        resourceType: 'invitation',
        resourceId: 'inv1',
        oldData: { status: 'locked' },
        newData: { status: 'unlocked_by_admin', reason: 'Editing' },
        metadata: null,
        ipAddress: '127.0.0.1',
        createdAt: '2024-01-15T00:00:00.000Z',
      };

      expect(log.action).toBe('unlock_invitation');
      expect(log.resourceType).toBe('invitation');
      expect(log.oldData?.status).toBe('locked');
      expect(log.newData?.status).toBe('unlocked_by_admin');
    });
  });

  describe('AdminTab type', () => {
    it('should accept valid tab values', () => {
      const tabs: AdminTab[] = [
        'overview',
        'customers',
        'invitations',
        'media',
        'custom-requests',
        'audit-log',
      ];
      expect(tabs).toHaveLength(6);
    });
  });
});
