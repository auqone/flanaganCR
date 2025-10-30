import { NextResponse } from "next/server";

/**
 * Test Subscribers Endpoint
 * Returns mock subscriber data for testing
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));

    // Mock data
    const allSubscribers = [
      {
        id: "sub_1",
        email: "john@example.com",
        name: "John Doe",
        source: "vip_signup",
        isActive: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: "sub_2",
        email: "jane@example.com",
        name: "Jane Smith",
        source: "vip_signup",
        isActive: true,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        id: "sub_3",
        email: "bob@example.com",
        name: "Bob Johnson",
        source: "website_signup",
        isActive: false,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: "sub_4",
        email: "alice@example.com",
        name: "Alice Williams",
        source: "vip_signup",
        isActive: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "sub_5",
        email: "charlie@example.com",
        name: "Charlie Brown",
        source: "website_signup",
        isActive: true,
        createdAt: new Date(),
      },
    ];

    // Filter by status
    let filtered = allSubscribers;
    if (status === "active") {
      filtered = filtered.filter((s) => s.isActive);
    } else if (status === "inactive") {
      filtered = filtered.filter((s) => !s.isActive);
    }

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.email.toLowerCase().includes(search.toLowerCase()) ||
          s.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Get counts
    const totalSubscribers = allSubscribers.length;
    const activeSubscribers = allSubscribers.filter((s) => s.isActive).length;
    const inactiveSubscribers = allSubscribers.filter((s) => !s.isActive).length;
    const total = filtered.length;

    // Paginate
    const skip = (page - 1) * limit;
    const subscribers = filtered.slice(skip, skip + limit);

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
    return NextResponse.json(
      { error: "Failed to fetch subscribers", details: error.message },
      { status: 500 }
    );
  }
}
