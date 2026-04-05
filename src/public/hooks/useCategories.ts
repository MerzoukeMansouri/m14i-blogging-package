"use client";

/**
 * useCategories Hook
 * Fetch blog categories with post counts
 */

import { useState, useEffect, useCallback } from "react";
import type { CategoryWithCount } from "../types";
import { useBlogContext } from "../context/BlogContext";

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

  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let result: CategoryWithCount[];

      // If custom API client is provided (e.g., Supabase client)
      if (apiClient) {
        const stats = await apiClient.categories.listWithCounts();
        result = stats;
      } else {
        // Use API endpoint
        const response = await fetch(`${apiBasePath}/categories`);

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }

        result = await response.json();
      }

      setCategories(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiBasePath, apiClient]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refresh: fetchCategories,
  };
}
