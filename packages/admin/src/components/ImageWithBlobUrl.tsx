"use client";

import { useState, useEffect } from "react";

export interface ImageWithBlobUrlProps {
  url: string;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
  loadingText?: string;
  errorText?: string;
}

/**
 * Image component that loads via blob URL to avoid browser cookie issues
 * Automatically handles loading state and error handling
 */
export function ImageWithBlobUrl({
  url,
  alt,
  className,
  fallbackClassName = "w-full h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm",
  loadingText = "Loading image...",
  errorText = "Failed to load image",
}: ImageWithBlobUrlProps): React.ReactElement {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let mounted = true;

    const loadImage = async () => {
      try {
        // Fetch without credentials to avoid sending cookies
        const response = await fetch(url, { credentials: 'omit' });
        if (!mounted) return;

        if (response.ok) {
          const blob = await response.blob();
          if (!mounted) return;

          objectUrl = URL.createObjectURL(blob);
          setBlobUrl(objectUrl);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      mounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url]);

  if (loading) {
    return (
      <div className={fallbackClassName}>
        {loadingText}
      </div>
    );
  }

  if (error || !blobUrl) {
    return (
      <div className={fallbackClassName}>
        {errorText}
      </div>
    );
  }

  return (
    <img
      src={blobUrl}
      alt={alt}
      className={className}
    />
  );
}