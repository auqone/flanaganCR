import { NextResponse } from "next/server";

/**
 * Test Orders Endpoint
 * Returns mock order data for testing
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";

    // Mock order data
    const allOrders = [
      {
        id: "ord_1",
        orderNumber: "ORD-1001",
        status: "DELIVERED",
        paymentStatus: "PAID",
        total: 99.99,
        shippingName: "John Doe",
        shippingEmail: "john@example.com",
        shippingAddress: "123 Main St",
        shippingCity: "New York",
        shippingState: "NY",
        shippingZip: "10001",
        shippingCountry: "United States",
        trackingNumber: "1Z999AA10123456784",
        trackingUrl: "https://www.ups.com/track?tracknum=1Z999AA10123456784",
        aliexpressOrderId: "AliExpress123",
        aliexpressOrderUrl: "https://trade.aliexpress.com/orderdetail.htm?orderId=123",
        adminNotes: "Delivered successfully",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        orderItems: [
          {
            id: "item_1",
            productName: "Wireless Bluetooth Earbuds",
            productImage: "https://via.placeholder.com/100",
            quantity: 1,
            price: 29.99,
            product: {
              id: "prod_1",
              name: "Wireless Bluetooth Earbuds",
              aliexpressUrl: "https://aliexpress.com/item/123",
            },
          },
          {
            id: "item_2",
            productName: "Smart LED Desk Lamp",
            productImage: "https://via.placeholder.com/100",
            quantity: 2,
            price: 34.99,
            product: {
              id: "prod_2",
              name: "Smart LED Desk Lamp",
              aliexpressUrl: "https://aliexpress.com/item/456",
            },
          },
        ],
      },
      {
        id: "ord_2",
        orderNumber: "ORD-1002",
        status: "SHIPPED",
        paymentStatus: "PAID",
        total: 249.99,
        shippingName: "Jane Smith",
        shippingEmail: "jane@example.com",
        shippingAddress: "456 Oak Ave",
        shippingCity: "Los Angeles",
        shippingState: "CA",
        shippingZip: "90001",
        shippingCountry: "United States",
        trackingNumber: "1Z999AA20234567895",
        trackingUrl: "https://www.ups.com/track?tracknum=1Z999AA20234567895",
        aliexpressOrderId: "AliExpress124",
        aliexpressOrderUrl: "https://trade.aliexpress.com/orderdetail.htm?orderId=124",
        adminNotes: "Shipped on 2025-10-28",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        orderItems: [
          {
            id: "item_3",
            productName: "Leather Wallet with RFID",
            productImage: "https://via.placeholder.com/100",
            quantity: 3,
            price: 16.99,
            product: {
              id: "prod_3",
              name: "Leather Wallet with RFID",
              aliexpressUrl: "https://aliexpress.com/item/789",
            },
          },
        ],
      },
      {
        id: "ord_3",
        orderNumber: "ORD-1003",
        status: "PROCESSING",
        paymentStatus: "PAID",
        total: 79.99,
        shippingName: "Bob Johnson",
        shippingEmail: "bob@example.com",
        shippingAddress: "789 Pine Rd",
        shippingCity: "Chicago",
        shippingState: "IL",
        shippingZip: "60601",
        shippingCountry: "United States",
        adminNotes: "Awaiting shipment",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        orderItems: [
          {
            id: "item_4",
            productName: "Wireless Bluetooth Earbuds",
            productImage: "https://via.placeholder.com/100",
            quantity: 1,
            price: 29.99,
            product: {
              id: "prod_1",
              name: "Wireless Bluetooth Earbuds",
              aliexpressUrl: "https://aliexpress.com/item/123",
            },
          },
        ],
      },
      {
        id: "ord_4",
        orderNumber: "ORD-1004",
        status: "PAID",
        paymentStatus: "PAID",
        total: 129.99,
        shippingName: "Alice Williams",
        shippingEmail: "alice@example.com",
        shippingAddress: "321 Elm St",
        shippingCity: "Houston",
        shippingState: "TX",
        shippingZip: "77001",
        shippingCountry: "United States",
        adminNotes: "Pending processing",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        orderItems: [
          {
            id: "item_5",
            productName: "Smart LED Desk Lamp",
            productImage: "https://via.placeholder.com/100",
            quantity: 1,
            price: 34.99,
            product: {
              id: "prod_2",
              name: "Smart LED Desk Lamp",
              aliexpressUrl: "https://aliexpress.com/item/456",
            },
          },
        ],
      },
      {
        id: "ord_5",
        orderNumber: "ORD-1005",
        status: "PENDING",
        paymentStatus: "PENDING",
        total: 149.99,
        shippingName: "Charlie Brown",
        shippingEmail: "charlie@example.com",
        shippingAddress: "555 Maple Dr",
        shippingCity: "Phoenix",
        shippingState: "AZ",
        shippingZip: "85001",
        shippingCountry: "United States",
        adminNotes: "Awaiting payment confirmation",
        createdAt: new Date(),
        orderItems: [
          {
            id: "item_6",
            productName: "Leather Wallet with RFID",
            productImage: "https://via.placeholder.com/100",
            quantity: 2,
            price: 16.99,
            product: {
              id: "prod_3",
              name: "Leather Wallet with RFID",
              aliexpressUrl: "https://aliexpress.com/item/789",
            },
          },
        ],
      },
    ];

    // Filter by status
    let filtered = allOrders;
    if (status !== "all") {
      filtered = filtered.filter((o) => o.status === status);
    }

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          o.shippingEmail.toLowerCase().includes(search.toLowerCase()) ||
          o.shippingName.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json(filtered);
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error.message },
      { status: 500 }
    );
  }
}
