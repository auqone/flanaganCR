import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/api-middleware";

interface ProductData {
  name: string;
  price: number;
  basePrice?: number;
  profitMargin?: number;
  image: string;
  images?: string[];
  category: string;
  rating?: number;
  reviews?: number;
  description: string;
  features: string[];
  inStock?: boolean;
  stockQuantity?: number;
  sku?: string;
  aliexpressUrl?: string;
  aliexpressId?: string;
  keywords?: string[];
  metaDescription?: string;
}

async function handlePOST(request: NextRequest) {
  try {
    const data: ProductData = await request.json();

    // Validate required fields
    if (!data.name || !data.price || !data.image || !data.description) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, image, and description are required" },
        { status: 400 }
      );
    }

    if (!data.features || data.features.length === 0) {
      return NextResponse.json(
        { error: "At least one product feature is required" },
        { status: 400 }
      );
    }

    // Create product in database
    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: Math.round(data.price * 100) / 100,
        basePrice: data.basePrice,
        profitMargin: data.profitMargin,
        image: data.image,
        images: data.images || [data.image],
        category: data.category,
        rating: data.rating || 4.5,
        reviews: data.reviews || 0,
        description: data.description,
        features: data.features,
        inStock: data.inStock !== undefined ? data.inStock : true,
        stockQuantity: data.stockQuantity !== undefined ? data.stockQuantity : 100,
        sku: data.sku,
        aliexpressUrl: data.aliexpressUrl,
        aliexpressId: data.aliexpressId,
        keywords: data.keywords || [],
        metaDescription: data.metaDescription,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error: any) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add product" },
      { status: 500 }
    );
  }
}

export const POST = withAdminAuth(handlePOST);
