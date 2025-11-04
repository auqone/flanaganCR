import { NextResponse, NextRequest } from "next/server";
import { withAdminAuth } from "@/lib/api-middleware";

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    // Mock customers data
    const mockCustomers = [
      {
        id: "customer-1",
        email: "john@example.com",
        name: "John Smith",
        phone: "+1 (555) 123-4567",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        orders: [
          {
            id: "order-1",
            orderNumber: "#ORD-001",
            total: 125.48,
            status: "COMPLETED",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "order-2",
            orderNumber: "#ORD-004",
            total: 89.99,
            status: "COMPLETED",
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "order-3",
            orderNumber: "#ORD-007",
            total: 234.50,
            status: "COMPLETED",
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        totalSpent: 449.97,
        orderCount: 3,
      },
      {
        id: "customer-2",
        email: "jane@example.com",
        name: "Jane Doe",
        phone: "+1 (555) 234-5678",
        address: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
        country: "USA",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        orders: [
          {
            id: "order-2",
            orderNumber: "#ORD-002",
            total: 89.99,
            status: "SHIPPED",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "order-5",
            orderNumber: "#ORD-005",
            total: 156.25,
            status: "COMPLETED",
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        totalSpent: 246.24,
        orderCount: 2,
      },
      {
        id: "customer-3",
        email: "mike@example.com",
        name: "Mike Johnson",
        phone: "+1 (555) 345-6789",
        address: "789 Pine Rd",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        orders: [
          {
            id: "order-3",
            orderNumber: "#ORD-003",
            total: 234.50,
            status: "PENDING",
            createdAt: new Date().toISOString(),
          },
        ],
        totalSpent: 234.50,
        orderCount: 1,
      },
      {
        id: "customer-4",
        email: "sarah@example.com",
        name: "Sarah Wilson",
        phone: "+1 (555) 456-7890",
        address: "321 Elm St",
        city: "Houston",
        state: "TX",
        zipCode: "77001",
        country: "USA",
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        orders: [
          {
            id: "order-6",
            orderNumber: "#ORD-006",
            total: 45.99,
            status: "COMPLETED",
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "order-8",
            orderNumber: "#ORD-008",
            total: 112.75,
            status: "COMPLETED",
            createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "order-9",
            orderNumber: "#ORD-009",
            total: 67.33,
            status: "COMPLETED",
            createdAt: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        totalSpent: 226.07,
        orderCount: 3,
      },
    ];

    // Filter by search if provided
    let customers = mockCustomers;
    if (search) {
      customers = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(search.toLowerCase()) ||
          customer.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handleGET);
