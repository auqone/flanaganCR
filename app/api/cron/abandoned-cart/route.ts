import { NextResponse } from 'next/server';
import { startAbandonedCartRecovery } from '@/lib/automation/abandonedCart';
import { Resend } from 'resend';

/**
 * Cron job endpoint for abandoned cart recovery
 * Schedule: Every hour
 *
 * Setup in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/abandoned-cart",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */
export async function GET(request: Request) {
  // Verify the request is from a cron job
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');

  if (!cronSecret) {
    console.error('CRON_SECRET environment variable is not set');
    return new Response('Server misconfigured', { status: 500 });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    console.warn('Unauthorized cron request to abandoned-cart');
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Initialize Resend
    const resend = process.env.RESEND_API_KEY
      ? new Resend(process.env.RESEND_API_KEY)
      : null;

    if (!resend) {
      console.warn('Resend API key not configured');
    }

    const emailsSent = await startAbandonedCartRecovery(resend);

    return NextResponse.json({
      success: true,
      emailsSent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Abandoned cart recovery failed:', error);

    return NextResponse.json({
      success: false,
      error: 'Abandoned cart recovery failed'
    }, { status: 500 });
  }
}
