import { NextResponse } from "next/server";

/**
 * Test Customers Endpoint
 * Returns mock customer data for testing
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    // Mock customer data
    const allCustomers = [
      {
        id: "cust_1",
        email: "john@example.com",
        name: "John Doe",
        phone: "+1 (555) 123-4567",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        orders: [
          {
            id: "ord_1",
            orderNumber: "ORD-1001",
            total: 99.99,
            status: "DELIVERED",
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
          {
            id: "ord_2",
            orderNumber: "ORD-1005",
            total: 149.99,
            status: "SHIPPED",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
        ],
        totalSpent: 249.98,
        orderCount: 2,
      },
      {
        id: "cust_2",
        email: "jane@example.com",
        name: "Jane Smith",
        phone: "+1 (555) 987-6543",
        address: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
        country: "United States",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        orders: [
          {
            id: "ord_3",
            orderNumber: "ORD-1002",
            total: 249.99,
            status: "DELIVERED",
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          },
        ],
        totalSpent: 249.99,
        orderCount: 1,
      },
      {
        id: "cust_3",
        email: "bob@example.com",
        name: "Bob Johnson",
        phone: "+1 (555) 456-7890",
        address: "789 Pine Rd",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "United States",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        orders: [
          {
            id: "ord_4",
            orderNumber: "ORD-1003",
            total: 79.99,
            status: "PROCESSING",
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
          {
            id: "ord_5",
            orderNumber: "ORD-1004",
            total: 129.99,
            status: "PAID",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
        totalSpent: 209.98,
        orderCount: 2,
      },
      {
        id: "cust_4",
        email: "alice@example.com",
        name: "Alice Williams",
        phone: "+1 (555) 321-0987",
        address: "321 Elm St",
        city: "Houston",
        state: "TX",
        zipCode: "77001",
        country: "United States",
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        orders: [],
        totalSpent: 0,
        orderCount: 0,
      },
    ];

    // Filter by search
    let filtered = allCustomers;
    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json(filtered);
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers", details: error.message },
      { status: 500 }
    );
  }
}
