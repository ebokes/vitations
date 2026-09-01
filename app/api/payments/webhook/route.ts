import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, parseWebhookEvent, verifyTransaction } from '@/lib/payment/paystack';
import { processSuccessfulPayment, processFailedPayment, getPaymentByReference } from '@/lib/payment/store';

export async function POST(request: NextRequest) {
  try {
    // Get the raw body
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature') || '';

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse the event
    const event = parseWebhookEvent(body);
    if (!event) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    }

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event);
        break;

      case 'charge.failed':
        await handleChargeFailed(event);
        break;

      case 'charge.pending':
        await handleChargePending(event);
        break;

      default:
        // Ignore other events
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleChargeSuccess(event: import('@/lib/payment/types').WebhookEvent) {
  const { reference } = event.data;

  // Verify transaction with Paystack (don't trust webhook alone)
  const verification = await verifyTransaction(reference);
  if (!verification) {
    console.error('Failed to verify transaction:', reference);
    return;
  }

  // Check if verification matches webhook data
  if (verification.status !== 'success') {
    console.error('Verification status mismatch:', reference);
    return;
  }

  // Process the successful payment
  const result = processSuccessfulPayment(
    reference,
    verification.paidAt || new Date().toISOString(),
    verification.channel as any
  );

  if (!result.success) {
    console.error('Failed to process payment:', reference, result.error);
  }
}

async function handleChargeFailed(event: import('@/lib/payment/types').WebhookEvent) {
  const { reference } = event.data;
  processFailedPayment(reference);
}

async function handleChargePending(event: import('@/lib/payment/types').WebhookEvent) {
  // Handle pending - may need to check later
  console.log('Payment pending:', event.data.reference);
}
