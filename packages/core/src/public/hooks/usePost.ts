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
    console.log('RAW API RESPONSE:', JSON.stringify(data, null, 2));
    // Server returns {post: {...}} or raw post object
    const post = data.post || data;
    console.log('EXTRACTED POST:', JSON.stringify(post, null, 2));
    return post;
  }, [apiBasePath, apiClient, slug]);

  const { data, isLoading, error, execute } = useAsyncData(fetchPost, {
    initialData: null,
  });

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return {
    post: data ?? null,
    isLoading,
    error,
    refresh: execute,
  };
}
