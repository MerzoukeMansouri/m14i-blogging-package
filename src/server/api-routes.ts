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

  // Helper to parse and validate enum values
  const parseEnum = <T extends readonly string[]>(
    key: string,
    validValues: T
  ): T[number] | undefined => {
    const value = searchParams.get(key);
    return value && validValues.includes(value) ? (value as T[number]) : undefined;
  };

  // Helper to parse numeric values
  const parseNumber = (key: string): number | undefined => {
    const value = searchParams.get(key);
    return value ? Number(value) : undefined;
  };

  // Helper to parse string values
  const parseString = (key: string): string | undefined => {
    return searchParams.get(key) || undefined;
  };

  // Parse all parameters
  Object.assign(params, {
    page: parseNumber("page"),
    pageSize: parseNumber("pageSize"),
    status: parseEnum("status", ["draft", "published", "archived"] as const),
    category: parseString("category"),
    tag: parseString("tag"),
    search: parseString("search"),
    orderBy: parseEnum("orderBy", ["created_at", "updated_at", "published_at", "title"] as const),
    orderDirection: parseEnum("orderDirection", ["asc", "desc"] as const),
  });

  // Remove undefined values
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  ) as BlogFilterParams;
}

// ============================================================================
// Helper Functions for Route Handlers
// ============================================================================

/**
 * Create a standard error response
 */
function createErrorResponse(error: unknown, defaultMessage: string): NextResponse {
  console.error(defaultMessage, error);
  return NextResponse.json(
    { error: defaultMessage },
    { status: 500 }
  );
}

/**
 * Create an unauthorized response
 */
function createUnauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

/**
 * Create a not found response
 */
function createNotFoundResponse(entity: string): NextResponse {
  return NextResponse.json(
    { error: `${entity} not found` },
    { status: 404 }
  );
}

/**
 * Check authorization and return early response if unauthorized
 */
async function requireAuthorization(
  request: NextRequest,
  checkAuth: (request: NextRequest) => Promise<boolean>
): Promise<NextResponse | null> {
  const isAuthorized = await checkAuth(request);
  return isAuthorized ? null : createUnauthorizedResponse();
}

// ============================================================================
// API Route Templates
// ============================================================================

/**
 * GET /api/blog/posts
 * List all blog posts with filtering and pagination
 */
export function createListPostsHandler(
  getBlogClient: () => Promise<any>
): (request: NextRequest) => Promise<NextResponse> {
  return async function GET(request: NextRequest): Promise<NextResponse> {
    try {
      const params = parseFilterParams(request.nextUrl.searchParams);
      const blog = await getBlogClient();
      const response = await blog.posts.list(params);
      return NextResponse.json(response);
    } catch (error) {
      return createErrorResponse(error, "Failed to fetch blog posts");
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
): (request: NextRequest) => Promise<NextResponse> {
  return async function POST(request: NextRequest): Promise<NextResponse> {
    try {
      const authError = await requireAuthorization(request, checkAuth);
      if (authError) return authError;

      const body = await request.json();
      const blog = await getBlogClient();
      const post = await blog.posts.create(body);
      return NextResponse.json(post, { status: 201 });
    } catch (error) {
      return createErrorResponse(error, "Failed to create blog post");
    }
  };
}

/**
 * GET /api/blog/posts/[slug]
 * Get a single blog post by slug
 */
export function createGetPostBySlugHandler(
  getBlogClient: () => Promise<any>
): (
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) => Promise<NextResponse> {
  return async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
  ): Promise<NextResponse> {
    try {
      const { slug } = await params;
      const blog = await getBlogClient();
      const post = await blog.posts.getBySlug(slug);

      if (!post) {
        return createNotFoundResponse("Post");
      }

      return NextResponse.json(post);
    } catch (error) {
      return createErrorResponse(error, "Failed to fetch blog post");
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
): (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => Promise<NextResponse> {
  return async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): Promise<NextResponse> {
    try {
      const authError = await requireAuthorization(request, checkAuth);
      if (authError) return authError;

      const { id } = await params;
      const body = await request.json();
      const blog = await getBlogClient();
      const post = await blog.posts.update(id, body);
      return NextResponse.json(post);
    } catch (error) {
      return createErrorResponse(error, "Failed to update blog post");
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
): (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => Promise<NextResponse> {
  return async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): Promise<NextResponse> {
    try {
      const authError = await requireAuthorization(request, checkAuth);
      if (authError) return authError;

      const { id } = await params;
      const blog = await getBlogClient();
      await blog.posts.delete(id);
      return NextResponse.json({ success: true });
    } catch (error) {
      return createErrorResponse(error, "Failed to delete blog post");
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
): (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => Promise<NextResponse> {
  return async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): Promise<NextResponse> {
    try {
      const authError = await requireAuthorization(request, checkAuth);
      if (authError) return authError;

      const { id } = await params;
      const blog = await getBlogClient();
      const post = await blog.posts.publish(id);
      return NextResponse.json(post);
    } catch (error) {
      return createErrorResponse(error, "Failed to publish blog post");
    }
  };
}

/**
 * GET /api/blog/search
 * Search blog posts
 */
export function createSearchPostsHandler(
  getBlogClient: () => Promise<any>
): (request: NextRequest) => Promise<NextResponse> {
  return async function GET(request: NextRequest): Promise<NextResponse> {
    try {
      const query = request.nextUrl.searchParams.get("q");
      if (!query) {
        return NextResponse.json(
          { error: "Query parameter 'q' is required" },
          { status: 400 }
        );
      }

      const limitParam = request.nextUrl.searchParams.get("limit");
      const limit = limitParam ? Number(limitParam) : 10;

      const blog = await getBlogClient();
      const posts = await blog.posts.search(query, limit);
      return NextResponse.json(posts);
    } catch (error) {
      return createErrorResponse(error, "Failed to search blog posts");
    }
  };
}

/**
 * GET /api/blog/media
 * List all media files
 * POST /api/blog/media
 * Upload new media file (admin only)
 *
 * IMPORTANT: The POST handler now supports both:
 * 1. File upload via FormData (recommended for actual file uploads)
 * 2. JSON body (for creating media records with external URLs)
 */
export function createMediaHandlers(
  getBlogClient: () => Promise<any>,
  checkAuth: (request: NextRequest) => Promise<boolean>,
  options?: {
    storageAdapter?: import("./media-upload").StorageAdapter;
    maxSizeMB?: number;
    allowedTypes?: string[];
    getUserId?: (request: NextRequest) => Promise<string | undefined>;
  }
): {
  GET: (request: NextRequest) => Promise<NextResponse>;
  POST: (request: NextRequest) => Promise<NextResponse>;
} {
  async function handleGetMedia(request: NextRequest): Promise<NextResponse> {
    try {
      const type = request.nextUrl.searchParams.get("type") || undefined;
      const limitParam = request.nextUrl.searchParams.get("limit");
      const limit = limitParam ? Number(limitParam) : 50;

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
  }

  async function handleCreateMedia(request: NextRequest): Promise<NextResponse> {
    try {
      const isAuthorized = await checkAuth(request);
      if (!isAuthorized) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      const contentType = request.headers.get("content-type") || "";
      const blog = await getBlogClient();

      // Handle file upload via FormData
      if (contentType.includes("multipart/form-data")) {
        if (!options?.storageAdapter) {
          return NextResponse.json(
            {
              error:
                "Storage adapter not configured. Please provide a storage adapter in createMediaHandlers options.",
            },
            { status: 500 }
          );
        }

        // Import the upload handler
        const { handleFileUpload } = await import("./media-upload");

        // Get user ID if available
        const userId = options.getUserId
          ? await options.getUserId(request)
          : undefined;

        // Handle the upload
        const result = await handleFileUpload(
          request,
          options.storageAdapter,
          blog,
          userId,
          {
            maxSizeMB: options.maxSizeMB,
            allowedTypes: options.allowedTypes,
          }
        );

        return NextResponse.json(result, { status: 201 });
      }

      // Handle JSON body (for external URLs)
      const body = await request.json();
      const media = await blog.media.create(body);
      return NextResponse.json(media, { status: 201 });
    } catch (error) {
      console.error("Error creating media:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create media";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  }

  return {
    GET: handleGetMedia,
    POST: handleCreateMedia,
  };
}

/**
 * GET /api/blog/stats
 * Get blog statistics
 */
export function createStatsHandler(
  getBlogClient: () => Promise<any>
): () => Promise<NextResponse> {
  return async function GET(): Promise<NextResponse> {
    try {
      const blog = await getBlogClient();
      const stats = await blog.stats.getStats();

      return NextResponse.json({ stats });
    } catch (error) {
      return createErrorResponse(error, "Failed to fetch blog stats");
    }
  };
}

// ============================================================================
// Generic CRUD Handler Factory
// ============================================================================

/**
 * Create a generic list handler for any entity type
 */
function createGenericListHandler(
  getBlogClient: () => Promise<any>,
  entityType: string,
  entityKey: string
): () => Promise<NextResponse> {
  return async function GET(): Promise<NextResponse> {
    try {
      const blog = await getBlogClient();
      const entities = await blog[entityType].list();
      return NextResponse.json({ [entityKey]: entities });
    } catch (error) {
      return createErrorResponse(error, `Failed to fetch ${entityType}`);
    }
  };
}

/**
 * Create a generic get handler for any entity type
 */
function createGenericGetHandler(
  getBlogClient: () => Promise<any>,
  entityType: string,
  entityKey: string
): (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => Promise<NextResponse> {
  return async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): Promise<NextResponse> {
    try {
      const { id } = await params;
      const blog = await getBlogClient();
      const entity = await blog[entityType].getById(id);

      if (!entity) {
        return createNotFoundResponse(entityKey);
      }

      return NextResponse.json({ [entityKey]: entity });
    } catch (error) {
      return createErrorResponse(error, `Failed to fetch ${entityKey}`);
    }
  };
}

/**
 * Create a generic create handler for any entity type
 */
function createGenericCreateHandler(
  getBlogClient: () => Promise<any>,
  checkAuth: (request: NextRequest) => Promise<boolean>,
  entityType: string,
  entityKey: string
): (request: NextRequest) => Promise<NextResponse> {
  return async function POST(request: NextRequest): Promise<NextResponse> {
    try {
      const authError = await requireAuthorization(request, checkAuth);
      if (authError) return authError;

      const body = await request.json();
      const blog = await getBlogClient();
      const entity = await blog[entityType].create(body);
      return NextResponse.json({ [entityKey]: entity }, { status: 201 });
    } catch (error) {
      return createErrorResponse(error, `Failed to create ${entityKey}`);
    }
  };
}

/**
 * Create a generic update handler for any entity type
 */
function createGenericUpdateHandler(
  getBlogClient: () => Promise<any>,
  checkAuth: (request: NextRequest) => Promise<boolean>,
  entityType: string,
  entityKey: string
): (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => Promise<NextResponse> {
  return async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): Promise<NextResponse> {
    try {
      const authError = await requireAuthorization(request, checkAuth);
      if (authError) return authError;

      const { id } = await params;
      const body = await request.json();
      const blog = await getBlogClient();
      const entity = await blog[entityType].update(id, body);
      return NextResponse.json({ [entityKey]: entity });
    } catch (error) {
      return createErrorResponse(error, `Failed to update ${entityKey}`);
    }
  };
}

/**
 * Create a generic delete handler for any entity type
 */
function createGenericDeleteHandler(
  getBlogClient: () => Promise<any>,
  checkAuth: (request: NextRequest) => Promise<boolean>,
  entityType: string,
  entityKey: string
): (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => Promise<NextResponse> {
  return async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): Promise<NextResponse> {
    try {
      const authError = await requireAuthorization(request, checkAuth);
      if (authError) return authError;

      const { id } = await params;
      const blog = await getBlogClient();
      await blog[entityType].delete(id);
      return NextResponse.json({ success: true });
    } catch (error) {
      return createErrorResponse(error, `Failed to delete ${entityKey}`);
    }
  };
}

