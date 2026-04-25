/**
 * Robots.txt Generator
 *
 * Generates robots.txt content for SEO
 */

export interface RobotsOptions {
  /**
   * Base URL of your site (e.g., 'https://example.com')
   */
  baseUrl: string;

  /**
   * URL path to sitemap (default: '/sitemap.xml')
   */
  sitemapPath?: string;

  /**
   * Allow all crawlers (default: true)
   */
  allowAll?: boolean;

  /**
   * Paths to disallow for all crawlers
   */
  disallow?: string[];

  /**
   * Custom user agents with specific rules
   */
  customAgents?: Array<{
    userAgent: string;
    allow?: string[];
    disallow?: string[];
    crawlDelay?: number;
  }>;

  /**
   * Crawl delay in seconds
   */
  crawlDelay?: number;
}

/**
 * Generate robots.txt content
 *
 * @example
 * ```typescript
 * import { generateRobotsTxt } from 'm14i-blogging/server';
 *
 * const robotsTxt = generateRobotsTxt({
 *   baseUrl: 'https://example.com',
 *   disallow: ['/admin', '/api'],
 * });
 * ```
 */
export function generateRobotsTxt(options: RobotsOptions): string {
  const {
    baseUrl,
    sitemapPath = '/sitemap.xml',
    allowAll = true,
    disallow = [],
    customAgents = [],
    crawlDelay,
  } = options;

  const lines: string[] = [];

  // Default user agent
  lines.push('User-agent: *');

  if (allowAll) {
    lines.push('Allow: /');
  }

  // Add disallowed paths
  disallow.forEach((path) => {
    lines.push(`Disallow: ${path}`);
  });

  // Add crawl delay if specified
  if (crawlDelay) {
    lines.push(`Crawl-delay: ${crawlDelay}`);
  }

  lines.push('');

  // Add custom agents
  customAgents.forEach((agent) => {
    lines.push(`User-agent: ${agent.userAgent}`);

    if (agent.allow) {
      agent.allow.forEach((path) => {
        lines.push(`Allow: ${path}`);
      });
    }

    if (agent.disallow) {
      agent.disallow.forEach((path) => {
        lines.push(`Disallow: ${path}`);
      });
    }

    if (agent.crawlDelay) {
      lines.push(`Crawl-delay: ${agent.crawlDelay}`);
    }

    lines.push('');
  });

  // Add sitemap
  lines.push(`Sitemap: ${baseUrl}${sitemapPath}`);

  return lines.join('\n');
}

/**
 * Generate robots.txt for Next.js app/robots.ts route
 *
 * @example
 * ```typescript
 * // app/robots.ts
 * import { generateNextJsRobots } from 'm14i-blogging/server';
 *
 * export default function robots() {
 *   return generateNextJsRobots({
 *     baseUrl: 'https://example.com',
 *     disallow: ['/admin', '/api'],
 *   });
 * }
 * ```
 */
export function generateNextJsRobots(options: RobotsOptions): {
  rules: Array<{
    userAgent: string | string[];
    allow?: string | string[];
    disallow?: string | string[];
    crawlDelay?: number;
  }>;
  sitemap: string | string[];
} {
  const {
    baseUrl,
    sitemapPath = '/sitemap.xml',
    allowAll = true,
    disallow = [],
    customAgents = [],
    crawlDelay,
  } = options;

  const rules: Array<{
    userAgent: string | string[];
    allow?: string | string[];
    disallow?: string | string[];
    crawlDelay?: number;
  }> = [];

  // Default user agent
  const defaultRule: {
    userAgent: string;
    allow?: string | string[];
    disallow?: string | string[];
    crawlDelay?: number;
  } = {
    userAgent: '*',
  };

  if (allowAll) {
    defaultRule.allow = '/';
  }

  if (disallow.length > 0) {
    defaultRule.disallow = disallow;
  }

  if (crawlDelay) {
    defaultRule.crawlDelay = crawlDelay;
  }

  rules.push(defaultRule);

  // Add custom agents
  customAgents.forEach((agent) => {
    rules.push({
      userAgent: agent.userAgent,
      allow: agent.allow,
      disallow: agent.disallow,
      crawlDelay: agent.crawlDelay,
    });
  });

  return {
    rules,
    sitemap: `${baseUrl}${sitemapPath}`,
  };
}

/**
 * Common robots.txt presets
 */
export const robotsPresets = {
  /**
   * Allow all crawlers, block admin and API routes
   */
  default: (baseUrl: string): RobotsOptions => ({
    baseUrl,
    allowAll: true,
    disallow: ['/admin', '/api', '/_next', '/private'],
  }),

  /**
   * Block all crawlers (development/staging)
   */
  blockAll: (baseUrl: string): RobotsOptions => ({
    baseUrl,
    allowAll: false,
    disallow: ['/'],
  }),

  /**
   * Allow all with AI crawler restrictions
   */
  restrictAI: (baseUrl: string): RobotsOptions => ({
    baseUrl,
    allowAll: true,
    disallow: ['/admin', '/api'],
    customAgents: [
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'],
      },
      {
        userAgent: 'Google-Extended',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'anthropic-ai',
        disallow: ['/'],
      },
      {
        userAgent: 'Claude-Web',
        disallow: ['/'],
      },
    ],
  }),

  /**
   * E-commerce friendly (allow product pages, block checkout/cart)
   */
  ecommerce: (baseUrl: string): RobotsOptions => ({
    baseUrl,
    allowAll: true,
    disallow: [
      '/admin',
      '/api',
      '/cart',
      '/checkout',
      '/account',
      '/wishlist',
      '/*?*sort=',
      '/*?*filter=',
    ],
  }),
};
