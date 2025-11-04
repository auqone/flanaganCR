import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-middleware";
import { readdir, stat } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * List Images Endpoint
 *
 * Retrieves all images from the public folder (including subfolders).
 * Only authenticated admins can access this.
 * Returns image metadata: path, size, type, URL
 */

const PUBLIC_FOLDER = join(process.cwd(), "public");

// Supported image extensions
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

interface ImageFile {
  path: string; // Relative path from public folder
  url: string; // URL to access the image
  filename: string; // Just the filename
  size: number; // File size in bytes
  type: string; // MIME type
}

async function getImagesRecursive(
  dir: string,
  baseDir: string = PUBLIC_FOLDER,
  relativePath: string = ""
): Promise<ImageFile[]> {
  const images: ImageFile[] = [];

  try {
    const files = await readdir(dir);

    for (const file of files) {
      // Skip hidden files and private folders
      if (file.startsWith(".") || file === "node_modules") continue;

      const filePath = join(dir, file);
      const fileStats = await stat(filePath);
      const relativeFilePath = relativePath ? `${relativePath}/${file}` : file;

      if (fileStats.isDirectory()) {
        // Recursively scan subdirectories
        const subImages = await getImagesRecursive(
          filePath,
          baseDir,
          relativeFilePath
        );
        images.push(...subImages);
      } else if (fileStats.isFile()) {
        // Check if file is an image
        const ext = file.toLowerCase().substring(file.lastIndexOf("."));
        if (IMAGE_EXTENSIONS.includes(ext)) {
          const mimeTypes: Record<string, string> = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
            ".svg": "image/svg+xml",
          };

          images.push({
            path: relativeFilePath,
            url: `/${relativeFilePath}`,
            filename: file,
            size: fileStats.size,
            type: mimeTypes[ext] || "image/unknown",
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return images;
}

async function handleGET(request: NextRequest) {
  try {
    // Optional query parameter to filter by folder
    const folder = request.nextUrl.searchParams.get("folder") || "";

    // Validate folder parameter to prevent directory traversal
    if (folder && (folder.includes("..") || folder.includes("/"))) {
      return NextResponse.json(
        { error: "Invalid folder parameter" },
        { status: 400 }
      );
    }

    const searchPath = folder
      ? join(PUBLIC_FOLDER, folder)
      : PUBLIC_FOLDER;

    // Verify folder exists and is within public directory
    if (!searchPath.startsWith(PUBLIC_FOLDER) || !existsSync(searchPath)) {
      return NextResponse.json(
        { error: "Folder not found" },
        { status: 404 }
      );
    }

    const images = await getImagesRecursive(searchPath);

    // Sort by filename
    images.sort((a, b) => a.filename.localeCompare(b.filename));

    return NextResponse.json({
      success: true,
      count: images.length,
      images,
      folder: folder || "root",
    });
  } catch (error: any) {
    console.error("List images error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to list images" },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handleGET);
