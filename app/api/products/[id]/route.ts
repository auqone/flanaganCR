import { NextResponse } from "next/server";

// Sample product data - same as above, in production use a database
const products = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    category: "Electronics",
    rating: 4.5,
    reviews: 128,
    description: "Premium wireless headphones with active noise cancellation and 30-hour battery life. Experience crystal-clear audio with deep bass and crisp highs.",
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Bluetooth 5.0",
      "Foldable design",
      "Premium materials",
    ],
    inStock: true,
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
    category: "Electronics",
    rating: 4.8,
    reviews: 342,
    description: "Stay connected and track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.",
    features: [
      "Heart rate monitor",
      "GPS tracking",
      "Water resistant",
      "7-day battery",
      "Sleep tracking",
    ],
    inStock: true,
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
