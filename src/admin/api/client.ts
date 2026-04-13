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

import type {
  GenerateCompleteBlogRequest,
  GenerateCompleteBlogResponse,
  GenerateLayoutRequest,
  GenerateLayoutResponse,
  GenerateSectionRequest,
  GenerateSectionResponse,
  GenerateSEORequest,
  GenerateSEOResponse,
  ImproveContentRequest,
  ImproveContentResponse,
} from "../../types/aiGeneration";

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

    // Define parameter mappings for cleaner code
    const paramMappings: Array<[keyof BlogFilterParams, string?]> = [
      ["page", undefined],
      ["pageSize", undefined],
      ["status", undefined],
      ["category", undefined],
      ["tag", undefined],
      ["search", undefined],
      ["orderBy", undefined],
      ["orderDirection", undefined],
    ];

    // Add each parameter if it exists
    for (const [key, mappedKey] of paramMappings) {
      const value = params[key];
      if (value !== undefined) {
        const paramName = mappedKey || key;
        query.set(paramName, String(value));
      }
    }

    return query;
  }

  /**
   * Get a single post by ID
   */
  async getPost(id: string): Promise<BlogPostRow> {
    const res = await this.makeRequest(`${this.basePath}/${id}`);
    return this.extractDataFromResponse(await res.json(), "post");
  }

  /**
   * Get a single post by slug
   */
  async getPostBySlug(slug: string): Promise<BlogPostRow> {
    const res = await this.makeRequest(`${this.basePath}/slug/${slug}`);
    return this.extractDataFromResponse(await res.json(), "post");
  }

  /**
   * Extract data from API response
   */
  private extractDataFromResponse<T>(data: any, key: string): T {
    return data[key] || data;
  }

  /**
   * Create a new post
   */
  async createPost(post: BlogPostInsert): Promise<BlogPostRow> {
    const res = await this.makeJsonRequest(this.basePath, "POST", post);
    return this.extractDataFromResponse(await res.json(), "post");
  }

  /**
   * Update an existing post
   */
  async updatePost(id: string, updates: BlogPostUpdate): Promise<BlogPostRow> {
    const res = await this.makeJsonRequest(`${this.basePath}/${id}`, "PATCH", updates);
    return this.extractDataFromResponse(await res.json(), "post");
  }

  /**
   * Make a JSON request with proper headers
   */
  private async makeJsonRequest(
    url: string,
    method: string,
    body?: any
  ): Promise<Response> {
    return this.makeRequest(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
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
    return this.extractDataFromResponse(await res.json(), "post");
  }

  // ============================================================================
  // Categories
  // ============================================================================

  /**
   * List all categories
   */
  async listCategories(): Promise<CategoryRow[]> {
    return this.listEntities<CategoryRow>("categories");
  }

  /**
   * Get a single category by ID
   */
  async getCategory(id: string): Promise<CategoryRow> {
    return this.getEntity<CategoryRow>("categories", id, "category");
  }

  /**
   * Create a new category
   */
  async createCategory(category: CategoryInsert): Promise<CategoryRow> {
    return this.createEntity<CategoryRow>("categories", category, "category");
  }

  /**
   * Update an existing category
   */
  async updateCategory(id: string, updates: CategoryUpdate): Promise<CategoryRow> {
    return this.updateEntity<CategoryRow>("categories", id, updates, "category");
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<void> {
    return this.deleteEntity("categories", id);
  }

  // ============================================================================
  // Tags
  // ============================================================================

  /**
   * List all tags
   */
  async listTags(): Promise<TagRow[]> {
    return this.listEntities<TagRow>("tags");
  }

  /**
   * Get a single tag by ID
   */
  async getTag(id: string): Promise<TagRow> {
    return this.getEntity<TagRow>("tags", id, "tag");
  }

  /**
   * Create a new tag
   */
  async createTag(tag: TagInsert): Promise<TagRow> {
    return this.createEntity<TagRow>("tags", tag, "tag");
  }

  /**
   * Update an existing tag
   */
  async updateTag(id: string, updates: TagUpdate): Promise<TagRow> {
    return this.updateEntity<TagRow>("tags", id, updates, "tag");
  }

  /**
   * Delete a tag
   */
  async deleteTag(id: string): Promise<void> {
    return this.deleteEntity("tags", id);
  }

  // ============================================================================
  // Generic CRUD Operations
  // ============================================================================

  /**
   * List all entities of a given type
   */
  private async listEntities<T>(entityType: string): Promise<T[]> {
    const res = await this.makeRequest(`${this.basePath}/${entityType}`);
    return this.extractDataFromResponse(await res.json(), entityType);
  }

  /**
   * Get a single entity by ID
   */
  private async getEntity<T>(
    entityType: string,
    id: string,
    responseKey: string
  ): Promise<T> {
    const res = await this.makeRequest(`${this.basePath}/${entityType}/${id}`);
    return this.extractDataFromResponse(await res.json(), responseKey);
  }

  /**
   * Create a new entity
   */
  private async createEntity<T>(
    entityType: string,
    data: any,
    responseKey: string
  ): Promise<T> {
    const res = await this.makeJsonRequest(
      `${this.basePath}/${entityType}`,
      "POST",
      data
    );
    return this.extractDataFromResponse(await res.json(), responseKey);
  }

  /**
   * Update an existing entity
   */
  private async updateEntity<T>(
    entityType: string,
    id: string,
    updates: any,
    responseKey: string
  ): Promise<T> {
    const res = await this.makeJsonRequest(
      `${this.basePath}/${entityType}/${id}`,
      "PATCH",
      updates
    );
    return this.extractDataFromResponse(await res.json(), responseKey);
  }

  /**
   * Delete an entity
   */
  private async deleteEntity(entityType: string, id: string): Promise<void> {
    await this.makeRequest(`${this.basePath}/${entityType}/${id}`, {
      method: "DELETE",
    });
  }

  // ============================================================================
  // AI Generation
  // ============================================================================

  /**
   * Generate blog post layout structure only (Step 1 of two-step generation)
   */
  async generateLayout(
    request: GenerateLayoutRequest
  ): Promise<GenerateLayoutResponse> {
    return this.makeAIGenerationRequest<GenerateLayoutResponse>("layout", request);
  }

  /**
   * Generate a single section with specific layout using AI
   */
  async generateSection(
    request: GenerateSectionRequest
  ): Promise<GenerateSectionResponse> {
    return this.makeAIGenerationRequest<GenerateSectionResponse>("section", request);
  }

  /**
   * Generate SEO metadata for a blog post using AI
   */
  async generateSEO(
    request: GenerateSEORequest
  ): Promise<GenerateSEOResponse> {
    return this.makeAIGenerationRequest<GenerateSEOResponse>("seo", request);
  }

  /**
   * Improve existing content using AI
   */
  async improveContent(
    request: ImproveContentRequest
  ): Promise<ImproveContentResponse> {
    return this.makeAIGenerationRequest<ImproveContentResponse>("improve", request);
  }

  /**
   * Make an AI generation request
   */
  private async makeAIGenerationRequest<T>(
    endpoint: string,
    request: any
  ): Promise<T> {
    const res = await this.makeJsonRequest(
      `${this.basePath}/generate/${endpoint}`,
      "POST",
      request
    );
    return res.json();
  }
}
