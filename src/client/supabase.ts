/**
 * Supabase Data Access Layer for m14i-blogging
 *
 * Provides pre-built CRUD operations for blog posts and media.
 * Works with the blog_posts and blog_media tables.
 *
 * @example
 * ```typescript
 * import { createBlogClient } from 'm14i-blogging/client';
 * import { createClient } from '@supabase/supabase-js';
 *
 * const supabase = createClient(url, key);
 * const blog = createBlogClient(supabase);
 *
 * // Use it
 * const posts = await blog.posts.list({ status: 'published' });
 * const post = await blog.posts.getBySlug('my-post');
 * ```
 */

import type {
  BlogPostRow,
  BlogPostInsert,
  BlogPostUpdate,
  BlogPostWithAuthor,
  BlogFilterParams,
  BlogPostListResponse,
  BlogMediaRow,
  BlogMediaInsert,
  BlogMediaUpdate,
  BlogStats,
  BlogCategory,
  BlogTag,
} from "../types/database";

// ============================================================================
// Supabase Client Type
// ============================================================================

export interface SupabaseClient {
  from(table: string): {
    select(query: string, options?: { count?: string }): any;
    insert(data: any): any;
    update(data: any): any;
    delete(): any;
    upsert(data: any): any;
  };
  rpc(functionName: string, params?: any): any;
}

// ============================================================================
// Configuration
// ============================================================================

export interface BlogClientConfig {
  /**
   * Table name for blog posts (default: "blog_posts")
   */
  postsTable?: string;
  /**
   * Table name for blog media (default: "blog_media")
   */
  mediaTable?: string;
  /**
   * Enable/disable author joins (default: true)
   */
  includeAuthor?: boolean;
  /**
   * Users table name for author joins (default: "users")
   */
  usersTable?: string;
}

const DEFAULT_CONFIG: Required<BlogClientConfig> = {
  postsTable: "blog_posts",
  mediaTable: "blog_media",
  includeAuthor: true,
  usersTable: "users",
};

// ============================================================================
// Blog Client Factory
// ============================================================================

/**
 * Creates a blog client with pre-built CRUD operations
 */
export function createBlogClient(
  supabase: SupabaseClient,
  config: BlogClientConfig = {}
) {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  return {
    /**
     * Blog post operations
     */
    posts: {
      /**
       * List blog posts with filtering and pagination
       */
      async list(
        params: BlogFilterParams = {}
      ): Promise<BlogPostListResponse> {
        const {
          page = 1,
          pageSize = 10,
          status,
          category,
          tag,
          search,
          orderBy = "created_at",
          orderDirection = "desc",
        } = params;

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = supabase
          .from(cfg.postsTable)
          .select(
            cfg.includeAuthor
              ? `
              *,
              author:${cfg.usersTable}!created_by(full_name, email, avatar_url)
            `
              : "*",
            { count: "exact" }
          )
          .range(from, to)
          .order(orderBy, { ascending: orderDirection === "asc" });

        if (status) {
          query = query.eq("status", status);
        }

        if (category) {
          query = query.eq("category", category);
        }

        if (tag) {
          query = query.contains("tags", [tag]);
        }

        if (search) {
          query = query.or(
            `title.ilike.%${search}%,excerpt.ilike.%${search}%,category.ilike.%${search}%`
          );
        }

        const { data, error, count } = await query;

        if (error) {
          throw new Error(`Failed to fetch blog posts: ${error.message}`);
        }

        return {
          posts: (data as unknown as BlogPostWithAuthor[]) || [],
          total: count || 0,
          page,
          pageSize,
          totalPages: Math.ceil((count || 0) / pageSize),
        };
      },

      /**
       * Get a single post by slug
       */
      async getBySlug(slug: string): Promise<BlogPostWithAuthor | null> {
        const { data, error } = await supabase
          .from(cfg.postsTable)
          .select(
            cfg.includeAuthor
              ? `
              *,
              author:${cfg.usersTable}!created_by(full_name, email, avatar_url)
            `
              : "*"
          )
          .eq("slug", slug)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            // Not found
            return null;
          }
          throw new Error(`Failed to fetch blog post: ${error.message}`);
        }

        return data as unknown as BlogPostWithAuthor;
      },

      /**
       * Get a single post by ID
       */
      async getById(id: string): Promise<BlogPostRow | null> {
        const { data, error} = await supabase
          .from(cfg.postsTable)
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            return null;
          }
          throw new Error(`Failed to fetch blog post: ${error.message}`);
        }

        return data as unknown as BlogPostRow;
      },

      /**
       * Create a new blog post
       */
      async create(post: BlogPostInsert): Promise<BlogPostRow> {
        const { data, error } = await supabase
          .from(cfg.postsTable)
          .insert(post)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to create blog post: ${error.message}`);
        }

        return data as unknown as BlogPostRow;
      },

      /**
       * Update an existing blog post
       */
      async update(
        id: string,
        updates: BlogPostUpdate
      ): Promise<BlogPostRow> {
        const { data, error } = await supabase
          .from(cfg.postsTable)
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to update blog post: ${error.message}`);
        }

        return data as unknown as BlogPostRow;
      },

      /**
       * Delete a blog post
       */
      async delete(id: string): Promise<void> {
        const { error } = await supabase
          .from(cfg.postsTable)
          .delete()
          .eq("id", id);

        if (error) {
          throw new Error(`Failed to delete blog post: ${error.message}`);
        }
      },

      /**
       * Publish a draft post
       */
      async publish(id: string): Promise<BlogPostRow> {
        return this.update(id, { status: "published" });
      },

      /**
       * Unpublish (archive) a post
       */
      async archive(id: string): Promise<BlogPostRow> {
        return this.update(id, { status: "archived" });
      },

      /**
       * Search posts using full-text search
       */
      async search(query: string, limit: number = 10): Promise<BlogPostRow[]> {
        const { data, error } = await supabase
          .rpc("blog_search_posts", { search_query: query })
          .limit(limit);

        if (error) {
          throw new Error(`Failed to search blog posts: ${error.message}`);
        }

        return (data as unknown as BlogPostRow[]) || [];
      },

      /**
       * Get posts by tag
       */
      async getByTag(tag: string, limit: number = 10): Promise<BlogPostRow[]> {
        const { data, error } = await supabase
          .rpc("blog_get_posts_by_tag", { tag_name: tag })
          .limit(limit);

        if (error) {
          throw new Error(`Failed to get posts by tag: ${error.message}`);
        }

        return (data as unknown as BlogPostRow[]) || [];
      },

      /**
       * Get posts by category
       */
      async getByCategory(
        category: string,
        limit: number = 10
      ): Promise<BlogPostRow[]> {
        const { data, error } = await supabase
          .rpc("blog_get_posts_by_category", { category_name: category })
          .limit(limit);

        if (error) {
          throw new Error(
            `Failed to get posts by category: ${error.message}`
          );
        }

        return (data as unknown as BlogPostRow[]) || [];
      },

      /**
       * Get related posts (by tags and category)
       */
      async getRelated(postId: string, limit: number = 3): Promise<BlogPostRow[]> {
        const post = await this.getById(postId);
        if (!post) return [];

        const { data, error } = await supabase
          .from(cfg.postsTable)
          .select("*")
          .eq("status", "published")
          .neq("id", postId)
          .or(`category.eq.${post.category},tags.ov.{${post.tags.join(",")}}`)
          .limit(limit);

        if (error) {
          throw new Error(`Failed to get related posts: ${error.message}`);
        }

        return (data as unknown as BlogPostRow[]) || [];
      },
    },

    /**
     * Blog media operations
     */
    media: {
      /**
       * List all media files
       */
      async list(
        type?: string,
        limit: number = 50
      ): Promise<BlogMediaRow[]> {
        let query = supabase
          .from(cfg.mediaTable)
          .select("*")
          .order("uploaded_at", { ascending: false })
          .limit(limit);

        if (type) {
          query = query.eq("type", type);
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(`Failed to fetch blog media: ${error.message}`);
        }

        return (data as unknown as BlogMediaRow[]) || [];
      },

      /**
       * Create new media record
       */
      async create(media: BlogMediaInsert): Promise<BlogMediaRow> {
        const { data, error } = await supabase
          .from(cfg.mediaTable)
          .insert(media)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to create blog media: ${error.message}`);
        }

        return data as unknown as BlogMediaRow;
      },

      /**
       * Update media record
       */
      async update(id: string, updates: BlogMediaUpdate): Promise<BlogMediaRow> {
        const { data, error } = await supabase
          .from(cfg.mediaTable)
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to update blog media: ${error.message}`);
        }

        return data as unknown as BlogMediaRow;
      },

      /**
       * Delete media record
       */
      async delete(id: string): Promise<void> {
        const { error } = await supabase
          .from(cfg.mediaTable)
          .delete()
          .eq("id", id);

        if (error) {
          throw new Error(`Failed to delete blog media: ${error.message}`);
        }
      },
    },

    /**
     * Statistics and analytics
     */
    stats: {
      /**
       * Get blog statistics
       */
      async getStats(): Promise<BlogStats> {
        const { data: posts, error } = await supabase
          .from(cfg.postsTable)
          .select("status, category, tags");

        if (error) {
          throw new Error(`Failed to fetch blog stats: ${error.message}`);
        }

        const stats: BlogStats = {
          totalPosts: posts.length,
          publishedPosts: 0,
          draftPosts: 0,
          archivedPosts: 0,
          categoryCounts: {},
          tagCounts: {},
        };

        posts.forEach((post: any) => {
          if (post.status === "published") stats.publishedPosts++;
          if (post.status === "draft") stats.draftPosts++;
          if (post.status === "archived") stats.archivedPosts++;

          if (post.category) {
            stats.categoryCounts[post.category] =
              (stats.categoryCounts[post.category] || 0) + 1;
          }

          post.tags?.forEach((tag: string) => {
            stats.tagCounts[tag] = (stats.tagCounts[tag] || 0) + 1;
          });
        });

        return stats;
      },

      /**
       * Get all categories with post counts
       */
      async getCategories(): Promise<BlogCategory[]> {
        const { data, error } = await supabase
          .from(cfg.postsTable)
          .select("category")
          .eq("status", "published")
          .not("category", "is", null);

        if (error) {
          throw new Error(`Failed to fetch categories: ${error.message}`);
        }

        const counts: Record<string, number> = {};
        data?.forEach((row: any) => {
          if (row.category) {
            counts[row.category] = (counts[row.category] || 0) + 1;
          }
        });

        return Object.entries(counts).map(([name, postCount]) => ({
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
          postCount,
        }));
      },

      /**
       * Get all tags with post counts
       */
      async getTags(): Promise<BlogTag[]> {
        const { data, error } = await supabase
          .from(cfg.postsTable)
          .select("tags")
          .eq("status", "published");

        if (error) {
          throw new Error(`Failed to fetch tags: ${error.message}`);
        }

        const counts: Record<string, number> = {};
        data?.forEach((row: any) => {
          row.tags?.forEach((tag: string) => {
            counts[tag] = (counts[tag] || 0) + 1;
          });
        });

        return Object.entries(counts)
          .map(([name, postCount]) => ({
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
            postCount,
          }))
          .sort((a, b) => b.postCount - a.postCount);
      },
    },

    /**
     * Category management operations (v0.4.0+)
     */
    categories: {
      /**
       * List all categories
       */
      async list(): Promise<import("../types/database").CategoryRow[]> {
        const { data, error } = await supabase
          .from("blog_categories")
          .select("*")
          .order("display_order", { ascending: true });

        if (error) {
          throw new Error(`Failed to fetch categories: ${error.message}`);
        }

        return (data as unknown as import("../types/database").CategoryRow[]) || [];
      },

      /**
       * List categories with post counts
       */
      async listWithCounts(): Promise<import("../types/database").CategoryWithCount[]> {
        const { data, error } = await supabase
          .rpc("blog.get_categories_with_counts");

        if (error) {
          throw new Error(`Failed to fetch categories with counts: ${error.message}`);
        }

        return (data as unknown as import("../types/database").CategoryWithCount[]) || [];
      },

      /**
       * Get category by ID
       */
      async getById(id: string): Promise<import("../types/database").CategoryRow | null> {
        const { data, error } = await supabase
          .from("blog_categories")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          if (error.code === "PGRST116") return null;
          throw new Error(`Failed to fetch category: ${error.message}`);
        }

        return data as unknown as import("../types/database").CategoryRow;
      },

      /**
       * Get category by slug
       */
      async getBySlug(slug: string): Promise<import("../types/database").CategoryRow | null> {
        const { data, error } = await supabase
          .from("blog_categories")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) {
          if (error.code === "PGRST116") return null;
          throw new Error(`Failed to fetch category: ${error.message}`);
        }

        return data as unknown as import("../types/database").CategoryRow;
      },

      /**
       * Create a new category
       */
      async create(category: import("../types/database").CategoryInsert): Promise<import("../types/database").CategoryRow> {
        const { data, error } = await supabase
          .from("blog_categories")
          .insert(category)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to create category: ${error.message}`);
        }

        return data as unknown as import("../types/database").CategoryRow;
      },

      /**
       * Update an existing category
       */
      async update(id: string, updates: import("../types/database").CategoryUpdate): Promise<import("../types/database").CategoryRow> {
        const { data, error } = await supabase
          .from("blog_categories")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to update category: ${error.message}`);
        }

        return data as unknown as import("../types/database").CategoryRow;
      },

      /**
       * Delete a category
       */
      async delete(id: string): Promise<void> {
        const { error } = await supabase
          .from("blog_categories")
          .delete()
          .eq("id", id);

        if (error) {
          throw new Error(`Failed to delete category: ${error.message}`);
        }
      },
    },

    /**
     * Tag management operations (v0.4.0+)
     */
    tags: {
      /**
       * List all tags
       */
      async list(): Promise<import("../types/database").TagRow[]> {
        const { data, error } = await supabase
          .from("blog_tags")
          .select("*")
          .order("name", { ascending: true });

        if (error) {
          throw new Error(`Failed to fetch tags: ${error.message}`);
        }

        return (data as unknown as import("../types/database").TagRow[]) || [];
      },

      /**
       * List tags with post counts
       */
      async listWithCounts(): Promise<import("../types/database").TagWithCount[]> {
        const { data, error } = await supabase
          .rpc("blog.get_tags_with_counts");

        if (error) {
          throw new Error(`Failed to fetch tags with counts: ${error.message}`);
        }

        return (data as unknown as import("../types/database").TagWithCount[]) || [];
      },

      /**
       * Get tag by ID
       */
      async getById(id: string): Promise<import("../types/database").TagRow | null> {
        const { data, error } = await supabase
          .from("blog_tags")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          if (error.code === "PGRST116") return null;
          throw new Error(`Failed to fetch tag: ${error.message}`);
        }

        return data as unknown as import("../types/database").TagRow;
      },

      /**
       * Get tag by slug
       */
      async getBySlug(slug: string): Promise<import("../types/database").TagRow | null> {
        const { data, error } = await supabase
          .from("blog_tags")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) {
          if (error.code === "PGRST116") return null;
          throw new Error(`Failed to fetch tag: ${error.message}`);
        }

        return data as unknown as import("../types/database").TagRow;
      },

      /**
       * Create a new tag
       */
      async create(tag: import("../types/database").TagInsert): Promise<import("../types/database").TagRow> {
        const { data, error } = await supabase
          .from("blog_tags")
          .insert(tag)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to create tag: ${error.message}`);
        }

        return data as unknown as import("../types/database").TagRow;
      },

      /**
       * Update an existing tag
       */
      async update(id: string, updates: import("../types/database").TagUpdate): Promise<import("../types/database").TagRow> {
        const { data, error } = await supabase
          .from("blog_tags")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to update tag: ${error.message}`);
        }

        return data as unknown as import("../types/database").TagRow;
      },

      /**
       * Delete a tag
       */
      async delete(id: string): Promise<void> {
        const { error } = await supabase
          .from("blog_tags")
          .delete()
          .eq("id", id);

        if (error) {
          throw new Error(`Failed to delete tag: ${error.message}`);
        }
      },
    },
  };
}

/**
 * Type helper to extract the blog client type
 */
export type BlogClient = ReturnType<typeof createBlogClient>;
