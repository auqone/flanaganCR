import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Coupon Validation Endpoint (Public)
 * Validates coupon codes during checkout
 * No admin auth required - used by customers
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, orderTotal } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Coupon code required" },
        { status: 400 }
      );
    }

    // Find coupon by code
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code" },
        { status: 404 }
      );
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json(
        { error: "Coupon is inactive" },
        { status: 400 }
      );
    }

    // Check date range
    const now = new Date();
    if (coupon.startDate && now < coupon.startDate) {
      return NextResponse.json(
        { error: "Coupon not yet valid" },
        { status: 400 }
      );
    }

    if (coupon.endDate && now > coupon.endDate) {
      return NextResponse.json(
        { error: "Coupon has expired" },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json(
        { error: "Coupon usage limit reached" },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          error: `Minimum order amount of $${coupon.minOrderAmount} required`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "FIXED") {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (orderTotal * coupon.discountValue) / 100;
      // Cap discount if max is set
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discount: discountAmount,
      finalTotal: Math.max(0, orderTotal - discountAmount),
    });
  } catch (error: any) {
    console.error("Validate coupon error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
