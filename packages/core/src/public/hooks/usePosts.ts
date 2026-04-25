"use client";

/**
 * usePosts Hook
 * Fetch and manage blog posts with filtering, pagination, and sorting
 */

import { useState, useEffect, useCallback } from "react";
import type { BlogPostRow, PostListResponse, BlogSortOption } from "../types";
import { useBlogContext } from "../context/BlogContext";

export interface UsePostsParams {
  status?: "published" | "draft" | "archived";
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: BlogSortOption;
}

export interface UsePostsReturn {
  posts: BlogPostRow[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook to fetch posts with filtering and pagination
 */
export function usePosts(params: UsePostsParams = {}): UsePostsReturn {
  const { apiBasePath, apiClient, display } = useBlogContext();
  const {
    status = "published",
    category,
    tag,
    search,
    page = 1,
    pageSize = display.postsPerPage,
    sort = "date-desc",
  } = params;

  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [orderBy, direction] = sort.split("-") as [string, "asc" | "desc"];
      const normalizedOrderBy = orderBy === "date" ? "published_at" : orderBy;

      let result: PostListResponse;

      if (apiClient) {
        result = await apiClient.posts.list({
          page,
          pageSize,
          status,
          category,
          tag,
          search,
          orderBy: normalizedOrderBy,
          orderDirection: direction,
        });
      } else {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          status,
        });

        // Add optional parameters
        const optionalParams = { category, tag, search };
        Object.entries(optionalParams).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });

        params.append("orderBy", normalizedOrderBy);
        params.append("orderDirection", direction);

        const response = await fetch(`${apiBasePath}?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        result = await response.json();
      }

      setPosts(result.posts || []);
      setTotal(result.total || 0);
      setHasMore(result.hasMore || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setPosts([]);
      setTotal(0);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [apiBasePath, apiClient, page, pageSize, status, category, tag, search, sort]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    total,
    page,
    pageSize,
    hasMore,
    isLoading,
    error,
    refresh: fetchPosts,
  };
}
