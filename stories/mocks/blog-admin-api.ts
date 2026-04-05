/**
 * Mock API Client for BlogAdmin Storybook
 */

import type {
  BlogPostRow,
  BlogPostInsert,
  BlogPostUpdate,
  BlogFilterParams,
  BlogPostListResponse,
  CategoryRow,
  CategoryInsert,
  TagRow,
  TagInsert,
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

const mockCategories: CategoryRow[] = [
  {
    id: "cat-1",
    name: "Tutorials",
    slug: "tutorials",
    icon: "📚",
    description: "Step-by-step guides and tutorials",
    color: "#3b82f6",
    created_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: "cat-2",
    name: "Advanced",
    slug: "advanced",
    icon: "🚀",
    description: "Advanced topics and techniques",
    color: "#8b5cf6",
    created_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: "cat-3",
    name: "News",
    slug: "news",
    icon: "📰",
    description: "Latest news and updates",
    color: "#10b981",
    created_at: new Date("2024-01-01").toISOString(),
  },
];

const mockTags: TagRow[] = [
  {
    id: "tag-1",
    name: "react",
    slug: "react",
    color: "#61dafb",
    created_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: "tag-2",
    name: "typescript",
    slug: "typescript",
    color: "#3178c6",
    created_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: "tag-3",
    name: "javascript",
    slug: "javascript",
    color: "#f7df1e",
    created_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: "tag-4",
    name: "web development",
    slug: "web-development",
    color: "#06b6d4",
    created_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: "tag-5",
    name: "patterns",
    slug: "patterns",
    color: "#ec4899",
    created_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: "tag-6",
    name: "architecture",
    slug: "architecture",
    color: "#f59e0b",
    created_at: new Date("2024-01-01").toISOString(),
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

  // Categories
  async listCategories(): Promise<CategoryRow[]> {
    await this.delay();
    return [...categories];
  }

  async createCategory(category: CategoryInsert): Promise<CategoryRow> {
    await this.delay();
    const newCategory: CategoryRow = {
      id: `cat-${Date.now()}`,
      ...category,
      created_at: new Date().toISOString(),
    };
    categories.push(newCategory);
    return newCategory;
  }

  // Tags
  async listTags(): Promise<TagRow[]> {
    await this.delay();
    return [...tags];
  }

  async createTag(tag: TagInsert): Promise<TagRow> {
    await this.delay();
    const newTag: TagRow = {
      id: `tag-${Date.now()}`,
      ...tag,
      created_at: new Date().toISOString(),
    };
    tags.push(newTag);
    return newTag;
  }
}
