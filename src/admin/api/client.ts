/**
 * BlogAdminAPIClient
 *
 * Client for making API calls from BlogAdmin component to backend routes.
 * Handles all CRUD operations for posts, categories, and tags.
 */

import type {
  BlogPostRow,
  BlogPostInsert,
  BlogPostUpdate,
  BlogPostListResponse,
  BlogFilterParams,
  CategoryRow,
  CategoryInsert,
  CategoryUpdate,
  TagRow,
  TagInsert,
  TagUpdate,
} from "../../types/database";

export interface APIResponse<T = any> {
  data?: T;
  error?: string;
}

export class BlogAdminAPIClient {
  constructor(private basePath: string = "/api/blog") {}

  // ============================================================================
  // Posts
  // ============================================================================

  /**
   * List all posts with optional filtering and pagination
   */
  async listPosts(params?: BlogFilterParams): Promise<BlogPostListResponse> {
    const query = this.buildQueryParams(params);
    const url = query.toString() ? `${this.basePath}?${query}` : this.basePath;

    const res = await this.makeRequest(url);
    return res.json();
  }

  /**
   * Build URL search params from filter parameters
   */
  private buildQueryParams(params?: BlogFilterParams): URLSearchParams {
    const query = new URLSearchParams();

    if (!params) {
      return query;
    }

    // Add numeric parameters
    if (params.page !== undefined) {
      query.set("page", params.page.toString());
    }
    if (params.pageSize !== undefined) {
      query.set("pageSize", params.pageSize.toString());
    }

    // Add string parameters
    if (params.status) {
      query.set("status", params.status);
    }
    if (params.category) {
      query.set("category", params.category);
    }
    if (params.tag) {
      query.set("tag", params.tag);
    }
    if (params.search) {
      query.set("search", params.search);
    }
    if (params.orderBy) {
      query.set("orderBy", params.orderBy);
    }
    if (params.orderDirection) {
      query.set("orderDirection", params.orderDirection);
    }

    return query;
  }

  /**
   * Get a single post by ID
   */
  async getPost(id: string): Promise<BlogPostRow> {
    const res = await this.makeRequest(`${this.basePath}/${id}`);
    const data = await res.json();
    return data.post || data;
  }

  /**
   * Get a single post by slug
   */
  async getPostBySlug(slug: string): Promise<BlogPostRow> {
    const res = await this.makeRequest(`${this.basePath}/slug/${slug}`);
    const data = await res.json();
    return data.post || data;
  }

  /**
   * Create a new post
   */
  async createPost(post: BlogPostInsert): Promise<BlogPostRow> {
    const res = await this.makeRequest(this.basePath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

    const data = await res.json();
    return data.post || data;
  }

  /**
   * Update an existing post
   */
  async updatePost(id: string, updates: BlogPostUpdate): Promise<BlogPostRow> {
    const res = await this.makeRequest(`${this.basePath}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const data = await res.json();
    return data.post || data;
  }

  /**
   * Make an HTTP request with error handling
   */
  private async makeRequest(url: string, init?: RequestInit): Promise<Response> {
    const res = await fetch(url, init);

    if (!res.ok) {
      let errorMessage = res.statusText;
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // Use default error message if JSON parsing fails
      }
      throw new Error(`Request failed: ${errorMessage}`);
    }

    return res;
  }

  /**
   * Delete a post
   */
  async deletePost(id: string): Promise<void> {
    await this.makeRequest(`${this.basePath}/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Publish a post
   */
  async publishPost(id: string): Promise<BlogPostRow> {
    const res = await this.makeRequest(`${this.basePath}/${id}/publish`, {
      method: "POST",
    });
    const data = await res.json();
    return data.post || data;
  }

  // ============================================================================
  // Categories
  // ============================================================================

  /**
   * List all categories
   */
  async listCategories(): Promise<CategoryRow[]> {
    const res = await this.makeRequest(`${this.basePath}/categories`);
    const data = await res.json();
    return data.categories || data;
  }

  /**
   * Get a single category by ID
   */
  async getCategory(id: string): Promise<CategoryRow> {
    const res = await this.makeRequest(`${this.basePath}/categories/${id}`);
    const data = await res.json();
    return data.category || data;
  }

  /**
   * Create a new category
   */
  async createCategory(category: CategoryInsert): Promise<CategoryRow> {
    const res = await this.makeRequest(`${this.basePath}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    const data = await res.json();
    return data.category || data;
  }

  /**
   * Update an existing category
   */
  async updateCategory(id: string, updates: CategoryUpdate): Promise<CategoryRow> {
    const res = await this.makeRequest(`${this.basePath}/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    return data.category || data;
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<void> {
    await this.makeRequest(`${this.basePath}/categories/${id}`, {
      method: "DELETE",
    });
  }

  // ============================================================================
  // Tags
  // ============================================================================

  /**
   * List all tags
   */
  async listTags(): Promise<TagRow[]> {
    const res = await this.makeRequest(`${this.basePath}/tags`);
    const data = await res.json();
    return data.tags || data;
  }

  /**
   * Get a single tag by ID
   */
  async getTag(id: string): Promise<TagRow> {
    const res = await this.makeRequest(`${this.basePath}/tags/${id}`);
    const data = await res.json();
    return data.tag || data;
  }

  /**
   * Create a new tag
   */
  async createTag(tag: TagInsert): Promise<TagRow> {
    const res = await this.makeRequest(`${this.basePath}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tag),
    });
    const data = await res.json();
    return data.tag || data;
  }

  /**
   * Update an existing tag
   */
  async updateTag(id: string, updates: TagUpdate): Promise<TagRow> {
    const res = await this.makeRequest(`${this.basePath}/tags/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    return data.tag || data;
  }

  /**
   * Delete a tag
   */
  async deleteTag(id: string): Promise<void> {
    await this.makeRequest(`${this.basePath}/tags/${id}`, {
      method: "DELETE",
    });
  }
}
