/**
 * Posts API Route Handlers
 *
 * Factory functions that create Next.js route handlers for blog posts
 */

import type { RouteConfig, PostFilterParams } from '../types';
import {
  getSupabaseClient,
  requireAdmin,
  handleError,
  parseQueryParams,
  parseIntParam,
  jsonResponse,
  errorResponse,
  successResponse,
  checkAuth,
} from '../utils';

// Re-export blog API functions from examples (will be moved to src/server/api)
// For now, users need to provide these or we include them in the package
type GetPostsOptions = PostFilterParams;

/**
 * Create GET and POST handlers for /api/blog/posts
 *
 * @example
 * ```typescript
 * // app/api/blog/posts/route.ts
 * import { createPostsRoutes } from 'm14i-blogging/server';
 * import { supabase } from '@/lib/supabase-client';
 *
 * export const { GET, POST } = createPostsRoutes({ supabase });
 * ```
 */
export function createPostsRoutes(config: RouteConfig) {
  /**
   * GET /api/blog/posts
   *
   * Query params:
   * - status: 'draft' | 'published' | 'archived'
   * - category: string
   * - tag: string
   * - search: string
   * - limit: number (default: 10)
   * - offset: number (default: 0)
   * - orderBy: 'created_at' | 'updated_at' | 'published_at' | 'title'
   * - orderDirection: 'asc' | 'desc'
   * - categories: 'true' (returns list of categories)
   * - tags: 'true' (returns list of tags)
   */
  async function GET(request: Request) {
    try {
      const supabase = await getSupabaseClient(config);
      const params = parseQueryParams(request.url);

      // Handle special queries
      if (params.categories === 'true') {
        const { data, error } = await supabase
          .from('blog.posts')
          .select('category')
          .not('category', 'is', null)
          .eq('status', 'published');

        if (error) throw error;

        const categories = [...new Set(data.map((row: any) => row.category))];
        return successResponse({ categories: categories.filter(Boolean).sort() });
      }

      if (params.tags === 'true') {
        const { data, error } = await supabase
          .from('blog.posts')
          .select('tags')
          .eq('status', 'published');

        if (error) throw error;

        const allTags = data.flatMap((row: any) => row.tags || []);
        const uniqueTags = [...new Set(allTags)];
        return successResponse({ tags: uniqueTags.sort() });
      }

      // Search query
      if (params.search) {
        const { data, error } = await supabase.rpc('blog.search_posts', {
          search_query: params.search,
        });

        if (error) throw error;

        const limit = parseIntParam(params.limit, 10);
        return successResponse({ posts: data.slice(0, limit) });
      }

      // Regular posts query
      const status = params.status as any;
      const category = params.category;
      const tag = params.tag;
      const limit = parseIntParam(params.limit, 10);
      const offset = parseIntParam(params.offset, 0);
      const orderBy = (params.orderBy || 'published_at') as any;
      const orderDirection = (params.orderDirection || 'desc') as any;

      let query = supabase.from('blog.posts').select('*', { count: 'exact' });

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (tag) {
        query = query.contains('tags', [tag]);
      }

      // Apply ordering
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return successResponse({
        posts: data || [],
        total: count || 0,
        hasMore: (count || 0) > offset + limit,
      });
    } catch (error) {
      const message = handleError(error, config);
      return errorResponse(message, 500);
    }
  }

  /**
   * POST /api/blog/posts
   *
   * Create a new blog post (admin only)
   *
   * Body: Partial<BlogPost>
   */
  async function POST(request: Request) {
    try {
      await requireAdmin(config);

      const supabase = await getSupabaseClient(config);
      const user = await checkAuth(config);
      const body = await request.json();

      // Validate required fields
      if (!body.title || !body.sections) {
        return errorResponse('Title and sections are required', 400);
      }

      // Generate slug if not provided
      let slug = body.slug || generateSlug(body.title);

      // Check slug uniqueness
      const { data: existingPost } = await supabase
        .from('blog.posts')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existingPost) {
        // Append random suffix to make it unique
        slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
      }

      // Auto-generate excerpt if not provided
      const excerpt = body.excerpt || autoGenerateExcerpt(body.sections);

      // Handle published date
      let status = body.status || 'draft';
      let publishedAt = null;

      // If publishedDate is provided, use it
      if (body.publishedDate) {
        publishedAt = body.publishedDate;
        // If published date is in the past or present, mark as published
        if (new Date(body.publishedDate) <= new Date()) {
          status = 'published';
        } else {
          // Future date = scheduled
          status = 'draft'; // Will be published by scheduled job
        }
      } else if (body.status === 'published') {
        // If explicitly set to published without a date, publish now
        publishedAt = new Date().toISOString();
      }

      const insertData = {
        title: body.title,
        slug,
        excerpt,
        featured_image: body.featuredImage || null,
        sections: body.sections,
        seo_metadata: {
          seo: body.seo,
          openGraph: body.openGraph,
          twitter: body.twitter,
        },
        author_info: body.author || null,
        status: status as any,
        category: body.category || null,
        tags: body.tags || [],
        published_at: publishedAt,
        created_by: user?.id || null,
      };

      const { data, error } = await supabase
        .from('blog.posts')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      return successResponse({ post: data }, 201);
    } catch (error) {
      const message = handleError(error, config);
      const status = error instanceof Error && error.message.includes('Unauthorized') ? 401 : 500;
      return errorResponse(message, status);
    }
  }

  return { GET, POST };
}

/**
 * Create GET, PATCH, DELETE handlers for /api/blog/posts/[id]
 *
 * @example
 * ```typescript
 * // app/api/blog/posts/[id]/route.ts
 * import { createPostByIdRoutes } from 'm14i-blogging/server';
 * import { supabase } from '@/lib/supabase-client';
 *
 * export const { GET, PATCH, DELETE } = createPostByIdRoutes({ supabase });
 * ```
 */
export function createPostByIdRoutes(config: RouteConfig) {
  /**
   * GET /api/blog/posts/[id]
   *
   * Get a single post by ID
   */
  async function GET(
    request: Request,
    context: { params: { id: string } }
  ) {
    try {
      const supabase = await getSupabaseClient(config);
      const { data, error } = await supabase
        .from('blog.posts')
        .select('*')
        .eq('id', context.params.id)
        .single();

      if (error) throw error;

      if (!data) {
        return errorResponse('Post not found', 404);
      }

      return successResponse({ post: data });
    } catch (error) {
      const message = handleError(error, config);
      return errorResponse(message, 500);
    }
  }

  /**
   * PATCH /api/blog/posts/[id]
   *
   * Update a post (admin only)
   *
   * Query params:
   * - action: 'publish' | 'unpublish' | 'archive'
   *
   * Body: Partial<BlogPost>
   */
  async function PATCH(
    request: Request,
    context: { params: { id: string } }
  ) {
    try {
      await requireAdmin(config);

      const supabase = await getSupabaseClient(config);
      const params = parseQueryParams(request.url);
      const action = params.action;

      // Handle special actions
      if (action === 'publish') {
        // Check if a specific publish date is provided
        const body = params.publishedAt ? { publishedAt: params.publishedAt } : {};

        const updateData: any = { status: 'published' };

        // If publishedAt is provided, use it; otherwise database trigger will set it
        if (body.publishedAt) {
          updateData.published_at = body.publishedAt;
        }

        const { data, error } = await supabase
          .from('blog.posts')
          .update(updateData)
          .eq('id', context.params.id)
          .select()
          .single();

        if (error) throw error;
        return successResponse({ post: data });
      }

      if (action === 'unpublish') {
        const { data, error } = await supabase
          .from('blog.posts')
          .update({
            status: 'draft',
            published_at: null // Clear published date when unpublishing
          })
          .eq('id', context.params.id)
          .select()
          .single();

        if (error) throw error;
        return successResponse({ post: data });
      }

      if (action === 'archive') {
        const { data, error } = await supabase
          .from('blog.posts')
          .update({ status: 'archived' })
          .eq('id', context.params.id)
          .select()
          .single();

        if (error) throw error;
        return successResponse({ post: data });
      }

      // Regular update
      const body = await request.json();

      // Validate slug if provided
      if (body.slug && !validateSlug(body.slug)) {
        return errorResponse('Invalid slug format', 400);
      }

      // Check slug uniqueness if changing slug
      if (body.slug) {
        const { data: existingPost } = await supabase
          .from('blog.posts')
          .select('id')
          .eq('slug', body.slug)
          .single();

        if (existingPost && existingPost.id !== context.params.id) {
          return errorResponse('Slug already exists', 400);
        }
      }

      const updateData: any = {};

      if (body.title !== undefined) updateData.title = body.title;
      if (body.slug !== undefined) updateData.slug = body.slug;
      if (body.excerpt !== undefined) updateData.excerpt = body.excerpt || null;
      if (body.featuredImage !== undefined)
        updateData.featured_image = body.featuredImage || null;
      if (body.sections !== undefined) updateData.sections = body.sections;
      if (body.category !== undefined) updateData.category = body.category || null;
      if (body.tags !== undefined) updateData.tags = body.tags || [];
      if (body.author !== undefined) updateData.author_info = body.author || null;

      // Handle status and published date changes
      if (body.status !== undefined) {
        updateData.status = body.status;

        // When changing to published status
        if (body.status === 'published' && body.publishedDate === undefined) {
          // If no publishedDate provided, use current time
          updateData.published_at = new Date().toISOString();
        } else if (body.status === 'draft') {
          // When changing back to draft, optionally clear published_at
          // (you might want to keep it for history)
          // updateData.published_at = null;
        }
      }

      // Handle explicit publishedDate changes
      if (body.publishedDate !== undefined) {
        updateData.published_at = body.publishedDate;

        // If setting a published date in the past/present, mark as published
        if (body.publishedDate && new Date(body.publishedDate) <= new Date()) {
          updateData.status = 'published';
        } else if (body.publishedDate) {
          // Future date - keep as draft (scheduled)
          if (body.status === undefined) {
            updateData.status = 'draft';
          }
        } else {
          // Clearing published date
          updateData.published_at = null;
        }
      }

      if (body.seo !== undefined || body.openGraph !== undefined || body.twitter !== undefined) {
        updateData.seo_metadata = {
          seo: body.seo,
          openGraph: body.openGraph,
          twitter: body.twitter,
        };
      }

      const { data, error } = await supabase
        .from('blog.posts')
        .update(updateData)
        .eq('id', context.params.id)
        .select()
        .single();

      if (error) throw error;

      return successResponse({ post: data });
    } catch (error) {
      const message = handleError(error, config);
      const status = error instanceof Error && error.message.includes('Unauthorized') ? 401 : 500;
      return errorResponse(message, status);
    }
  }

  /**
   * DELETE /api/blog/posts/[id]
   *
   * Delete a post (admin only)
   */
  async function DELETE(
    request: Request,
    context: { params: { id: string } }
  ) {
    try {
      await requireAdmin(config);

      const supabase = await getSupabaseClient(config);
      const { error } = await supabase
        .from('blog.posts')
        .delete()
        .eq('id', context.params.id);

      if (error) throw error;

      return successResponse({ success: true });
    } catch (error) {
      const message = handleError(error, config);
      const status = error instanceof Error && error.message.includes('Unauthorized') ? 401 : 500;
      return errorResponse(message, status);
    }
  }

  return { GET, PATCH, DELETE };
}

/**
 * Create GET handler for /api/blog/posts/slug/[slug]
 *
 * @example
 * ```typescript
 * // app/api/blog/posts/slug/[slug]/route.ts
 * import { createPostBySlugRoute } from 'm14i-blogging/server';
 * import { supabase } from '@/lib/supabase-client';
 *
 * export const { GET } = createPostBySlugRoute({ supabase });
 * ```
 */
export function createPostBySlugRoute(config: RouteConfig) {
  async function GET(
    request: Request,
    context: { params: { slug: string } }
  ) {
    try {
      const supabase = await getSupabaseClient(config);
      const { data, error } = await supabase
        .from('blog.posts')
        .select('*')
        .eq('slug', context.params.slug)
        .single();

      if (error) throw error;

      if (!data) {
        return errorResponse('Post not found', 404);
      }

      return successResponse({ post: data });
    } catch (error) {
      const message = handleError(error, config);
      return errorResponse(message, 500);
    }
  }

  return { GET };
}

// Helper functions (these would ideally be imported from adapters)
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 200);
}

function validateSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function autoGenerateExcerpt(sections: any[], maxLength: number = 160): string {
  const textParts: string[] = [];

  sections.forEach((section: any) => {
    section.columns?.forEach((column: any) => {
      column.forEach((block: any) => {
        if (block.type === 'text') {
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

  const plainText = textParts.join(' ');

  if (plainText.length <= maxLength) {
    return plainText;
  }

  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}
