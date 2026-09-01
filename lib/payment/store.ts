import {
  PaymentRecord,
  OrderRecord,
  PaymentStatus,
  PaymentFilters,
  PaymentListResponse,
  PackagePricing,
  PACKAGE_PRICES_CONFIG,
  Currency,
} from './types';
import { generatePaymentReference } from './paystack';

// In-memory store for demo purposes
const paymentStore: Map<string, PaymentRecord> = new Map();
const orderStore: Map<string, OrderRecord> = new Map();

let idCounter = 1;

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${idCounter++}`;
}

/**
 * Get package pricing
 */
export function getPackagePricing(tier: string): PackagePricing | null {
  return PACKAGE_PRICES_CONFIG[tier] || null;
}

/**
 * Create a new order
 */
export function createOrder(
  userId: string,
  packageTier: string,
  templateId: string
): OrderRecord | null {
  const pricing = getPackagePricing(packageTier);
  if (!pricing) return null;

  const now = new Date().toISOString();
  const order: OrderRecord = {
    id: generateId('order'),
    userId,
    packageTier: pricing.tier,
    templateId,
    amount: pricing.amount,
    currency: pricing.currency,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  orderStore.set(order.id, order);
  return order;
}

/**
 * Get order by ID
 */
export function getOrderById(orderId: string): OrderRecord | null {
  return orderStore.get(orderId) || null;
}

/**
 * Get orders for a user
 */
export function getOrdersByUser(userId: string): OrderRecord[] {
  return Array.from(orderStore.values()).filter((o) => o.userId === userId);
}

/**
 * Update order status
 */
export function updateOrderStatus(
  orderId: string,
  status: OrderRecord['status'],
  paymentId?: string
): OrderRecord | null {
  const order = orderStore.get(orderId);
  if (!order) return null;

  order.status = status;
  if (paymentId) order.paymentId = paymentId;
  order.updatedAt = new Date().toISOString();

  orderStore.set(orderId, order);
  return order;
}

/**
 * Create a payment record
 */
export function createPayment(
  orderId: string,
  userId: string,
  email: string,
  amount: number,
  currency: Currency
): PaymentRecord {
  const reference = generatePaymentReference(orderId);
  const now = new Date().toISOString();

  const payment: PaymentRecord = {
    id: generateId('payment'),
    orderId,
    userId,
    email,
    amount,
    currency,
    reference,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  paymentStore.set(payment.id, payment);
  return payment;
}

/**
 * Get payment by ID
 */
export function getPaymentById(paymentId: string): PaymentRecord | null {
  return paymentStore.get(paymentId) || null;
}

/**
 * Get payment by reference
 */
export function getPaymentByReference(reference: string): PaymentRecord | null {
  return Array.from(paymentStore.values()).find(
    (p) => p.reference === reference
  ) || null;
}

/**
 * Get payments for an order
 */
export function getPaymentsByOrder(orderId: string): PaymentRecord[] {
  return Array.from(paymentStore.values()).filter((p) => p.orderId === orderId);
}

/**
 * Update payment status
 */
export function updatePaymentStatus(
  reference: string,
  status: PaymentStatus,
  metadata?: {
    paidAt?: string;
    method?: PaymentRecord['method'];
    paystackReference?: string;
  }
): PaymentRecord | null {
  const payment = Array.from(paymentStore.values()).find(
    (p) => p.reference === reference
  );

  if (!payment) return null;

  payment.status = status;
  if (metadata?.paidAt) payment.paidAt = metadata.paidAt;
  if (metadata?.method) payment.method = metadata.method;
  if (metadata?.paystackReference) payment.paystackReference = metadata.paystackReference;
  payment.updatedAt = new Date().toISOString();

  paymentStore.set(payment.id, payment);
  return payment;
}

/**
 * Process successful payment
 */
export function processSuccessfulPayment(
  reference: string,
  paidAt: string,
  method: PaymentRecord['method']
): { success: boolean; payment?: PaymentRecord; order?: OrderRecord; error?: string } {
  // Find payment
  const payment = getPaymentByReference(reference);
  if (!payment) {
    return { success: false, error: 'Payment not found' };
  }

  // Check for duplicate processing
  if (payment.status === 'success') {
    const order = getOrderById(payment.orderId);
    return { success: true, payment, order: order || undefined };
  }

  // Update payment
  const updatedPayment = updatePaymentStatus(reference, 'success', {
    paidAt,
    method,
    paystackReference: reference,
  });

  if (!updatedPayment) {
    return { success: false, error: 'Failed to update payment' };
  }

  // Update order
  const updatedOrder = updateOrderStatus(payment.orderId, 'paid', payment.id);

  return {
    success: true,
    payment: updatedPayment,
    order: updatedOrder || undefined,
  };
}

/**
 * Process failed payment
 */
export function processFailedPayment(
  reference: string,
  reason?: string
): PaymentRecord | null {
  const payment = getPaymentByReference(reference);
  if (!payment) return null;

  return updatePaymentStatus(reference, 'failed');
}

/**
 * Process cancelled payment
 */
export function processCancelledPayment(reference: string): PaymentRecord | null {
  const payment = getPaymentByReference(reference);
  if (!payment) return null;

  const updatedPayment = updatePaymentStatus(reference, 'cancelled');
  updateOrderStatus(payment.orderId, 'cancelled');

  return updatedPayment;
}

/**
 * Get payment history with filters
 */
export function getPaymentHistory(
  filters?: PaymentFilters
): PaymentListResponse {
  let payments = Array.from(paymentStore.values());

  // Apply user filter
  if (filters?.userId) {
    payments = payments.filter((p) => p.userId === filters.userId);
  }

  // Apply status filter
  if (filters?.status) {
    payments = payments.filter((p) => p.status === filters.status);
  }

  // Sort by creation date (newest first)
  payments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Apply pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const total = payments.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedPayments = payments.slice(start, start + limit);

  return {
    payments: paginatedPayments,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Check if order is paid
 */
export function isOrderPaid(orderId: string): boolean {
  const order = getOrderById(orderId);
  return order?.status === 'paid';
}

/**
 * Seed demo payments for testing
 */
export function seedDemoPayments(userId: string): void {
  // Create an order
  const order = createOrder(userId, 'premium', 'tpl-elegant-001');
  if (!order) return;

  // Create payment
  const payment = createPayment(order.id, userId, 'demo@example.com', order.amount, order.currency);

  // Mark as paid
  processSuccessfulPayment(
    payment.reference,
    new Date().toISOString(),
    'card'
  );
}
