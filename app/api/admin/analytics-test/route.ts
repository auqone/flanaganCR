import { NextResponse, NextRequest } from "next/server";
import { withAdminAuth } from "@/lib/api-middleware";

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get("period") || "30", 10);

    // Mock analytics data
    const summary = {
      totalRevenue: 12450.75,
      totalOrders: 148,
      totalCustomers: 89,
      avgOrderValue: 84.13,
      totalProfit: 3112.69,
    };

    const ordersByStatus = [
      { status: "COMPLETED", _count: { status: 95 } },
      { status: "PENDING", _count: { status: 32 } },
      { status: "SHIPPED", _count: { status: 18 } },
      { status: "CANCELLED", _count: { status: 3 } },
    ];

    const topProducts = [
      {
        id: "1",
        name: "Self Heal By Design",
        price: 9.99,
        image: "https://ae01.alicdn.com/kf/S1563f315a52b41c0b1268e90c9bdd973V.jpg",
        totalSold: 45,
        orderCount: 42,
      },
      {
        id: "2",
        name: "Wireless Bluetooth Earbuds",
        price: 24.99,
        image: "https://ae01.alicdn.com/kf/S8d4e2e5e7f6c4b9da3c1e8f9d2a5b6c7D.jpg",
        totalSold: 38,
        orderCount: 35,
      },
      {
        id: "4",
        name: "Minimalist Leather Wallet",
        price: 16.99,
        image: "https://ae01.alicdn.com/kf/A1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6Q.jpg",
        totalSold: 32,
        orderCount: 29,
      },
    ];

    const dailyRevenue = Array.from({ length: period }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (period - 1 - i));
      return {
        date: date.toISOString().split("T")[0],
        revenue: Math.floor(Math.random() * 500) + 100,
        orders: Math.floor(Math.random() * 10) + 2,
      };
    });

    const recentOrders = [
      {
        id: "order-1",
        orderNumber: "#ORD-001",
        total: 125.48,
        status: "COMPLETED",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        customer: {
          name: "John Smith",
          email: "john@example.com",
        },
      },
      {
        id: "order-2",
        orderNumber: "#ORD-002",
        total: 89.99,
        status: "SHIPPED",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        customer: {
          name: "Jane Doe",
          email: "jane@example.com",
        },
      },
      {
        id: "order-3",
        orderNumber: "#ORD-003",
        total: 234.50,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        customer: {
          name: "Mike Johnson",
          email: "mike@example.com",
        },
      },
    ];

    return NextResponse.json({
      period,
      summary,
      ordersByStatus,
      topProducts,
      dailyRevenue,
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handleGET);
