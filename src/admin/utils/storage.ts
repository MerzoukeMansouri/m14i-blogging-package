/**
 * Storage Utilities for Preview Data
 * Uses sessionStorage to store draft previews
 */

import type { PreviewData } from "../types";

const PREVIEW_PREFIX = "blog-preview-";

/**
 * Save preview data to sessionStorage
 */
export function savePreviewData(slug: string, data: PreviewData): void {
  if (typeof window === "undefined") return;

  try {
    const key = `${PREVIEW_PREFIX}${slug}`;
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save preview data:", error);
  }
}

/**
 * Load preview data from sessionStorage
 */
export function loadPreviewData(slug: string): PreviewData | null {
  if (typeof window === "undefined") return null;

  try {
    const key = `${PREVIEW_PREFIX}${slug}`;
    const data = sessionStorage.getItem(key);

    if (!data) return null;

    return JSON.parse(data) as PreviewData;
  } catch (error) {
    console.error("Failed to load preview data:", error);
    return null;
  }
}

/**
 * Clear preview data from sessionStorage
 */
export function clearPreviewData(slug: string): void {
  if (typeof window === "undefined") return;

  try {
    const key = `${PREVIEW_PREFIX}${slug}`;
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to clear preview data:", error);
  }
}

/**
 * Clear all preview data
 */
export function clearAllPreviewData(): void {
  if (typeof window === "undefined") return;

  try {
    const keys = Object.keys(sessionStorage);
    keys.forEach((key) => {
      if (key.startsWith(PREVIEW_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Failed to clear all preview data:", error);
  }
}
