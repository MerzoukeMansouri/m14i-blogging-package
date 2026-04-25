/**
 * @m14i/blogging-server
 * Server-side blog utilities for Next.js
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

// Export AI generation route handlers
export {
  createGenerateCompleteRoute,
  createGenerateSectionRoute,
  createGenerateSEORoute,
  createImproveContentRoute,
  createGenerateFromTemplateRoute,
} from './routes/generate';

// Export brand settings route handler
export { createBrandSettingsRoute } from './routes/brand-settings';

// Export AI services
export { createAIContentGenerator, AIContentGenerator } from './services/aiContentGenerator';

// Export middleware
export { applyRateLimit, getRateLimiter, type RateLimitConfig } from './middleware/rateLimit';

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
  createCategoriesHandler,
  createTagsHandler,
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

// Export media upload utilities
export {
  validateFile,
  validateFileSize,
  validateFileType,
  sanitizeFileName,
  generateUniqueFileName,
  getMediaType,
  parseFileFromRequest,
  handleFileUpload,
  createSupabaseStorageAdapter,
  extractImageMetadata,
  extractPdfMetadata,
  type UploadedFile,
  type UploadResult,
  type ValidationOptions,
  type StorageAdapter,
} from './media-upload';

// Export AI generation types
export type {
  GenerateCompleteBlogRequest,
  GenerateCompleteBlogResponse,
  GenerateLayoutRequest,
  GenerateLayoutResponse,
  GenerateSectionRequest,
  GenerateSectionResponse,
  GenerateSEORequest,
  GenerateSEOResponse,
  ImproveContentRequest,
  ImproveContentResponse,
  GenerateFromTemplateRequest,
  LayoutTemplate,
  BrandContext,
} from './types/aiGeneration';

// Re-export core types (server-safe)
export type * from '@m14i/blogging-core/client';
