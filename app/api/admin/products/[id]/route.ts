import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth, AdminRole } from "@/lib/api-middleware";

interface ProductUpdateData {
  name?: string;
  price?: number;
  basePrice?: number;
  profitMargin?: number;
  image?: string;
  images?: string[];
  category?: string;
  rating?: number;
  reviews?: number;
  description?: string;
  features?: string[];
  inStock?: boolean;
  stockQuantity?: number;
  sku?: string;
  aliexpressUrl?: string;
  aliexpressId?: string;
  keywords?: string[];
  metaDescription?: string;
}

async function handlePUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data: ProductUpdateData = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Security: Validate stock quantity is non-negative
    if (data.stockQuantity !== undefined && data.stockQuantity < 0) {
      return NextResponse.json(
        { error: "Stock quantity cannot be negative" },
        { status: 400 }
      );
    }

    // Use transaction to prevent race conditions between check and update
    const product = await prisma.$transaction(async (tx) => {
      // Check if product exists within transaction
      const existingProduct = await tx.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new Error("Product not found");
      }

      // Update product atomically
      return await tx.product.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.price !== undefined && { price: Math.round(data.price * 100) / 100 }),
          ...(data.basePrice !== undefined && { basePrice: data.basePrice }),
          ...(data.profitMargin !== undefined && { profitMargin: data.profitMargin }),
          ...(data.image && { image: data.image }),
          ...(data.images && { images: data.images }),
          ...(data.category && { category: data.category }),
          ...(data.rating !== undefined && { rating: data.rating }),
          ...(data.reviews !== undefined && { reviews: data.reviews }),
          ...(data.description && { description: data.description }),
          ...(data.features && { features: data.features }),
          ...(data.inStock !== undefined && { inStock: data.inStock }),
          ...(data.stockQuantity !== undefined && { stockQuantity: data.stockQuantity }),
          ...(data.sku !== undefined && { sku: data.sku }),
          ...(data.aliexpressUrl !== undefined && { aliexpressUrl: data.aliexpressUrl }),
          ...(data.aliexpressId !== undefined && { aliexpressId: data.aliexpressId }),
          ...(data.keywords && { keywords: data.keywords }),
          ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription }),
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);

    // Handle transaction errors specifically
    if (error.message === "Product not found") {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

async function handleDELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}

// RBAC: Only Admin+ can modify/delete products
export const PUT = withAdminAuth(handlePUT, AdminRole.ADMIN);
export const DELETE = withAdminAuth(handleDELETE, AdminRole.ADMIN);
