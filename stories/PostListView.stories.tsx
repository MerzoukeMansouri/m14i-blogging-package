import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogProvider } from "../src/public/context/BlogContext";
import { PostListView } from "../src/public/views/PostListView";
import { mockApiClient } from "./mockData";

const meta: Meta<typeof PostListView> = {
  title: "Public/Views/PostListView",
  component: PostListView,
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

export default meta;
type Story = StoryObj<typeof PostListView>;

export const Default: Story = {
  args: {
    page: 1,
  },
};

export const GridLayout: Story = {
  decorators: [
    (Story) => (
      <BlogProvider
        basePath="/blog"
        apiClient={mockApiClient}
        display={{ layout: "grid" }}
      >
        <Story />
      </BlogProvider>
    ),
  ],
  args: {
    page: 1,
  },
};

export const ListLayout: Story = {
  decorators: [
    (Story) => (
      <BlogProvider
        basePath="/blog"
        apiClient={mockApiClient}
        display={{ layout: "list" }}
      >
        <Story />
      </BlogProvider>
    ),
  ],
  args: {
    page: 1,
  },
};

export const MasonryLayout: Story = {
  decorators: [
    (Story) => (
      <BlogProvider
        basePath="/blog"
        apiClient={mockApiClient}
        display={{ layout: "masonry" }}
      >
        <Story />
      </BlogProvider>
    ),
  ],
  args: {
    page: 1,
  },
};

export const MagazineLayout: Story = {
  decorators: [
    (Story) => (
      <BlogProvider
        basePath="/blog"
        apiClient={mockApiClient}
        display={{ layout: "magazine" }}
      >
        <Story />
      </BlogProvider>
    ),
  ],
  args: {
    page: 1,
  },
};

export const WithCategoryFilter: Story = {
  args: {
    page: 1,
    category: "React",
  },
};

export const WithTagFilter: Story = {
  args: {
    page: 1,
    tag: "react",
  },
};

export const WithoutSidebar: Story = {
  decorators: [
    (Story) => (
      <BlogProvider
        basePath="/blog"
        apiClient={mockApiClient}
        features={{
          search: false,
          categoryFilter: false,
          tagFilter: false,
        }}
      >
        <Story />
      </BlogProvider>
    ),
  ],
  args: {
    page: 1,
  },
};
