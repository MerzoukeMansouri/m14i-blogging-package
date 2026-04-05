/**
 * Ready-to-use API Route Handlers for Next.js App Router
 *
 * These are template handlers that you can copy directly into your app/api directory.
 * They integrate seamlessly with the m14i-blogging client.
 *
 * @example
 * Copy these files to your Next.js app:
 * - app/api/blog/posts/route.ts
 * - app/api/blog/posts/[slug]/route.ts
 * - app/api/blog/posts/[id]/publish/route.ts
 * - app/api/blog/media/route.ts
 * - app/api/blog/stats/route.ts
 */

import { NextRequest, NextResponse } from "next/server";
import type { BlogFilterParams } from "../types/database";

// ============================================================================
// Type Guards and Utilities
// ============================================================================

/**
 * Check if user is admin
 * Adjust this based on your authentication system
 */
export async function isAdmin(request: NextRequest): Promise<boolean> {
  // IMPLEMENTATION NEEDED: Replace with your auth logic
  // Example with Supabase:
  // const supabase = createClient();
  // const { data: { user } } = await supabase.auth.getUser();
  // return user?.app_metadata?.role === 'admin';
  return false;
}

/**
 * Parse filter parameters from URL search params
 */
export function parseFilterParams(searchParams: URLSearchParams): BlogFilterParams {
  const params: BlogFilterParams = {};

  const page = searchParams.get("page");
  if (page) params.page = Number(page);

  const pageSize = searchParams.get("pageSize");
  if (pageSize) params.pageSize = Number(pageSize);

  const status = searchParams.get("status");
  if (status && ["draft", "published", "archived"].includes(status)) {
    params.status = status as "draft" | "published" | "archived";
  }

  const category = searchParams.get("category");
  if (category) params.category = category;

  const tag = searchParams.get("tag");
  if (tag) params.tag = tag;

  const search = searchParams.get("search");
  if (search) params.search = search;

  const orderBy = searchParams.get("orderBy");
  if (orderBy && ["created_at", "updated_at", "published_at", "title"].includes(orderBy)) {
    params.orderBy = orderBy as "created_at" | "updated_at" | "published_at" | "title";
  }

  const orderDirection = searchParams.get("orderDirection");
  if (orderDirection && ["asc", "desc"].includes(orderDirection)) {
    params.orderDirection = orderDirection as "asc" | "desc";
  }

  return params;
}

// ============================================================================
// API Route Templates
// ============================================================================

/**
 * GET /api/blog/posts
 * List all blog posts with filtering and pagination
 */
export function createListPostsHandler(getBlogClient: () => Promise<any>) {
  return async function GET(request: NextRequest) {
    try {
      const params = parseFilterParams(request.nextUrl.searchParams);
      const blog = await getBlogClient();
      const response = await blog.posts.list(params);
      return NextResponse.json(response);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return NextResponse.json(
        { error: "Failed to fetch blog posts" },
        { status: 500 }
      );
    }
  };
}

/**
 * POST /api/blog/posts
 * Create a new blog post (admin only)
 */
export function createCreatePostHandler(
  getBlogClient: () => Promise<any>,
  checkAuth: (request: NextRequest) => Promise<boolean>
) {
  return async function POST(request: NextRequest) {
    try {
      // Check authentication
      if (!(await checkAuth(request))) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      const body = await request.json();
      const blog = await getBlogClient();
      const post = await blog.posts.create(body);
      return NextResponse.json(post, { status: 201 });
    } catch (error) {
      console.error("Error creating blog post:", error);
      return NextResponse.json(
        { error: "Failed to create blog post" },
        { status: 500 }
      );
    }
  };
}

/**
 * GET /api/blog/posts/[slug]
 * Get a single blog post by slug
 */
export function createGetPostBySlugHandler(getBlogClient: () => Promise<any>) {
  return async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
  ) {
    try {
      const { slug } = await params;
      const blog = await getBlogClient();
      const post = await blog.posts.getBySlug(slug);

      if (!post) {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return NextResponse.json(
        { error: "Failed to fetch blog post" },
        { status: 500 }
      );
    }
  };
}

/**
 * PATCH /api/blog/posts/[id]
 * Update a blog post (admin only)
 */
export function createUpdatePostHandler(
  getBlogClient: () => Promise<any>,
  checkAuth: (request: NextRequest) => Promise<boolean>
) {
  return async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      // Check authentication
      if (!(await checkAuth(request))) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      const { id } = await params;
      const body = await request.json();
      const blog = await getBlogClient();
      const post = await blog.posts.update(id, body);
      return NextResponse.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      return NextResponse.json(
        { error: "Failed to update blog post" },
        { status: 500 }
      );
    }
  };
}

/**
 * DELETE /api/blog/posts/[id]
 * Delete a blog post (admin only)
 */
export function createDeletePostHandler(
  getBlogClient: () => Promise<any>,
  checkAuth: (request: NextRequest) => Promise<boolean>
) {
  return async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      // Check authentication
      if (!(await checkAuth(request))) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      const { id } = await params;
      const blog = await getBlogClient();
      await blog.posts.delete(id);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return NextResponse.json(
        { error: "Failed to delete blog post" },
        { status: 500 }
      );
    }
  };
}

/**
 * POST /api/blog/posts/[id]/publish
 * Publish a blog post (admin only)
 */
export function createPublishPostHandler(
  getBlogClient: () => Promise<any>,
  checkAuth: (request: NextRequest) => Promise<boolean>
) {
  return async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      // Check authentication
      if (!(await checkAuth(request))) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      const { id } = await params;
      const blog = await getBlogClient();
      const post = await blog.posts.publish(id);
      return NextResponse.json(post);
    } catch (error) {
      console.error("Error publishing blog post:", error);
      return NextResponse.json(
        { error: "Failed to publish blog post" },
        { status: 500 }
      );
    }
  };
}

/**
 * GET /api/blog/search
 * Search blog posts
 */
export function createSearchPostsHandler(getBlogClient: () => Promise<any>) {
  return async function GET(request: NextRequest) {
    try {
      const query = request.nextUrl.searchParams.get("q");
      if (!query) {
        return NextResponse.json(
          { error: "Query parameter 'q' is required" },
          { status: 400 }
        );
      }

      const limit = Number(request.nextUrl.searchParams.get("limit")) || 10;
      const blog = await getBlogClient();
      const posts = await blog.posts.search(query, limit);
      return NextResponse.json(posts);
    } catch (error) {
      console.error("Error searching blog posts:", error);
      return NextResponse.json(
        { error: "Failed to search blog posts" },
        { status: 500 }
      );
    }
  };
}

/**
 * GET /api/blog/media
 * List all media files
 * POST /api/blog/media
 * Upload new media file (admin only)
 */
export function createMediaHandlers(
  getBlogClient: () => Promise<any>,
  checkAuth: (request: NextRequest) => Promise<boolean>
) {
  return {
    GET: async function (request: NextRequest) {
      try {
        const type = request.nextUrl.searchParams.get("type") || undefined;
        const limit = Number(request.nextUrl.searchParams.get("limit")) || 50;
        const blog = await getBlogClient();
        const media = await blog.media.list(type, limit);
        return NextResponse.json(media);
      } catch (error) {
        console.error("Error fetching media:", error);
        return NextResponse.json(
          { error: "Failed to fetch media" },
          { status: 500 }
        );
      }
    },
    POST: async function (request: NextRequest) {
      try {
        // Check authentication
        if (!(await checkAuth(request))) {
          return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
          );
        }

        const body = await request.json();
        const blog = await getBlogClient();
        const media = await blog.media.create(body);
        return NextResponse.json(media, { status: 201 });
      } catch (error) {
        console.error("Error creating media:", error);
        return NextResponse.json(
          { error: "Failed to create media" },
          { status: 500 }
        );
      }
    },
  };
}

/**
 * GET /api/blog/stats
 * Get blog statistics
 */
export function createStatsHandler(getBlogClient: () => Promise<any>) {
  return async function GET() {
    try {
      const blog = await getBlogClient();
      const [stats, categories, tags] = await Promise.all([
        blog.stats.getStats(),
        blog.stats.getCategories(),
        blog.stats.getTags(),
      ]);

      return NextResponse.json({
        stats,
        categories,
        tags,
      });
    } catch (error) {
      console.error("Error fetching blog stats:", error);
      return NextResponse.json(
        { error: "Failed to fetch blog stats" },
        { status: 500 }
      );
    }
  };
}
