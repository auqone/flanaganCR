import { NextResponse } from 'next/server';
import { startAbandonedCartRecovery } from '@/lib/automation/abandonedCart';

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
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const emailsSent = await startAbandonedCartRecovery();

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
