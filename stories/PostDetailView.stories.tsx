import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogProvider } from "../src/public/context/BlogContext";
import { PostDetailView } from "../src/public/views/PostDetailView";
import { mockApiClient, mockPosts } from "./mockData";

const meta: Meta<typeof PostDetailView> = {
  title: "Public/Views/PostDetailView",
  component: PostDetailView,
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
type Story = StoryObj<typeof PostDetailView>;

export const Default: Story = {
  args: {
    slug: mockPosts[0].slug,
  },
};

export const WithRelatedPosts: Story = {
  decorators: [
    (Story) => (
      <BlogProvider
        basePath="/blog"
        apiClient={mockApiClient}
        features={{ relatedPosts: true }}
      >
        <Story />
      </BlogProvider>
    ),
  ],
  args: {
    slug: mockPosts[0].slug,
  },
};

export const WithoutRelatedPosts: Story = {
  decorators: [
    (Story) => (
      <BlogProvider
        basePath="/blog"
        apiClient={mockApiClient}
        features={{ relatedPosts: false }}
      >
        <Story />
      </BlogProvider>
    ),
  ],
  args: {
    slug: mockPosts[0].slug,
  },
};

export const MinimalDisplay: Story = {
  decorators: [
    (Story) => (
      <BlogProvider
        basePath="/blog"
        apiClient={mockApiClient}
        display={{
          showFeaturedImage: false,
          showAuthor: false,
          showTags: false,
          showCategory: false,
          showReadingTime: false,
        }}
      >
        <Story />
      </BlogProvider>
    ),
  ],
  args: {
    slug: mockPosts[1].slug,
  },
};

export const DifferentPost: Story = {
  args: {
    slug: mockPosts[2].slug,
  },
};
