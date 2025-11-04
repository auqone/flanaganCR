import { NextResponse, NextRequest } from "next/server";
import { withAdminAuth } from "@/lib/api-middleware";

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    // Mock subscribers data
    const mockSubscribers = [
      {
        id: "sub-1",
        email: "john.smith@example.com",
        name: "John Smith",
        source: "website",
        isActive: true,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "sub-2",
        email: "jane.doe@example.com",
        name: "Jane Doe",
        source: "newsletter-signup",
        isActive: true,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "sub-3",
        email: "mike.johnson@example.com",
        name: "Mike Johnson",
        source: "website",
        isActive: true,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "sub-4",
        email: "sarah.wilson@example.com",
        name: "Sarah Wilson",
        source: "newsletter-signup",
        isActive: false,
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "sub-5",
        email: "emily.brown@example.com",
        name: "Emily Brown",
        source: "website",
        isActive: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "sub-6",
        email: "david.miller@example.com",
        name: "David Miller",
        source: "newsletter-signup",
        isActive: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "sub-7",
        email: "lisa.anderson@example.com",
        name: "Lisa Anderson",
        source: "website",
        isActive: false,
        createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "sub-8",
        email: "robert.taylor@example.com",
        name: "Robert Taylor",
        source: "newsletter-signup",
        isActive: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Filter by status if provided
    let subscribers = mockSubscribers;
    if (status === "active") {
      subscribers = subscribers.filter((sub) => sub.isActive);
    } else if (status === "inactive") {
      subscribers = subscribers.filter((sub) => !sub.isActive);
    }

    // Filter by search if provided
    if (search) {
      subscribers = subscribers.filter(
        (sub) =>
          sub.name.toLowerCase().includes(search.toLowerCase()) ||
          sub.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Calculate summary
    const activeCount = mockSubscribers.filter((sub) => sub.isActive).length;
    const inactiveCount = mockSubscribers.filter((sub) => !sub.isActive).length;

    const response = {
      data: subscribers,
      summary: {
        total: mockSubscribers.length,
        active: activeCount,
        inactive: inactiveCount,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handleGET);
