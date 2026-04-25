/**
 * Meta Tag Generators
 * Generate meta tags for SEO, Open Graph, and Twitter Cards
 */

import type { BlogPost } from '../types';
import type { SEOConfig, ImageMetadata } from '../types/seo';
import { generateSEODefaults } from './seo-defaults';

/**
 * Next.js Metadata type (for App Router)
 * This is a simplified version - users will have the full types from Next.js
 */
export interface NextMetadata {
  title?: string;
  description?: string;
  keywords?: string | string[];
  authors?: Array<{ name: string; url?: string }>;
  creator?: string;
  publisher?: string;
  robots?: string;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    locale?: string;
    type?: string;
    images?: Array<{
      url: string;
      alt?: string;
      width?: number;
      height?: number;
      type?: string;
    }>;
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    section?: string;
    tags?: string[];
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    images?: Array<{
      url: string;
      alt?: string;
    }>;
  };
}

/**
 * HTML Meta Tag (for manual injection or SSR)
 */
export interface HTMLMetaTag {
  name?: string;
  property?: string;
  content: string;
  [key: string]: string | undefined;
}

/**
 * Normalize image for meta tags
 */
function normalizeImageForMeta(image: string | ImageMetadata | undefined): ImageMetadata | undefined {
  if (!image) return undefined;
  if (typeof image === 'string') {
    return { url: image };
  }
  return image;
}

/**
 * Generate Next.js Metadata object (App Router)
 * Use this with `export const metadata` or `generateMetadata()` in Next.js App Router
 */
export function generateBlogMetadata(blogPost: BlogPost, config: SEOConfig): NextMetadata {
  const defaults = generateSEODefaults(blogPost, config);

  // Normalize images
  const ogImage = normalizeImageForMeta(defaults.openGraph.image);
  const twitterImage = normalizeImageForMeta(defaults.twitter.image);

  const metadata: NextMetadata = {
    title: blogPost.title,
    description: defaults.seo.description,
    keywords: defaults.seo.keywords,
    authors: blogPost.author ? [{ name: blogPost.author.name, url: blogPost.author.url }] : undefined,
    creator: blogPost.author?.name,
    publisher: config.publisher?.name,
    robots: defaults.seo.robots,
    alternates: {
      canonical: defaults.seo.canonicalUrl,
      languages: defaults.seo.alternateLanguages?.reduce((acc, lang) => {
        acc[lang.language] = lang.url;
        return acc;
      }, {} as Record<string, string>),
    },
    openGraph: {
      title: defaults.openGraph.title,
      description: defaults.openGraph.description,
      url: defaults.openGraph.url,
      siteName: defaults.openGraph.siteName,
      locale: defaults.openGraph.locale,
      type: defaults.openGraph.type,
      images: ogImage ? [{
        url: ogImage.url,
        alt: ogImage.alt,
        width: ogImage.width,
        height: ogImage.height,
        type: ogImage.type,
      }] : undefined,
      publishedTime: defaults.openGraph.article?.publishedTime,
      modifiedTime: defaults.openGraph.article?.modifiedTime,
      authors: defaults.openGraph.article?.authors,
      section: defaults.openGraph.article?.section,
      tags: defaults.openGraph.article?.tags,
    },
    twitter: {
      card: defaults.twitter.card,
      site: defaults.twitter.site,
      creator: defaults.twitter.creator,
      title: defaults.twitter.title,
      description: defaults.twitter.description,
      images: twitterImage ? [{
        url: twitterImage.url,
        alt: twitterImage.alt || blogPost.title,
      }] : undefined,
    },
  };

  return metadata;
}

/**
 * Generate HTML meta tags array
 * Use this for manual injection or with react-helmet
 */
export function generateHTMLMetaTags(blogPost: BlogPost, config: SEOConfig): HTMLMetaTag[] {
  const defaults = generateSEODefaults(blogPost, config);
  const tags: HTMLMetaTag[] = [];

  // Basic meta tags
  tags.push({ name: 'description', content: defaults.seo.description || '' });

  if (defaults.seo.keywords && defaults.seo.keywords.length > 0) {
    tags.push({ name: 'keywords', content: defaults.seo.keywords.join(', ') });
  }

  if (defaults.seo.robots) {
    tags.push({ name: 'robots', content: defaults.seo.robots });
  }

  if (defaults.seo.language) {
    tags.push({ httpEquiv: 'content-language', content: defaults.seo.language });
  }

  // Author
  if (blogPost.author) {
    tags.push({ name: 'author', content: blogPost.author.name });
  }

  // Article metadata
  if (blogPost.publishedDate) {
    tags.push({ name: 'article:published_time', content: blogPost.publishedDate });
  }

  if (blogPost.modifiedDate) {
    tags.push({ name: 'article:modified_time', content: blogPost.modifiedDate });
  }

  // Open Graph tags
  tags.push({ property: 'og:title', content: defaults.openGraph.title || blogPost.title });
  tags.push({ property: 'og:description', content: defaults.openGraph.description || '' });
  tags.push({ property: 'og:type', content: defaults.openGraph.type || 'article' });

  if (defaults.openGraph.url) {
    tags.push({ property: 'og:url', content: defaults.openGraph.url });
  }

  if (defaults.openGraph.siteName) {
    tags.push({ property: 'og:site_name', content: defaults.openGraph.siteName });
  }

  if (defaults.openGraph.locale) {
    tags.push({ property: 'og:locale', content: defaults.openGraph.locale });
  }

  // Open Graph image
  const ogImage = normalizeImageForMeta(defaults.openGraph.image);
  if (ogImage) {
    tags.push({ property: 'og:image', content: ogImage.url });
    if (ogImage.alt) {
      tags.push({ property: 'og:image:alt', content: ogImage.alt });
    }
    if (ogImage.width) {
      tags.push({ property: 'og:image:width', content: ogImage.width.toString() });
    }
    if (ogImage.height) {
      tags.push({ property: 'og:image:height', content: ogImage.height.toString() });
    }
    if (ogImage.type) {
      tags.push({ property: 'og:image:type', content: ogImage.type });
    }
  }

  // Open Graph article metadata
  if (defaults.openGraph.article) {
    const article = defaults.openGraph.article;

    if (article.publishedTime) {
      tags.push({ property: 'article:published_time', content: article.publishedTime });
    }
    if (article.modifiedTime) {
      tags.push({ property: 'article:modified_time', content: article.modifiedTime });
    }
    if (article.authors) {
      article.authors.forEach(author => {
        tags.push({ property: 'article:author', content: author });
      });
    }
    if (article.section) {
      tags.push({ property: 'article:section', content: article.section });
    }
    if (article.tags) {
      article.tags.forEach(tag => {
        tags.push({ property: 'article:tag', content: tag });
      });
    }
  }

  // Twitter Card tags
  if (defaults.twitter.card) {
    tags.push({ name: 'twitter:card', content: defaults.twitter.card });
  }

  if (defaults.twitter.site) {
    tags.push({ name: 'twitter:site', content: defaults.twitter.site });
  }

  if (defaults.twitter.creator) {
    tags.push({ name: 'twitter:creator', content: defaults.twitter.creator });
  }

  if (defaults.twitter.title) {
    tags.push({ name: 'twitter:title', content: defaults.twitter.title });
  }

  if (defaults.twitter.description) {
    tags.push({ name: 'twitter:description', content: defaults.twitter.description });
  }

  const twitterImage = normalizeImageForMeta(defaults.twitter.image);
  if (twitterImage) {
    tags.push({ name: 'twitter:image', content: twitterImage.url });
    if (twitterImage.alt || defaults.twitter.imageAlt) {
      tags.push({ name: 'twitter:image:alt', content: twitterImage.alt || defaults.twitter.imageAlt || blogPost.title });
    }
  }

  // Additional custom meta tags
  if (defaults.seo.additionalMeta) {
    Object.entries(defaults.seo.additionalMeta).forEach(([name, content]) => {
      tags.push({ name, content });
    });
  }

  return tags;
}

/**
 * Generate canonical link tag
 */
export function generateCanonicalLink(blogPost: BlogPost, config: SEOConfig): string {
  const defaults = generateSEODefaults(blogPost, config);
  return defaults.seo.canonicalUrl || '';
}

/**
 * Generate HTML meta tags as string (for SSR)
 */
export function generateMetaTagsHTML(blogPost: BlogPost, config: SEOConfig): string {
  const tags = generateHTMLMetaTags(blogPost, config);
  const canonical = generateCanonicalLink(blogPost, config);

  let html = '';

  // Meta tags
  tags.forEach(tag => {
    const attrs = Object.entries(tag)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    html += `<meta ${attrs} />\n`;
  });

  // Canonical link
  if (canonical) {
    html += `<link rel="canonical" href="${canonical}" />\n`;
  }

  return html;
}
