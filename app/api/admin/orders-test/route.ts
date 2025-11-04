import { NextResponse, NextRequest } from "next/server";
import { withAdminAuth } from "@/lib/api-middleware";

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Mock orders data
    const mockOrders = [
      {
        id: "order-1",
        orderNumber: "#ORD-001",
        status: "COMPLETED",
        paymentStatus: "PAID",
        total: 125.48,
        shippingName: "John Smith",
        shippingEmail: "john@example.com",
        shippingAddress: "123 Main St",
        shippingCity: "New York",
        shippingState: "NY",
        shippingZip: "10001",
        shippingCountry: "USA",
        trackingNumber: "1Z999AA10123456784",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        orderItems: [
          {
            id: "item-1",
            productName: "Self Heal By Design",
            productImage: "https://ae01.alicdn.com/kf/S1563f315a52b41c0b1268e90c9bdd973V.jpg",
            quantity: 1,
            price: 9.99,
            product: {
              id: "1",
              name: "Self Heal By Design",
              aliexpressUrl: "https://aliexpress.com/item/123",
            },
          },
          {
            id: "item-2",
            productName: "Wireless Bluetooth Earbuds",
            productImage: "https://ae01.alicdn.com/kf/S8d4e2e5e7f6c4b9da3c1e8f9d2a5b6c7D.jpg",
            quantity: 2,
            price: 24.99,
            product: {
              id: "2",
              name: "Wireless Bluetooth Earbuds",
              aliexpressUrl: "https://aliexpress.com/item/456",
            },
          },
        ],
      },
      {
        id: "order-2",
        orderNumber: "#ORD-002",
        status: "SHIPPED",
        paymentStatus: "PAID",
        total: 89.99,
        shippingName: "Jane Doe",
        shippingEmail: "jane@example.com",
        shippingAddress: "456 Oak Ave",
        shippingCity: "Los Angeles",
        shippingState: "CA",
        shippingZip: "90001",
        shippingCountry: "USA",
        trackingNumber: "1Z999AA10123456785",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        orderItems: [
          {
            id: "item-3",
            productName: "Smart LED Desk Lamp",
            productImage: "https://ae01.alicdn.com/kf/H7a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7P.jpg",
            quantity: 1,
            price: 34.99,
            product: {
              id: "3",
              name: "Smart LED Desk Lamp",
              aliexpressUrl: "https://aliexpress.com/item/789",
            },
          },
        ],
      },
      {
        id: "order-3",
        orderNumber: "#ORD-003",
        status: "PENDING",
        paymentStatus: "PENDING",
        total: 234.50,
        shippingName: "Mike Johnson",
        shippingEmail: "mike@example.com",
        shippingAddress: "789 Pine Rd",
        shippingCity: "Chicago",
        shippingState: "IL",
        shippingZip: "60601",
        shippingCountry: "USA",
        createdAt: new Date().toISOString(),
        orderItems: [
          {
            id: "item-4",
            productName: "Minimalist Leather Wallet",
            productImage: "https://ae01.alicdn.com/kf/A1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6Q.jpg",
            quantity: 3,
            price: 16.99,
            product: {
              id: "4",
              name: "Minimalist Leather Wallet",
              aliexpressUrl: "https://aliexpress.com/item/101",
            },
          },
          {
            id: "item-5",
            productName: "Jade Roller Set",
            productImage: "https://ae01.alicdn.com/kf/R9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4S.jpg",
            quantity: 2,
            price: 12.99,
            product: {
              id: "5",
              name: "Jade Roller Set",
              aliexpressUrl: "https://aliexpress.com/item/202",
            },
          },
        ],
      },
    ];

    // Filter by status if provided
    let orders = mockOrders;
    if (status) {
      orders = orders.filter(order => order.status === status);
    }

    // Filter by search if provided
    if (search) {
      orders = orders.filter(order =>
        order.orderNumber.includes(search) ||
        order.shippingName.toLowerCase().includes(search.toLowerCase()) ||
        order.shippingEmail.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handleGET);
