"use client";

/**
 * useTags Hook
 * Fetch blog tags with post counts (derived from posts)
 */

import { useCallback } from "react";
import type { BlogTag } from "../../types/database";
import { useBlogContext } from "../context/BlogContext";
import { useAsyncData } from "../../utils/hooks/useAsyncData";

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

  const fetchTags = useCallback(async (): Promise<BlogTag[]> => {
    // If custom API client is provided (e.g., Supabase client)
    if (apiClient) {
      return await apiClient.stats.getTags();
    }

    // Use API endpoint
    const response = await fetch(`${apiBasePath}/stats/tags`);

    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : (data.tags ?? []);
  }, [apiBasePath, apiClient]);

  const { data, isLoading, error, execute } = useAsyncData(fetchTags, {
    initialData: [],
    autoFetch: true,
  });

  return {
    tags: data ?? [],
    isLoading,
    error,
    refresh: execute,
  };
}
