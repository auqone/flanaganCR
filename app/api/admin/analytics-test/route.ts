import { NextResponse } from "next/server";

/**
 * Test Analytics Endpoint
 * Returns mock analytics data for testing
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30";

    return NextResponse.json({
      period: parseInt(period),
      summary: {
        totalRevenue: 12500.50,
        totalOrders: 48,
        totalCustomers: 35,
        avgOrderValue: 260.43,
        totalProfit: 5000.25,
      },
      ordersByStatus: [
        { status: "PENDING", _count: { status: 5 } },
        { status: "PAID", _count: { status: 15 } },
        { status: "PROCESSING", _count: { status: 8 } },
        { status: "SHIPPED", _count: { status: 18 } },
        { status: "DELIVERED", _count: { status: 2 } },
      ],
      topProducts: [
        {
          id: "1",
          name: "Wireless Bluetooth Earbuds",
          price: 29.99,
          image: "https://via.placeholder.com/100",
          totalSold: 156,
          orderCount: 120,
        },
        {
          id: "2",
          name: "Smart LED Desk Lamp",
          price: 34.99,
          image: "https://via.placeholder.com/100",
          totalSold: 98,
          orderCount: 75,
        },
        {
          id: "3",
          name: "Leather Wallet with RFID",
          price: 16.99,
          image: "https://via.placeholder.com/100",
          totalSold: 67,
          orderCount: 45,
        },
      ],
      dailyRevenue: [
        { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], revenue: 1200, orders: 5 },
        { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], revenue: 1800, orders: 7 },
        { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], revenue: 950, orders: 4 },
        { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], revenue: 2100, orders: 9 },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], revenue: 1550, orders: 6 },
        { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], revenue: 2000, orders: 8 },
        { date: new Date().toISOString().split("T")[0], revenue: 2800, orders: 9 },
      ],
      recentOrders: [
        {
          id: "order_1",
          orderNumber: "ORD-1001",
          shippingName: "John Doe",
          shippingEmail: "john@example.com",
          total: 99.99,
          status: "SHIPPED",
          createdAt: new Date(),
          customer: {
            name: "John Doe",
            email: "john@example.com",
          },
        },
        {
          id: "order_2",
          orderNumber: "ORD-1002",
          shippingName: "Jane Smith",
          shippingEmail: "jane@example.com",
          total: 249.99,
          status: "PAID",
          createdAt: new Date(),
          customer: {
            name: "Jane Smith",
            email: "jane@example.com",
          },
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
