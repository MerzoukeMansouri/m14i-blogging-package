"use client";

import React from "react";
import { MediaUploader } from "./MediaUploader";
import { MediaGallery } from "./MediaGallery";

export interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (url: string) => void;
  currentValue?: string;
  title?: string;
}

/**
 * Reusable media library modal component
 * Provides upload and gallery selection functionality
 */
export function MediaLibraryModal({
  isOpen,
  onClose,
  onImageSelected,
  currentValue,
  title = "Media Library",
}: MediaLibraryModalProps): React.ReactElement | null {
  if (!isOpen) return null;

  const handleImageSelected = (url: string): void => {
    onImageSelected(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <MediaUploader
              onImageSelected={handleImageSelected}
              currentValue={currentValue}
            />
            <div className="border-t pt-4">
              <MediaGallery
                onImageSelected={handleImageSelected}
                selectedUrl={currentValue}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}