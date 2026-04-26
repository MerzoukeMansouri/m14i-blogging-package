/**
 * Mock API Client for BlogAdmin Storybook
 */

import type {
  BlogPostRow,
  BlogPostInsert,
  BlogPostUpdate,
  BlogFilterParams,
  BlogPostListResponse,
  BlogCategory,
  BlogTag,
} from "../../src/types/database";

// Mock data
const mockPosts: BlogPostRow[] = [
  {
    id: "post-1",
    title: "Getting Started with React",
    slug: "getting-started-with-react",
    excerpt: "Learn the basics of React in this comprehensive guide",
    featured_image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    sections: [
      {
        id: "section-1",
        type: "single-column",
        columns: [
          [
            {
              id: "block-1",
              type: "text",
              content: "# Getting Started with React\n\nReact is a powerful JavaScript library for building user interfaces.",
            },
          ],
        ],
      },
    ],
    category: "Tutorials",
    tags: ["react", "javascript", "web development"],
    status: "published",
    seo_metadata: {
      metaTitle: "Getting Started with React - Complete Guide",
      metaDescription: "Learn React from scratch with our comprehensive tutorial",
    },
    author_info: {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
    },
    created_at: new Date("2024-01-15").toISOString(),
    updated_at: new Date("2024-01-15").toISOString(),
    published_at: new Date("2024-01-15").toISOString(),
    created_by: "user-1",
  },
  {
    id: "post-2",
    title: "Advanced TypeScript Patterns",
    slug: "advanced-typescript-patterns",
    excerpt: "Explore advanced TypeScript patterns and best practices",
    featured_image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    sections: [],
    category: "Advanced",
    tags: ["typescript", "patterns"],
    status: "published",
    seo_metadata: {},
    author_info: {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
    },
    created_at: new Date("2024-01-10").toISOString(),
    updated_at: new Date("2024-01-10").toISOString(),
    published_at: new Date("2024-01-10").toISOString(),
    created_by: "user-1",
  },
  {
    id: "post-3",
    title: "Building Modern Web Apps",
    slug: "building-modern-web-apps",
    excerpt: "A guide to building modern, scalable web applications",
    featured_image: null,
    sections: [],
    category: "Tutorials",
    tags: ["web development", "architecture"],
    status: "draft",
    seo_metadata: {},
    author_info: {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
    },
    created_at: new Date("2024-01-20").toISOString(),
    updated_at: new Date("2024-01-20").toISOString(),
    published_at: null,
    created_by: "user-1",
  },
];

const mockCategories: BlogCategory[] = [
  {
    name: "Tutorials",
    slug: "tutorials",
    postCount: 2,
  },
  {
    name: "Advanced",
    slug: "advanced",
    postCount: 1,
  },
  {
    name: "News",
    slug: "news",
    postCount: 0,
  },
];

const mockTags: BlogTag[] = [
  {
    name: "react",
    slug: "react",
    postCount: 2,
  },
  {
    name: "typescript",
    slug: "typescript",
    postCount: 1,
  },
  {
    name: "javascript",
    slug: "javascript",
    postCount: 2,
  },
  {
    name: "web development",
    slug: "web-development",
    postCount: 2,
  },
  {
    name: "patterns",
    slug: "patterns",
    postCount: 1,
  },
  {
    name: "architecture",
    slug: "architecture",
    postCount: 1,
  },
];

// State
let posts = [...mockPosts];
let categories = [...mockCategories];
let tags = [...mockTags];

// Mock API Client
export class MockBlogAdminAPIClient {
  private readonly basePath: string;
  private readonly simulatedDelay: number = 200;

  constructor(basePath: string = "/api/blog") {
    this.basePath = basePath;
  }

  /**
   * Simulate network delay for realistic behavior
   */
  private async delay(ms: number = this.simulatedDelay): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Posts
  async listPosts(params?: BlogFilterParams): Promise<BlogPostListResponse> {
    await this.delay();

    let filtered = [...posts];

    // Apply filters
    filtered = this.applyPostFilters(filtered, params);

    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      posts: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
    };
  }

  /**
   * Apply filters to posts list
   */
  private applyPostFilters(
    posts: BlogPostRow[],
    params?: BlogFilterParams
  ): BlogPostRow[] {
    if (!params) {
      return posts;
    }

    let filtered = posts;

    // Filter by status
    if (params.status) {
      filtered = filtered.filter((p) => p.status === params.status);
    }

    // Filter by category
    if (params.category) {
      filtered = filtered.filter((p) => p.category === params.category);
    }

    // Filter by tags
    if (params.tags && params.tags.length > 0) {
      filtered = filtered.filter((p) =>
        params.tags!.some((tag) => p.tags?.includes(tag))
      );
    }

    // Search
    if (params.search) {
      const query = params.search.toLowerCase();
      filtered = filtered.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(query);
        const excerptMatch = p.excerpt?.toLowerCase().includes(query) || false;
        return titleMatch || excerptMatch;
      });
    }

    return filtered;
  }

  async getPost(id: string): Promise<BlogPostRow> {
    await this.delay();

    const post = posts.find((p) => p.id === id);
    if (!post) {
      throw new Error("Post not found");
    }

    return post;
  }

  async getPostBySlug(slug: string): Promise<BlogPostRow> {
    await this.delay();

    const post = posts.find((p) => p.slug === slug);
    if (!post) {
      throw new Error("Post not found");
    }

    return post;
  }

  async createPost(post: BlogPostInsert): Promise<BlogPostRow> {
    await this.delay();

    const now = new Date().toISOString();
    const newPost: BlogPostRow = {
      id: `post-${Date.now()}`,
      ...post,
      author_info: {
        id: post.created_by || "user-1",
        name: "John Doe",
        email: "john@example.com",
      },
      created_at: now,
      updated_at: now,
      published_at: post.status === "published" ? now : null,
    };

    posts.unshift(newPost);
    return newPost;
  }

  async updatePost(id: string, updates: BlogPostUpdate): Promise<BlogPostRow> {
    await this.delay();

    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Post not found");
    }

    posts[index] = {
      ...posts[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return posts[index];
  }

  async deletePost(id: string): Promise<void> {
    await this.delay();
    posts = posts.filter((p) => p.id !== id);
  }

  async publishPost(id: string): Promise<BlogPostRow> {
    await this.delay();

    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Post not found");
    }

    const now = new Date().toISOString();
    posts[index] = {
      ...posts[index],
      status: "published",
      published_at: now,
      updated_at: now,
    };

    return posts[index];
  }

  // Categories & Tags (derived from posts)
  async listCategories(): Promise<BlogCategory[]> {
    await this.delay();
    return [...categories];
  }

  async listTags(): Promise<BlogTag[]> {
    await this.delay();
    return [...tags];
  }

  async getStats() {
    await this.delay();
    return {
      totalPosts: posts.length,
      publishedPosts: posts.filter((p) => p.status === "published").length,
      draftPosts: posts.filter((p) => p.status === "draft").length,
      archivedPosts: posts.filter((p) => p.status === "archived").length,
      categoryCounts: categories.reduce((acc, c) => ({ ...acc, [c.name]: c.postCount }), {}),
      tagCounts: tags.reduce((acc, t) => ({ ...acc, [t.name]: t.postCount }), {}),
    };
  }
}
