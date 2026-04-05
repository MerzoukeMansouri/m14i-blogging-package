"use client";

/**
 * useTags Hook
 * Fetch blog tags with post counts
 */

import { useState, useEffect, useCallback } from "react";
import type { TagWithCount } from "../types";
import { useBlogContext } from "../context/BlogContext";

export interface UseTagsReturn {
  tags: TagWithCount[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook to fetch tags with post counts
 */
export function useTags(): UseTagsReturn {
  const { apiBasePath, apiClient } = useBlogContext();

  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let result: TagWithCount[];

      // If custom API client is provided (e.g., Supabase client)
      if (apiClient) {
        const stats = await apiClient.tags.listWithCounts();
        result = stats;
      } else {
        // Use API endpoint
        const response = await fetch(`${apiBasePath}/tags`);

        if (!response.ok) {
          throw new Error(`Failed to fetch tags: ${response.statusText}`);
        }

        result = await response.json();
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
