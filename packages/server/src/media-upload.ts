/**
 * Media Upload Utilities for m14i-blogging
 *
 * Provides file validation, upload handling, and Supabase Storage integration
 * for images and PDFs.
 */

import { NextRequest } from "next/server";

// ============================================================================
// Types
// ============================================================================

export interface UploadedFile {
  file: File;
  buffer: ArrayBuffer;
}

export interface UploadResult {
  id: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  type: "image" | "pdf" | "other";
  url: string;
  metadata?: Record<string, unknown>;
}

export interface ValidationOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export interface StorageAdapter {
  upload(file: File, buffer: ArrayBuffer, path: string): Promise<string>;
  delete(path: string): Promise<void>;
  getPublicUrl(path: string): string;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MAX_SIZE_MB = 10;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

const ALLOWED_PDF_TYPES = ["application/pdf"];

const ALLOWED_MEDIA_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_PDF_TYPES];

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate file size
 */
export function validateFileSize(
  file: File,
  maxSizeMB: number = DEFAULT_MAX_SIZE_MB
): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit. Current size: ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)}MB`,
    };
  }

  return { valid: true };
}

/**
 * Validate file type
 */
export function validateFileType(
  file: File,
  allowedTypes: string[] = ALLOWED_MEDIA_TYPES
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Get media type from MIME type
 */
export function getMediaType(
  mimeType: string
): "image" | "pdf" | "other" {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    return "image";
  }
  if (ALLOWED_PDF_TYPES.includes(mimeType)) {
    return "pdf";
  }
  return "other";
}

/**
 * Sanitize filename to prevent path traversal and special characters
 */
export function sanitizeFileName(fileName: string): string {
  // Remove any directory paths
  const baseName = fileName.split("/").pop() || fileName;

  // Replace special characters with underscores, keep extension
  const sanitized = baseName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_");

  return sanitized;
}

/**
 * Generate unique filename with timestamp
 */
export function generateUniqueFileName(originalName: string): string {
  const sanitized = sanitizeFileName(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = sanitized.split(".").pop();
  const nameWithoutExt = sanitized.replace(`.${extension}`, "");

  return `${nameWithoutExt}_${timestamp}_${random}.${extension}`;
}

/**
 * Validate uploaded file
 */
export function validateFile(
  file: File,
  options: ValidationOptions = {}
): { valid: boolean; error?: string } {
  const {
    maxSizeMB = DEFAULT_MAX_SIZE_MB,
    allowedTypes = ALLOWED_MEDIA_TYPES,
  } = options;

  // Validate file size
  const sizeValidation = validateFileSize(file, maxSizeMB);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  // Validate file type
  const typeValidation = validateFileType(file, allowedTypes);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  return { valid: true };
}

// ============================================================================
// FormData Parsing
// ============================================================================

/**
 * Parse file from FormData
 */
export async function parseFileFromRequest(
  request: NextRequest
): Promise<{ file: File; buffer: ArrayBuffer } | { error: string }> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return { error: "No file provided or invalid file format" };
    }

    const buffer = await file.arrayBuffer();

    return { file, buffer };
  } catch (error) {
    return { error: "Failed to parse file from request" };
  }
}

// ============================================================================
// Supabase Storage Adapter
// ============================================================================

/**
 * Create Supabase Storage adapter for file uploads
 */
export function createSupabaseStorageAdapter(
  supabaseClient: any,
  bucketName: string = "blog-media"
): StorageAdapter {
  return {
    async upload(file: File, buffer: ArrayBuffer, path: string): Promise<string> {
      const { data, error } = await supabaseClient.storage
        .from(bucketName)
        .upload(path, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        throw new Error(`Failed to upload file to storage: ${error.message}`);
      }

      return data.path;
    },

    async delete(path: string): Promise<void> {
      const { error } = await supabaseClient.storage
        .from(bucketName)
        .remove([path]);

      if (error) {
        throw new Error(`Failed to delete file from storage: ${error.message}`);
      }
    },

    getPublicUrl(path: string): string {
      const { data } = supabaseClient.storage
        .from(bucketName)
        .getPublicUrl(path);

      return data.publicUrl;
    },
  };
}

// ============================================================================
// Image Metadata Extraction
// ============================================================================

/**
 * Extract image metadata (dimensions, etc.)
 * This is a placeholder - in a real implementation, you'd use a library like sharp
 */
export async function extractImageMetadata(
  file: File
): Promise<Record<string, unknown>> {
  // Placeholder for image metadata extraction
  // In production, you might want to use sharp or another library
  // to extract width, height, format, etc.

  return {
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  };
}

/**
 * Extract PDF metadata (page count, etc.)
 */
export async function extractPdfMetadata(
  file: File
): Promise<Record<string, unknown>> {
  // Placeholder for PDF metadata extraction
  // In production, you might want to use pdf-lib or another library

  return {
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  };
}

// ============================================================================
// Main Upload Handler
// ============================================================================

/**
 * Handle file upload with validation and storage
 */
export async function handleFileUpload(
  request: NextRequest,
  storageAdapter: StorageAdapter,
  blogClient: any,
  userId?: string,
  options: ValidationOptions = {}
): Promise<UploadResult> {
  // Parse file from request
  const parseResult = await parseFileFromRequest(request);
  if ("error" in parseResult) {
    throw new Error(parseResult.error);
  }

  const { file, buffer } = parseResult;

  // Validate file
  const validation = validateFile(file, options);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Generate unique filename
  const uniqueFileName = generateUniqueFileName(file.name);
  const mediaType = getMediaType(file.type);

  // Upload to storage
  const storagePath = await storageAdapter.upload(file, buffer, uniqueFileName);
  const publicUrl = storageAdapter.getPublicUrl(storagePath);

  // Extract metadata based on file type
  let metadata: Record<string, unknown> = {};
  if (mediaType === "image") {
    metadata = await extractImageMetadata(file);
  } else if (mediaType === "pdf") {
    metadata = await extractPdfMetadata(file);
  }

  // Create media record in database
  const mediaRecord = await blogClient.media.create({
    file_path: publicUrl,
    file_name: file.name,
    file_size: file.size,
    mime_type: file.type,
    type: mediaType,
    metadata,
    uploaded_by: userId,
  });

  return {
    id: mediaRecord.id,
    filePath: mediaRecord.file_path,
    fileName: mediaRecord.file_name,
    fileSize: mediaRecord.file_size,
    mimeType: mediaRecord.mime_type,
    type: mediaRecord.type,
    url: publicUrl,
    metadata: mediaRecord.metadata,
  };
}
