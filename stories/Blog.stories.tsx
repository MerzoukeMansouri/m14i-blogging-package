import type { Meta, StoryObj } from "@storybook/react-vite";
import { Blog } from "../src/public/Blog";
import { mockApiClient } from "./mockData";

// Mock navigate function for Storybook
const mockNavigate = (path: string) => {
  console.log("Navigate to:", path);
};

const meta: Meta<typeof Blog> = {
  title: "Public/Blog",
  component: Blog,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Blog>;

export const Default: Story = {
  args: {
    basePath: "/blog",
    apiClient: mockApiClient,
    navigate: mockNavigate,
  },
};

export const GridLayout: Story = {
  args: {
    basePath: "/blog",
    apiClient: mockApiClient,
    navigate: mockNavigate,
    display: {
      layout: "grid",
      postsPerPage: 9,
    },
  },
};

export const ListLayout: Story = {
  args: {
    basePath: "/blog",
    apiClient: mockApiClient,
    navigate: mockNavigate,
    display: {
      layout: "list",
      postsPerPage: 5,
    },
  },
};

export const MasonryLayout: Story = {
  args: {
    basePath: "/blog",
    apiClient: mockApiClient,
    navigate: mockNavigate,
    display: {
      layout: "masonry",
      postsPerPage: 9,
    },
  },
};

export const MagazineLayout: Story = {
  args: {
    basePath: "/blog",
    apiClient: mockApiClient,
    navigate: mockNavigate,
    display: {
      layout: "magazine",
      postsPerPage: 10,
    },
  },
};

export const WithoutSidebar: Story = {
  args: {
    basePath: "/blog",
    apiClient: mockApiClient,
    navigate: mockNavigate,
    features: {
      search: false,
      categoryFilter: false,
      tagFilter: false,
      relatedPosts: true,
    },
  },
};

export const MinimalFeatures: Story = {
  args: {
    basePath: "/blog",
    apiClient: mockApiClient,
    navigate: mockNavigate,
    features: {
      search: false,
      categoryFilter: false,
      tagFilter: false,
      relatedPosts: false,
      readingTime: false,
    },
    display: {
      showFeaturedImage: true,
      showExcerpt: true,
      showAuthor: false,
      showTags: false,
      showCategory: false,
      showReadingTime: false,
    },
  },
};

export const CustomLabels: Story = {
  args: {
    basePath: "/blog",
    apiClient: mockApiClient,
    navigate: mockNavigate,
    labels: {
      readMore: "Continue reading",
      backToBlog: "Back to all articles",
      search: "Find",
      searchPlaceholder: "What are you looking for?",
      allCategories: "All Topics",
      filterByCategory: "Browse by Topic",
      filterByTag: "Browse by Tag",
      publishedOn: "Posted on",
      by: "written by",
      readingTime: "Est. reading time",
      relatedPosts: "You might also like",
      noPostsFound: "No articles found",
    },
  },
};

export const CompactLayout: Story = {
  args: {
    basePath: "/blog",
    apiClient: mockApiClient,
    navigate: mockNavigate,
    display: {
      layout: "grid",
      postsPerPage: 6,
      showFeaturedImage: true,
      showExcerpt: false,
      showReadingTime: false,
      showAuthor: false,
      showTags: false,
      showCategory: true,
      showDate: true,
    },
  },
};

export const DetailedLayout: Story = {
  args: {
    basePath: "/blog",
    apiClient: mockApiClient,
    navigate: mockNavigate,
    display: {
      layout: "list",
      postsPerPage: 5,
      showFeaturedImage: true,
      showExcerpt: true,
      showReadingTime: true,
      showAuthor: true,
      showTags: true,
      showCategory: true,
      showDate: true,
      relatedPostsCount: 3,
    },
    features: {
      search: true,
      categoryFilter: true,
      tagFilter: true,
      relatedPosts: true,
      readingTime: true,
    },
  },
};

export const WithCallbacks: Story = {
  args: {
    basePath: "/blog",
    apiClient: mockApiClient,
    navigate: mockNavigate,
    onPostClick: (post) => {
      console.log("Post clicked:", post.title);
      alert(`You clicked: ${post.title}`);
    },
    onCategoryClick: (category) => {
      console.log("Category clicked:", category);
      alert(`Category: ${category}`);
    },
    onTagClick: (tag) => {
      console.log("Tag clicked:", tag);
      alert(`Tag: ${tag}`);
    },
    onSearch: (query) => {
      console.log("Search query:", query);
      alert(`Searching for: ${query}`);
    },
  },
};

export const WithDefaultFilters: Story = {
  args: {
    basePath: "/blog",
    apiClient: mockApiClient,
    navigate: mockNavigate,
    defaultCategory: "React",
    defaultSort: "date-desc",
  },
};
