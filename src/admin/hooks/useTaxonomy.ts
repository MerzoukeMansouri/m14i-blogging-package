"use client";

/**
 * useTaxonomy Hook
 * Manages categories and tags (derived from posts)
 */

import { useState, useCallback, useEffect } from "react";
import { useBlogAdminContext } from "../context/BlogAdminContext";
import type {
  BlogCategory,
  BlogTag,
} from "../../types/database";

export function useTaxonomy() {
  const { apiClient, features } = useBlogAdminContext();

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch categories
   */
  const fetchCategories = useCallback(async () => {
    if (!features.categories) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiClient.listCategories();
      setCategories(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch categories";
      setError(message);
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, [apiClient, features.categories]);

  /**
   * Fetch tags
   */
  const fetchTags = useCallback(async () => {
    if (!features.tags) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiClient.listTags();
      setTags(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch tags";
      setError(message);
      console.error("Error fetching tags:", err);
    } finally {
      setLoading(false);
    }
  }, [apiClient, features.tags]);

  /**
   * Load all taxonomy data
   */
  const loadTaxonomy = useCallback(async () => {
    await Promise.all([fetchCategories(), fetchTags()]);
  }, [fetchCategories, fetchTags]);

  /**
   * Auto-load taxonomy on mount
   */
  useEffect(() => {
    loadTaxonomy();
  }, [loadTaxonomy]);

  return {
    categories,
    tags,
    loading,
    error,
    loadTaxonomy,
  };
}
