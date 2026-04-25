"use client";

/**
 * usePosts Hook
 * Manages blog posts state and operations
 */

import { useState, useCallback } from "react";
import { useBlogAdminContext } from "../context/BlogAdminContext";
import type {
  BlogPostRow,
  BlogPostInsert,
  BlogPostUpdate,
  BlogFilterParams,
} from "@m14i/blogging-core";

export function usePosts() {
  const { apiClient, onPostCreate, onPostUpdate, onPostDelete, onPublish } = useBlogAdminContext();

  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch posts with optional filters
   */
  const fetchPosts = useCallback(
    async (params?: BlogFilterParams): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.listPosts(params);
        setPosts(response.posts);
        setTotal(response.total);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch posts";
        setError(message);
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    },
    [apiClient]
  );

  /**
   * Get a single post by ID
   */
  const getPost = useCallback(
    async (id: string): Promise<BlogPostRow> => {
      try {
        return await apiClient.getPost(id);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch post";
        setError(message);
        console.error("Error fetching post:", err);
        throw err;
      }
    },
    [apiClient]
  );

  /**
   * Create a new post
   */
  const createPost = useCallback(
    async (post: BlogPostInsert): Promise<BlogPostRow> => {
      setLoading(true);
      setError(null);

      try {
        const newPost = await apiClient.createPost(post);
        setPosts((prev) => [newPost, ...prev]);
        onPostCreate?.(newPost);
        return newPost;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create post";
        setError(message);
        console.error("Error creating post:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiClient, onPostCreate]
  );

  /**
   * Update an existing post
   */
  const updatePost = useCallback(
    async (id: string, updates: BlogPostUpdate): Promise<BlogPostRow> => {
      setLoading(true);
      setError(null);

      try {
        const updatedPost = await apiClient.updatePost(id, updates);
        setPosts((prev) => prev.map((p) => (p.id === id ? updatedPost : p)));
        onPostUpdate?.(updatedPost);
        return updatedPost;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update post";
        setError(message);
        console.error("Error updating post:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiClient, onPostUpdate]
  );

  /**
   * Delete a post
   */
  const deletePost = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await apiClient.deletePost(id);
        setPosts((prev) => prev.filter((p) => p.id !== id));
        setTotal((prev) => prev - 1);
        onPostDelete?.(id);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete post";
        setError(message);
        console.error("Error deleting post:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiClient, onPostDelete]
  );

  /**
   * Publish a post
   */
  const publishPost = useCallback(
    async (id: string): Promise<BlogPostRow> => {
      setLoading(true);
      setError(null);

      try {
        const publishedPost = await apiClient.publishPost(id);
        setPosts((prev) => prev.map((p) => (p.id === id ? publishedPost : p)));
        onPublish?.(publishedPost);
        return publishedPost;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to publish post";
        setError(message);
        console.error("Error publishing post:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiClient, onPublish]
  );

  return {
    posts,
    total,
    loading,
    error,
    fetchPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    publishPost,
  };
}
