// Styles
import "./styles.css";

// SEO Components
export { BlogSEO, generateBlogMetadata, generateBlogJSONLD } from "./components/BlogSEO";
export { BlogHead, BlogMetaTags, BlogStructuredData } from "./components/BlogHead";
export { BlogPreview } from "./components/BlogPreview";
export { ContentBlockRenderer } from "./components/ContentBlockRenderer";

// Types
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
} from "./types";

// Theme Types
export type {
  CSSVariablesTheme,
  BlogPreviewClassNames,
  ContentBlockClassNames,
  BlogTheme,
} from "./types/theme";

export { themePresets, applyTheme } from "./types/theme";

// SEO Types
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
} from "./types/seo";

// Utils
export {
  createEmptyColumns,
  createDefaultBlock,
  getLayoutClasses,
  getLayoutLabel,
} from "./utils";

// SEO Utils - Content Analysis
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
} from "./utils/seo-analysis";

// SEO Utils - Defaults & Validation
export {
  generateSEODefaults,
  withSEODefaults,
  validateSEO,
  getSEOScore,
} from "./utils/seo-defaults";

// SEO Utils - Meta Tag Generation
export {
  generateHTMLMetaTags,
  generateCanonicalLink,
  generateMetaTagsHTML,
  type NextMetadata,
  type HTMLMetaTag,
} from "./utils/meta-generators";

// SEO Utils - Structured Data
export {
  generateArticleSchema,
  generatePersonSchema,
  generateBreadcrumbSchema,
  generateAllStructuredData,
  toJSONLD,
  generateJSONLDScriptTag,
  generateJSONLDScriptTags,
} from "./utils/structured-data";

// Config
export { DEFAULT_LAYOUTS, DEFAULT_BLOCKS, DEFAULT_CONFIG, mergeConfig, mergeBrandContext } from "./config/defaults";

// Layout Templates
export {
  LAYOUT_TEMPLATES,
  getTemplate,
  getTemplateIds,
  getTemplatesByLength,
} from "./config/layoutTemplates";

// AI Generation (shared types)
export type { BrandContext, LayoutTemplate } from "./types/aiGeneration";

// Database Types
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
} from "./types/database";

// Client - Supabase Data Access Layer
export { createBlogClient } from "./client/supabase";
export type { BlogClient, BlogClientConfig, SupabaseClient } from "./client/supabase";

// Public Blog Components
export { Blog } from "./public/Blog";
export { PostListView } from "./public/views/PostListView";
export { PostDetailView } from "./public/views/PostDetailView";
export { CategoryView } from "./public/views/CategoryView";
export { TagView } from "./public/views/TagView";
export { SearchView } from "./public/views/SearchView";

// Public Components
export { PostCard } from "./public/components/PostCard";
export { Sidebar } from "./public/components/Sidebar";
export { Pagination } from "./public/components/Pagination";
export { SearchBox } from "./public/components/SearchBox";
export { CategoryFilter } from "./public/components/CategoryFilter";
export { TagCloud } from "./public/components/TagCloud";

// Layout Components
export { GridLayout } from "./public/components/layouts/GridLayout";
export { ListLayout } from "./public/components/layouts/ListLayout";
export { MasonryLayout } from "./public/components/layouts/MasonryLayout";
export { MagazineLayout } from "./public/components/layouts/MagazineLayout";

// Public Hooks
export { usePosts } from "./public/hooks/usePosts";
export { usePost } from "./public/hooks/usePost";
export { useCategories } from "./public/hooks/useCategories";
export { useTags } from "./public/hooks/useTags";
export { useSearch } from "./public/hooks/useSearch";
export { useRelatedPosts } from "./public/hooks/useRelatedPosts";

// Utility Hooks
export { useAsyncData } from "./utils/hooks/useAsyncData";
export type { UseAsyncDataOptions, UseAsyncDataReturn } from "./utils/hooks/useAsyncData";

// Public Context
export { BlogProvider, useBlogContext } from "./public/context/BlogContext";

// Public Utilities
export {
  parseRoute,
  buildPath,
  navigateTo,
  updateSearchParams,
  isClient,
  getCurrentPathname,
  getCurrentSearchParams,
} from "./public/utils/router";

export {
  formatDate,
  formatRelativeDate,
  calculateReadingTime as getPostReadingTime,
  formatReadingTime as formatPostReadingTime,
  truncateText,
  getPostExcerpt,
  slugify,
  pluralize,
  formatNumber,
} from "./public/utils/formatting";

export { markdownToHtml, markdownToHtmlSync } from "./utils/markdown";

// Public Types
export type {
  BlogProps,
  BlogLayout,
  BlogSortOption,
  BlogView,
  BlogRoute,
  BlogFeatures,
  BlogDisplayOptions,
  BlogLabels,
  BlogComponents,
  BlogClassNames,
  BlogState,
  PostListResponse,
  CategoryWithCount,
  TagWithCount,
} from "./public/types";

export type { BlogProviderProps, BlogContextValue } from "./public/context/BlogContext";
export type { UsePostsParams, UsePostsReturn } from "./public/hooks/usePosts";
export type { UsePostReturn } from "./public/hooks/usePost";
export type { UseCategoriesReturn } from "./public/hooks/useCategories";
export type { UseTagsReturn } from "./public/hooks/useTags";
export type { UseSearchReturn } from "./public/hooks/useSearch";
export type { UseRelatedPostsReturn } from "./public/hooks/useRelatedPosts";
