import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/api-middleware";

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search && search.trim()) {
      where.OR = [
        { email: { contains: search.trim(), mode: "insensitive" } },
        { name: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    // Get counts for summary
    const totalSubscribers = await prisma.emailSubscriber.count();
    const activeSubscribers = await prisma.emailSubscriber.count({
      where: { isActive: true },
    });
    const inactiveSubscribers = await prisma.emailSubscriber.count({
      where: { isActive: false },
    });

    // Fetch total with current filters
    const total = await prisma.emailSubscriber.count({ where });

    // Fetch subscribers with pagination
    const subscribers = await prisma.emailSubscriber.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: subscribers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      summary: {
        total: totalSubscribers,
        active: activeSubscribers,
        inactive: inactiveSubscribers,
      },
    });
  } catch (error: any) {
    console.error("Error fetching subscribers:", error);
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch subscribers", details: error.message },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handleGET);
