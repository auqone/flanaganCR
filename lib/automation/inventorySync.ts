import { Product } from './types';

/**
 * Fetch inventory from Spocket
 */
export async function fetchSpocketInventory(): Promise<Product[]> {
  try {
    const response = await fetch('https://api.spocket.co/v1/products', {
      headers: {
        'Authorization': `Bearer ${process.env.SPOCKET_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Spocket inventory');
    }

    const data = await response.json();

    return data.products.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.retail_price,
      supplierPrice: p.cost_price,
      supplierId: 'spocket',
      stock: p.inventory_quantity,
      sku: p.sku
    }));
  } catch (error) {
    console.error('Failed to fetch Spocket inventory:', error);
    return [];
  }
}

/**
 * Sync inventory with database
 */
export async function syncInventory(): Promise<{ updated: number; errors: number }> {
  console.log('Starting inventory sync...');

  const products = await fetchSpocketInventory();
  let updated = 0;
  let errors = 0;

  for (const product of products) {
    try {
      // Update product in database
      // await updateProductInventory(product.id, product.stock);

      // If out of stock, send notification
      if (product.stock === 0) {
        await notifyOutOfStock(product.id, product.name);
      }

      updated++;
    } catch (error) {
      console.error(`Failed to update product ${product.id}:`, error);
      errors++;
    }
  }

  console.log(`Inventory sync complete: ${updated} updated, ${errors} errors`);

  return { updated, errors };
}

/**
 * Notify admin when product is out of stock
 */
async function notifyOutOfStock(productId: string, productName: string): Promise<void> {
  console.log(`⚠️ Product out of stock: ${productName} (${productId})`);

  // Send email notification
  // await sendEmail({
  //   to: 'admin@sellery.com',
  //   subject: `Out of Stock Alert: ${productName}`,
  //   text: `Product ${productName} (ID: ${productId}) is now out of stock.`
  // });
}

/**
 * Monitor price changes from suppliers
 */
export async function monitorPriceChanges(): Promise<void> {
  console.log('Monitoring price changes...');

  const products = await fetchSpocketInventory();

  for (const product of products) {
    // Get current price from database
    // const currentPrice = await getProductPrice(product.id);

    // Calculate your price with markup
    const markup = 2.5; // 150% markup
    const newPrice = product.supplierPrice ? product.supplierPrice * markup : 0;

    // If price changed significantly (more than $1), update
    // if (Math.abs(newPrice - currentPrice) > 1) {
    //   await updateProductPrice(product.id, newPrice);
    //   console.log(`Updated price for ${product.name}: $${currentPrice} -> $${newPrice}`);
    // }
  }

  console.log('Price monitoring complete');
}

/**
 * Auto-repricer based on competition and demand
 */
export function calculateDynamicPrice(
  supplierCost: number,
  avgCompetitorPrice: number,
  demand: number
): number {
  const baseMarkup = 2.5; // 150% markup
  const demandMultiplier = demand > 100 ? 1.1 : 1.0;

  let price = supplierCost * baseMarkup * demandMultiplier;

  // Stay competitive - don't price more than 20% above competition
  if (price > avgCompetitorPrice * 1.2) {
    price = avgCompetitorPrice * 1.05; // 5% above competition
  }

  // Minimum profit margin
  const minPrice = supplierCost * 1.5; // 50% minimum markup
  if (price < minPrice) {
    price = minPrice;
  }

  return Math.round(price * 100) / 100;
}
