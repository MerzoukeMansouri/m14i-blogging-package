/**
 * SEO Defaults Helper
 * Automatically generates missing SEO fields with intelligent defaults
 */

import type { BlogPost } from '../types';
import type {
  SEOConfig,
  SEOMetadata,
  OpenGraphMetadata,
  TwitterCardMetadata,
  ImageMetadata
} from '../types/seo';
import { generateExcerptFromSections, analyzeContent } from './seo-analysis';

/**
 * Normalize image metadata
 * Converts string URLs to ImageMetadata objects
 */
function normalizeImageMetadata(image: string | ImageMetadata | undefined): ImageMetadata | undefined {
  if (!image) return undefined;
  if (typeof image === 'string') {
    return { url: image };
  }
  return image;
}

/**
 * Generate full URL from slug
 */
function generateUrl(slug: string, siteUrl: string): string {
  const cleanSiteUrl = siteUrl.replace(/\/$/, '');
  const cleanSlug = slug.replace(/^\//, '');
  return `${cleanSiteUrl}/${cleanSlug}`;
}

/**
 * Generate SEO metadata with smart defaults
 * Auto-fills missing fields based on available data
 */
export function generateSEODefaults(
  blogPost: BlogPost,
  config: SEOConfig
): Required<Pick<BlogPost, 'seo' | 'openGraph' | 'twitter'>> {
  // Analyze content for auto-generation
  const analysis = analyzeContent(blogPost);

  // Get or generate description
  const description =
    blogPost.seo?.description ||
    blogPost.excerpt ||
    analysis.autoExcerpt ||
    '';

  // Get canonical URL
  const canonicalUrl = blogPost.seo?.canonicalUrl || generateUrl(blogPost.slug, config.siteUrl);

  // Normalize featured image
  const featuredImage = normalizeImageMetadata(blogPost.featuredImage);

  // Get default image from config
  const defaultImage = normalizeImageMetadata(config.defaultImage);

  // Determine the best image to use
  const primaryImage = featuredImage || defaultImage;

  // Generate SEO metadata
  const seo: SEOMetadata = {
    description,
    keywords: blogPost.tags || blogPost.seo?.keywords || [],
    canonicalUrl,
    robots: blogPost.seo?.robots || 'index, follow',
    language: blogPost.seo?.language || config.defaultLanguage || 'en',
    ...blogPost.seo, // Override with explicit values
  };

  // Generate Open Graph metadata
  const openGraph: OpenGraphMetadata = {
    title: blogPost.openGraph?.title || blogPost.title,
    description: blogPost.openGraph?.description || description,
    type: blogPost.openGraph?.type || 'article',
    url: blogPost.openGraph?.url || canonicalUrl,
    siteName: blogPost.openGraph?.siteName || config.siteName,
    locale: blogPost.openGraph?.locale || (seo.language?.replace('-', '_') || 'en_US'),
    image: blogPost.openGraph?.image || primaryImage,
    article: {
      publishedTime: blogPost.publishedDate || blogPost.createdAt,
      modifiedTime: blogPost.modifiedDate || blogPost.updatedAt,
      authors: blogPost.author ? [blogPost.author.name] : undefined,
      section: blogPost.category,
      tags: blogPost.tags,
      ...blogPost.openGraph?.article,
    },
    ...blogPost.openGraph, // Override with explicit values
  };

  // Generate Twitter Card metadata
  const twitter: TwitterCardMetadata = {
    card: blogPost.twitter?.card || (primaryImage ? 'summary_large_image' : 'summary'),
    site: blogPost.twitter?.site || config.twitterSite,
    creator: blogPost.twitter?.creator || blogPost.author?.social?.twitter,
    title: blogPost.twitter?.title || openGraph.title,
    description: blogPost.twitter?.description || openGraph.description,
    image: blogPost.twitter?.image || openGraph.image,
    imageAlt: typeof blogPost.twitter?.image === 'object'
      ? blogPost.twitter.image.alt
      : (typeof primaryImage === 'object' ? primaryImage.alt : blogPost.title),
    ...blogPost.twitter, // Override with explicit values
  };

  return { seo, openGraph, twitter };
}

/**
 * Merge blog post with SEO defaults
 * Returns a new BlogPost object with all SEO fields populated
 */
export function withSEODefaults(blogPost: BlogPost, config: SEOConfig): BlogPost {
  const defaults = generateSEODefaults(blogPost, config);

  return {
    ...blogPost,
    seo: defaults.seo,
    openGraph: defaults.openGraph,
    twitter: defaults.twitter,
    // Also set publishedDate and modifiedDate if not set
    publishedDate: blogPost.publishedDate || blogPost.createdAt,
    modifiedDate: blogPost.modifiedDate || blogPost.updatedAt,
    // Set author from config default if not provided
    author: blogPost.author || config.defaultAuthor,
  };
}

/**
 * Validate SEO metadata and return warnings
 * Checks for common SEO issues
 */
export function validateSEO(blogPost: BlogPost, config: SEOConfig): string[] {
  const warnings: string[] = [];
  const defaults = generateSEODefaults(blogPost, config);
  const analysis = analyzeContent(blogPost);

  // Check title length (ideal: 50-60 characters, max: 70)
  if (blogPost.title.length > 70) {
    warnings.push(`Title is too long (${blogPost.title.length} chars). Keep it under 60 characters for best results.`);
  } else if (blogPost.title.length < 30) {
    warnings.push(`Title is too short (${blogPost.title.length} chars). Aim for 30-60 characters.`);
  }

  // Check meta description length (ideal: 150-160 characters)
  const description = defaults.seo.description;
  if (description) {
    if (description.length > 160) {
      warnings.push(`Meta description is too long (${description.length} chars). Keep it under 160 characters.`);
    } else if (description.length < 120) {
      warnings.push(`Meta description is too short (${description.length} chars). Aim for 120-160 characters.`);
    }
  } else {
    warnings.push('No meta description provided or could be generated.');
  }

  // Check for featured image
  if (!blogPost.featuredImage && !config.defaultImage) {
    warnings.push('No featured image provided. Images improve social media sharing.');
  }

  // Check for author
  if (!blogPost.author && !config.defaultAuthor) {
    warnings.push('No author information provided. Author attribution helps with E-A-T (Expertise, Authoritativeness, Trustworthiness).');
  }

  // Check content length
  if (analysis.wordCount < 300) {
    warnings.push(`Content is short (${analysis.wordCount} words). Longer content (600+ words) typically ranks better.`);
  }

  // Check heading structure
  if (analysis.headings && analysis.headings.length > 0) {
    const h1Count = analysis.headings.filter(h => h.level === 1).length;
    if (h1Count === 0) {
      warnings.push('No H1 heading found in content. Add one for better SEO structure.');
    } else if (h1Count > 1) {
      warnings.push(`Multiple H1 headings found (${h1Count}). Use only one H1 per page.`);
    }

    // Check for heading hierarchy gaps
    const levels = analysis.headings.map(h => h.level).sort();
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i - 1] > 1) {
        warnings.push('Heading hierarchy has gaps (e.g., H1 → H3). Use sequential heading levels (H1 → H2 → H3).');
        break;
      }
    }
  } else {
    warnings.push('No headings found in content. Use headings (H2, H3) to structure your content.');
  }

  // Check images for alt text
  if (analysis.imageCount && analysis.imageCount > 0) {
    // This is a basic check; detailed alt text validation would require block-level analysis
    warnings.push(`Content has ${analysis.imageCount} image(s). Ensure all images have descriptive alt text.`);
  }

  // Check for keywords/tags
  if (!blogPost.tags || blogPost.tags.length === 0) {
    warnings.push('No tags/keywords provided. Tags help categorize content and improve discoverability.');
  }

  // Check canonical URL
  if (!defaults.seo.canonicalUrl) {
    warnings.push('No canonical URL set. This could cause duplicate content issues.');
  }

  return warnings;
}

/**
 * Get SEO score based on validation
 * Returns a score from 0-100 and categorization
 */
export function getSEOScore(blogPost: BlogPost, config: SEOConfig): {
  score: number;
  grade: 'excellent' | 'good' | 'fair' | 'poor';
  warnings: string[];
} {
  const warnings = validateSEO(blogPost, config);

  // Start with perfect score and deduct points for each issue
  let score = 100;
  const deductionPerWarning = Math.ceil(100 / 15); // Adjust based on number of checks

  score -= warnings.length * deductionPerWarning;
  score = Math.max(0, Math.min(100, score));

  let grade: 'excellent' | 'good' | 'fair' | 'poor';
  if (score >= 90) grade = 'excellent';
  else if (score >= 70) grade = 'good';
  else if (score >= 50) grade = 'fair';
  else grade = 'poor';

  return { score, grade, warnings };
}
