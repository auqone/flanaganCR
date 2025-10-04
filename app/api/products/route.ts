import { NextResponse } from "next/server";

// Real products from AliExpress - in production, this would come from a database
const products = [
  {
    id: "1",
    name: "Self Heal By Design - The Role of Micro-Organisms for Health",
    price: 9.99,
    image: "https://ae01.alicdn.com/kf/S1563f315a52b41c0b1268e90c9bdd973V.jpg",
    category: "Health & Wellness",
    rating: 4.8,
    reviews: 25,
    description: "Discover the transformative power of micro-organisms in this groundbreaking health book by O'Neill. Learn how to harness natural healing processes and optimize your body's innate ability to repair and regenerate. Perfect for health-conscious readers interested in holistic wellness and natural healing approaches.",
    inStock: true,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");

  let filteredProducts = [...products];

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter((p) => p.category === category);
  }

  // Sort products
  if (sort === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return NextResponse.json(filteredProducts);
}
