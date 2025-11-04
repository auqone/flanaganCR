import { NextResponse } from 'next/server';
import { syncInventory } from '@/lib/automation/inventorySync';

/**
 * Cron job endpoint for syncing inventory
 * Schedule: Every 4 hours
 *
 * Setup in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/sync-inventory",
 *     "schedule": "0 *\/4 * * *"
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
    console.warn('Unauthorized cron request to sync-inventory');
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const result = await syncInventory();

    return NextResponse.json({
      success: true,
      updated: result.updated,
      errors: result.errors,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Inventory sync failed:', error);

    return NextResponse.json({
      success: false,
      error: 'Inventory sync failed'
    }, { status: 500 });
  }
}
