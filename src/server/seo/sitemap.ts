/**
 * Sitemap Generator for Blog Posts
 *
 * Generates XML sitemaps for better SEO
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface SitemapOptions {
  /**
   * Base URL of your site (e.g., 'https://example.com')
   */
  baseUrl: string;

  /**
   * URL path to blog posts (default: '/blog')
   */
  blogPath?: string;

  /**
   * Default change frequency for blog posts
   */
  defaultChangeFreq?: SitemapEntry['changefreq'];

  /**
   * Default priority for blog posts (0.0 to 1.0)
   */
  defaultPriority?: number;

  /**
   * Include only published posts (default: true)
   */
  publishedOnly?: boolean;

  /**
   * Additional static URLs to include in sitemap
   */
  additionalUrls?: SitemapEntry[];
}

/**
 * Generate sitemap entries for blog posts
 *
 * @example
 * ```typescript
 * import { generateBlogSitemap } from 'm14i-blogging/server';
 * import { createServerSupabaseClient } from '@/lib/supabase-client';
 *
 * const sitemap = await generateBlogSitemap(createServerSupabaseClient(), {
 *   baseUrl: 'https://example.com',
 * });
 * ```
 */
export async function generateBlogSitemap(
  supabase: SupabaseClient,
  options: SitemapOptions
): Promise<SitemapEntry[]> {
  const {
    baseUrl,
    blogPath = '/blog',
    defaultChangeFreq = 'weekly',
    defaultPriority = 0.7,
    publishedOnly = true,
  } = options;

  // Fetch all posts
  let query = supabase
    .from('blog.posts')
    .select('slug, updated_at, published_at')
    .order('published_at', { ascending: false });

  if (publishedOnly) {
    query = query.eq('status', 'published');
  }

  const { data: posts, error } = await query;

  if (error || !posts) {
    console.error('Error fetching posts for sitemap:', error);
    return [];
  }

  // Generate sitemap entries
  const entries: SitemapEntry[] = posts.map((post) => ({
    url: `${baseUrl}${blogPath}/${post.slug}`,
    lastmod: post.updated_at || post.published_at,
    changefreq: defaultChangeFreq,
    priority: defaultPriority,
  }));

  return entries;
}

/**
 * Generate complete sitemap with blog posts and additional URLs
 *
 * @example
 * ```typescript
 * const entries = await generateCompleteSitemap(supabase, {
 *   baseUrl: 'https://example.com',
 *   additionalUrls: [
 *     { url: 'https://example.com', changefreq: 'daily', priority: 1.0 },
 *     { url: 'https://example.com/about', changefreq: 'monthly', priority: 0.8 },
 *   ],
 * });
 * ```
 */
export async function generateCompleteSitemap(
  supabase: SupabaseClient,
  options: SitemapOptions
): Promise<SitemapEntry[]> {
  const blogEntries = await generateBlogSitemap(supabase, options);
  const additionalUrls = options.additionalUrls || [];

  return [...additionalUrls, ...blogEntries];
}

/**
 * Convert sitemap entries to XML string
 *
 * @example
 * ```typescript
 * const entries = await generateBlogSitemap(supabase, { baseUrl: 'https://example.com' });
 * const xml = generateSitemapXML(entries);
 * ```
 */
export function generateSitemapXML(entries: SitemapEntry[]): string {
  const urlEntries = entries
    .map((entry) => {
      const { url, lastmod, changefreq, priority } = entry;

      return `  <url>
    <loc>${escapeXml(url)}</loc>${lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>` : ''}${changefreq ? `\n    <changefreq>${changefreq}</changefreq>` : ''}${priority !== undefined ? `\n    <priority>${priority.toFixed(1)}</priority>` : ''}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Generate sitemap for Next.js app/sitemap.ts route
 *
 * @example
 * ```typescript
 * // app/sitemap.ts
 * import { generateNextJsSitemap } from 'm14i-blogging/server';
 * import { createServerSupabaseClient } from '@/lib/supabase-client';
 *
 * export default async function sitemap() {
 *   const supabase = createServerSupabaseClient();
 *
 *   return generateNextJsSitemap(supabase, {
 *     baseUrl: 'https://example.com',
 *     additionalUrls: [
 *       {
 *         url: 'https://example.com',
 *         lastModified: new Date(),
 *         changeFrequency: 'daily',
 *         priority: 1,
 *       },
 *     ],
 *   });
 * }
 * ```
 */
export async function generateNextJsSitemap(
  supabase: SupabaseClient,
  options: Omit<SitemapOptions, 'defaultChangeFreq' | 'defaultPriority'> & {
    defaultChangeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    defaultPriority?: number;
    additionalUrls?: Array<{
      url: string;
      lastModified?: Date | string;
      changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
      priority?: number;
    }>;
  }
) {
  const {
    baseUrl,
    blogPath = '/blog',
    defaultChangeFrequency = 'weekly',
    defaultPriority = 0.7,
    publishedOnly = true,
    additionalUrls = [],
  } = options;

  // Fetch all posts
  let query = supabase
    .from('blog.posts')
    .select('slug, updated_at, published_at')
    .order('published_at', { ascending: false });

  if (publishedOnly) {
    query = query.eq('status', 'published');
  }

  const { data: posts, error } = await query;

  if (error || !posts) {
    console.error('Error fetching posts for sitemap:', error);
    return additionalUrls;
  }

  // Generate sitemap entries in Next.js format
  const blogEntries = posts.map((post) => ({
    url: `${baseUrl}${blogPath}/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at),
    changeFrequency: defaultChangeFrequency,
    priority: defaultPriority,
  }));

  return [...additionalUrls, ...blogEntries];
}

/**
 * Helper function to escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

/**
 * Generate sitemap index for large sites with multiple sitemaps
 *
 * @example
 * ```typescript
 * const xml = generateSitemapIndex([
 *   { loc: 'https://example.com/sitemap-posts.xml', lastmod: new Date() },
 *   { loc: 'https://example.com/sitemap-pages.xml', lastmod: new Date() },
 * ]);
 * ```
 */
export function generateSitemapIndex(
  sitemaps: Array<{ loc: string; lastmod?: Date | string }>
): string {
  const sitemapEntries = sitemaps
    .map((sitemap) => {
      const { loc, lastmod } = sitemap;

      return `  <sitemap>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
  </sitemap>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}
