/**
 * Formatting Utilities
 * Date formatting, reading time calculation, etc.
 */

import type { BlogPostRow, LayoutSection } from "../../types";

/**
 * Format a date string
 */
export function formatDate(dateString: string, locale: string = "fr-FR"): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format a relative date (e.g., "2 days ago")
 */
export function formatRelativeDate(dateString: string, locale: string = "fr-FR"): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    const timeUnits: Array<[number, Intl.RelativeTimeFormatUnit]> = [
      [60, "second"],
      [3600, "minute"],
      [86400, "hour"],
      [2592000, "day"],
      [31536000, "month"],
      [Infinity, "year"],
    ];

    let previousThreshold = 1;
    for (const [threshold, unit] of timeUnits) {
      if (diffInSeconds < threshold) {
        const value = Math.floor(diffInSeconds / previousThreshold);
        return rtf.format(-value, unit);
      }
      previousThreshold = threshold;
    }

    return dateString;
  } catch {
    return dateString;
  }
}

/**
 * Calculate reading time from post sections
 * Assumes average reading speed of 200 words per minute
 */
export function calculateReadingTime(sections: LayoutSection[]): number {
  const WORDS_PER_MINUTE = 200;

  let totalWords = 0;

  sections.forEach((section) => {
    section.columns.forEach((column) => {
      column.forEach((block) => {
        if (block.type === "text" && block.content) {
          // Count words in text blocks
          const words = block.content.trim().split(/\s+/).length;
          totalWords += words;
        }
      });
    });
  });

  // Calculate reading time in minutes (minimum 1 minute)
  const minutes = Math.max(1, Math.ceil(totalWords / WORDS_PER_MINUTE));

  return minutes;
}

/**
 * Calculate reading time from a post
 */
export function getPostReadingTime(post: BlogPostRow): number {
  return calculateReadingTime(post.sections);
}

/**
 * Format reading time for display
 */
export function formatReadingTime(
  minutes: number,
  labels: { minuteRead?: string; minutesRead?: string } = {}
): string {
  const minuteLabel = labels.minuteRead || "min de lecture";
  const minutesLabel = labels.minutesRead || "mins de lecture";

  return `${minutes} ${minutes === 1 ? minuteLabel : minutesLabel}`;
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Get excerpt from post (uses post.excerpt or generates from sections)
 */
export function getPostExcerpt(post: BlogPostRow, maxLength: number = 150): string {
  // Use post excerpt if available
  if (post.excerpt) {
    return truncateText(post.excerpt, maxLength);
  }

  // Generate excerpt from first text block
  for (const section of post.sections) {
    for (const column of section.columns) {
      for (const block of column) {
        if (block.type === "text" && block.content) {
          // Remove HTML tags and truncate
          const plainText = block.content.replace(/<[^>]*>/g, "");
          return truncateText(plainText, maxLength);
        }
      }
    }
  }

  return "";
}

/**
 * Generate a URL-friendly slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores with -
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing -
}

/**
 * Pluralize a word based on count
 */
export function pluralize(
  count: number,
  singular: string,
  plural: string
): string {
  return count === 1 ? singular : plural;
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(num: number, locale: string = "fr-FR"): string {
  return new Intl.NumberFormat(locale).format(num);
}
