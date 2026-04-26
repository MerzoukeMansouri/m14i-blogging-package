import type { Meta, StoryObj } from "@storybook/react";
import { BlogPostList } from "@m14i/blogging-core";
import type { BlogPostRow } from "@m14i/blogging-core";

const samplePosts: BlogPostRow[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    slug: "getting-started-nextjs-15",
    excerpt: "Learn the new features and improvements in Next.js 15, including React Server Components and improved performance.",
    featured_image: "https://picsum.photos/seed/nextjs/400/300",
    category: "Development",
    tags: ["nextjs", "react", "typescript"],
    status: "published",
    sections: [],
    seo_metadata: {},
    author_info: null,
    created_at: "2024-03-15T10:00:00Z",
    updated_at: "2024-03-15T10:00:00Z",
    published_at: "2024-03-15T10:00:00Z",
    created_by: "author-1",
    search_vector: "",
  },
  {
    id: "2",
    title: "Mastering TypeScript: Advanced Patterns",
    slug: "mastering-typescript-patterns",
    excerpt: "Dive deep into advanced TypeScript patterns including generics, conditional types, and mapped types.",
    featured_image: "https://picsum.photos/seed/typescript/400/300",
    category: "Programming",
    tags: ["typescript", "patterns", "advanced"],
    status: "published",
    sections: [],
    seo_metadata: {},
    author_info: null,
    created_at: "2024-03-14T10:00:00Z",
    updated_at: "2024-03-14T10:00:00Z",
    published_at: "2024-03-14T10:00:00Z",
    created_by: "author-1",
    search_vector: "",
  },
  {
    id: "3",
    title: "Building Scalable React Applications",
    slug: "scalable-react-apps",
    excerpt: "Best practices for structuring large React applications with proper state management and component architecture.",
    featured_image: "https://picsum.photos/seed/react/400/300",
    category: "Development",
    tags: ["react", "architecture", "scalability"],
    status: "published",
    sections: [],
    seo_metadata: {},
    author_info: null,
    created_at: "2024-03-13T10:00:00Z",
    updated_at: "2024-03-13T10:00:00Z",
    published_at: "2024-03-13T10:00:00Z",
    created_by: "author-1",
    search_vector: "",
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox: When to Use Each",
    slug: "css-grid-vs-flexbox",
    excerpt: "A comprehensive guide to choosing between CSS Grid and Flexbox for your layout needs.",
    featured_image: "https://picsum.photos/seed/css/400/300",
    category: "Design",
    tags: ["css", "layout", "design"],
    status: "published",
    sections: [],
    seo_metadata: {},
    author_info: null,
    created_at: "2024-03-12T10:00:00Z",
    updated_at: "2024-03-12T10:00:00Z",
    published_at: "2024-03-12T10:00:00Z",
    created_by: "author-1",
    search_vector: "",
  },
  {
    id: "5",
    title: "Performance Optimization for Web Apps",
    slug: "web-performance-optimization",
    excerpt: "Practical techniques for improving web application performance, from lazy loading to code splitting.",
    featured_image: "https://picsum.photos/seed/performance/400/300",
    category: "Performance",
    tags: ["performance", "optimization", "web"],
    status: "published",
    sections: [],
    seo_metadata: {},
    author_info: null,
    created_at: "2024-03-11T10:00:00Z",
    updated_at: "2024-03-11T10:00:00Z",
    published_at: "2024-03-11T10:00:00Z",
    created_by: "author-1",
    search_vector: "",
  },
  {
    id: "6",
    title: "Introduction to Server Components",
    slug: "intro-server-components",
    excerpt: "Understanding React Server Components and how they change the way we build React applications.",
    featured_image: "https://picsum.photos/seed/server/400/300",
    category: "Development",
    tags: ["react", "server-components", "nextjs"],
    status: "published",
    sections: [],
    seo_metadata: {},
    author_info: null,
    created_at: "2024-03-10T10:00:00Z",
    updated_at: "2024-03-10T10:00:00Z",
    published_at: "2024-03-10T10:00:00Z",
    created_by: "author-1",
    search_vector: "",
  },
];

const meta = {
  title: "Components/BlogPostList",
  component: BlogPostList,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BlogPostList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    posts: samplePosts,
    pageTitle: "Blog",
    basePath: "/blog",
    showCategory: true,
    showExcerpt: true,
    showFeaturedImage: true,
  },
};

export const WithoutImages: Story = {
  args: {
    posts: samplePosts,
    pageTitle: "Articles",
    showCategory: true,
    showExcerpt: true,
    showFeaturedImage: false,
  },
};

export const CompactGrid: Story = {
  args: {
    posts: samplePosts,
    pageTitle: "Latest Posts",
    showCategory: false,
    showExcerpt: false,
    showFeaturedImage: true,
    theme: {
      grid: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4",
      card: "block border rounded-lg p-4 hover:shadow-md transition-shadow",
      postTitle: "text-lg font-semibold mb-2 line-clamp-2",
    },
  },
};

export const MagazineStyle: Story = {
  args: {
    posts: samplePosts,
    pageTitle: "Featured Articles",
    theme: {
      container: "max-w-7xl mx-auto px-6 py-12",
      title: "text-5xl font-extrabold mb-12 text-center",
      grid: "grid grid-cols-1 md:grid-cols-2 gap-8",
      card: "group block overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300",
      image: "w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-300",
      postTitle: "text-2xl font-bold mb-3 mt-6 px-6 group-hover:text-blue-600 transition-colors",
      excerpt: "text-gray-600 mb-6 px-6 line-clamp-2",
      category: "inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold ml-6 mb-6",
    },
  },
};

export const MinimalList: Story = {
  args: {
    posts: samplePosts,
    pageTitle: "Writing",
    showFeaturedImage: false,
    showCategory: false,
    theme: {
      container: "max-w-3xl mx-auto px-4 py-16",
      title: "text-4xl font-serif mb-12",
      grid: "space-y-8",
      card: "block border-b border-gray-200 pb-8 hover:border-gray-400 transition-colors",
      postTitle: "text-2xl font-serif mb-2 hover:text-blue-600 transition-colors",
      excerpt: "text-gray-600 font-serif text-lg",
    },
  },
};

export const EmptyState: Story = {
  args: {
    posts: [],
    pageTitle: "Blog",
    emptyMessage: "No blog posts found. Check back soon!",
  },
};

export const TwoColumns: Story = {
  args: {
    posts: samplePosts.slice(0, 4),
    pageTitle: "Featured",
    theme: {
      grid: "grid grid-cols-1 md:grid-cols-2 gap-6",
    },
  },
};

export const FourColumns: Story = {
  args: {
    posts: samplePosts,
    pageTitle: "All Posts",
    theme: {
      container: "max-w-[1600px] mx-auto px-8 py-12",
      grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      card: "block border rounded-lg p-4 hover:shadow-lg transition-shadow",
      image: "w-full h-40 object-cover rounded-lg mb-3",
      postTitle: "text-base font-bold mb-2 line-clamp-2",
      excerpt: "text-sm text-gray-600 mb-3 line-clamp-2",
    },
  },
};
