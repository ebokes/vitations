import {
  createOrder,
  getOrderById,
  createPayment,
  getPaymentById,
  getPaymentByReference,
  processSuccessfulPayment,
  processFailedPayment,
  getPackagePricing,
  isOrderPaid,
} from '@/lib/payment/store';
import { generatePaymentReference, verifyWebhookSignature } from '@/lib/payment/paystack';
import { PACKAGE_PRICES_CONFIG } from '@/lib/payment/types';

describe('Payment System', () => {
  const testUserId = 'test-user-001';

  describe('Package Pricing', () => {
    it('should have correct pricing for all tiers', () => {
      expect(PACKAGE_PRICES_CONFIG.essential.amount).toBe(5000000); // ₦50,000
      expect(PACKAGE_PRICES_CONFIG.premium.amount).toBe(15000000); // ₦150,000
      expect(PACKAGE_PRICES_CONFIG.ultimate.amount).toBe(35000000); // ₦350,000
    });

    it('should return pricing for valid tier', () => {
      const pricing = getPackagePricing('premium');
      expect(pricing).toBeDefined();
      expect(pricing?.tier).toBe('premium');
    });

    it('should return null for invalid tier', () => {
      const pricing = getPackagePricing('invalid');
      expect(pricing).toBeNull();
    });
  });

  describe('Order Management', () => {
    it('should create an order', () => {
      const order = createOrder(testUserId, 'premium', 'tpl-elegant-001');
      expect(order).toBeDefined();
      expect(order?.userId).toBe(testUserId);
      expect(order?.packageTier).toBe('premium');
      expect(order?.amount).toBe(15000000);
      expect(order?.status).toBe('pending');
    });

    it('should return null for invalid package', () => {
      const order = createOrder(testUserId, 'invalid', 'tpl-elegant-001');
      expect(order).toBeNull();
    });

    it('should get order by ID', () => {
      const order = createOrder(testUserId, 'essential', 'tpl-modern-003');
      if (order) {
        const found = getOrderById(order.id);
        expect(found).toBeDefined();
        expect(found?.id).toBe(order.id);
      }
    });

    it('should check if order is paid', () => {
      const order = createOrder(testUserId, 'essential', 'tpl-modern-003');
      if (order) {
        expect(isOrderPaid(order.id)).toBe(false);
      }
    });
  });

  describe('Payment Management', () => {
    it('should create a payment', () => {
      const order = createOrder(testUserId, 'essential', 'tpl-modern-003');
      if (order) {
        const payment = createPayment(order.id, testUserId, 'test@example.com', order.amount, 'NGN');
        expect(payment).toBeDefined();
        expect(payment.orderId).toBe(order.id);
        expect(payment.status).toBe('pending');
        expect(payment.reference).toMatch(/^VT-/);
      }
    });

    it('should get payment by ID', () => {
      const order = createOrder(testUserId, 'essential', 'tpl-modern-003');
      if (order) {
        const payment = createPayment(order.id, testUserId, 'test@example.com', order.amount, 'NGN');
        const found = getPaymentById(payment.id);
        expect(found).toBeDefined();
        expect(found?.id).toBe(payment.id);
      }
    });

    it('should get payment by reference', () => {
      const order = createOrder(testUserId, 'essential', 'tpl-modern-003');
      if (order) {
        const payment = createPayment(order.id, testUserId, 'test@example.com', order.amount, 'NGN');
        const found = getPaymentByReference(payment.reference);
        expect(found).toBeDefined();
        expect(found?.reference).toBe(payment.reference);
      }
    });
  });

  describe('Payment Processing', () => {
    it('should process successful payment', () => {
      const order = createOrder(testUserId, 'essential', 'tpl-modern-003');
      if (order) {
        const payment = createPayment(order.id, testUserId, 'test@example.com', order.amount, 'NGN');
        const result = processSuccessfulPayment(
          payment.reference,
          new Date().toISOString(),
          'card'
        );

        expect(result.success).toBe(true);
        expect(result.payment?.status).toBe('success');
        expect(result.order?.status).toBe('paid');
      }
    });

    it('should handle duplicate successful payment', () => {
      const order = createOrder(testUserId, 'essential', 'tpl-modern-003');
      if (order) {
        const payment = createPayment(order.id, testUserId, 'test@example.com', order.amount, 'NGN');

        // Process twice
        processSuccessfulPayment(payment.reference, new Date().toISOString(), 'card');
        const result = processSuccessfulPayment(payment.reference, new Date().toISOString(), 'card');

        expect(result.success).toBe(true);
      }
    });

    it('should process failed payment', () => {
      const order = createOrder(testUserId, 'essential', 'tpl-modern-003');
      if (order) {
        const payment = createPayment(order.id, testUserId, 'test@example.com', order.amount, 'NGN');
        const result = processFailedPayment(payment.reference);

        expect(result).toBeDefined();
        expect(result?.status).toBe('failed');
      }
    });

    it('should return null for non-existent payment', () => {
      const result = processSuccessfulPayment('non-existent', new Date().toISOString(), 'card');
      expect(result.success).toBe(false);
    });
  });

  describe('Payment Reference', () => {
    it('should generate unique references', () => {
      const ref1 = generatePaymentReference('order-001');
      const ref2 = generatePaymentReference('order-002');

      expect(ref1).not.toBe(ref2);
      expect(ref1).toMatch(/^VT-/);
      expect(ref2).toMatch(/^VT-/);
    });
  });

  describe('Webhook Signature', () => {
    it('should return false for invalid signature', () => {
      const result = verifyWebhookSignature('test-payload', 'invalid-signature');
      expect(result).toBe(false);
    });
  });
});
