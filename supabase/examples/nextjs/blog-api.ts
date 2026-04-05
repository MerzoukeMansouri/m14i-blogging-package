/**
 * Blog API Functions for Supabase
 *
 * This file provides type-safe functions for CRUD operations on blog posts
 * using Supabase. Use these in API routes, Server Components, or Server Actions.
 */

import type { BlogPost, LayoutSection } from '../../../src/types';
import type { BlogPostRow, BlogPostInsert, BlogPostUpdate } from '../../adapters';
import {
  dbRowToBlogPost,
  blogPostToDbInsert,
  blogPostToDbUpdate,
  generateSlug,
  autoGenerateExcerpt,
  validateSlug,
} from '../../adapters';

// Types for query parameters
export interface GetPostsOptions {
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  tag?: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'updated_at' | 'published_at' | 'title';
  orderDirection?: 'asc' | 'desc';
}

export interface GetPostsResult {
  posts: BlogPost[];
  total: number;
  hasMore: boolean;
}

// ============================================================================
// READ OPERATIONS
// ============================================================================

/**
 * Get a single post by slug
 */
export async function getPostBySlug(
  supabase: any,
  slug: string
): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog.posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  return dbRowToBlogPost(data as BlogPostRow);
}

/**
 * Get a single post by ID
 */
export async function getPostById(
  supabase: any,
  id: string
): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog.posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return dbRowToBlogPost(data as BlogPostRow);
}

/**
 * Get multiple posts with filtering, pagination, and sorting
 */
export async function getPosts(
  supabase: any,
  options: GetPostsOptions = {}
): Promise<GetPostsResult> {
  const {
    status,
    category,
    tag,
    search,
    limit = 10,
    offset = 0,
    orderBy = 'published_at',
    orderDirection = 'desc',
  } = options;

  let query = supabase.from('blog.posts').select('*', { count: 'exact' });

  // Apply filters
  if (status) {
    query = query.eq('status', status);
  }

  if (category) {
    query = query.eq('category', category);
  }

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  if (search) {
    // Use full-text search
    query = query.textSearch('search_vector', search);
  }

  // Apply ordering
  query = query.order(orderBy, { ascending: orderDirection === 'asc' });

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error || !data) {
    return { posts: [], total: 0, hasMore: false };
  }

  const posts = data.map((row: BlogPostRow) => dbRowToBlogPost(row));

  return {
    posts,
    total: count ?? 0,
    hasMore: (count ?? 0) > offset + limit,
  };
}

/**
 * Get published posts only (shorthand)
 */
export async function getPublishedPosts(
  supabase: any,
  options: Omit<GetPostsOptions, 'status'> = {}
): Promise<GetPostsResult> {
  return getPosts(supabase, { ...options, status: 'published' });
}

/**
 * Get all unique categories
 */
export async function getCategories(supabase: any): Promise<string[]> {
  const { data, error } = await supabase
    .from('blog.posts')
    .select('category')
    .not('category', 'is', null)
    .eq('status', 'published');

  if (error || !data) return [];

  const categories = [...new Set(data.map((row: any) => row.category))];
  return categories.filter(Boolean).sort();
}

/**
 * Get all unique tags
 */
export async function getTags(supabase: any): Promise<string[]> {
  const { data, error } = await supabase
    .from('blog.posts')
    .select('tags')
    .eq('status', 'published');

  if (error || !data) return [];

  const allTags = data.flatMap((row: any) => row.tags || []);
  const uniqueTags = [...new Set(allTags)];
  return uniqueTags.sort();
}

/**
 * Search posts using full-text search
 */
export async function searchPosts(
  supabase: any,
  query: string,
  limit: number = 10
): Promise<BlogPost[]> {
  const { data, error } = await supabase.rpc('blog.search_posts', {
    search_query: query,
  });

  if (error || !data) return [];

  return data.slice(0, limit).map((row: BlogPostRow) => dbRowToBlogPost(row));
}

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

/**
 * Create a new blog post
 */
export async function createPost(
  supabase: any,
  post: Partial<BlogPost>,
  userId?: string
): Promise<{ post: BlogPost | null; error: string | null }> {
  // Validate required fields
  if (!post.title || !post.sections) {
    return { post: null, error: 'Title and sections are required' };
  }

  // Generate slug if not provided
  let slug = post.slug || generateSlug(post.title);

  // Validate slug format
  if (!validateSlug(slug)) {
    return { post: null, error: 'Invalid slug format' };
  }

  // Check slug uniqueness
  const existingPost = await getPostBySlug(supabase, slug);
  if (existingPost) {
    // Append random suffix to make it unique
    slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
  }

  // Auto-generate excerpt if not provided
  const excerpt = post.excerpt || autoGenerateExcerpt(post.sections);

  const insertData = blogPostToDbInsert(
    {
      ...post,
      slug,
      excerpt,
      sections: post.sections,
    } as BlogPost,
    userId
  );

  const { data, error } = await supabase
    .from('blog.posts')
    .insert(insertData)
    .select()
    .single();

  if (error || !data) {
    return { post: null, error: error?.message || 'Failed to create post' };
  }

  return { post: dbRowToBlogPost(data as BlogPostRow), error: null };
}

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

/**
 * Update an existing blog post
 */
export async function updatePost(
  supabase: any,
  id: string,
  updates: Partial<BlogPost>
): Promise<{ post: BlogPost | null; error: string | null }> {
  // Validate slug if provided
  if (updates.slug && !validateSlug(updates.slug)) {
    return { post: null, error: 'Invalid slug format' };
  }

  // Check slug uniqueness if changing slug
  if (updates.slug) {
    const existingPost = await getPostBySlug(supabase, updates.slug);
    if (existingPost && existingPost.id !== id) {
      return { post: null, error: 'Slug already exists' };
    }
  }

  const updateData = blogPostToDbUpdate(updates);

  const { data, error } = await supabase
    .from('blog.posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return { post: null, error: error?.message || 'Failed to update post' };
  }

  return { post: dbRowToBlogPost(data as BlogPostRow), error: null };
}

/**
 * Update post sections only (useful for BlogBuilder onChange)
 */
export async function updatePostSections(
  supabase: any,
  id: string,
  sections: LayoutSection[]
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase
    .from('blog.posts')
    .update({ sections })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Publish a draft post
 */
export async function publishPost(
  supabase: any,
  id: string
): Promise<{ post: BlogPost | null; error: string | null }> {
  const { data, error } = await supabase
    .from('blog.posts')
    .update({ status: 'published' })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return { post: null, error: error?.message || 'Failed to publish post' };
  }

  return { post: dbRowToBlogPost(data as BlogPostRow), error: null };
}

/**
 * Unpublish a post (revert to draft)
 */
export async function unpublishPost(
  supabase: any,
  id: string
): Promise<{ post: BlogPost | null; error: string | null }> {
  const { data, error } = await supabase
    .from('blog.posts')
    .update({ status: 'draft' })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return { post: null, error: error?.message || 'Failed to unpublish post' };
  }

  return { post: dbRowToBlogPost(data as BlogPostRow), error: null };
}

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * Delete a post by ID
 */
export async function deletePost(
  supabase: any,
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const { error } = await supabase.from('blog.posts').delete().eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Archive a post (soft delete)
 */
export async function archivePost(
  supabase: any,
  id: string
): Promise<{ post: BlogPost | null; error: string | null }> {
  const { data, error } = await supabase
    .from('blog.posts')
    .update({ status: 'archived' })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return { post: null, error: error?.message || 'Failed to archive post' };
  }

  return { post: dbRowToBlogPost(data as BlogPostRow), error: null };
}
