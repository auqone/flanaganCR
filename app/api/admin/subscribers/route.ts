import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/api-middleware";

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    // Fetch subscribers
    const subscribers = await prisma.emailSubscriber.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get counts for summary
    const totalSubscribers = await prisma.emailSubscriber.count();
    const activeSubscribers = await prisma.emailSubscriber.count({
      where: { isActive: true },
    });
    const inactiveSubscribers = await prisma.emailSubscriber.count({
      where: { isActive: false },
    });

    return NextResponse.json({
      subscribers,
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
