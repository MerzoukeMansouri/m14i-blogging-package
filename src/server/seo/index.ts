/**
 * SEO Utilities for Blog
 *
 * Helpers for sitemap, robots.txt, RSS feeds, and metadata generation
 */

// Sitemap
export {
  generateBlogSitemap,
  generateCompleteSitemap,
  generateSitemapXML,
  generateNextJsSitemap,
  generateSitemapIndex,
  type SitemapEntry,
  type SitemapOptions,
} from './sitemap';

// Robots.txt
export {
  generateRobotsTxt,
  generateNextJsRobots,
  robotsPresets,
  type RobotsOptions,
} from './robots';

// Metadata
export {
  generateBlogPostMetadata,
  generateBlogIndexMetadata,
  generateBlogPostJsonLd,
  type BlogPostMetadata,
  type MetadataOptions,
} from './metadata';

// RSS
export {
  generateRSSFeed,
  generateAtomFeed,
  type RSSOptions,
} from './rss';
