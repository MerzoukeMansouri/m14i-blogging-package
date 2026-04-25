/**
 * Next.js Metadata Generator for Blog Posts
 *
 * Generates metadata for SEO optimization
 */

import type { Metadata } from 'next';

export interface BlogPostMetadata {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  author?: {
    name: string;
    url?: string;
    image?: string;
  };
  category?: string;
  tags?: string[];
  publishedDate?: string;
  modifiedDate?: string;
  seo?: {
    description?: string;
    keywords?: string[];
    canonicalUrl?: string;
  };
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  twitter?: {
    card?: string;
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
  };
}

export interface MetadataOptions {
  /**
   * Base URL of your site
   */
  baseUrl: string;

  /**
   * Blog path (default: '/blog')
   */
  blogPath?: string;

  /**
   * Site name
   */
  siteName?: string;

  /**
   * Default author
   */
  defaultAuthor?: {
    name: string;
    url?: string;
  };

  /**
   * Default OG image
   */
  defaultOgImage?: string;

  /**
   * Twitter handle
   */
  twitterSite?: string;

  /**
   * Default locale
   */
  locale?: string;
}

/**
 * Generate Next.js metadata for a blog post
 *
 * @example
 * ```typescript
 * // app/blog/[slug]/page.tsx
 * import { generateMetadata } from 'm14i-blogging/server';
 * import { getPostBySlug } from '@/lib/blog-api';
 *
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const post = await getPostBySlug(supabase, params.slug);
 *
 *   return generateBlogPostMetadata(post, {
 *     baseUrl: 'https://example.com',
 *     siteName: 'My Blog',
 *     twitterSite: '@myblog',
 *   });
 * }
 * ```
 */
export function generateBlogPostMetadata(
  post: BlogPostMetadata,
  options: MetadataOptions
): Metadata {
  const {
    baseUrl,
    blogPath = '/blog',
    siteName = 'Blog',
    defaultAuthor,
    defaultOgImage,
    twitterSite,
    locale = 'en_US',
  } = options;

  const url = `${baseUrl}${blogPath}/${post.slug}`;
  const title = post.title;
  const description = post.seo?.description || post.excerpt || '';
  const image = post.openGraph?.image || post.featuredImage || defaultOgImage;
  const author = post.author?.name || defaultAuthor?.name;
  const publishedTime = post.publishedDate;
  const modifiedTime = post.modifiedDate;

  const metadata: Metadata = {
    title,
    description,
    authors: author ? [{ name: author, url: post.author?.url || defaultAuthor?.url }] : undefined,
    keywords: post.seo?.keywords || post.tags,
    category: post.category,

    // Open Graph
    openGraph: {
      title: post.openGraph?.title || title,
      description: post.openGraph?.description || description,
      url,
      siteName,
      locale,
      type: 'article',
      images: image ? [{ url: image }] : undefined,
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      tags: post.tags,
    },

    // Twitter
    twitter: {
      card: (post.twitter?.card as any) || 'summary_large_image',
      site: post.twitter?.site || twitterSite,
      creator: post.twitter?.creator,
      title: post.twitter?.title || title,
      description: post.twitter?.description || description,
      images: post.twitter?.image || image,
    },

    // Alternate
    alternates: {
      canonical: post.seo?.canonicalUrl || url,
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  return metadata;
}

/**
 * Generate metadata for blog index page
 *
 * @example
 * ```typescript
 * // app/blog/page.tsx
 * export const metadata = generateBlogIndexMetadata({
 *   baseUrl: 'https://example.com',
 *   siteName: 'My Blog',
 *   description: 'Thoughts on web development',
 * });
 * ```
 */
export function generateBlogIndexMetadata(
  options: MetadataOptions & {
    title?: string;
    description?: string;
  }
): Metadata {
  const {
    baseUrl,
    blogPath = '/blog',
    siteName = 'Blog',
    title = 'Blog',
    description = '',
    defaultOgImage,
    twitterSite,
    locale = 'en_US',
  } = options;

  const url = `${baseUrl}${blogPath}`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      url,
      siteName,
      locale,
      type: 'website',
      images: defaultOgImage ? [{ url: defaultOgImage }] : undefined,
    },

    twitter: {
      card: 'summary_large_image',
      site: twitterSite,
      title,
      description,
      images: defaultOgImage,
    },

    alternates: {
      canonical: url,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

/**
 * Generate JSON-LD structured data for a blog post
 *
 * @example
 * ```typescript
 * const jsonLd = generateBlogPostJsonLd(post, {
 *   baseUrl: 'https://example.com',
 *   siteName: 'My Blog',
 * });
 *
 * // Add to page:
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
 * />
 * ```
 */
export function generateBlogPostJsonLd(
  post: BlogPostMetadata,
  options: MetadataOptions
) {
  const {
    baseUrl,
    blogPath = '/blog',
    siteName = 'Blog',
    defaultAuthor,
  } = options;

  const url = `${baseUrl}${blogPath}/${post.slug}`;
  const author = post.author?.name || defaultAuthor?.name;
  const authorUrl = post.author?.url || defaultAuthor?.url;
  const image = post.featuredImage || post.openGraph?.image;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.seo?.description,
    image: image ? [image] : undefined,
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate || post.publishedDate,
    author: author
      ? {
          '@type': 'Person',
          name: author,
          url: authorUrl,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: post.tags?.join(', '),
    articleSection: post.category,
  };
}
