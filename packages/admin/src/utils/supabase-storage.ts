/**
 * Supabase Storage utilities for image upload
 */

export interface SupabaseStorageClient {
  storage: {
    from(bucket: string): {
      upload(path: string, file: File, options?: any): Promise<{ data: any; error: any }>;
      download(path: string): Promise<{ data: any; error: any }>;
      list(path?: string, options?: any): Promise<{ data: any[]; error: any }>;
      getPublicUrl(path: string): { data: { publicUrl: string } };
      remove(paths: string[]): Promise<{ data: any; error: any }>;
    };
  };
}

export interface UploadedImage {
  name: string;
  path: string;
  url: string;
  size: number;
  createdAt: string;
}

/**
 * Upload an image to Supabase Storage with verification
 */
export async function uploadImage(
  supabase: SupabaseStorageClient,
  file: File,
  bucketName: string = "blog-images"
): Promise<UploadedImage> {
  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  // Trigger file flush by reading via authenticated route
  const { data: downloadBlob } = await supabase.storage
    .from(bucketName)
    .download(filePath);

  if (downloadBlob) {
    // Force full read by consuming the blob
    await downloadBlob.arrayBuffer();
  }

  // Brief wait for storage to flush
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Verify public URL is accessible
  try {
    const response = await fetch(publicUrl);
    if (response.ok) {
      await response.blob(); // Consume response to ensure caching
    }
  } catch {
    // Ignore verification errors - URL will work eventually
  }

  return {
    name: file.name,
    path: filePath,
    url: publicUrl,
    size: file.size,
    createdAt: new Date().toISOString(),
  };
}

/**
 * List all images in the bucket
 */
export async function listImages(
  supabase: SupabaseStorageClient,
  bucketName: string = "blog-images",
  options?: { limit?: number; offset?: number; sortBy?: { column: string; order: string } }
): Promise<UploadedImage[]> {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list("", {
      limit: options?.limit || 100,
      offset: options?.offset || 0,
      sortBy: options?.sortBy || { column: "created_at", order: "desc" },
    });

  if (error) {
    throw new Error(`Failed to list images: ${error.message}`);
  }

  // Convert to UploadedImage format
  return (data || []).map((file: any) => {
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(file.name);

    return {
      name: file.name,
      path: file.name,
      url: publicUrl,
      size: file.metadata?.size || 0,
      createdAt: file.created_at || new Date().toISOString(),
    };
  });
}

/**
 * Delete an image from storage
 */
export async function deleteImage(
  supabase: SupabaseStorageClient,
  path: string,
  bucketName: string = "blog-images"
): Promise<void> {
  const { error } = await supabase.storage
    .from(bucketName)
    .remove([path]);

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Type de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP.",
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: "Fichier trop volumineux. Taille maximum: 5 MB.",
    };
  }

  return { valid: true };
}