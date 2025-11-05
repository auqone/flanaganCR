import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";

/**
 * Individual Coupon Operations
 * GET: Get coupon details
 * PUT: Update coupon
 * DELETE: Delete coupon
 */

async function handleGET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const coupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon,
    });
  } catch (error: any) {
    console.error("Get coupon error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch coupon" },
      { status: 500 }
    );
  }
}

async function handlePUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        description: body.description,
        discountType: body.discountType,
        discountValue: body.discountValue,
        maxUses: body.maxUses,
        minOrderAmount: body.minOrderAmount,
        maxDiscountAmount: body.maxDiscountAmount,
        isActive: body.isActive,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    });

    return NextResponse.json({
      success: true,
      coupon,
    });
  } catch (error: any) {
    console.error("Update coupon error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update coupon" },
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

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Coupon deleted",
    });
  } catch (error: any) {
    console.error("Delete coupon error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete coupon" },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handleGET);
export const PUT = withAdminAuth(handlePUT);
export const DELETE = withAdminAuth(handleDELETE);
