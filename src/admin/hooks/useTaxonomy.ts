"use client";

/**
 * useTaxonomy Hook
 * Manages categories and tags
 */

import { useState, useCallback, useEffect } from "react";
import { useBlogAdminContext } from "../context/BlogAdminContext";
import type {
  CategoryRow,
  CategoryInsert,
  TagRow,
  TagInsert,
} from "../../types/database";

export function useTaxonomy() {
  const { apiClient, features } = useBlogAdminContext();

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [tags, setTags] = useState<TagRow[]>([]);
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
   * Create a new category
   */
  const createCategory = useCallback(
    async (category: CategoryInsert) => {
      setError(null);

      try {
        const newCategory = await apiClient.createCategory(category);
        setCategories((prev) => [...prev, newCategory]);
        return newCategory;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create category";
        setError(message);
        console.error("Error creating category:", err);
        throw err;
      }
    },
    [apiClient]
  );

  /**
   * Create a new tag
   */
  const createTag = useCallback(
    async (tag: TagInsert) => {
      setError(null);

      try {
        const newTag = await apiClient.createTag(tag);
        setTags((prev) => [...prev, newTag]);
        return newTag;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create tag";
        setError(message);
        console.error("Error creating tag:", err);
        throw err;
      }
    },
    [apiClient]
  );

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
    createCategory,
    createTag,
  };
}
