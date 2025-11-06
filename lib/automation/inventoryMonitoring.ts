import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { generateLowInventoryAlertEmail } from "@/lib/email/templates/lowInventory";

/**
 * Check for low inventory products
 */
export async function checkLowInventory() {
  try {
    // Find products where stockQuantity is low or 0
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        image: true,
        price: true,
      },
    });

    // Filter for low stock (assuming threshold of 10)
    const lowStockProducts = products
      .filter((p) => p.stockQuantity !== null && p.stockQuantity <= 10)
      .map((p) => ({
        id: p.id,
        name: p.name,
        stock: p.stockQuantity || 0,
        lowStockThreshold: 10,
        image: p.image,
        price: p.price,
      }));

    return lowStockProducts;
  } catch (error) {
    console.error("Error checking low inventory:", error);
    return [];
  }
}

/**
 * Send low inventory alert to admins
 */
export async function sendLowInventoryAlert(
  resend: Resend | null,
  products: Array<{
    id: string;
    name: string;
    stock: number;
    lowStockThreshold: number;
    image: string;
    price: number;
  }>
): Promise<boolean> {
  if (!resend) {
    console.warn("Resend not configured, skipping low inventory alert");
    return false;
  }

  if (products.length === 0) {
    console.log("No low inventory products to alert about");
    return true;
  }

  try {
    // Get all admin emails
    const admins = await prisma.admin.findMany({
      where: {
        role: { in: ["SUPER_ADMIN", "ADMIN"] },
      },
      select: {
        email: true,
        name: true,
      },
    });

    if (admins.length === 0) {
      console.warn("No admins found to send low inventory alerts");
      return false;
    }

    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/products`;

    const emailHtml = generateLowInventoryAlertEmail({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        threshold: p.lowStockThreshold,
        image: p.image,
        price: p.price,
      })),
      dashboardUrl,
    });

    // Send email to all admins
    for (const admin of admins) {
      try {
        await resend.emails.send({
          from: "Flanagan Crafted Naturals <alerts@flanagancostarica.com>",
          to: admin.email,
          subject: `⚠️ Low Inventory Alert - ${products.length} Product${products.length > 1 ? "s" : ""} Need Attention`,
          html: emailHtml,
        });

        console.log(`Sent low inventory alert to ${admin.email}`);
      } catch (emailError) {
        console.error(`Failed to send alert to ${admin.email}:`, emailError);
      }
    }

    return true;
  } catch (error) {
    console.error("Error sending low inventory alerts:", error);
    return false;
  }
}

/**
 * Monitor inventory and send alerts (called by cron job)
 */
export async function monitorInventory(resend: Resend | null): Promise<{
  lowStockProducts: number;
  outOfStock: number;
  alertsSent: boolean;
}> {
  try {
    const lowStockProducts = await checkLowInventory();

    const outOfStock = lowStockProducts.filter((p) => p.stock === 0).length;

    const alertsSent = await sendLowInventoryAlert(resend, lowStockProducts);

    return {
      lowStockProducts: lowStockProducts.length,
      outOfStock,
      alertsSent,
    };
  } catch (error) {
    console.error("Error monitoring inventory:", error);
    return {
      lowStockProducts: 0,
      outOfStock: 0,
      alertsSent: false,
    };
  }
}

/**
 * Update product stock after order
 */
export async function decrementProductStock(
  productId: string,
  quantity: number
): Promise<boolean> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stockQuantity: true },
    });

    if (!product) {
      console.error(`Product ${productId} not found`);
      return false;
    }

    const currentStock = product.stockQuantity || 0;
    const newStock = Math.max(0, currentStock - quantity);

    await prisma.product.update({
      where: { id: productId },
      data: { stockQuantity: newStock },
    });

    console.log(
      `Updated product ${productId} stock: ${currentStock} → ${newStock}`
    );

    // Check if product is now low on stock (threshold: 10)
    if (newStock <= 10 && currentStock > 10) {
      console.log(`Product ${productId} is now low on stock (${newStock} units)`);
    }

    return true;
  } catch (error) {
    console.error(`Error decrementing stock for product ${productId}:`, error);
    return false;
  }
}

/**
 * Bulk update product stock
 */
export async function bulkUpdateProductStock(
  updates: Array<{ productId: string; quantity: number }>
): Promise<number> {
  let updated = 0;

  for (const update of updates) {
    const success = await decrementProductStock(
      update.productId,
      update.quantity
    );
    if (success) updated++;
  }

  return updated;
}

/**
 * Get inventory status report
 */
export async function getInventoryReport(): Promise<{
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}> {
  try {
    const products = await prisma.product.findMany({
      select: {
        stockQuantity: true,
        price: true,
      },
    });

    const threshold = 10;
    const lowStock = products.filter(
      (p) => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) <= threshold
    ).length;
    const outOfStock = products.filter((p) => (p.stockQuantity || 0) === 0).length;
    const inStock = products.filter((p) => (p.stockQuantity || 0) > threshold).length;

    const totalValue = products.reduce(
      (sum, p) => sum + (p.stockQuantity || 0) * p.price,
      0
    );

    return {
      totalProducts: products.length,
      inStock,
      lowStock,
      outOfStock,
      totalValue,
    };
  } catch (error) {
    console.error("Error generating inventory report:", error);
    return {
      totalProducts: 0,
      inStock: 0,
      lowStock: 0,
      outOfStock: 0,
      totalValue: 0,
    };
  }
}
