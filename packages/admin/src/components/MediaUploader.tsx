"use client";

import { useState, useRef } from "react";
import { useBlogAdminContext } from "../context/BlogAdminContext";
import { uploadImage, validateImageFile } from "../utils/supabase-storage";

export interface MediaUploaderProps {
  onImageSelected: (url: string) => void;
  currentValue?: string;
}

export function MediaUploader({ onImageSelected, currentValue }: MediaUploaderProps) {
  const { components, supabaseClient } = useBlogAdminContext();
  const Button = components?.Button;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !supabaseClient) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || "Invalid file");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Simulate progress (Supabase doesn't provide upload progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const uploaded = await uploadImage(supabaseClient, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Select the uploaded image
      onImageSelected(uploaded.url);

      // Reset after short delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 500);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (!supabaseClient) {
    return (
      <div className="text-xs text-yellow-700 bg-yellow-50 p-3 rounded border border-yellow-200">
        <strong>Storage service unavailable</strong>
        <p className="mt-1">Supabase Storage is not running in local development.</p>
        <p className="mt-1">Use the "URL / Find Image" tab instead, or start full Supabase stack:</p>
        <code className="block mt-2 text-xs bg-yellow-100 p-2 rounded">supabase start</code>
      </div>
    );
  }

  const renderButton = (): React.ReactElement => {
    const buttonText = isUploading ? `Uploading... ${uploadProgress}%` : "📤 Upload Image";

    if (Button) {
      return (
        <Button
          type="button"
          onClick={handleButtonClick}
          disabled={isUploading}
          variant="outline"
          className="w-full"
        >
          {buttonText}
        </Button>
      );
    }

    return (
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isUploading}
        className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {buttonText}
      </button>
    );
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {renderButton()}

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {uploadError && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
          {uploadError}
        </div>
      )}

      <p className="text-xs text-gray-500">
        JPG, PNG, GIF, WebP. Max 5 MB.
      </p>
    </div>
  );
}