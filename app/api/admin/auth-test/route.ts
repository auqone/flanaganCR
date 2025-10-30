import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

/**
 * Test Authentication Endpoint
 * Uses hardcoded credentials for testing when database is unreachable
 * REMOVE THIS IN PRODUCTION!
 */

// Hardcoded test admin (for development/testing only)
const TEST_ADMIN = {
  id: "admin_test_1",
  email: "admin@flanagan.com",
  password: "$2b$10$9xkzAL05KEGXLoGdW5t5MuXmiIJmNlvMKXztUjkGvQ8yMaKykY8lS", // adminPassword123
  name: "John Flanagan",
  role: "SUPER_ADMIN",
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check against test credentials
    if (email !== TEST_ADMIN.email) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, TEST_ADMIN.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Set auth cookie
    await setAuthCookie(TEST_ADMIN.id, TEST_ADMIN.email, TEST_ADMIN.role);

    return NextResponse.json({
      success: true,
      admin: {
        id: TEST_ADMIN.id,
        email: TEST_ADMIN.email,
        name: TEST_ADMIN.name,
        role: TEST_ADMIN.role,
      },
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  return NextResponse.json({ success: true });
}
