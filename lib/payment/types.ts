export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed' | 'cancelled' | 'abandoned';
export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd' | 'qr' | 'mobile_money' | 'bank';
export type Currency = 'NGN' | 'USD' | 'GHS' | 'ZAR' | 'KES';

export interface PaymentConfig {
  currency: Currency;
  supportedMethods: PaymentMethod[];
  paystackPublicKey: string;
  paystackSecretKey: string;
  paystackWebhookSecret: string;
  callbackUrl: string;
}

export interface PackagePricing {
  tier: 'essential' | 'premium' | 'ultimate';
  amount: number; // in kobo (smallest currency unit)
  currency: Currency;
  label: string;
  description: string;
}

export interface PaymentInitialization {
  orderId: string;
  email: string;
  amount: number; // in kobo
  currency: Currency;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, string>;
}

export interface PaymentInitializationResponse {
  success: boolean;
  authorizationUrl?: string;
  accessCode?: string;
  reference?: string;
  error?: string;
}

export interface PaymentVerification {
  reference: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  paidAt?: string;
  channel?: PaymentMethod;
  metadata?: Record<string, string>;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  userId: string;
  email: string;
  amount: number;
  currency: Currency;
  reference: string;
  status: PaymentStatus;
  method?: PaymentMethod;
  paystackReference?: string;
  paystackAccessCode?: string;
  paidAt?: string;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEvent {
  id: string;
  event: string;
  data: {
    reference: string;
    amount: number;
    currency: string;
    status: string;
    paid_at: string;
    channel: string;
    metadata?: Record<string, string>;
  };
}

export interface OrderRecord {
  id: string;
  userId: string;
  packageTier: 'essential' | 'premium' | 'ultimate';
  templateId: string;
  amount: number;
  currency: Currency;
  paymentId?: string;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  userId?: string;
  page?: number;
  limit?: number;
}

export interface PaymentListResponse {
  payments: PaymentRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Package pricing configuration
export const PACKAGE_PRICES_CONFIG: Record<string, PackagePricing> = {
  essential: {
    tier: 'essential',
    amount: 5000000, // ₦50,000 in kobo
    currency: 'NGN',
    label: 'Essential',
    description: 'Basic invitation with essential features',
  },
  premium: {
    tier: 'premium',
    amount: 15000000, // ₦150,000 in kobo
    currency: 'NGN',
    label: 'Premium',
    description: 'Advanced features with gift registry and gallery',
  },
  ultimate: {
    tier: 'ultimate',
    amount: 35000000, // ₦350,000 in kobo
    currency: 'NGN',
    label: 'Ultimate',
    description: 'Full features with 3D, livestream, and guest uploads',
  },
};

// Currency symbols
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  NGN: '₦',
  USD: '$',
  GHS: 'GH₵',
  ZAR: 'R',
  KES: 'KSh',
};

// Format amount to display
export function formatPaymentAmount(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = (amount / 100).toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${symbol}${formatted}`;
}

// Format amount from kobo to naira
export function koboToNaira(kobo: number): number {
  return kobo / 100;
}

// Convert naira to kobo
export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}
