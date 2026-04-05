/**
 * Mock data for Storybook stories
 */

import type { BlogPostRow, LayoutSection } from "../src/types";
import type { CategoryWithCount, TagWithCount } from "../src/public/types";

// Sample layout sections
const sampleSections: LayoutSection[] = [
  {
    id: "intro",
    type: "1-column",
    columns: [
      [
        {
          id: "intro-text",
          type: "text",
          content:
            "# Introduction\n\nThis is a sample blog post demonstrating the Blog component with **rich content** and *markdown support*. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
      ],
    ],
  },
  {
    id: "content",
    type: "2-columns",
    columns: [
      [
        {
          id: "left",
          type: "text",
          content:
            "## Key Points\n\n- First important point\n- Second key takeaway\n- Third essential detail\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
      ],
      [
        {
          id: "right",
          type: "text",
          content:
            "## Analysis\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
      ],
    ],
  },
];

// Sample blog posts
export const mockPosts: BlogPostRow[] = [
  {
    id: "1",
    title: "Getting Started with React 19",
    slug: "getting-started-react-19",
    excerpt:
      "Learn about the new features and improvements in React 19, including the new compiler and server components.",
    featured_image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    sections: sampleSections,
    seo_metadata: null,
    author_info: {
      name: "Marie Dubois",
      email: "marie@example.com",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    status: "published",
    category: "React",
    tags: ["react", "javascript", "frontend"],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    published_at: "2024-01-15T10:00:00Z",
    created_by: "user-1",
  },
  {
    id: "2",
    title: "TypeScript Best Practices for 2024",
    slug: "typescript-best-practices-2024",
    excerpt:
      "Discover the latest TypeScript patterns and best practices to write safer, more maintainable code.",
    featured_image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    sections: sampleSections,
    seo_metadata: null,
    author_info: {
      name: "Pierre Martin",
      email: "pierre@example.com",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    status: "published",
    category: "TypeScript",
    tags: ["typescript", "javascript", "best-practices"],
    created_at: "2024-01-14T09:00:00Z",
    updated_at: "2024-01-14T09:00:00Z",
    published_at: "2024-01-14T09:00:00Z",
    created_by: "user-2",
  },
  {
    id: "3",
    title: "Building Scalable Next.js Applications",
    slug: "building-scalable-nextjs-apps",
    excerpt:
      "A comprehensive guide to architecting large-scale Next.js applications with performance in mind.",
    featured_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    sections: sampleSections,
    seo_metadata: null,
    author_info: {
      name: "Sophie Laurent",
      email: "sophie@example.com",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    status: "published",
    category: "Next.js",
    tags: ["nextjs", "react", "performance"],
    created_at: "2024-01-13T08:00:00Z",
    updated_at: "2024-01-13T08:00:00Z",
    published_at: "2024-01-13T08:00:00Z",
    created_by: "user-3",
  },
  {
    id: "4",
    title: "Mastering CSS Grid and Flexbox",
    slug: "mastering-css-grid-flexbox",
    excerpt:
      "Deep dive into modern CSS layout techniques with practical examples and use cases.",
    featured_image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800",
    sections: sampleSections,
    seo_metadata: null,
    author_info: {
      name: "Luc Bernard",
      email: "luc@example.com",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    status: "published",
    category: "CSS",
    tags: ["css", "layout", "design"],
    created_at: "2024-01-12T07:00:00Z",
    updated_at: "2024-01-12T07:00:00Z",
    published_at: "2024-01-12T07:00:00Z",
    created_by: "user-4",
  },
  {
    id: "5",
    title: "Node.js Performance Optimization Tips",
    slug: "nodejs-performance-tips",
    excerpt:
      "Proven strategies to optimize your Node.js applications for better performance and scalability.",
    featured_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    sections: sampleSections,
    seo_metadata: null,
    author_info: {
      name: "Amélie Rousseau",
      email: "amelie@example.com",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    status: "published",
    category: "Node.js",
    tags: ["nodejs", "backend", "performance"],
    created_at: "2024-01-11T06:00:00Z",
    updated_at: "2024-01-11T06:00:00Z",
    published_at: "2024-01-11T06:00:00Z",
    created_by: "user-5",
  },
  {
    id: "6",
    title: "Introduction to Web Accessibility",
    slug: "intro-web-accessibility",
    excerpt:
      "Make your web applications accessible to everyone with these essential WCAG guidelines.",
    featured_image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800",
    sections: sampleSections,
    seo_metadata: null,
    author_info: {
      name: "Thomas Leroy",
      email: "thomas@example.com",
      avatar: "https://i.pravatar.cc/150?img=6",
    },
    status: "published",
    category: "Accessibility",
    tags: ["a11y", "wcag", "ux"],
    created_at: "2024-01-10T05:00:00Z",
    updated_at: "2024-01-10T05:00:00Z",
    published_at: "2024-01-10T05:00:00Z",
    created_by: "user-6",
  },
  {
    id: "7",
    title: "Testing React Components with Vitest",
    slug: "testing-react-vitest",
    excerpt:
      "Learn how to write effective tests for your React components using Vitest and Testing Library.",
    featured_image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800",
    sections: sampleSections,
    seo_metadata: null,
    author_info: {
      name: "Camille Moreau",
      email: "camille@example.com",
      avatar: "https://i.pravatar.cc/150?img=7",
    },
    status: "published",
    category: "Testing",
    tags: ["testing", "react", "vitest"],
    created_at: "2024-01-09T04:00:00Z",
    updated_at: "2024-01-09T04:00:00Z",
    published_at: "2024-01-09T04:00:00Z",
    created_by: "user-7",
  },
  {
    id: "8",
    title: "GraphQL vs REST: Choosing the Right API",
    slug: "graphql-vs-rest",
    excerpt:
      "Compare GraphQL and REST APIs to make informed decisions for your next project.",
    featured_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    sections: sampleSections,
    seo_metadata: null,
    author_info: {
      name: "Nicolas Petit",
      email: "nicolas@example.com",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    status: "published",
    category: "APIs",
    tags: ["graphql", "rest", "api"],
    created_at: "2024-01-08T03:00:00Z",
    updated_at: "2024-01-08T03:00:00Z",
    published_at: "2024-01-08T03:00:00Z",
    created_by: "user-8",
  },
  {
    id: "9",
    title: "Docker for Frontend Developers",
    slug: "docker-frontend-developers",
    excerpt:
      "A beginner-friendly introduction to Docker for frontend development workflows.",
    featured_image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800",
    sections: sampleSections,
    seo_metadata: null,
    author_info: {
      name: "Isabelle Garcia",
      email: "isabelle@example.com",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    status: "published",
    category: "DevOps",
    tags: ["docker", "devops", "containers"],
    created_at: "2024-01-07T02:00:00Z",
    updated_at: "2024-01-07T02:00:00Z",
    published_at: "2024-01-07T02:00:00Z",
    created_by: "user-9",
  },
];

// Sample categories
export const mockCategories: CategoryWithCount[] = [
  { name: "React", count: 5 },
  { name: "TypeScript", count: 3 },
  { name: "Next.js", count: 4 },
  { name: "CSS", count: 2 },
  { name: "Node.js", count: 3 },
  { name: "Accessibility", count: 1 },
  { name: "Testing", count: 2 },
  { name: "APIs", count: 2 },
  { name: "DevOps", count: 1 },
];

// Sample tags
export const mockTags: TagWithCount[] = [
  { name: "react", count: 8 },
  { name: "javascript", count: 6 },
  { name: "typescript", count: 5 },
  { name: "frontend", count: 7 },
  { name: "backend", count: 3 },
  { name: "performance", count: 4 },
  { name: "best-practices", count: 3 },
  { name: "nextjs", count: 4 },
  { name: "testing", count: 3 },
  { name: "css", count: 2 },
  { name: "layout", count: 2 },
  { name: "design", count: 2 },
  { name: "a11y", count: 1 },
  { name: "wcag", count: 1 },
  { name: "ux", count: 2 },
  { name: "graphql", count: 1 },
  { name: "rest", count: 1 },
  { name: "api", count: 2 },
  { name: "docker", count: 1 },
  { name: "devops", count: 1 },
];

// Mock API client for Storybook
export const mockApiClient = {
  posts: {
    list: async (params: any) => {
      const { page = 1, pageSize = 10, category, tag, search } = params;

      let filteredPosts = [...mockPosts];

      if (category) {
        filteredPosts = filteredPosts.filter((p) => p.category === category);
      }

      if (tag) {
        filteredPosts = filteredPosts.filter((p) => p.tags.includes(tag));
      }

      if (search) {
        const query = search.toLowerCase();
        filteredPosts = filteredPosts.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.excerpt?.toLowerCase().includes(query)
        );
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedPosts = filteredPosts.slice(start, end);

      return {
        posts: paginatedPosts,
        total: filteredPosts.length,
        page,
        pageSize,
        hasMore: end < filteredPosts.length,
      };
    },
    getBySlug: async (slug: string) => {
      return mockPosts.find((p) => p.slug === slug) || null;
    },
    getById: async (id: string) => {
      return mockPosts.find((p) => p.id === id) || null;
    },
    getRelated: async (postId: string, limit: number = 3) => {
      const post = mockPosts.find((p) => p.id === postId);
      if (!post) return [];

      return mockPosts
        .filter((p) => p.id !== postId && p.category === post.category)
        .slice(0, limit);
    },
  },
  categories: {
    listWithCounts: async () => mockCategories,
  },
  tags: {
    listWithCounts: async () => mockTags,
  },
};
