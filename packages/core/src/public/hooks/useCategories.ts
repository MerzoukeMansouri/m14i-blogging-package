"use client";

/**
 * useCategories Hook
 * Fetch blog categories with post counts
 */

import { useCallback } from "react";
import type { CategoryWithCount } from "../types";
import { useBlogContext } from "../context/BlogContext";
import { useAsyncData } from "../../utils/hooks/useAsyncData";

export interface UseCategoriesReturn {
  categories: CategoryWithCount[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook to fetch categories with post counts
 */
export function useCategories(): UseCategoriesReturn {
  const { apiBasePath, apiClient } = useBlogContext();

  const fetchCategories = useCallback(async (): Promise<CategoryWithCount[]> => {
    // If custom API client is provided (e.g., Supabase client)
    if (apiClient) {
      return await apiClient.categories.listWithCounts();
    }

    // Use API endpoint
    const response = await fetch(`${apiBasePath}/categories`);

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : (data.categories ?? []);
  }, [apiBasePath, apiClient]);

  const { data, isLoading, error, execute } = useAsyncData(fetchCategories, {
    initialData: [],
    autoFetch: true,
  });

  return {
    categories: data ?? [],
    isLoading,
    error,
    refresh: execute,
  };
}
