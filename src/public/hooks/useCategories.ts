"use client";

/**
 * useCategories Hook
 * Fetch blog categories with post counts (derived from posts)
 */

import { useState, useEffect, useCallback } from "react";
import type { BlogCategory } from "../../types/database";
import { useBlogContext } from "../context/BlogContext";

export interface UseCategoriesReturn {
  categories: BlogCategory[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook to fetch categories with post counts
 */
export function useCategories(): UseCategoriesReturn {
  const { apiBasePath, apiClient } = useBlogContext();

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let result: BlogCategory[];

      // If custom API client is provided (e.g., Supabase client)
      if (apiClient) {
        result = await apiClient.stats.getCategories();
      } else {
        // Use API endpoint
        const response = await fetch(`${apiBasePath}/stats/categories`);

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }

        const data = await response.json();
        result = Array.isArray(data) ? data : (data.categories ?? []);
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
