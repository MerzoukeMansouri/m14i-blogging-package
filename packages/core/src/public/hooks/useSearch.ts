"use client";

/**
 * useSearch Hook
 * Search blog posts by keyword
 */

import { useState, useCallback } from "react";
import { usePosts } from "./usePosts";
import type { UsePostsReturn } from "./usePosts";

export interface UseSearchReturn extends UsePostsReturn {
  query: string;
  setQuery: (query: string) => void;
  performSearch: (query: string) => void;
  clearSearch: () => void;
}

/**
 * Hook to search posts by keyword
 */
export function useSearch(initialQuery: string = "", initialPage: number = 1): UseSearchReturn {
  const [query, setQueryState] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);

  const postsResult = usePosts({
    search: query,
    page,
    status: "published",
  });

  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);
    setPage(1); // Reset to first page on new search
  }, []);

  const performSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, [setQuery]);

  const clearSearch = useCallback(() => {
    setQueryState("");
    setPage(1);
  }, []);

  return {
    ...postsResult,
    query,
    setQuery,
    performSearch,
    clearSearch,
  };
}
