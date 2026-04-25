/**
 * Client exports for m14i-blogging
 *
 * Pre-built data access layer for Supabase integration
 *
 * @example
 * ```typescript
 * import { createBlogClient } from 'm14i-blogging/client';
 * import { createClient } from '@supabase/supabase-js';
 *
 * const supabase = createClient(url, key);
 * const blog = createBlogClient(supabase);
 *
 * // Use the client
 * const { posts } = await blog.posts.list({ status: 'published' });
 * ```
 */

export { createBlogClient } from './supabase';
export type { BlogClient, BlogClientConfig, SupabaseClient } from './supabase';
