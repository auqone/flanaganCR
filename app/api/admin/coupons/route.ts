import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";

/**
 * Coupon Management API
 * GET: List all coupons
 * POST: Create new coupon
 */

async function handleGET(request: NextRequest) {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error: any) {
    console.error("Get coupons error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

async function handlePOST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      code,
      description,
      discountType,
      discountValue,
      maxUses,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
    } = body;

    // Validation
    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: code, discountType, discountValue" },
        { status: 400 }
      );
    }

    if (!["FIXED", "PERCENTAGE"].includes(discountType)) {
      return NextResponse.json(
        { error: "discountType must be FIXED or PERCENTAGE" },
        { status: 400 }
      );
    }

    // Check if coupon code already exists
    const existing = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Coupon code already exists" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        maxUses,
        minOrderAmount,
        maxDiscountAmount,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json({
      success: true,
      coupon,
    });
  } catch (error: any) {
    console.error("Create coupon error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create coupon" },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handleGET);
export const POST = withAdminAuth(handlePOST);
