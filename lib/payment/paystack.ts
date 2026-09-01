import crypto from 'crypto';
import {
  PaymentInitialization,
  PaymentInitializationResponse,
  PaymentVerification,
  WebhookEvent,
  Currency,
} from './types';

// Paystack API base URL
const PAYSTACK_API_URL = 'https://api.paystack.co';

/**
 * Get Paystack configuration from environment
 */
function getPaystackConfig() {
  return {
    secretKey: process.env.PAYSTACK_SECRET_KEY || '',
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || '',
  };
}

/**
 * Make a request to Paystack API
 */
async function paystackRequest(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: Record<string, unknown>
): Promise<unknown> {
  const config = getPaystackConfig();
  const url = `${PAYSTACK_API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.secretKey}`,
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && method === 'POST') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!data.status) {
    throw new Error(data.message || 'Paystack API error');
  }

  return data.data;
}

/**
 * Initialize a Paystack transaction
 */
export async function initializeTransaction(
  initialization: PaymentInitialization
): Promise<PaymentInitializationResponse> {
  try {
    const result = (await paystackRequest('/transaction/initialize', 'POST', {
      email: initialization.email,
      amount: initialization.amount,
      currency: initialization.currency,
      reference: initialization.reference,
      callback_url: initialization.callbackUrl,
      metadata: {
        order_id: initialization.orderId,
        ...initialization.metadata,
      },
    })) as {
      authorization_url: string;
      access_code: string;
      reference: string;
    };

    return {
      success: true,
      authorizationUrl: result.authorization_url,
      accessCode: result.access_code,
      reference: result.reference,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initialize payment',
    };
  }
}

/**
 * Verify a Paystack transaction
 */
export async function verifyTransaction(
  reference: string
): Promise<PaymentVerification | null> {
  try {
    const result = (await paystackRequest(
      `/transaction/verify/${reference}`
    )) as {
      id: number;
      reference: string;
      amount: number;
      currency: string;
      status: string;
      paid_at: string;
      channel: string;
      metadata?: Record<string, string>;
    };

    const statusMap: Record<string, PaymentVerification['status']> = {
      success: 'success',
      failed: 'failed',
      abandoned: 'abandoned',
      pending: 'pending',
    };

    return {
      reference: result.reference,
      amount: result.amount,
      currency: result.currency as Currency,
      status: statusMap[result.status] || 'pending',
      paidAt: result.paid_at,
      channel: result.channel as PaymentVerification['channel'],
      metadata: result.metadata,
    };
  } catch (error) {
    console.error('Payment verification failed:', error);
    return null;
  }
}

/**
 * Verify Paystack webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const config = getPaystackConfig();

  if (!config.webhookSecret) {
    console.warn('Paystack webhook secret not configured');
    return false;
  }

  const hash = crypto
    .createHmac('sha512', config.webhookSecret)
    .update(payload)
    .digest('hex');

  return hash === signature;
}

/**
 * Parse webhook event payload
 */
export function parseWebhookEvent(payload: string): WebhookEvent | null {
  try {
    const event = JSON.parse(payload) as WebhookEvent;
    return event;
  } catch (error) {
    console.error('Failed to parse webhook event:', error);
    return null;
  }
}

/**
 * Generate a unique payment reference
 */
export function generatePaymentReference(orderId: string): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `VT-${orderId.slice(-8)}-${timestamp}-${random}`;
}

/**
 * Check if a transaction was successful
 */
export function isTransactionSuccessful(verification: PaymentVerification): boolean {
  return verification.status === 'success';
}

/**
 * Get Paystack public key for client-side
 */
export function getPaystackPublicKey(): string {
  const config = getPaystackConfig();
  return config.publicKey;
}
