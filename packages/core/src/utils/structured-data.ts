/**
 * Structured Data Generators (JSON-LD)
 * Generate Schema.org structured data for blog posts
 */

import type { BlogPost } from '../types';
import type {
  SEOConfig,
  ArticleSchema,
  BreadcrumbSchema,
  PersonSchema,
  ImageMetadata
} from '../types/seo';
import { generateSEODefaults } from './seo-defaults';
import { analyzeContent, getReadingTimeDuration } from './seo-analysis';

/**
 * Normalize image for structured data
 */
function normalizeImageForSchema(image: string | ImageMetadata | undefined): string | undefined {
  if (!image) return undefined;
  if (typeof image === 'string') return image;
  return image.url;
}

/**
 * Generate Article/BlogPosting schema
 * @see https://schema.org/BlogPosting
 */
export function generateArticleSchema(blogPost: BlogPost, config: SEOConfig): ArticleSchema {
  const defaults = generateSEODefaults(blogPost, config);
  const analysis = analyzeContent(blogPost);

  // Get image
  const imageUrl = normalizeImageForSchema(defaults.openGraph.image) ||
                   normalizeImageForSchema(config.defaultImage);

  // Generate schema
  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blogPost.title,
    description: defaults.seo.description,
    image: imageUrl,
    datePublished: blogPost.publishedDate || blogPost.createdAt,
    dateModified: blogPost.modifiedDate || blogPost.updatedAt || blogPost.publishedDate || blogPost.createdAt,
    author: blogPost.author ? {
      '@type': 'Person',
      name: blogPost.author.name,
      url: blogPost.author.url,
      image: blogPost.author.image,
    } : undefined,
    publisher: config.publisher ? {
      '@type': 'Organization',
      name: config.publisher.name,
      url: config.publisher.url,
      logo: config.publisher.logo ? {
        '@type': 'ImageObject',
        url: normalizeImageForSchema(config.publisher.logo) || '',
        width: typeof config.publisher.logo === 'object' ? config.publisher.logo.width : undefined,
        height: typeof config.publisher.logo === 'object' ? config.publisher.logo.height : undefined,
      } : undefined,
    } : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': defaults.seo.canonicalUrl || '',
    },
    keywords: defaults.seo.keywords,
    articleSection: blogPost.category,
    wordCount: analysis.wordCount,
    timeRequired: analysis.readingTime > 0 ? getReadingTimeDuration(analysis.readingTime) : undefined,
    url: defaults.seo.canonicalUrl,
  };

  // Remove undefined values
  return JSON.parse(JSON.stringify(schema));
}

/**
 * Generate Person schema for author
 * @see https://schema.org/Person
 */
export function generatePersonSchema(
  author: { name: string; url?: string; image?: string; bio?: string; social?: Record<string, string | undefined> }
): PersonSchema {
  const sameAs: string[] = [];

  if (author.social) {
    Object.values(author.social).forEach(url => {
      if (url) sameAs.push(url);
    });
  }

  const schema: PersonSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: author.url,
    image: author.image,
    description: author.bio,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };

  return JSON.parse(JSON.stringify(schema));
}

/**
 * Generate Breadcrumb schema
 * @see https://schema.org/BreadcrumbList
 */
export function generateBreadcrumbSchema(
  blogPost: BlogPost,
  config: SEOConfig,
  breadcrumbs?: Array<{ name: string; url?: string }>
): BreadcrumbSchema {
  const defaults = generateSEODefaults(blogPost, config);

  // Default breadcrumbs if none provided
  const items = breadcrumbs || [
    { name: 'Home', url: config.siteUrl },
    { name: 'Blog', url: `${config.siteUrl}/blog` },
    { name: blogPost.title },
  ];

  const schema: BreadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return schema;
}

/**
 * Generate all structured data for a blog post
 * Returns an array of JSON-LD objects
 */
export function generateAllStructuredData(
  blogPost: BlogPost,
  config: SEOConfig,
  options?: {
    includeBreadcrumbs?: boolean;
    includeAuthor?: boolean;
    customBreadcrumbs?: Array<{ name: string; url?: string }>;
  }
): Array<ArticleSchema | PersonSchema | BreadcrumbSchema> {
  const schemas: Array<ArticleSchema | PersonSchema | BreadcrumbSchema> = [];

  // Article schema (always included)
  schemas.push(generateArticleSchema(blogPost, config));

  // Author schema (if author exists and includeAuthor is not false)
  if (options?.includeAuthor !== false && blogPost.author) {
    schemas.push(generatePersonSchema(blogPost.author));
  }

  // Breadcrumb schema (if enabled)
  if (options?.includeBreadcrumbs) {
    schemas.push(generateBreadcrumbSchema(blogPost, config, options.customBreadcrumbs));
  }

  return schemas;
}

/**
 * Convert structured data to JSON-LD script tag content
 */
export function toJSONLD(schema: object | object[]): string {
  return JSON.stringify(schema, null, 2);
}

/**
 * Generate HTML script tag with JSON-LD
 */
export function generateJSONLDScriptTag(schema: object | object[]): string {
  const json = toJSONLD(schema);
  return `<script type="application/ld+json">\n${json}\n</script>`;
}

/**
 * Generate multiple JSON-LD script tags
 */
export function generateJSONLDScriptTags(schemas: object[]): string {
  return schemas.map(schema => generateJSONLDScriptTag(schema)).join('\n');
}
