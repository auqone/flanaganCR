import { NextResponse } from 'next/server';
import { processNewOrder } from '@/lib/automation/orderAutomation';
import { Order } from '@/lib/automation/types';

/**
 * Webhook endpoint for order creation
 * This gets called automatically when a new order is placed
 */
export async function POST(request: Request) {
  try {
    const order: Order = await request.json();

    // Verify webhook signature (implement your verification)
    // const signature = request.headers.get('x-webhook-signature');
    // if (!verifySignature(signature, order)) {
    //   return new Response('Invalid signature', { status: 401 });
    // }

    // Process the order asynchronously
    await processNewOrder(order);

    return NextResponse.json({
      success: true,
      orderId: order.id
    });
  } catch (error) {
    console.error('Order webhook failed:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to process order webhook'
    }, { status: 500 });
  }
}
