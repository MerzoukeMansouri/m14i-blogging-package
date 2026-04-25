"use client";

/**
 * useTags Hook
 * Fetch blog tags with post counts
 */

import { useCallback } from "react";
import type { TagWithCount } from "../types";
import { useBlogContext } from "../context/BlogContext";
import { useAsyncData } from "../../utils/hooks/useAsyncData";

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

  const fetchTags = useCallback(async (): Promise<TagWithCount[]> => {
    // If custom API client is provided (e.g., Supabase client)
    if (apiClient) {
      return await apiClient.tags.listWithCounts();
    }

    // Use API endpoint
    const response = await fetch(`${apiBasePath}/tags`);

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
