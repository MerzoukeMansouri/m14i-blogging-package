/**
 * Database-specific types for blog posts and media
 * These types are designed to work with Supabase or any PostgreSQL database
 */

import type { LayoutSection } from "./layouts";
import type { AuthorInfo, SEOMetadata } from "./seo";

// ============================================================================
// Blog Post Types
// ============================================================================

/**
 * Blog post status enum
 */
export type BlogPostStatus = "draft" | "published" | "archived";

/**
 * Complete blog post from database (includes all fields)
 */
export interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  sections: LayoutSection[];
  seo_metadata: Record<string, unknown> | null;
  author_info: AuthorInfo | null;
  status: BlogPostStatus;
  category: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
  created_by: string | null;
}

/**
 * Data required to insert a new blog post
 */
export interface BlogPostInsert {
  title: string;
  slug: string;
  excerpt?: string | null;
  featured_image?: string | null;
  sections: LayoutSection[];
  seo_metadata?: Record<string, unknown> | null;
  author_info?: AuthorInfo | null;
  status?: BlogPostStatus;
  category?: string | null;
  tags?: string[];
  published_at?: string | null;
  created_by?: string | null;
}

/**
 * Data that can be updated in an existing blog post
 */
export interface BlogPostUpdate {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  featured_image?: string | null;
  sections?: LayoutSection[];
  seo_metadata?: Record<string, unknown> | null;
  author_info?: AuthorInfo | null;
  status?: BlogPostStatus;
  category?: string | null;
  tags?: string[];
  published_at?: string | null;
}

/**
 * Blog post with author information joined
 */
export interface BlogPostWithAuthor extends BlogPostRow {
  author?: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
}

// ============================================================================
// Media Types
// ============================================================================

/**
 * Media type enum
 */
export type BlogMediaType = "image" | "video" | "pdf" | "other";

/**
 * Complete media record from database
 */
export interface BlogMediaRow {
  id: string;
  file_path: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  type: BlogMediaType;
  metadata: Record<string, unknown> | null;
  usage_count: number;
  last_used_at: string | null;
  uploaded_at: string;
  uploaded_by: string | null;
}

/**
 * Data required to insert new media
 */
export interface BlogMediaInsert {
  file_path: string;
  file_name: string;
  file_size?: number | null;
  mime_type?: string | null;
  type?: BlogMediaType;
  metadata?: Record<string, unknown> | null;
  uploaded_by?: string | null;
}

/**
 * Data that can be updated in existing media
 */
export interface BlogMediaUpdate {
  file_name?: string;
  metadata?: Record<string, unknown> | null;
  usage_count?: number;
  last_used_at?: string | null;
}

// ============================================================================
// Query & Filter Types
// ============================================================================

/**
 * Parameters for filtering blog posts
 */
export interface BlogFilterParams {
  page?: number;
  pageSize?: number;
  status?: BlogPostStatus;
  category?: string;
  tag?: string;
  search?: string;
  orderBy?: "created_at" | "updated_at" | "published_at" | "title";
  orderDirection?: "asc" | "desc";
}

/**
 * Paginated list response
 */
export interface BlogPostListResponse {
  posts: BlogPostWithAuthor[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Blog statistics for admin dashboard
 */
export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  categoryCounts: Record<string, number>;
  tagCounts: Record<string, number>;
}

/**
 * Category with post count (derived from posts)
 * Categories are stored as free text in posts.category
 */
export interface BlogCategory {
  name: string;
  slug: string;
  postCount: number;
}

/**
 * Tag with post count (derived from posts)
 * Tags are stored as free text array in posts.tags
 */
export interface BlogTag {
  name: string;
  slug: string;
  postCount: number;
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Simplified blog post for frontend use (converts snake_case to camelCase)
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  sections: LayoutSection[];
  seoMetadata?: SEOMetadata;
  authorInfo?: AuthorInfo;
  status: BlogPostStatus;
  category?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  createdBy?: string;
  author?: {
    fullName?: string;
    email: string;
    avatarUrl?: string;
  };
}

/**
 * Simplified media for frontend use
 */
export interface BlogMedia {
  id: string;
  filePath: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  type: BlogMediaType;
  metadata?: Record<string, unknown>;
  usageCount: number;
  lastUsedAt?: string;
  uploadedAt: string;
  uploadedBy?: string;
}
