/**
 * RSS Feed Generator for Blog Posts
 *
 * Generates RSS 2.0 feeds for blog subscriptions
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export interface RSSOptions {
  /**
   * Base URL of your site
   */
  baseUrl: string;

  /**
   * Blog path (default: '/blog')
   */
  blogPath?: string;

  /**
   * Feed title
   */
  title: string;

  /**
   * Feed description
   */
  description: string;

  /**
   * Feed language (default: 'en')
   */
  language?: string;

  /**
   * Copyright notice
   */
  copyright?: string;

  /**
   * Managing editor email
   */
  managingEditor?: string;

  /**
   * Webmaster email
   */
  webMaster?: string;

  /**
   * Feed image
   */
  image?: {
    url: string;
    title: string;
    link: string;
  };

  /**
   * Maximum number of posts to include (default: 20)
   */
  limit?: number;

  /**
   * Include only published posts (default: true)
   */
  publishedOnly?: boolean;

  /**
   * Filter by category
   */
  category?: string;
}

/**
 * Generate RSS feed for blog posts
 *
 * @example
 * ```typescript
 * import { generateRSSFeed } from 'm14i-blogging/server';
 * import { createServerSupabaseClient } from '@/lib/supabase-client';
 *
 * const rss = await generateRSSFeed(createServerSupabaseClient(), {
 *   baseUrl: 'https://example.com',
 *   title: 'My Blog',
 *   description: 'Latest posts from my blog',
 * });
 * ```
 */
export async function generateRSSFeed(
  supabase: SupabaseClient,
  options: RSSOptions
): Promise<string> {
  const {
    baseUrl,
    blogPath = '/blog',
    title,
    description,
    language = 'en',
    copyright,
    managingEditor,
    webMaster,
    image,
    limit = 20,
    publishedOnly = true,
    category,
  } = options;

  // Fetch posts
  let query = supabase
    .from('blog.posts')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (publishedOnly) {
    query = query.eq('status', 'published');
  }

  if (category) {
    query = query.eq('category', category);
  }

  const { data: posts, error } = await query;

  if (error || !posts) {
    console.error('Error fetching posts for RSS:', error);
    return generateEmptyRSS(options);
  }

  // Build RSS XML
  const feedUrl = `${baseUrl}${blogPath}`;
  const rssUrl = `${baseUrl}/rss.xml`;

  const items = posts
    .map((post) => {
      const postUrl = `${baseUrl}${blogPath}/${post.slug}`;
      const pubDate = post.published_at ? new Date(post.published_at).toUTCString() : '';
      const author = post.author_info?.email || managingEditor || '';
      const categories = post.tags?.map((tag: string) => `    <category>${escapeXml(tag)}</category>`).join('\n') || '';

      return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${escapeXml(postUrl)}</link>
    <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
    <description>${escapeXml(post.excerpt || '')}</description>
    <pubDate>${pubDate}</pubDate>${author ? `\n    <author>${escapeXml(author)}</author>` : ''}${categories ? `\n${categories}` : ''}${post.featured_image ? `\n    <enclosure url="${escapeXml(post.featured_image)}" type="image/jpeg" />` : ''}
  </item>`;
    })
    .join('\n');

  const imageBlock = image
    ? `  <image>
    <url>${escapeXml(image.url)}</url>
    <title>${escapeXml(image.title)}</title>
    <link>${escapeXml(image.link)}</link>
  </image>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
  <title>${escapeXml(title)}</title>
  <link>${escapeXml(feedUrl)}</link>
  <description>${escapeXml(description)}</description>
  <language>${language}</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${escapeXml(rssUrl)}" rel="self" type="application/rss+xml" />${copyright ? `\n  <copyright>${escapeXml(copyright)}</copyright>` : ''}${managingEditor ? `\n  <managingEditor>${escapeXml(managingEditor)}</managingEditor>` : ''}${webMaster ? `\n  <webMaster>${escapeXml(webMaster)}</webMaster>` : ''}
${imageBlock}
${items}
</channel>
</rss>`;
}

/**
 * Generate empty RSS feed (when no posts or error)
 */
function generateEmptyRSS(options: RSSOptions): string {
  const { baseUrl, blogPath = '/blog', title, description, language = 'en' } = options;
  const feedUrl = `${baseUrl}${blogPath}`;
  const rssUrl = `${baseUrl}/rss.xml`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(title)}</title>
  <link>${escapeXml(feedUrl)}</link>
  <description>${escapeXml(description)}</description>
  <language>${language}</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${escapeXml(rssUrl)}" rel="self" type="application/rss+xml" />
</channel>
</rss>`;
}

/**
 * Generate Atom feed for blog posts
 *
 * @example
 * ```typescript
 * const atom = await generateAtomFeed(supabase, {
 *   baseUrl: 'https://example.com',
 *   title: 'My Blog',
 *   description: 'Latest posts',
 *   author: { name: 'John Doe', email: 'john@example.com' },
 * });
 * ```
 */
export async function generateAtomFeed(
  supabase: SupabaseClient,
  options: RSSOptions & {
    author?: {
      name: string;
      email?: string;
      uri?: string;
    };
  }
): Promise<string> {
  const {
    baseUrl,
    blogPath = '/blog',
    title,
    description,
    author,
    limit = 20,
    publishedOnly = true,
    category,
  } = options;

  // Fetch posts
  let query = supabase
    .from('blog.posts')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (publishedOnly) {
    query = query.eq('status', 'published');
  }

  if (category) {
    query = query.eq('category', category);
  }

  const { data: posts, error } = await query;

  if (error || !posts) {
    console.error('Error fetching posts for Atom feed:', error);
    return '';
  }

  const feedUrl = `${baseUrl}${blogPath}`;
  const feedId = feedUrl;
  const updated = posts[0]?.updated_at || new Date().toISOString();

  const entries = posts
    .map((post) => {
      const postUrl = `${baseUrl}${blogPath}/${post.slug}`;
      const published = post.published_at || post.created_at;
      const updated = post.updated_at || published;

      return `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${escapeXml(postUrl)}" />
    <id>${escapeXml(postUrl)}</id>
    <published>${published}</published>
    <updated>${updated}</updated>
    <summary>${escapeXml(post.excerpt || '')}</summary>${post.author_info?.name ? `\n    <author>\n      <name>${escapeXml(post.author_info.name)}</name>${post.author_info.email ? `\n      <email>${escapeXml(post.author_info.email)}</email>` : ''}\n    </author>` : ''}
  </entry>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(title)}</title>
  <link href="${escapeXml(feedUrl)}" />
  <link rel="self" href="${escapeXml(baseUrl)}/atom.xml" />
  <id>${escapeXml(feedId)}</id>
  <updated>${updated}</updated>
  <subtitle>${escapeXml(description)}</subtitle>${author ? `\n  <author>\n    <name>${escapeXml(author.name)}</name>${author.email ? `\n    <email>${escapeXml(author.email)}</email>` : ''}${author.uri ? `\n    <uri>${escapeXml(author.uri)}</uri>` : ''}\n  </author>` : ''}
${entries}
</feed>`;
}

/**
 * Helper function to escape XML special characters
 */
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';

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
