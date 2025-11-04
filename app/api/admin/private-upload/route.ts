import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-middleware";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Private Image Upload Endpoint
 *
 * Stores images locally on the server in a private directory.
 * Only authenticated admins can upload and access images.
 * Images are stored with timestamp-based filenames for uniqueness.
 */

// Directory where private images are stored
const PRIVATE_IMAGES_DIR = join(process.cwd(), "public", "private-images");

async function handlePOST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image (PNG, JPG, GIF, etc.)" },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Create directory if it doesn't exist
    if (!existsSync(PRIVATE_IMAGES_DIR)) {
      await mkdir(PRIVATE_IMAGES_DIR, { recursive: true });
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const ext = file.type.split("/")[1];
    const filename = `product-${timestamp}-${random}.${ext}`;

    // Save file to private directory
    const filepath = join(PRIVATE_IMAGES_DIR, filename);
    const buffer = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(buffer));

    // Return private image URL (will be served by /api/admin/private-images endpoint)
    const imageUrl = `/api/admin/private-images/${filename}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename: filename,
      size: file.size,
      type: file.type,
    });
  } catch (error: any) {
    console.error("Private image upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}

export const POST = withAdminAuth(handlePOST);
