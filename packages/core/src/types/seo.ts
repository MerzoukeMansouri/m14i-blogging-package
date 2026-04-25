/**
 * SEO Type Definitions for m14i-blogging
 * Comprehensive types for SEO metadata, Open Graph, Twitter Cards, and Schema.org structured data
 */

/**
 * Author information for blog posts
 */
export interface AuthorInfo {
  /** Full name of the author */
  name: string;
  /** URL to author's profile or website */
  url?: string;
  /** URL to author's profile image */
  image?: string;
  /** Brief author bio */
  bio?: string;
  /** Social media handles */
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Image metadata for Open Graph and Twitter Cards
 */
export interface ImageMetadata {
  /** Image URL */
  url: string;
  /** Image alt text for accessibility */
  alt?: string;
  /** Image width in pixels */
  width?: number;
  /** Image height in pixels */
  height?: number;
  /** Image MIME type (e.g., 'image/jpeg', 'image/png') */
  type?: string;
}

/**
 * Core SEO metadata fields
 */
export interface SEOMetadata {
  /** Meta description (recommended: 150-160 characters) */
  description?: string;
  /** Keywords/tags for the content */
  keywords?: string[];
  /** Canonical URL to prevent duplicate content issues */
  canonicalUrl?: string;
  /** Robots meta tag instructions */
  robots?: 'index, follow' | 'noindex, follow' | 'index, nofollow' | 'noindex, nofollow' | string;
  /** Language code (e.g., 'en', 'en-US', 'fr') */
  language?: string;
  /** Alternate language versions */
  alternateLanguages?: Array<{
    language: string;
    url: string;
  }>;
  /** Additional meta tags as key-value pairs */
  additionalMeta?: Record<string, string>;
}

/**
 * Open Graph metadata for social media sharing
 * @see https://ogp.me/
 */
export interface OpenGraphMetadata {
  /** Open Graph title (fallback to page title) */
  title?: string;
  /** Open Graph description (fallback to meta description) */
  description?: string;
  /** Open Graph image with metadata */
  image?: ImageMetadata | string;
  /** Additional images */
  images?: Array<ImageMetadata | string>;
  /** Type of content (article, website, etc.) */
  type?: 'article' | 'website' | 'blog' | string;
  /** Canonical URL for this page */
  url?: string;
  /** Site name */
  siteName?: string;
  /** Locale (e.g., 'en_US') */
  locale?: string;
  /** Article-specific metadata */
  article?: {
    /** ISO 8601 published time */
    publishedTime?: string;
    /** ISO 8601 modified time */
    modifiedTime?: string;
    /** Article author(s) */
    authors?: string[];
    /** Article section/category */
    section?: string;
    /** Article tags */
    tags?: string[];
  };
}

/**
 * Twitter Card metadata
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
 */
export interface TwitterCardMetadata {
  /** Card type */
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  /** Twitter handle of the website (@username) */
  site?: string;
  /** Twitter handle of the content creator (@username) */
  creator?: string;
  /** Title (fallback to OG title or page title) */
  title?: string;
  /** Description (fallback to OG description or meta description) */
  description?: string;
  /** Image URL or metadata */
  image?: ImageMetadata | string;
  /** Image alt text */
  imageAlt?: string;
}

/**
 * Schema.org Article/BlogPosting structured data
 * @see https://schema.org/BlogPosting
 */
export interface ArticleSchema {
  '@context'?: string;
  '@type': 'Article' | 'BlogPosting' | 'NewsArticle' | 'TechArticle';
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    '@type': 'Person';
    name: string;
    url?: string;
    image?: string;
  };
  publisher?: {
    '@type': 'Organization';
    name: string;
    url?: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
      width?: number;
      height?: number;
    };
  };
  mainEntityOfPage?: {
    '@type': 'WebPage';
    '@id': string;
  };
  keywords?: string[];
  articleSection?: string;
  wordCount?: number;
  timeRequired?: string; // ISO 8601 duration (e.g., 'PT5M' for 5 minutes)
  url?: string;
}

/**
 * Schema.org Breadcrumb structured data
 * @see https://schema.org/BreadcrumbList
 */
export interface BreadcrumbSchema {
  '@context': string;
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * Schema.org Person structured data
 * @see https://schema.org/Person
 */
export interface PersonSchema {
  '@context': string;
  '@type': 'Person';
  name: string;
  url?: string;
  image?: string;
  description?: string;
  sameAs?: string[]; // Social media URLs
  jobTitle?: string;
  worksFor?: {
    '@type': 'Organization';
    name: string;
    url?: string;
  };
}

/**
 * Configuration for SEO generation
 */
export interface SEOConfig {
  /** Base URL of the site (e.g., 'https://example.com') */
  siteUrl: string;
  /** Name of the website */
  siteName: string;
  /** Default author information (used when post has no author) */
  defaultAuthor?: AuthorInfo;
  /** Default Open Graph image */
  defaultImage?: ImageMetadata | string;
  /** Default Twitter handle for site (@username) */
  twitterSite?: string;
  /** Default language code */
  defaultLanguage?: string;
  /** Publisher information for structured data */
  publisher?: {
    name: string;
    url?: string;
    logo?: ImageMetadata | string;
  };
  /** Whether to generate JSON-LD structured data */
  enableStructuredData?: boolean;
  /** Whether to auto-generate missing SEO fields */
  autoGenerateDefaults?: boolean;
}

/**
 * Content analysis result
 */
export interface ContentAnalysis {
  /** Total word count */
  wordCount: number;
  /** Estimated reading time in minutes */
  readingTime: number;
  /** Auto-generated excerpt if none provided */
  autoExcerpt?: string;
  /** Extracted headings hierarchy */
  headings?: Array<{
    level: number; // 1-6
    text: string;
  }>;
  /** Number of images */
  imageCount?: number;
  /** Number of videos */
  videoCount?: number;
}
