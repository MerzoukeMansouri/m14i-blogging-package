"use client";

/**
 * usePost Hook
 * Fetch a single blog post by slug
 */

import { useCallback, useEffect } from "react";
import type { BlogPostRow } from "../../types";
import { useBlogContext } from "../context/BlogContext";
import { useAsyncData } from "../../utils/hooks/useAsyncData";

export interface UsePostReturn {
  post: BlogPostRow | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook to fetch a single post by slug
 */
export function usePost(slug: string | undefined): UsePostReturn {
  const { apiBasePath, apiClient } = useBlogContext();

  const fetchPost = useCallback(async (): Promise<BlogPostRow | null> => {
    if (!slug) {
      return null;
    }

    // If custom API client is provided (e.g., Supabase client)
    if (apiClient) {
      return await apiClient.posts.getBySlug(slug);
    }

    // Use API endpoint
    const response = await fetch(`${apiBasePath}/slug/${encodeURIComponent(slug)}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    const data = await response.json();
    // Server returns {post: {...}} or raw post object
    return data.post || data;
  }, [apiBasePath, apiClient, slug]);

  const { data, isLoading, error, execute } = useAsyncData(fetchPost, {
    initialData: null,
  });

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    post: data ?? null,
    isLoading,
    error,
    refresh: execute,
  };
}
