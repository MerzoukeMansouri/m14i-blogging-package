"use client";

/**
 * usePost Hook
 * Fetch a single blog post by slug
 */

import { useState, useEffect, useCallback } from "react";
import type { BlogPostRow } from "../../types";
import { useBlogContext } from "../context/BlogContext";

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

  const [post, setPost] = useState<BlogPostRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    if (!slug) {
      setPost(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let result: BlogPostRow;

      // If custom API client is provided (e.g., Supabase client)
      if (apiClient) {
        result = await apiClient.posts.getBySlug(slug);
      } else {
        // Use API endpoint
        const response = await fetch(`${apiBasePath}/slug/${encodeURIComponent(slug)}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.statusText}`);
        }

        result = await response.json();
      }

      setPost(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setPost(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiBasePath, apiClient, slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return {
    post,
    isLoading,
    error,
    refresh: fetchPost,
  };
}
