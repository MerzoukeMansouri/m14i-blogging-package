/**
 * Server-side types for API route handlers
 */

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Configuration for route handlers
 */
export interface RouteConfig {
  /**
   * Supabase client instance
   * Can be either client-side or server-side client
   */
  supabase: SupabaseClient | (() => SupabaseClient) | (() => Promise<SupabaseClient>);

  /**
   * Optional: Custom authentication check
   * Return user if authenticated, null otherwise
   */
  getUser?: () => Promise<{ id: string; role?: string } | null>;

  /**
   * Optional: Custom admin check
   * Return true if user is admin
   */
  isAdmin?: () => Promise<boolean>;

  /**
   * Optional: Custom error handler
   */
  onError?: (error: Error) => void;
}

/**
 * Standard API response
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination params
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

/**
 * Filter params for posts
 */
export interface PostFilterParams extends PaginationParams {
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  tag?: string;
  search?: string;
  orderBy?: 'created_at' | 'updated_at' | 'published_at' | 'title';
  orderDirection?: 'asc' | 'desc';
}

/**
 * Scheduled post result
 */
export interface ScheduledPostResult {
  success: boolean;
  published: number;
  posts: Array<{
    id: string;
    title: string;
    slug?: string;
    published_at: string;
  }>;
  message: string;
  error?: any;
}
