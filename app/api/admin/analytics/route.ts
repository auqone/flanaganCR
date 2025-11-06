import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth, AdminRole } from "@/lib/api-middleware";

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30"; // days

    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Total revenue
    const totalRevenue = await prisma.order.aggregate({
      where: {
        status: { in: ["PAID", "PROCESSING", "ORDERED_SUPPLIER", "SHIPPED", "DELIVERED"] },
        createdAt: { gte: startDate },
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Total orders
    const totalOrders = await prisma.order.count({
      where: {
        createdAt: { gte: startDate },
      },
    });

    // Orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      where: {
        createdAt: { gte: startDate },
      },
      _count: {
        status: true,
      },
    });

    // Total customers
    const totalCustomers = await prisma.customer.count({
      where: {
        createdAt: { gte: startDate },
      },
    });

    // Average order value
    const avgOrderValue = totalOrders > 0
      ? (totalRevenue._sum.totalAmount || 0) / totalOrders
      : 0;

    // Top selling products
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        order: {
          createdAt: { gte: startDate },
          status: { in: ["PAID", "PROCESSING", "ORDERED_SUPPLIER", "SHIPPED", "DELIVERED"] },
        },
      },
      _sum: {
        quantity: true,
      },
      _count: {
        productId: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
          },
        });
        return {
          ...product,
          totalSold: item._sum.quantity || 0,
          orderCount: item._count.productId,
        };
      })
    );

    // Revenue by day (for chart)
    let dailyRevenue: Array<{ date: string; revenue: number; orders: number }> = [];
    try {
      dailyRevenue = await prisma.$queryRaw`
        SELECT
          DATE("createdAt") as date,
          CAST(SUM("totalAmount") AS DECIMAL(10,2)) as revenue,
          CAST(COUNT(*) AS INTEGER) as orders
        FROM "Order"
        WHERE "status" IN ('PAID', 'PROCESSING', 'ORDERED_SUPPLIER', 'SHIPPED', 'DELIVERED')
          AND "createdAt" >= ${startDate}
        GROUP BY DATE("createdAt")
        ORDER BY DATE("createdAt") ASC
      `;
    } catch (error) {
      console.error("Error fetching daily revenue:", error);
      // Continue with empty array
    }

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    // Calculate profit (if basePrice is available)
    const ordersWithProfit = await prisma.order.findMany({
      where: {
        status: { in: ["PAID", "PROCESSING", "ORDERED_SUPPLIER", "SHIPPED", "DELIVERED"] },
        createdAt: { gte: startDate },
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                basePrice: true,
              },
            },
          },
        },
      },
    });

    let totalProfit = 0;
    ordersWithProfit.forEach((order: any) => {
      order.orderItems.forEach((item: any) => {
        if (item.product.basePrice) {
          const costPrice = item.product.basePrice * item.quantity;
          const sellPrice = item.price * item.quantity;
          totalProfit += (sellPrice - costPrice);
        }
      });
    });

    return NextResponse.json({
      period: periodDays,
      summary: {
        totalRevenue: Number(totalRevenue._sum.totalAmount) || 0,
        totalOrders: totalOrders || 0,
        totalCustomers: totalCustomers || 0,
        avgOrderValue: Number(avgOrderValue) || 0,
        totalProfit: Number(totalProfit) || 0,
      },
      ordersByStatus: ordersByStatus || [],
      topProducts: topProductsWithDetails || [],
      dailyRevenue: dailyRevenue || [],
      recentOrders: recentOrders ? recentOrders.slice(0, 5) : [],
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// RBAC: Only Admin+ can view company analytics (revenue, profit, etc.)
export const GET = withAdminAuth(handleGET, AdminRole.ADMIN);
