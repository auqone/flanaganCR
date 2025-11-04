# Private Image Hosting System

## Overview

Your Tigerista e-commerce platform now includes a **private image hosting system** that allows you to store and serve product images directly from your own server, without relying on external services like Cloudinary or AliExpress.

## How It Works

### 1. **Upload Endpoint** - `/api/admin/private-upload`
- **Location:** `app/api/admin/private-upload/route.ts`
- **Method:** POST
- **Authentication:** Admin only (requires valid JWT token)
- **Purpose:** Handles image uploads from the admin panel

**File Storage:**
- Images are saved to: `public/private-images/`
- Filenames are randomized with timestamps: `product-[timestamp]-[random].jpg`
- Prevents collisions and maintains privacy

**Validation:**
- File type: Must be image (PNG, JPG, GIF, WebP, SVG)
- File size: Maximum 10MB
- Returns: `{ success: true, url: "/api/admin/private-images/[filename]" }`

### 2. **Serving Endpoint** - `/api/admin/private-images/[filename]`
- **Location:** `app/api/admin/private-images/[filename]/route.ts`
- **Method:** GET
- **Purpose:** Serves stored images with proper caching headers
- **Security:** Prevents directory traversal attacks

**Response Headers:**
```
Content-Type: image/jpeg (or appropriate MIME type)
Cache-Control: public, max-age=31536000, immutable (1-year cache)
Content-Length: [file size]
```

**Supported Formats:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- SVG (.svg)

### 3. **Admin Form Integration**
- **Location:** `app/admin/products/page.tsx`
- **Upload Interface:**
  - Click-to-upload button
  - Drag & drop support
  - Real-time file validation
  - Live upload progress indicator
  - Image preview after upload

## Usage

### For Admins

1. Go to **Admin Dashboard → Add New Product**
2. Scroll to **"Private Product Image Hosting"** section
3. Choose one of two options:

**Option A: Upload to Your Server**
- Click the upload area or drag & drop
- Select image from your computer
- Image is automatically uploaded to your server
- URL appears in the image field: `/api/admin/private-images/product-[timestamp]-[random].jpg`

**Option B: Use External URL**
- Paste an external image URL (AliExpress, Unsplash, etc.)
- Useful if you already have images hosted elsewhere
- Image must be HTTPS

4. See live preview of uploaded image
5. Complete product form and submit

### Example Upload Response

```json
{
  "success": true,
  "url": "/api/admin/private-images/product-1730000000000-a1b2c3d.jpg",
  "filename": "product-1730000000000-a1b2c3d.jpg",
  "size": 245000,
  "type": "image/jpeg"
}
```

## Directory Structure

```
project-root/
├── public/
│   └── private-images/          ← Images stored here
│       ├── product-*.jpg
│       ├── product-*.png
│       └── ...
├── app/
│   └── api/
│       └── admin/
│           ├── private-upload/  ← Upload endpoint
│           └── private-images/
│               └── [filename]/  ← Serving endpoint
└── app/admin/
    └── products/
        └── page.tsx             ← Admin form
```

## Security Features

### Upload Security
✅ **Admin Authentication** - Only logged-in admins can upload
✅ **File Type Validation** - Only images allowed
✅ **File Size Limit** - Maximum 10MB per image
✅ **Unique Filenames** - Timestamp + random string prevents overwrites

### Serving Security
✅ **Directory Traversal Protection** - Filenames validated to prevent `../` attacks
✅ **Path Verification** - Ensures files are within private-images directory
✅ **MIME Type Detection** - Correct content-type header sent
✅ **404 Handling** - Missing files return 404 error

## Performance

### Caching
- Images are cached for **1 year** (`max-age=31536000`)
- Use `immutable` flag since filenames never change
- Browsers won't re-request images

### Storage
- **Initial**: Empty (no images)
- **Per Image**: ~200KB - 2MB (typical product photos)
- **100 images**: ~20-200MB
- **1000 images**: ~200MB - 2GB

### Bandwidth
- First load: Full image download
- Subsequent loads: Cached (0 bytes transfer)
- Very efficient for repeat visitors

## Configuration

### Upload Size Limit
In `app/api/admin/private-upload/route.ts`, line 35:
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB - adjust if needed
```

### Storage Path
In both files:
```typescript
const PRIVATE_IMAGES_DIR = join(process.cwd(), "public", "private-images");
```

## Deployment Notes

### DigitalOcean App Platform
1. Images stored in `public/private-images/`
2. Directory is **persistent** (survives deployments if using proper storage)
3. Make sure `public/private-images/` is writable

### Vercel
1. ⚠️ **Important:** Vercel doesn't persist files between deployments
2. **Solution:** Use this for:
   - Development/testing
   - Temporary images
   - Short-lived products
3. **Better for Vercel:** Use a persistent storage service:
   - AWS S3
   - Cloudinary (though you wanted private hosting)
   - DigitalOcean Spaces
   - Backblaze B2

### Self-Hosted
✅ Works perfectly on any server with persistent storage
✅ No external service required
✅ Full control over images

## Backing Up Images

### On DigitalOcean
```bash
# SSH into your server
ssh user@your-server.com

# Copy images to backup location
cp -r /app/public/private-images/ /backups/products-backup/

# Or download to your computer
scp -r user@your-server.com:/app/public/private-images ./local-backup/
```

### Before Deployment
```bash
# Create backup
tar -czf private-images-backup-$(date +%Y%m%d).tar.gz public/private-images/

# Store safely
mv private-images-backup-*.tar.gz /backups/
```

## Monitoring

### Check Storage Usage
```bash
du -sh public/private-images/
# Output: 245M    public/private-images/
```

### List Uploaded Images
```bash
ls -lh public/private-images/ | sort -k5 -hr | head -20
```

### Image Statistics
```bash
# Count images
find public/private-images/ -type f | wc -l

# Total size
du -sh public/private-images/

# Oldest images (for cleanup)
find public/private-images/ -type f -printf '%T+ %p\n' | sort | head -10
```

## Troubleshooting

### "Failed to upload image"
**Cause:** Server permissions or disk space
**Solution:**
1. Check disk space: `df -h`
2. Verify write permissions: `ls -ld public/private-images/`
3. Check server logs for errors

### "Image not found" when loading
**Cause:** File deleted or upload failed
**Solution:**
1. Check file exists: `ls public/private-images/[filename]`
2. Verify permissions: `ls -l public/private-images/[filename]`
3. Re-upload the image

### File size exceeded
**Cause:** Image larger than 10MB limit
**Solution:**
1. Compress image: Use ImageMagick, TinyPNG, or online tools
2. Increase limit in code (if needed):
   - Edit `MAX_FILE_SIZE` in `private-upload/route.ts`
   - Recommended: Keep under 5MB for web performance

### Uploads work but images don't display
**Cause:** Serving endpoint issue or path mismatch
**Solution:**
1. Check console errors (browser DevTools)
2. Verify URL format: `/api/admin/private-images/product-*.jpg`
3. Check file permissions: `chmod 644 public/private-images/*`

## API Examples

### Upload Image (JavaScript/Fetch)
```javascript
const file = document.getElementById('fileInput').files[0];
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/admin/private-upload', {
  method: 'POST',
  credentials: 'include', // Include admin session cookie
  body: formData
});

const { url } = await response.json();
console.log('Image URL:', url); // /api/admin/private-images/product-*.jpg
```

### Display Image (HTML)
```html
<!-- Simple img tag -->
<img src="/api/admin/private-images/product-1730000000000-a1b2c3d.jpg" alt="Product">

<!-- Next.js Image component (optimized) -->
<Image
  src="/api/admin/private-images/product-1730000000000-a1b2c3d.jpg"
  alt="Product"
  width={300}
  height={300}
/>
```

## Future Enhancements

### Potential Features
1. **Image Gallery** - Admin page to browse all uploaded images
2. **Bulk Upload** - Upload multiple images at once
3. **Image Compression** - Auto-compress on upload
4. **CDN Integration** - Serve via CDN while keeping originals private
5. **Image Optimization** - Convert to WebP, generate thumbnails
6. **Cleanup Job** - Auto-delete unused images (cron task)
7. **Access Logs** - Track which images are viewed
8. **Image Editing** - Crop, resize in admin panel

## Summary

Your private image hosting system:
- ✅ Stores images on **your server** (not external services)
- ✅ Serves images with **optimal caching** (1-year)
- ✅ **Admin-only uploads** with file validation
- ✅ **Zero external dependencies** for image hosting
- ✅ Works on **DigitalOcean**, self-hosted, or any server
- ✅ **Fully integrated** with product admin panel

Upload images directly in the Add New Product form and enjoy fast, private image hosting! 🖼️
