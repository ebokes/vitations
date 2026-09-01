'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { XCircle, RefreshCw, Home, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const status = searchParams.get('status');
  const reference = searchParams.get('reference');

  const getErrorMessage = () => {
    switch (error) {
      case 'no_reference':
        return 'No payment reference was provided.';
      case 'verification_failed':
        return 'We could not verify your payment. Please contact support.';
      case 'callback_error':
        return 'An error occurred while processing your payment.';
      default:
        if (status === 'failed') {
          return 'Your payment was not successful. Please try again.';
        }
        if (status === 'abandoned') {
          return 'Payment was abandoned. Please try again.';
        }
        return 'Something went wrong with your payment.';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-neutral-900">Payment Failed</h1>
          <p className="mt-4 text-neutral-600">{getErrorMessage()}</p>
          {reference && (
            <p className="mt-2 text-sm text-neutral-500">
              Reference: {reference}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/setup">
              <Button className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="w-full">
                <HelpCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 flex items-center justify-center">Loading...</div>}>
      <PaymentFailedContent />
    </Suspense>
  );
}
