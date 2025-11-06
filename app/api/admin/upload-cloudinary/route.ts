import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-middleware";
import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary Upload Endpoint
 * Handles image uploads to Cloudinary
 * Protected with admin authentication
 */

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"];
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: JPEG, PNG, GIF, WebP, AVIF. Received: ${file.type}` },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      return NextResponse.json(
        { error: `File size (${sizeMB}MB) exceeds maximum allowed size of 10MB` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary with optimizations
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "flanagan-products",
          resource_type: "auto",
          use_filename: true,
          unique_filename: true,
          // Image optimization
          quality: "auto",
          fetch_format: "auto",
          flags: "progressive",
          // Transformations for responsive images
          transformations: [
            {
              width: 1200,
              crop: "auto",
              gravity: "auto",
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    const uploadResult = result as any;

    // Generate responsive image URLs using Cloudinary transformations
    const baseUrl = uploadResult.secure_url.replace(/\/upload\//, "/upload/");
    const transformations = {
      small: uploadResult.secure_url.replace(/\/upload\//, "/upload/c_scale,w_400,q_auto,f_auto/"),
      medium: uploadResult.secure_url.replace(/\/upload\//, "/upload/c_scale,w_800,q_auto,f_auto/"),
      large: uploadResult.secure_url.replace(/\/upload\//, "/upload/c_scale,w_1200,q_auto,f_auto/"),
    };

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      size: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      responsive: transformations,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);

    // Provide specific error messages based on error type
    let errorMessage = "Failed to upload image";
    let statusCode = 500;

    if (error.http_code === 401 || error.http_code === 403) {
      errorMessage = "Authentication failed with Cloudinary. Check API credentials.";
      statusCode = 403;
    } else if (error.http_code === 400) {
      errorMessage = `Cloudinary validation error: ${error.message}`;
      statusCode = 400;
    } else if (error.message?.includes("ENOSPC")) {
      errorMessage = "Server storage full. Please try again later.";
      statusCode = 507;
    } else if (error.message?.includes("ETIMEDOUT") || error.message?.includes("ECONNREFUSED")) {
      errorMessage = "Connection timeout with Cloudinary. Please check your internet connection and try again.";
      statusCode = 503;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

export const POST = withAdminAuth(handlePOST);
