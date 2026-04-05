// Styles
import "./styles.css";

// Components
export { BlogBuilder } from "./components/BlogBuilder";
export { BlogBuilderWithDefaults } from "./components/BlogBuilderWithDefaults";
export { BlogPreview } from "./components/BlogPreview";
export { ContentBlockRenderer } from "./components/ContentBlockRenderer";
export { ContentBlockInlineEditor } from "./components/ContentBlockInlineEditor";

// SEO Components
export { BlogSEO, generateBlogMetadata, generateBlogJSONLD } from "./components/BlogSEO";
export { BlogHead, BlogMetaTags, BlogStructuredData } from "./components/BlogHead";

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
export type { BlogBuilderProps } from "./components/BlogBuilder";

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
export { DEFAULT_LAYOUTS, DEFAULT_BLOCKS, DEFAULT_CONFIG, mergeConfig } from "./config/defaults";

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
