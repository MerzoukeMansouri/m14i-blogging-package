"use client";

/**
 * useRelatedPosts Hook
 * Fetch related blog posts based on category, tags, or post ID
 */

import { useState, useEffect, useCallback } from "react";
import type { BlogPostRow } from "../../types";
import { useBlogContext } from "../context/BlogContext";

export interface UseRelatedPostsReturn {
  relatedPosts: BlogPostRow[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook to fetch related posts
 */
export function useRelatedPosts(
  postId: string | undefined,
  limit: number = 3
): UseRelatedPostsReturn {
  const { apiBasePath, apiClient, display } = useBlogContext();
  const actualLimit = limit || display.relatedPostsCount;

  const [relatedPosts, setRelatedPosts] = useState<BlogPostRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRelatedPosts = useCallback(async () => {
    if (!postId) {
      setRelatedPosts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let result: BlogPostRow[];

      // If custom API client is provided (e.g., Supabase client)
      if (apiClient) {
        result = await apiClient.posts.getRelated(postId, actualLimit);
      } else {
        // Use API endpoint
        const response = await fetch(
          `${apiBasePath}/${postId}/related?limit=${actualLimit}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch related posts: ${response.statusText}`);
        }

        result = await response.json();
      }

      setRelatedPosts(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setRelatedPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiBasePath, apiClient, postId, actualLimit]);

  useEffect(() => {
    fetchRelatedPosts();
  }, [fetchRelatedPosts]);

  return {
    relatedPosts,
    isLoading,
    error,
    refresh: fetchRelatedPosts,
  };
}
