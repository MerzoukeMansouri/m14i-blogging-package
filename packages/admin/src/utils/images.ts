/**
 * Free Image Service Integration
 * Uses Picsum Photos - completely free, no authentication required
 */

export interface ImagePhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
}

/**
 * Get random high-quality images from Picsum Photos
 * Completely free service, no authentication needed, no CORS issues
 */
export async function searchImages(
  query: string,
  perPage: number = 10
): Promise<ImagePhoto[]> {
  try {
    // Picsum Photos provides beautiful, free stock photos
    // We'll generate a stable random seed from the query for consistent results
    const seed = hashString(query);
    const imageUrl = `https://picsum.photos/seed/${seed}/1600/900`;

    return [
      {
        id: seed.toString(),
        urls: {
          raw: imageUrl,
          full: imageUrl,
          regular: imageUrl,
          small: `https://picsum.photos/seed/${seed}/800/450`,
          thumb: `https://picsum.photos/seed/${seed}/400/225`,
        },
        alt_description: query,
        description: `Image related to ${query}`,
      },
    ];
  } catch (error) {
    console.error("Error getting image:", error);
    return [];
  }
}

/**
 * Simple hash function to convert string to number
 * Used to generate consistent random images for the same query
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate search query from post data
 * Returns null if no meaningful content available
 */
export function generateImageSearchQuery(
  title?: string,
  category?: string,
  tags?: string[]
): string | null {
  // Prioritize category, then first tag, then title
  if (category && category.trim()) {
    return category.trim();
  }

  if (tags && tags.length > 0 && tags[0].trim()) {
    return tags[0].trim();
  }

  if (title && title.trim()) {
    // Extract key words from title (remove common words)
    const commonWords = ["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "with"];
    const words = title
      .toLowerCase()
      .split(/\s+/)
      .filter(word => !commonWords.includes(word) && word.length > 2)
      .slice(0, 3);

    if (words.length > 0) {
      return words.join(" ");
    }
  }

  // Return null if no meaningful content - don't fetch random image
  return null;
}
