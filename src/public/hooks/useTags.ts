"use client";

/**
 * useTags Hook
 * Fetch blog tags with post counts (derived from posts)
 */

import { useState, useEffect, useCallback } from "react";
import type { BlogTag } from "../../types/database";
import { useBlogContext } from "../context/BlogContext";

export interface UseTagsReturn {
  tags: BlogTag[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook to fetch tags with post counts
 */
export function useTags(): UseTagsReturn {
  const { apiBasePath, apiClient } = useBlogContext();

  const [tags, setTags] = useState<BlogTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let result: BlogTag[];

      // If custom API client is provided (e.g., Supabase client)
      if (apiClient) {
        result = await apiClient.stats.getTags();
      } else {
        // Use API endpoint
        const response = await fetch(`${apiBasePath}/stats/tags`);

        if (!response.ok) {
          throw new Error(`Failed to fetch tags: ${response.statusText}`);
        }

        const data = await response.json();
        result = Array.isArray(data) ? data : (data.tags ?? []);
      }

      setTags(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setTags([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiBasePath, apiClient]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    isLoading,
    error,
    refresh: fetchTags,
  };
}
