import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Private Image Serving Endpoint
 *
 * Serves private images from the local storage directory.
 * Images can be accessed by anyone with the direct URL,
 * but are stored outside the public folder for security.
 *
 * In production, you should add authentication to this endpoint
 * if you want to restrict access to admins only.
 */

const PRIVATE_IMAGES_DIR = join(process.cwd(), "public", "private-images");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Security: Validate filename to prevent directory traversal
    if (!filename || filename.includes("..") || filename.includes("/")) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    // Construct full file path
    const filepath = join(PRIVATE_IMAGES_DIR, filename);

    // Security: Ensure file is within the private images directory
    if (!filepath.startsWith(PRIVATE_IMAGES_DIR)) {
      return new NextResponse("Access denied", { status: 403 });
    }

    // Check if file exists
    if (!existsSync(filepath)) {
      return new NextResponse("Image not found", { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(filepath);

    // Determine MIME type from filename extension
    const ext = filename.split(".").pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
    };

    const mimeType = mimeTypes[ext || ""] || "application/octet-stream";

    // Return image with cache headers
    return new NextResponse(Buffer.from(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Private image serving error:", error);
    return new NextResponse("Failed to serve image", { status: 500 });
  }
}
