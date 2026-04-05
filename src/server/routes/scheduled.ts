/**
 * Scheduled Publishing Routes and Utilities
 *
 * Handles scheduled post publishing
 */

import type { RouteConfig } from '../types';
import {
  getSupabaseClient,
  requireAdmin,
  handleError,
  parseQueryParams,
  parseIntParam,
  successResponse,
  errorResponse,
} from '../utils';

/**
 * Create GET handler for /api/blog/scheduled
 *
 * Returns posts scheduled to be published in the future
 *
 * @example
 * ```typescript
 * // app/api/blog/scheduled/route.ts
 * import { createScheduledPostsRoute } from 'm14i-blogging/server';
 * import { createServerSupabaseClient } from '@/lib/supabase-client';
 *
 * export const { GET } = createScheduledPostsRoute({ supabase: createServerSupabaseClient });
 * ```
 */
export function createScheduledPostsRoute(config: RouteConfig) {
  async function GET(request: Request) {
    try {
      await requireAdmin(config);

      const supabase = await getSupabaseClient(config);
      const params = parseQueryParams(request.url);
      const limit = parseIntParam(params.limit, 50);

      // Get posts with future published_at dates
      const { data, error } = await supabase
        .from('blog.posts')
        .select('*')
        .eq('status', 'draft')
        .not('published_at', 'is', null)
        .gt('published_at', new Date().toISOString())
        .order('published_at', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return successResponse({ posts: data || [], total: data?.length || 0 });
    } catch (error) {
      const message = handleError(error, config);
      const status = error instanceof Error && error.message.includes('Unauthorized') ? 401 : 500;
      return errorResponse(message, status);
    }
  }

  return { GET };
}

/**
 * Create POST handler for /api/blog/scheduled/publish
 *
 * Publishes all posts scheduled to be published now or in the past
 * This should be called by a cron job or scheduled task
 *
 * @example
 * ```typescript
 * // app/api/blog/scheduled/publish/route.ts
 * import { createPublishScheduledRoute } from 'm14i-blogging/server';
 * import { createServerSupabaseClient } from '@/lib/supabase-client';
 *
 * export const { POST } = createPublishScheduledRoute({ supabase: createServerSupabaseClient });
 * ```
 *
 * Then set up a cron job:
 * ```typescript
 * // app/api/cron/publish-scheduled/route.ts
 * export async function GET() {
 *   // Verify cron secret
 *   const authHeader = request.headers.get('authorization');
 *   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
 *     return new Response('Unauthorized', { status: 401 });
 *   }
 *
 *   const res = await fetch('http://localhost:3000/api/blog/scheduled/publish', {
 *     method: 'POST',
 *   });
 *
 *   return res;
 * }
 * ```
 */
export function createPublishScheduledRoute(config: RouteConfig) {
  async function POST(request: Request) {
    try {
      // Note: This endpoint might want different auth for cron jobs
      // For now, requiring admin. You can customize with config.isAdmin

      const supabase = await getSupabaseClient(config);

      // Find all posts scheduled to be published now or in the past
      const { data: scheduledPosts, error: selectError } = await supabase
        .from('blog.posts')
        .select('id, title, published_at')
        .eq('status', 'draft')
        .not('published_at', 'is', null)
        .lte('published_at', new Date().toISOString());

      if (selectError) throw selectError;

      if (!scheduledPosts || scheduledPosts.length === 0) {
        return successResponse({
          published: 0,
          posts: [],
          message: 'No posts to publish',
        });
      }

      // Publish all scheduled posts
      const postIds = scheduledPosts.map((p: any) => p.id);

      const { data: publishedPosts, error: updateError } = await supabase
        .from('blog.posts')
        .update({ status: 'published' })
        .in('id', postIds)
        .select('id, title, slug, published_at');

      if (updateError) throw updateError;

      return successResponse({
        published: publishedPosts?.length || 0,
        posts: publishedPosts || [],
        message: `Successfully published ${publishedPosts?.length || 0} post(s)`,
      });
    } catch (error) {
      const message = handleError(error, config);
      return errorResponse(message, 500);
    }
  }

  return { POST };
}

/**
 * Utility function to publish scheduled posts
 * Use this directly in your code or serverless functions
 *
 * @example
 * ```typescript
 * import { publishScheduledPosts } from 'm14i-blogging/server';
 * import { supabaseAdmin } from '@/lib/supabase-admin';
 *
 * // In a cron job or serverless function
 * const result = await publishScheduledPosts(supabaseAdmin);
 * console.log(`Published ${result.published} posts`);
 * ```
 */
export async function publishScheduledPosts(supabase: any) {
  try {
    // Find all posts scheduled to be published now or in the past
    const { data: scheduledPosts, error: selectError } = await supabase
      .from('blog.posts')
      .select('id, title, published_at')
      .eq('status', 'draft')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString());

    if (selectError) throw selectError;

    if (!scheduledPosts || scheduledPosts.length === 0) {
      return {
        success: true,
        published: 0,
        posts: [],
        message: 'No posts to publish',
      };
    }

    // Publish all scheduled posts
    const postIds = scheduledPosts.map((p: any) => p.id);

    const { data: publishedPosts, error: updateError } = await supabase
      .from('blog.posts')
      .update({ status: 'published' })
      .in('id', postIds)
      .select('id, title, slug, published_at');

    if (updateError) throw updateError;

    return {
      success: true,
      published: publishedPosts?.length || 0,
      posts: publishedPosts || [],
      message: `Successfully published ${publishedPosts?.length || 0} post(s)`,
    };
  } catch (error) {
    return {
      success: false,
      published: 0,
      posts: [],
      message: error instanceof Error ? error.message : 'Failed to publish scheduled posts',
      error,
    };
  }
}
