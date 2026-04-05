import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogProvider } from "../src/public/context/BlogContext";
import { TagCloud } from "../src/public/components/TagCloud";
import { mockApiClient } from "./mockData";

const meta: Meta<typeof TagCloud> = {
  title: "Public/Components/TagCloud",
  component: TagCloud,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BlogProvider basePath="/blog" apiClient={mockApiClient}>
        <div style={{ minWidth: "500px" }}>
          <Story />
        </div>
      </BlogProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TagCloud>;

export const Default: Story = {
  args: {},
};

export const WithActiveTag: Story = {
  args: {
    activeTag: "react",
  },
};

export const LimitedTags: Story = {
  args: {
    maxTags: 10,
  },
};

export const WithCallback: Story = {
  args: {
    onTagClick: (tag) => {
      console.log("Tag clicked:", tag);
      alert(`Tag: ${tag}`);
    },
  },
};
