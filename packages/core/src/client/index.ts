/**
 * Client exports for m14i-blogging
 *
 * Server-safe exports: no React client components, only data access and utilities
 *
 * @example
 * ```typescript
 * import { createBlogClient } from '@m14i/blogging-core/client';
 * import { createClient } from '@supabase/supabase-js';
 *
 * const supabase = createClient(url, key);
 * const blog = createBlogClient(supabase);
 *
 * // Use the client
 * const { posts } = await blog.posts.list({ status: 'published' });
 * ```
 */

// Supabase client
export { createBlogClient } from './supabase';
export type { BlogClient, BlogClientConfig, SupabaseClient } from './supabase';

// Database types (server-safe)
export type {
  BlogPostStatus,
  BlogPostRow,
  BlogPostInsert,
  BlogPostUpdate,
  BlogPostWithAuthor,
  BlogMediaType,
  BlogMediaRow,
  BlogMediaInsert,
  BlogMediaUpdate,
  BlogFilterParams,
  BlogPostListResponse,
  BlogStats,
  BlogCategory,
  BlogTag,
  BlogMedia,
} from '../types/database';

// Content types (server-safe)
export type {
  LayoutType,
  ContentBlockType,
  TextBlock,
  ImageBlock,
  VideoBlock,
  QuoteBlock,
  PDFBlock,
  CarouselBlock,
  ChartBlock,
  CodeBlock,
  ContentBlock,
  LayoutSection,
  BlogPost,
  LayoutConfig,
  BlockConfig,
  ThemeConfig,
  UIConfig,
  CallbacksConfig,
  BlogBuilderConfig,
} from '../types';

// AI generation types (server-safe)
export type { BrandContext, LayoutTemplate } from '../types/aiGeneration';

// SEO types (server-safe)
export type {
  AuthorInfo,
  ImageMetadata,
  SEOMetadata,
  OpenGraphMetadata,
  TwitterCardMetadata,
  ArticleSchema,
  BreadcrumbSchema,
  PersonSchema,
  SEOConfig,
  ContentAnalysis,
} from '../types/seo';

// Utility functions (server-safe)
export {
  createEmptyColumns,
  createDefaultBlock,
  getLayoutClasses,
  getLayoutLabel,
} from '../utils';

export {
  extractPlainText,
  countWords,
  countWordsInSections,
  calculateReadingTime,
  calculateReadingTimeFromSections,
  generateExcerpt,
  generateExcerptFromSections,
  extractHeadingsFromMarkdown,
  extractHeadingsFromSections,
  countBlocksByType,
  analyzeContent,
  formatReadingTime,
  getReadingTimeDuration,
  generateSlug,
} from '../utils/seo-analysis';

export {
  generateSEODefaults,
  withSEODefaults,
  validateSEO,
  getSEOScore,
} from '../utils/seo-defaults';

export {
  generateHTMLMetaTags,
  generateCanonicalLink,
  generateMetaTagsHTML,
  type NextMetadata,
  type HTMLMetaTag,
} from '../utils/meta-generators';

export {
  generateArticleSchema,
  generatePersonSchema,
  generateBreadcrumbSchema,
  generateAllStructuredData,
  toJSONLD,
  generateJSONLDScriptTag,
  generateJSONLDScriptTags,
} from '../utils/structured-data';

// Config (server-safe)
export {
  DEFAULT_LAYOUTS,
  DEFAULT_BLOCKS,
  DEFAULT_CONFIG,
  mergeConfig,
  mergeBrandContext,
} from '../config/defaults';

export {
  LAYOUT_TEMPLATES,
  getTemplate,
  getTemplateIds,
  getTemplatesByLength,
} from '../config/layoutTemplates';
