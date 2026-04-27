"use client";

import { useState, useEffect } from "react";
import { useBlogAdminContext } from "../context/BlogAdminContext";
import { listImages, deleteImage, type UploadedImage } from "../utils/supabase-storage";
import { ImageWithBlobUrl } from "./ImageWithBlobUrl";

export interface MediaGalleryProps {
  onImageSelected: (url: string) => void;
  selectedUrl?: string;
}

export function MediaGallery({ onImageSelected, selectedUrl }: MediaGalleryProps) {
  const { supabaseClient } = useBlogAdminContext();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadImages = async () => {
    if (!supabaseClient) {
      setError("Supabase client not configured");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const uploadedImages = await listImages(supabaseClient);
      setImages(uploadedImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (path: string) => {
    if (!supabaseClient || !confirm("Delete this image?")) return;

    try {
      await deleteImage(supabaseClient, path);
      setImages(images.filter((img) => img.path !== path));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  useEffect(() => {
    loadImages();
  }, [supabaseClient]);

  if (!supabaseClient) {
    return (
      <div className="text-xs text-yellow-700 bg-yellow-50 p-3 rounded border border-yellow-200">
        <strong>Storage service unavailable</strong>
        <p className="mt-1">Supabase Storage is not running. Use "URL / Find Image" tab.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-xs text-gray-500 text-center py-8">
        Loading media library...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xs text-red-600 bg-red-50 p-3 rounded">
        {error}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-xs text-gray-500 text-center py-8 border-2 border-dashed rounded">
        No images uploaded yet. Upload your first image above!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-700">
          Media Library ({images.length})
        </p>
        <button
          onClick={loadImages}
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
        {images.map((image) => (
          <div
            key={image.path}
            className={`relative group cursor-pointer border-2 rounded overflow-hidden ${
              selectedUrl === image.url
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => onImageSelected(image.url)}
          >
            <div className="aspect-square bg-gray-100">
              <ImageWithBlobUrl
                url={image.url}
                alt={image.name}
                className="w-full h-full object-cover"
                fallbackClassName="w-full h-full flex items-center justify-center text-xs text-gray-400"
                loadingText="Loading..."
                errorText="Error"
              />
            </div>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(image.path);
              }}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              title="Delete"
            >
              ×
            </button>

            {/* Selected indicator */}
            {selectedUrl === image.url && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                <span className="text-white text-2xl">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        Click an image to select it. Hover to delete.
      </p>
    </div>
  );
}