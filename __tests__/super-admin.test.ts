import {
  SUPER_ADMIN_NAVIGATION,
  formatDesignType,
  formatTemplateStatus,
} from '@/lib/super-admin/types';
import type {
  SuperAdminUser,
  SuperAdminPackage,
  SuperAdminTemplate,
  SuperAdminPlatformStats,
  SuperAdminTab,
  PackageFeature,
} from '@/lib/super-admin/types';

describe('Super Admin System', () => {
  describe('Navigation', () => {
    it('should define super admin navigation items', () => {
      expect(SUPER_ADMIN_NAVIGATION).toHaveLength(5);
      expect(SUPER_ADMIN_NAVIGATION.map((n) => n.id)).toEqual([
        'overview',
        'users',
        'packages',
        'templates',
        'platform',
      ]);
    });

    it('should have labels and icons for all items', () => {
      SUPER_ADMIN_NAVIGATION.forEach((item) => {
        expect(item.label).toBeTruthy();
        expect(item.icon).toBeTruthy();
      });
    });
  });

  describe('formatDesignType', () => {
    it('should format 2d_basic', () => {
      expect(formatDesignType('2d_basic')).toBe('2D Basic');
    });

    it('should format 2d_animated', () => {
      expect(formatDesignType('2d_animated')).toBe('2D Animated');
    });

    it('should format 2d_advanced', () => {
      expect(formatDesignType('2d_advanced')).toBe('2D Advanced');
    });

    it('should format 3d_selected', () => {
      expect(formatDesignType('3d_selected')).toBe('3D Selected');
    });

    it('should format 3d_advanced', () => {
      expect(formatDesignType('3d_advanced')).toBe('3D Advanced');
    });
  });

  describe('formatTemplateStatus', () => {
    it('should format draft', () => {
      const result = formatTemplateStatus('draft');
      expect(result.label).toBe('Draft');
      expect(result.variant).toBe('default');
    });

    it('should format active', () => {
      const result = formatTemplateStatus('active');
      expect(result.label).toBe('Active');
      expect(result.variant).toBe('success');
    });

    it('should format retired', () => {
      const result = formatTemplateStatus('retired');
      expect(result.label).toBe('Retired');
      expect(result.variant).toBe('danger');
    });
  });

  describe('SuperAdminUser', () => {
    it('should have required fields', () => {
      const user: SuperAdminUser = {
        id: '1',
        email: 'admin@example.com',
        fullName: 'Admin User',
        phone: '+2341234567890',
        role: 'super_admin',
        createdAt: '2024-01-01T00:00:00.000Z',
        lastSignInAt: '2024-06-01T00:00:00.000Z',
      };

      expect(user.id).toBe('1');
      expect(user.role).toBe('super_admin');
      expect(user.email).toBe('admin@example.com');
    });
  });

  describe('SuperAdminPackage', () => {
    it('should have required fields with features', () => {
      const features: PackageFeature[] = [
        { id: 'f1', featureKey: 'rsvp', featureName: 'RSVP', featureDescription: null },
      ];

      const pkg: SuperAdminPackage = {
        id: '1',
        tier: 'premium',
        name: 'Premium',
        description: 'Premium package',
        priceNgn: 150000,
        isActive: true,
        features,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-06-01T00:00:00.000Z',
      };

      expect(pkg.tier).toBe('premium');
      expect(pkg.priceNgn).toBe(150000);
      expect(pkg.features).toHaveLength(1);
      expect(pkg.features[0].featureKey).toBe('rsvp');
    });
  });

  describe('SuperAdminTemplate', () => {
    it('should have required fields', () => {
      const template: SuperAdminTemplate = {
        id: '1',
        name: 'Classic Elegance',
        description: 'A classic wedding template',
        designType: '2d_animated',
        category: 'wedding',
        minimumPackage: 'premium',
        previewUrl: null,
        thumbnailUrl: null,
        status: 'active',
        currentVersion: 3,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-06-01T00:00:00.000Z',
      };

      expect(template.name).toBe('Classic Elegance');
      expect(template.designType).toBe('2d_animated');
      expect(template.status).toBe('active');
      expect(template.currentVersion).toBe(3);
    });
  });

  describe('SuperAdminPlatformStats', () => {
    it('should have required fields', () => {
      const stats: SuperAdminPlatformStats = {
        totalUsers: 100,
        usersByRole: { customer: 95, admin: 4, super_admin: 1 },
        totalInvitations: 50,
        totalRevenue: 5000000,
        totalPayments: 45,
        activePackages: 3,
        activeTemplates: 5,
      };

      expect(stats.totalUsers).toBe(100);
      expect(stats.usersByRole.super_admin).toBe(1);
      expect(stats.totalRevenue).toBe(5000000);
    });
  });

  describe('SuperAdminTab type', () => {
    it('should accept valid tab values', () => {
      const tabs: SuperAdminTab[] = ['overview', 'users', 'packages', 'templates', 'platform'];
      expect(tabs).toHaveLength(5);
    });
  });
});
