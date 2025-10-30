import { NextResponse } from "next/server";

/**
 * Test /me endpoint
 * Returns the authenticated admin info from cookie
 */

export async function GET(request: Request) {
  try {
    // Check if admin_token cookie exists
    const cookieHeader = request.headers.get("cookie") || "";
    const hasAdminToken = cookieHeader.includes("admin_token");

    if (!hasAdminToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Return test admin info
    return NextResponse.json({
      admin: {
        id: "admin_test_1",
        email: "admin@flanagan.com",
        name: "John Flanagan",
        role: "SUPER_ADMIN",
      },
    });
  } catch (error) {
    console.error("Error getting current admin:", error);
    return NextResponse.json(
      { error: "Failed to get admin info" },
      { status: 500 }
    );
  }
}
