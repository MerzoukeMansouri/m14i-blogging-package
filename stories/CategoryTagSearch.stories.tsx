import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogProvider } from "../src/public/context/BlogContext";
import { CategoryView } from "../src/public/views/CategoryView";
import { TagView } from "../src/public/views/TagView";
import { SearchView } from "../src/public/views/SearchView";
import { mockApiClient } from "./mockData";

// Category View Stories
const categoryMeta: Meta<typeof CategoryView> = {
  title: "Public/Views/CategoryView",
  component: CategoryView,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BlogProvider basePath="/blog" apiClient={mockApiClient}>
        <Story />
      </BlogProvider>
    ),
  ],
};

export default categoryMeta;

export const CategoryDefault: StoryObj<typeof CategoryView> = {
  args: {
    category: "React",
    page: 1,
  },
};

export const CategoryNextJS: StoryObj<typeof CategoryView> = {
  args: {
    category: "Next.js",
    page: 1,
  },
};

export const CategoryTypeScript: StoryObj<typeof CategoryView> = {
  args: {
    category: "TypeScript",
    page: 1,
  },
};

// Tag View Stories
const tagMeta: Meta<typeof TagView> = {
  title: "Public/Views/TagView",
  component: TagView,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BlogProvider basePath="/blog" apiClient={mockApiClient}>
        <Story />
      </BlogProvider>
    ),
  ],
};

export const TagDefault: StoryObj<typeof TagView> = {
  ...tagMeta,
  args: {
    tag: "react",
    page: 1,
  },
};

export const TagJavaScript: StoryObj<typeof TagView> = {
  ...tagMeta,
  args: {
    tag: "javascript",
    page: 1,
  },
};

export const TagPerformance: StoryObj<typeof TagView> = {
  ...tagMeta,
  args: {
    tag: "performance",
    page: 1,
  },
};

// Search View Stories
const searchMeta: Meta<typeof SearchView> = {
  title: "Public/Views/SearchView",
  component: SearchView,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BlogProvider basePath="/blog" apiClient={mockApiClient}>
        <Story />
      </BlogProvider>
    ),
  ],
};

export const SearchDefault: StoryObj<typeof SearchView> = {
  ...searchMeta,
  args: {
    query: "React",
    page: 1,
  },
};

export const SearchTypeScript: StoryObj<typeof SearchView> = {
  ...searchMeta,
  args: {
    query: "TypeScript",
    page: 1,
  },
};

export const SearchNoResults: StoryObj<typeof SearchView> = {
  ...searchMeta,
  args: {
    query: "xyz123nonexistent",
    page: 1,
  },
};

export const SearchEmpty: StoryObj<typeof SearchView> = {
  ...searchMeta,
  args: {
    query: "",
    page: 1,
  },
};
