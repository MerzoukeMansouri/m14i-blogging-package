/**
 * Server-side exports for m14i-blogging
 *
 * This module exports route handler factories that can be used
 * in Next.js API routes for blog post management.
 *
 * @example
 * ```typescript
 * // app/api/blog/posts/route.ts
 * import { createPostsRoutes } from 'm14i-blogging/server';
 * import { createServerSupabaseClient } from '@/lib/supabase';
 *
 * export const { GET, POST } = createPostsRoutes({
 *   supabase: createServerSupabaseClient,
 * });
 * ```
 */

// Export types
export type { RouteConfig, ApiResponse, PaginationParams, PostFilterParams } from './types';

// Export utilities
export {
  getSupabaseClient,
  checkAuth,
  checkAdmin,
  requireAdmin,
  handleError,
  parseQueryParams,
  parseIntParam,
  jsonResponse,
  errorResponse,
  successResponse,
} from './utils';

// Export route handlers
export {
  createPostsRoutes,
  createPostByIdRoutes,
  createPostBySlugRoute,
} from './routes/posts';

export {
  createScheduledPostsRoute,
  createPublishScheduledRoute,
  publishScheduledPosts,
} from './routes/scheduled';

// Export ready-to-use API route handlers
export {
  createListPostsHandler,
  createCreatePostHandler,
  createGetPostBySlugHandler,
  createUpdatePostHandler,
  createDeletePostHandler,
  createPublishPostHandler,
  createSearchPostsHandler,
  createMediaHandlers,
  createStatsHandler,
  isAdmin,
  parseFilterParams,
} from './api-routes';

// Export SEO utilities
export {
  // Sitemap
  generateBlogSitemap,
  generateCompleteSitemap,
  generateSitemapXML,
  generateNextJsSitemap,
  generateSitemapIndex,
  type SitemapEntry,
  type SitemapOptions,
  // Robots.txt
  generateRobotsTxt,
  generateNextJsRobots,
  robotsPresets,
  type RobotsOptions,
  // Metadata
  generateBlogPostMetadata,
  generateBlogIndexMetadata,
  generateBlogPostJsonLd,
  type BlogPostMetadata,
  type MetadataOptions,
  // RSS
  generateRSSFeed,
  generateAtomFeed,
  type RSSOptions,
} from './seo';
