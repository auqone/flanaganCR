import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import {
  generateAbandonedCartEmail,
  generateFollowUpAbandonedCartEmail,
  AbandonedCartEmailData,
} from "@/lib/email/templates/abandonedCart";

/**
 * Find abandoned carts (not updated in 1+ hours with items, no recovery email sent)
 */
export async function findAbandonedCarts() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    // First reminder: 1 hour after abandonment
    const firstReminderCarts = await prisma.cart.findMany({
      where: {
        lastUpdated: {
          lt: oneHourAgo,
          gte: twentyFourHoursAgo,
        },
        recoveryEmailSent: false,
        customerEmail: { not: null },
      },
      include: {
        items: true,
      },
    });

    return firstReminderCarts;
  } catch (error) {
    console.error("Error finding abandoned carts:", error);
    return [];
  }
}

/**
 * Find carts for follow-up email (24 hours after first email)
 */
export async function findCartsForFollowUp() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  try {
    const followUpCarts = await prisma.cart.findMany({
      where: {
        lastUpdated: {
          lt: twentyFourHoursAgo,
          gte: fortyEightHoursAgo,
        },
        recoveryEmailSent: true,
        customerEmail: { not: null },
      },
      include: {
        items: true,
      },
    });

    return followUpCarts;
  } catch (error) {
    console.error("Error finding follow-up carts:", error);
    return [];
  }
}

/**
 * Send abandoned cart recovery email
 */
export async function sendAbandonedCartEmail(
  cart: any,
  resend: Resend | null,
  options?: {
    discountCode?: string;
    discountAmount?: number;
    isFollowUp?: boolean;
  }
): Promise<boolean> {
  if (!resend) {
    console.warn("Resend not configured, skipping email");
    return false;
  }

  if (!cart.customerEmail) {
    console.warn(`Cart ${cart.id} has no customer email`);
    return false;
  }

  try {
    const emailData: AbandonedCartEmailData = {
      customerEmail: cart.customerEmail,
      cartItems: cart.items.map((item: any) => ({
        productName: item.productName,
        productImage: item.productImage,
        price: item.price,
        quantity: item.quantity,
      })),
      cartTotal: cart.total,
      recoveryUrl: `${process.env.NEXT_PUBLIC_APP_URL}/cart?session=${cart.sessionId}`,
      discountCode: options?.discountCode,
      discountAmount: options?.discountAmount,
    };

    const emailHtml = options?.isFollowUp
      ? generateFollowUpAbandonedCartEmail(emailData)
      : generateAbandonedCartEmail(emailData);

    const subject = options?.isFollowUp
      ? "⏰ Last Chance - Your Cart Expires Soon!"
      : "🛒 You Left Something Behind - Complete Your Purchase";

    await resend.emails.send({
      from: "Flanagan Crafted Naturals <orders@flanagancostarica.com>",
      to: cart.customerEmail,
      subject,
      html: emailHtml,
    });

    console.log(`Sent ${options?.isFollowUp ? "follow-up" : "initial"} recovery email to ${cart.customerEmail}`);
    return true;
  } catch (error) {
    console.error(`Failed to send recovery email for cart ${cart.id}:`, error);
    return false;
  }
}

/**
 * Start abandoned cart recovery sequence
 */
export async function startAbandonedCartRecovery(resend: Resend | null): Promise<number> {
  console.log("Starting abandoned cart recovery...");

  try {
    // Send initial recovery emails (1 hour after abandonment)
    const abandonedCarts = await findAbandonedCarts();
    let emailsSent = 0;

    for (const cart of abandonedCarts) {
      const sent = await sendAbandonedCartEmail(cart, resend);

      if (sent) {
        // Mark recovery email as sent
        await prisma.cart.update({
          where: { id: cart.id },
          data: { recoveryEmailSent: true },
        });
        emailsSent++;
      }
    }

    // Send follow-up emails (24 hours after first email) with discount
    const followUpCarts = await findCartsForFollowUp();

    for (const cart of followUpCarts) {
      const sent = await sendAbandonedCartEmail(cart, resend, {
        discountCode: "COMEBACK10",
        discountAmount: cart.total * 0.1,
        isFollowUp: true,
      });

      if (sent) {
        emailsSent++;
      }
    }

    console.log(
      `Abandoned cart recovery complete: ${emailsSent} emails sent (${abandonedCarts.length} initial, ${followUpCarts.length} follow-ups)`
    );

    return emailsSent;
  } catch (error) {
    console.error("Abandoned cart recovery failed:", error);
    return 0;
  }
}

/**
 * Calculate cart abandonment rate
 */
export async function calculateAbandonmentRate(): Promise<number> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const totalCarts = await prisma.cart.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const completedOrders = await prisma.order.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] },
      },
    });

    if (totalCarts === 0) return 0;

    const rate = ((totalCarts - completedOrders) / totalCarts) * 100;
    return Math.round(rate * 100) / 100;
  } catch (error) {
    console.error("Error calculating abandonment rate:", error);
    return 0;
  }
}

/**
 * Generate abandoned cart report
 */
export async function generateAbandonedCartReport(): Promise<{
  rate: number;
  activeCarts: number;
  potentialRevenue: number;
  topProducts: Array<{ productName: string; count: number }>;
}> {
  try {
    const rate = await calculateAbandonmentRate();

    const activeCarts = await prisma.cart.findMany({
      where: {
        recoveryEmailSent: false,
      },
      include: {
        items: true,
      },
    });

    const potentialRevenue = activeCarts.reduce(
      (sum, cart) => sum + cart.total,
      0
    );

    // Get top abandoned products
    const allItems = activeCarts.flatMap((cart) => cart.items);
    const productCounts: { [key: string]: number } = {};

    allItems.forEach((item: any) => {
      productCounts[item.productName] =
        (productCounts[item.productName] || 0) + 1;
    });

    const topProducts = Object.entries(productCounts)
      .map(([productName, count]) => ({ productName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      rate,
      activeCarts: activeCarts.length,
      potentialRevenue,
      topProducts,
    };
  } catch (error) {
    console.error("Error generating abandoned cart report:", error);
    return {
      rate: 0,
      activeCarts: 0,
      potentialRevenue: 0,
      topProducts: [],
    };
  }
}

/**
 * Create or update cart in database
 */
export async function upsertCart(data: {
  sessionId: string;
  customerEmail?: string;
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}): Promise<void> {
  try {
    const existingCart = await prisma.cart.findUnique({
      where: { sessionId: data.sessionId },
    });

    if (existingCart) {
      // Update existing cart
      await prisma.cart.update({
        where: { sessionId: data.sessionId },
        data: {
          customerEmail: data.customerEmail,
          total: data.total,
          lastUpdated: new Date(),
          items: {
            deleteMany: {},
            create: data.items,
          },
        },
      });
    } else {
      // Create new cart
      await prisma.cart.create({
        data: {
          sessionId: data.sessionId,
          customerEmail: data.customerEmail,
          total: data.total,
          items: {
            create: data.items,
          },
        },
      });
    }
  } catch (error) {
    console.error("Error upserting cart:", error);
  }
}

/**
 * Delete cart after successful checkout
 */
export async function deleteCart(sessionId: string): Promise<void> {
  try {
    await prisma.cart.delete({
      where: { sessionId },
    });
    console.log(`Deleted cart for session ${sessionId}`);
  } catch (error) {
    console.error(`Error deleting cart for session ${sessionId}:`, error);
  }
}
