import type { AuthorInfo, SEOMetadata, OpenGraphMetadata, TwitterCardMetadata } from "./seo";
import type { LayoutSection } from "./layouts";

// Re-export block types
export type {
  ContentBlockType,
  TextBlock,
  ImageBlock,
  VideoBlock,
  QuoteBlock,
  CarouselBlock,
  CarouselSlide,
  PDFBlock,
  PDFDisplayMode,
  ContentBlock,
} from "./blocks";

// Re-export layout types
export type { LayoutType, LayoutSection } from "./layouts";

// Re-export configuration types
export type {
  LayoutConfig,
  BlockConfig,
  ThemeConfig,
  UIConfig,
  CallbacksConfig,
  BlogBuilderConfig,
} from "./config";

// Re-export database types
export type {
  // Blog post types
  BlogPostStatus,
  BlogPostRow,
  BlogPostInsert,
  BlogPostUpdate,
  BlogPostWithAuthor,
  BlogFilterParams,
  BlogPostListResponse,
  BlogStats,
  BlogCategory,
  BlogTag,
  // Media types
  BlogMediaType,
  BlogMediaRow,
  BlogMediaInsert,
  BlogMediaUpdate,
  // Category & tag management (v0.4.0+)
  CategoryRow,
  CategoryInsert,
  CategoryUpdate,
  CategoryWithCount,
  TagRow,
  TagInsert,
  TagUpdate,
  TagWithCount,
} from "./database";

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  sections: LayoutSection[];
  createdAt?: string;
  updatedAt?: string;

  // SEO-specific fields (all optional for backward compatibility)
  /** Author information */
  author?: AuthorInfo;
  /** Category/section of the blog post */
  category?: string;
  /** Tags/keywords for the post */
  tags?: string[];
  /** Publication date (ISO 8601 format) */
  publishedDate?: string;
  /** Last modified date (ISO 8601 format) */
  modifiedDate?: string;

  // Advanced SEO metadata
  /** Core SEO metadata (description, keywords, canonical URL, etc.) */
  seo?: SEOMetadata;
  /** Open Graph metadata for social media sharing */
  openGraph?: OpenGraphMetadata;
  /** Twitter Card metadata */
  twitter?: TwitterCardMetadata;
}
