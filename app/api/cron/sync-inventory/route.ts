import { NextResponse } from 'next/server';
import { syncInventory } from '@/lib/automation/inventorySync';
import { monitorInventory } from '@/lib/automation/inventoryMonitoring';
import { Resend } from 'resend';

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
    // Initialize Resend
    const resend = process.env.RESEND_API_KEY
      ? new Resend(process.env.RESEND_API_KEY)
      : null;

    // Sync inventory (placeholder - customize based on your needs)
    const syncResult = await syncInventory();

    // Monitor inventory and send low stock alerts
    const monitorResult = await monitorInventory(resend);

    return NextResponse.json({
      success: true,
      sync: {
        updated: syncResult.updated,
        errors: syncResult.errors,
      },
      monitoring: {
        lowStockProducts: monitorResult.lowStockProducts,
        outOfStock: monitorResult.outOfStock,
        alertsSent: monitorResult.alertsSent,
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Inventory sync/monitoring failed:', error);

    return NextResponse.json({
      success: false,
      error: 'Inventory sync/monitoring failed'
    }, { status: 500 });
  }
}
