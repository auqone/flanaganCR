import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");

    let query: any = {};

    // Filter by category
    if (category) {
      query.where = { category };
    }

    // Get products from database
    let products = await prisma.product.findMany(query);

    // Sort products
    if (sort === "price-asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
