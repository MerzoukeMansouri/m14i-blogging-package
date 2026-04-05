/**
 * Next.js App Router API Route Examples
 *
 * These examples show how to create API routes for blog post CRUD operations
 * in Next.js 13+ App Router.
 *
 * Place these files in your Next.js app:
 * - app/api/blog/posts/route.ts
 * - app/api/blog/posts/[id]/route.ts
 */

// ============================================================================
// FILE: app/api/blog/posts/route.ts
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, requireAdmin } from '@/lib/supabase-client';
import {
  getPosts,
  createPost,
  getCategories,
  getTags,
  searchPosts,
} from '@/lib/blog-api';

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
 */
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const searchParams = request.nextUrl.searchParams;

  // Handle special queries
  if (searchParams.get('categories')) {
    const categories = await getCategories(supabase);
    return NextResponse.json({ categories });
  }

  if (searchParams.get('tags')) {
    const tags = await getTags(supabase);
    return NextResponse.json({ tags });
  }

  const searchQuery = searchParams.get('search');
  if (searchQuery) {
    const posts = await searchPosts(supabase, searchQuery);
    return NextResponse.json({ posts });
  }

  // Regular posts query
  const status = searchParams.get('status') as any;
  const category = searchParams.get('category') || undefined;
  const tag = searchParams.get('tag') || undefined;
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');
  const orderBy = (searchParams.get('orderBy') || 'published_at') as any;
  const orderDirection = (searchParams.get('orderDirection') || 'desc') as any;

  const result = await getPosts(supabase, {
    status,
    category,
    tag,
    limit,
    offset,
    orderBy,
    orderDirection,
  });

  return NextResponse.json(result);
}

/**
 * POST /api/blog/posts
 *
 * Create a new blog post (admin only)
 *
 * Body:
 * {
 *   title: string;
 *   slug?: string;
 *   excerpt?: string;
 *   featuredImage?: string;
 *   sections: LayoutSection[];
 *   category?: string;
 *   tags?: string[];
 *   seo?: SEOMetadata;
 *   openGraph?: OpenGraphMetadata;
 *   twitter?: TwitterCardMetadata;
 *   author?: AuthorInfo;
 * }
 */
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();

  try {
    // Require admin access
    const user = await requireAdmin(supabase);

    const body = await request.json();

    const { post, error } = await createPost(supabase, body, user.id);

    if (error || !post) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unauthorized' },
      { status: 401 }
    );
  }
}

// ============================================================================
// FILE: app/api/blog/posts/[id]/route.ts
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, requireAdmin } from '@/lib/supabase-client';
import {
  getPostById,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
  archivePost,
} from '@/lib/blog-api';

/**
 * GET /api/blog/posts/[id]
 *
 * Get a single post by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();
  const post = await getPostById(supabase, params.id);

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({ post });
}

/**
 * PATCH /api/blog/posts/[id]
 *
 * Update a post (admin only)
 *
 * Body: Partial<BlogPost>
 *
 * Special actions (query params):
 * - ?action=publish
 * - ?action=unpublish
 * - ?action=archive
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();

  try {
    // Require admin access
    await requireAdmin(supabase);

    const action = request.nextUrl.searchParams.get('action');

    // Handle special actions
    if (action === 'publish') {
      const { post, error } = await publishPost(supabase, params.id);
      if (error || !post) {
        return NextResponse.json({ error }, { status: 400 });
      }
      return NextResponse.json({ post });
    }

    if (action === 'unpublish') {
      const { post, error } = await unpublishPost(supabase, params.id);
      if (error || !post) {
        return NextResponse.json({ error }, { status: 400 });
      }
      return NextResponse.json({ post });
    }

    if (action === 'archive') {
      const { post, error } = await archivePost(supabase, params.id);
      if (error || !post) {
        return NextResponse.json({ error }, { status: 400 });
      }
      return NextResponse.json({ post });
    }

    // Regular update
    const body = await request.json();
    const { post, error } = await updatePost(supabase, params.id, body);

    if (error || !post) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unauthorized' },
      { status: 401 }
    );
  }
}

/**
 * DELETE /api/blog/posts/[id]
 *
 * Delete a post (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient();

  try {
    // Require admin access
    await requireAdmin(supabase);

    const { success, error } = await deletePost(supabase, params.id);

    if (!success) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unauthorized' },
      { status: 401 }
    );
  }
}

// ============================================================================
// FILE: app/api/blog/posts/slug/[slug]/route.ts
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';
import { getPostBySlug } from '@/lib/blog-api';

/**
 * GET /api/blog/posts/slug/[slug]
 *
 * Get a single post by slug (useful for public blog pages)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createServerSupabaseClient();
  const post = await getPostBySlug(supabase, params.slug);

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({ post });
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Client-side fetch examples:

// Get all published posts
const response = await fetch('/api/blog/posts?status=published');
const { posts, total, hasMore } = await response.json();

// Get posts by category
const response = await fetch('/api/blog/posts?category=tutorials&limit=20');

// Search posts
const response = await fetch('/api/blog/posts?search=typescript');

// Get categories
const response = await fetch('/api/blog/posts?categories=true');
const { categories } = await response.json();

// Get tags
const response = await fetch('/api/blog/posts?tags=true');
const { tags } = await response.json();

// Create a new post (admin only)
const response = await fetch('/api/blog/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My New Post',
    sections: [...],
    category: 'tutorials',
    tags: ['typescript', 'react'],
  }),
});

// Update a post (admin only)
const response = await fetch('/api/blog/posts/post-id-here', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Updated Title',
    sections: [...],
  }),
});

// Publish a post (admin only)
const response = await fetch('/api/blog/posts/post-id-here?action=publish', {
  method: 'PATCH',
});

// Delete a post (admin only)
const response = await fetch('/api/blog/posts/post-id-here', {
  method: 'DELETE',
});

// Get post by slug (for blog detail page)
const response = await fetch('/api/blog/posts/slug/my-blog-post');
const { post } = await response.json();
*/
