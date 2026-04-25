# Media Upload Guide

This guide explains how to use the media upload functionality in @m14i/blogging-core to handle image and PDF uploads.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [API Route Configuration](#api-route-configuration)
- [File Upload Validation](#file-upload-validation)
- [Frontend Integration](#frontend-integration)
- [Component Improvements](#component-improvements)
- [Security Considerations](#security-considerations)

## Overview

The media upload system provides:

- ✅ **File validation** (type, size)
- ✅ **Secure filename sanitization**
- ✅ **Supabase Storage integration**
- ✅ **Database metadata tracking**
- ✅ **Support for images and PDFs**
- ✅ **Enhanced UI components** with hover effects and actions
- ✅ **FormData and JSON support**

## Setup

### 1. Create Supabase Storage Bucket

First, create a storage bucket in your Supabase project:

```sql
-- Create a public bucket for blog media
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-media', 'blog-media', true);

-- Set up RLS policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-media');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-media');

CREATE POLICY "Users can update own uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-media' AND auth.uid()::text = owner);

CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-media' AND auth.uid()::text = owner);
```

### 2. Install Dependencies

Ensure you have the required dependencies:

```bash
npm install @supabase/supabase-js
# or
pnpm add @supabase/supabase-js
```

## API Route Configuration

### Basic Setup

Create an API route at `app/api/blog/media/route.ts`:

```typescript
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createBlogClient } from "@m14i/blogging-core/client";
import {
  createMediaHandlers,
  createSupabaseStorageAdapter,
} from "@m14i/blogging-core/server";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for server-side operations
);

// Create blog client
const getBlogClient = async () => createBlogClient(supabase);

// Auth check function
async function checkAuth(request: NextRequest): Promise<boolean> {
  // Implement your authentication logic here
  // Example with Supabase Auth:
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error } = await supabase.auth.getUser(token);

  return !error && !!user;
}

// Get user ID from request
async function getUserId(request: NextRequest): Promise<string | undefined> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return undefined;

  const token = authHeader.replace("Bearer ", "");
  const { data: { user } } = await supabase.auth.getUser(token);

  return user?.id;
}

// Create storage adapter
const storageAdapter = createSupabaseStorageAdapter(supabase, "blog-media");

// Create handlers with options
export const { GET, POST } = createMediaHandlers(getBlogClient, checkAuth, {
  storageAdapter,
  maxSizeMB: 10, // Maximum file size in MB
  allowedTypes: [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    // PDFs
    "application/pdf",
  ],
  getUserId,
});
```

### Advanced Configuration

For more control, you can customize the upload behavior:

```typescript
import {
  handleFileUpload,
  validateFile,
  type ValidationOptions,
} from "@m14i/blogging-core/server";

export async function POST(request: NextRequest) {
  try {
    // Custom auth check
    const isAuthenticated = await checkAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get blog client
    const blog = await getBlogClient();
    const userId = await getUserId(request);

    // Custom validation options
    const validationOptions: ValidationOptions = {
      maxSizeMB: 5,
      allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
    };

    // Handle upload
    const result = await handleFileUpload(
      request,
      storageAdapter,
      blog,
      userId,
      validationOptions
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
```

## File Upload Validation

The system includes comprehensive validation:

### Size Validation

```typescript
import { validateFileSize } from "@m14i/blogging-core/server";

const validation = validateFileSize(file, 10); // 10MB limit
if (!validation.valid) {
  console.error(validation.error);
}
```

### Type Validation

```typescript
import { validateFileType } from "@m14i/blogging-core/server";

const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
const validation = validateFileType(file, allowedTypes);
if (!validation.valid) {
  console.error(validation.error);
}
```

### Complete Validation

```typescript
import { validateFile } from "@m14i/blogging-core/server";

const validation = validateFile(file, {
  maxSizeMB: 5,
  allowedTypes: ["image/jpeg", "image/png"],
});

if (!validation.valid) {
  throw new Error(validation.error);
}
```

### Filename Sanitization

```typescript
import { sanitizeFileName, generateUniqueFileName } from "@m14i/blogging-core/server";

// Sanitize filename
const safe = sanitizeFileName("My File (1).pdf"); // "My_File_1_.pdf"

// Generate unique filename
const unique = generateUniqueFileName("photo.jpg");
// "photo_1712345678900_a1b2c3.jpg"
```

## Frontend Integration

### React File Upload Component

```typescript
"use client";

import { useState } from "react";
import type { UploadResult } from "@m14i/blogging-core/server";

export function MediaUploader() {
  const [uploading, setUploading] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/blog/media", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${yourAuthToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result: UploadResult = await response.json();
      setUploadedMedia(result);
      console.log("Upload successful:", result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
          Upload Image or PDF
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*,application/pdf"
          onChange={handleUpload}
          disabled={uploading}
          className="block w-full text-sm"
        />
      </div>

      {uploading && (
        <div className="text-sm text-muted-foreground">Uploading...</div>
      )}

      {error && (
        <div className="text-sm text-red-600">Error: {error}</div>
      )}

      {uploadedMedia && (
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Upload Successful!</h3>
          <dl className="space-y-1 text-sm">
            <div>
              <dt className="inline font-medium">File:</dt>
              <dd className="inline ml-2">{uploadedMedia.fileName}</dd>
            </div>
            <div>
              <dt className="inline font-medium">Size:</dt>
              <dd className="inline ml-2">
                {(uploadedMedia.fileSize / 1024 / 1024).toFixed(2)} MB
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">Type:</dt>
              <dd className="inline ml-2">{uploadedMedia.type}</dd>
            </div>
            <div>
              <dt className="inline font-medium">URL:</dt>
              <dd className="inline ml-2 break-all">{uploadedMedia.url}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
```

### Drag & Drop Upload

```typescript
"use client";

import { useState } from "react";

export function DragDropUploader() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    // Upload logic here (same as above)
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/blog/media", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const result = await response.json();
    console.log(result);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center
        ${isDragging ? "border-primary bg-primary/5" : "border-border"}
      `}
    >
      <p className="text-sm text-muted-foreground">
        Drag and drop a file here, or click to select
      </p>
    </div>
  );
}
```

## Component Improvements

The updated components include enhanced features:

### Image Component

- ✨ **Hover zoom effect** - Images scale slightly on hover
- 🔍 **View full image button** - Opens image in new tab
- 🎨 **Smooth transitions** - Better user experience
- 📱 **Lazy loading** - Improved performance
- 📝 **Centered captions** - Better visual hierarchy

### PDF Component

- 📄 **PDF icon and header** - Clear document identification
- 🎯 **Multiple actions** - Download and open in new tab
- 🖼️ **Better iframe styling** - Improved embed appearance
- 💡 **Fullscreen hint** - User guidance on hover
- 🎨 **Enhanced empty state** - Visual PDF icon placeholder

## Security Considerations

### Important Security Measures

1. **File Type Validation**
   - Always validate MIME types on the server
   - Don't trust client-side validation alone
   - Use allowlists, not denylists

2. **File Size Limits**
   - Prevent DoS attacks with size limits
   - Configure appropriate limits for your use case
   - Default is 10MB, adjust as needed

3. **Filename Sanitization**
   - Remove path traversal attempts
   - Replace special characters
   - Generate unique filenames

4. **Authentication & Authorization**
   - Always check user authentication
   - Verify user permissions
   - Track uploaded_by for audit trail

5. **Storage Bucket Security**
   - Use RLS policies for Supabase Storage
   - Separate public/private buckets
   - Implement proper access controls

### Example Security Configuration

```typescript
// Strict validation for production
const PRODUCTION_OPTIONS = {
  maxSizeMB: 5,
  allowedTypes: [
    "image/jpeg",
    "image/png",
    "image/webp", // Only specific image types
    "application/pdf",
  ],
};

// More lenient for development
const DEVELOPMENT_OPTIONS = {
  maxSizeMB: 10,
  allowedTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "application/pdf",
  ],
};

const options = process.env.NODE_ENV === "production"
  ? PRODUCTION_OPTIONS
  : DEVELOPMENT_OPTIONS;
```

## API Response Format

### Successful Upload

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "filePath": "https://your-project.supabase.co/storage/v1/object/public/blog-media/photo_1712345678900_a1b2c3.jpg",
  "fileName": "photo.jpg",
  "fileSize": 2048576,
  "mimeType": "image/jpeg",
  "type": "image",
  "url": "https://your-project.supabase.co/storage/v1/object/public/blog-media/photo_1712345678900_a1b2c3.jpg",
  "metadata": {
    "size": 2048576,
    "type": "image/jpeg",
    "lastModified": 1712345678900
  }
}
```

### Error Response

```json
{
  "error": "File size exceeds 10MB limit. Current size: 15.23MB"
}
```

## TypeScript Types

```typescript
import type {
  UploadResult,
  UploadedFile,
  ValidationOptions,
  StorageAdapter,
} from "@m14i/blogging-core/server";

// Upload result
const result: UploadResult = {
  id: "uuid",
  filePath: "path/to/file",
  fileName: "file.jpg",
  fileSize: 1024,
  mimeType: "image/jpeg",
  type: "image",
  url: "https://...",
  metadata: {},
};

// Validation options
const options: ValidationOptions = {
  maxSizeMB: 10,
  allowedTypes: ["image/jpeg", "image/png"],
};
```

## Complete Example

See the `/examples` directory for a complete working example of:
- Next.js API route setup
- React upload component
- Admin interface integration
- Error handling
- Progress indicators

## Troubleshooting

### Common Issues

**"Storage adapter not configured"**
- Ensure you pass `storageAdapter` option to `createMediaHandlers`
- Check Supabase client initialization

**"Unauthorized" errors**
- Verify your `checkAuth` function implementation
- Check authentication headers in requests

**"File type not allowed"**
- Review `allowedTypes` configuration
- Ensure MIME type matches allowed list

**Upload fails silently**
- Check browser console for errors
- Verify CORS settings for Supabase Storage
- Check RLS policies on storage bucket

## Next Steps

- Configure your Supabase Storage bucket
- Implement authentication in your app
- Add the media upload API route
- Create an admin interface for media management
- Integrate media selection in blog post editor

For more information, see the [main documentation](./README.md).
