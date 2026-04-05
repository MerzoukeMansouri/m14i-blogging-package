import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogProvider } from "../src/public/context/BlogContext";
import { PostCard } from "../src/public/components/PostCard";
import { mockPosts } from "./mockData";

const meta: Meta<typeof PostCard> = {
  title: "Public/Components/PostCard",
  component: PostCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BlogProvider basePath="/blog">
        <div style={{ maxWidth: "400px" }}>
          <Story />
        </div>
      </BlogProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PostCard>;

export const Default: Story = {
  args: {
    post: mockPosts[0],
  },
};

export const WithoutFeaturedImage: Story = {
  args: {
    post: {
      ...mockPosts[0],
      featured_image: null,
    },
  },
};

export const WithoutExcerpt: Story = {
  args: {
    post: {
      ...mockPosts[0],
      excerpt: null,
    },
  },
};

export const WithoutTags: Story = {
  args: {
    post: {
      ...mockPosts[0],
      tags: [],
    },
  },
};

export const LongTitle: Story = {
  args: {
    post: {
      ...mockPosts[0],
      title:
        "This is a Very Long Blog Post Title That Demonstrates How the Component Handles Extended Text Content",
    },
  },
};

export const MinimalPost: Story = {
  args: {
    post: {
      ...mockPosts[0],
      featured_image: null,
      excerpt: null,
      tags: [],
      category: null,
      author_info: null,
    },
  },
};

export const Interactive: Story = {
  args: {
    post: mockPosts[1],
    onClick: (post) => {
      console.log("Post clicked:", post.title);
      alert(`You clicked: ${post.title}`);
    },
  },
};
