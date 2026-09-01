import { NextRequest, NextResponse } from 'next/server';
import { initializeTransaction, generatePaymentReference } from '@/lib/payment/paystack';
import { createPayment, getOrderById, getPackagePricing } from '@/lib/payment/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, email, amount, currency = 'NGN' } = body;

    // Validate required fields
    if (!orderId || !email || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify order exists
    const order = getOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify amount matches order
    const pricing = getPackagePricing(order.packageTier);
    if (!pricing || pricing.amount !== amount) {
      return NextResponse.json(
        { error: 'Amount mismatch' },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = createPayment(orderId, order.userId, email, amount, currency as any);

    // Generate reference
    const reference = payment.reference;

    // Initialize Paystack transaction
    const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payments/callback`;

    const result = await initializeTransaction({
      orderId,
      email,
      amount,
      currency: currency as any,
      reference,
      callbackUrl,
      metadata: {
        order_id: orderId,
        package_tier: order.packageTier,
      },
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: result.authorizationUrl,
      accessCode: result.accessCode,
      reference: result.reference,
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
