import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/api-middleware";

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    // Build query conditions
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch customers from database
    const customers = await prisma.customer.findMany({
      where,
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate total spent for each customer
    const customersWithStats = customers.map((customer: any) => {
      const totalSpent = customer.orders.reduce((sum: any, order: any) => sum + order.total, 0);
      const orderCount = customer.orders.length;

      return {
        ...customer,
        totalSpent,
        orderCount,
      };
    });

    return NextResponse.json(customersWithStats);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handleGET);
