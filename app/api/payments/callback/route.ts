import { NextRequest, NextResponse } from 'next/server';
import { verifyTransaction } from '@/lib/payment/paystack';
import { processSuccessfulPayment, processFailedPayment } from '@/lib/payment/store';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');

  // Use reference or trxref
  const paymentReference = reference || trxref;

  if (!paymentReference) {
    // Redirect to error page
    return NextResponse.redirect(
      new URL('/payment/failed?error=no_reference', request.url)
    );
  }

  try {
    // Verify transaction with Paystack
    const verification = await verifyTransaction(paymentReference);

    if (!verification) {
      return NextResponse.redirect(
        new URL('/payment/failed?error=verification_failed', request.url)
      );
    }

    if (verification.status === 'success') {
      // Process successful payment
      const result = processSuccessfulPayment(
        paymentReference,
        verification.paidAt || new Date().toISOString(),
        verification.channel as any
      );

      if (result.success) {
        // Redirect to success page
        return NextResponse.redirect(
          new URL(`/payment/success?reference=${paymentReference}`, request.url)
        );
      }
    }

    // Payment failed or pending
    processFailedPayment(paymentReference);
    return NextResponse.redirect(
      new URL(`/payment/failed?reference=${paymentReference}&status=${verification.status}`, request.url)
    );
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(
      new URL('/payment/failed?error=callback_error', request.url)
    );
  }
}
