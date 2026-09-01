'use client';

import * as React from 'react';
import { Loader2, CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PaymentRecord, PaymentStatus, PACKAGE_PRICES_CONFIG, CURRENCY_SYMBOLS } from './types';
import { initializeTransaction, getPaystackPublicKey } from './paystack';

interface PaymentFormProps {
  orderId: string;
  email: string;
  amount: number;
  currency?: string;
  packageName: string;
  onSuccess?: (payment: PaymentRecord) => void;
  onError?: (error: string) => void;
}

export function PaymentForm({
  orderId,
  email,
  amount,
  currency = 'NGN',
  packageName,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    setStatus('processing');

    try {
      // In production, this would be a server action
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          email,
          amount,
          currency,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      // Redirect to Paystack
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      setStatus('failed');
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formattedAmount = `${CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] || '₦'}${(amount / 100).toLocaleString()}`;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-neutral-900">Payment</h3>
        </div>

        <div className="space-y-4">
          {/* Order Summary */}
          <div className="rounded-lg bg-neutral-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Package</span>
              <span className="font-medium text-neutral-900 capitalize">{packageName}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-neutral-600">Amount</span>
              <span className="text-lg font-bold text-primary-600">{formattedAmount}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-lg border border-neutral-200 p-4">
            <p className="text-sm font-medium text-neutral-900">Payment Method</p>
            <p className="mt-1 text-sm text-neutral-600">
              Secure payment via Paystack
            </p>
            <div className="mt-3 flex gap-2">
              <Badge variant="secondary">Card</Badge>
              <Badge variant="secondary">Bank Transfer</Badge>
              <Badge variant="secondary">USSD</Badge>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Success Message */}
          {status === 'success' && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Payment successful! Redirecting...
            </div>
          )}

          {/* Failed Message */}
          {status === 'failed' && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <XCircle className="h-4 w-4" />
              Payment failed. Please try again.
            </div>
          )}

          {/* Pay Button */}
          <Button
            onClick={handlePayment}
            disabled={loading || status === 'success'}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Payment Successful
              </>
            ) : (
              `Pay ${formattedAmount}`
            )}
          </Button>

          {/* Security Note */}
          <p className="text-center text-xs text-neutral-500">
            Your payment is secured by Paystack. We never store your card details.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface PaymentStatusDisplayProps {
  payment: PaymentRecord;
}

export function PaymentStatusDisplay({ payment }: PaymentStatusDisplayProps) {
  const statusConfig: Record<
    PaymentStatus,
    { color: string; icon: React.ElementType; label: string }
  > = {
    pending: { color: 'text-yellow-600', icon: AlertCircle, label: 'Pending' },
    processing: { color: 'text-blue-600', icon: Loader2, label: 'Processing' },
    success: { color: 'text-green-600', icon: CheckCircle, label: 'Successful' },
    failed: { color: 'text-red-600', icon: XCircle, label: 'Failed' },
    cancelled: { color: 'text-neutral-600', icon: XCircle, label: 'Cancelled' },
    abandoned: { color: 'text-neutral-600', icon: XCircle, label: 'Abandoned' },
  };

  const config = statusConfig[payment.status];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${config.color}`} />
      <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
    </div>
  );
}
