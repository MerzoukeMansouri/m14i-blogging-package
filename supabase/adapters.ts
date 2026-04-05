/**
 * Type Adapters for Supabase Integration
 *
 * These adapters convert between Supabase database types and the m14i-blogging
 * package types, ensuring type safety across the persistence layer.
 */

import type {
  BlogPost,
  LayoutSection,
  AuthorInfo,
  SEOMetadata,
  OpenGraphMetadata,
  TwitterCardMetadata,
} from '../src/types';

// ============================================================================
// SUPABASE DATABASE TYPES
// ============================================================================
// Note: Generate actual types with: npx supabase gen types typescript --local

/**
 * Database row type for blog.posts table
 */
export interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  sections: LayoutSection[]; // JSONB stored as parsed object
  seo_metadata: {
    seo?: SEOMetadata;
    openGraph?: OpenGraphMetadata;
    twitter?: TwitterCardMetadata;
  };
  author_info: AuthorInfo | null;
  status: 'draft' | 'published' | 'archived';
  category: string | null;
  tags: string[];
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  published_at: string | null; // ISO timestamp
  created_by: string | null; // UUID
}

/**
 * Insert type for blog.posts table (omits generated/default fields)
 */
export interface BlogPostInsert {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  featured_image?: string | null;
  sections: LayoutSection[];
  seo_metadata?: {
    seo?: SEOMetadata;
    openGraph?: OpenGraphMetadata;
    twitter?: TwitterCardMetadata;
  };
  author_info?: AuthorInfo | null;
  status?: 'draft' | 'published' | 'archived';
  category?: string | null;
  tags?: string[];
  created_by?: string | null;
}

/**
 * Update type for blog.posts table (all fields optional except where needed)
 */
export interface BlogPostUpdate {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  featured_image?: string | null;
  sections?: LayoutSection[];
  seo_metadata?: {
    seo?: SEOMetadata;
    openGraph?: OpenGraphMetadata;
    twitter?: TwitterCardMetadata;
  };
  author_info?: AuthorInfo | null;
  status?: 'draft' | 'published' | 'archived';
  category?: string | null;
  tags?: string[];
}

/**
 * Database row type for blog.media table
 */
export interface MediaRow {
  id: string;
  file_path: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  type: 'image' | 'video' | 'pdf' | 'other';
  metadata: {
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
    duration?: number;
    thumbnail?: string;
    title?: string;
    description?: string;
    pageCount?: number;
  };
  usage_count: number;
  last_used_at: string | null;
  uploaded_at: string;
  uploaded_by: string | null;
}

// ============================================================================
// ADAPTER FUNCTIONS
// ============================================================================

/**
 * Convert Supabase BlogPostRow to BlogPost (package type)
 *
 * Use this when reading from database to display with BlogPreview
 */
export function dbRowToBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? undefined,
    featuredImage: row.featured_image ?? undefined,
    sections: row.sections,
    createdAt: row.created_at,
    updatedAt: row.updated_at,

    // SEO metadata
    author: row.author_info ?? undefined,
    category: row.category ?? undefined,
    tags: row.tags.length > 0 ? row.tags : undefined,
    publishedDate: row.published_at ?? undefined,
    modifiedDate: row.updated_at,
    seo: row.seo_metadata.seo,
    openGraph: row.seo_metadata.openGraph,
    twitter: row.seo_metadata.twitter,
  };
}

/**
 * Convert BlogPost (package type) to BlogPostInsert for database
 *
 * Use this when creating a new post from BlogBuilder
 */
export function blogPostToDbInsert(
  post: BlogPost,
  userId?: string
): BlogPostInsert {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? null,
    featured_image: post.featuredImage ?? null,
    sections: post.sections,
    seo_metadata: {
      seo: post.seo,
      openGraph: post.openGraph,
      twitter: post.twitter,
    },
    author_info: post.author ?? null,
    status: 'draft', // Always start as draft
    category: post.category ?? null,
    tags: post.tags ?? [],
    created_by: userId ?? null,
  };
}

/**
 * Convert BlogPost (package type) to BlogPostUpdate for database
 *
 * Use this when updating an existing post from BlogBuilder
 */
export function blogPostToDbUpdate(post: Partial<BlogPost>): BlogPostUpdate {
  const update: BlogPostUpdate = {};

  if (post.title !== undefined) update.title = post.title;
  if (post.slug !== undefined) update.slug = post.slug;
  if (post.excerpt !== undefined) update.excerpt = post.excerpt ?? null;
  if (post.featuredImage !== undefined) update.featured_image = post.featuredImage ?? null;
  if (post.sections !== undefined) update.sections = post.sections;
  if (post.category !== undefined) update.category = post.category ?? null;
  if (post.tags !== undefined) update.tags = post.tags ?? [];
  if (post.author !== undefined) update.author_info = post.author ?? null;

  // Build SEO metadata object if any SEO field is present
  if (post.seo !== undefined || post.openGraph !== undefined || post.twitter !== undefined) {
    update.seo_metadata = {
      seo: post.seo,
      openGraph: post.openGraph,
      twitter: post.twitter,
    };
  }

  return update;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate slug format (lowercase, hyphens only)
 */
export function validateSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 200); // Reasonable slug length limit
}

/**
 * Check if post is published
 */
export function isPublished(row: BlogPostRow): boolean {
  return row.status === 'published' && row.published_at !== null;
}

/**
 * Get reading time from sections (in minutes)
 */
export function calculateReadingTime(sections: LayoutSection[]): number {
  const WORDS_PER_MINUTE = 200;

  let wordCount = 0;

  sections.forEach(section => {
    section.columns.forEach(column => {
      column.forEach(block => {
        if (block.type === 'text') {
          wordCount += block.content.split(/\s+/).length;
        } else if (block.type === 'quote') {
          wordCount += block.content.split(/\s+/).length;
        }
      });
    });
  });

  return Math.ceil(wordCount / WORDS_PER_MINUTE);
}

/**
 * Extract all image URLs from sections (for preloading, validation, etc.)
 */
export function extractImageUrls(sections: LayoutSection[]): string[] {
  const urls: string[] = [];

  sections.forEach(section => {
    section.columns.forEach(column => {
      column.forEach(block => {
        if (block.type === 'image' && block.src) {
          urls.push(block.src);
        } else if (block.type === 'carousel') {
          block.slides.forEach(slide => {
            if (slide.src) urls.push(slide.src);
          });
        }
      });
    });
  });

  return urls;
}

/**
 * Extract plain text content from sections (for search, excerpts, etc.)
 */
export function extractPlainText(sections: LayoutSection[]): string {
  const textParts: string[] = [];

  sections.forEach(section => {
    section.columns.forEach(column => {
      column.forEach(block => {
        if (block.type === 'text') {
          // Remove markdown formatting
          const plainText = block.content
            .replace(/[#*_~`]/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
          textParts.push(plainText);
        } else if (block.type === 'quote') {
          textParts.push(block.content);
        }
      });
    });
  });

  return textParts.join(' ');
}

/**
 * Auto-generate excerpt from content if not provided
 */
export function autoGenerateExcerpt(
  sections: LayoutSection[],
  maxLength: number = 160
): string {
  const plainText = extractPlainText(sections);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Truncate at word boundary
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a value is a valid BlogPostRow
 */
export function isBlogPostRow(value: unknown): value is BlogPostRow {
  if (!value || typeof value !== 'object') return false;

  const row = value as Partial<BlogPostRow>;

  return (
    typeof row.id === 'string' &&
    typeof row.title === 'string' &&
    typeof row.slug === 'string' &&
    Array.isArray(row.sections) &&
    typeof row.seo_metadata === 'object' &&
    ['draft', 'published', 'archived'].includes(row.status as string)
  );
}
