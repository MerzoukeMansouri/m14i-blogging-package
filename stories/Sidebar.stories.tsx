import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogProvider } from "../src/public/context/BlogContext";
import { Sidebar } from "../src/public/components/Sidebar";
import { mockApiClient } from "./mockData";

const meta: Meta<typeof Sidebar> = {
  title: "Public/Components/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BlogProvider basePath="/blog" apiClient={mockApiClient}>
        <div style={{ minWidth: "350px" }}>
          <Story />
        </div>
      </BlogProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {},
};

export const WithActiveFilters: Story = {
  args: {
    activeCategory: "React",
    activeTag: "javascript",
  },
};

export const WithoutSearch: Story = {
  decorators: [
    (Story) => (
      <BlogProvider
        basePath="/blog"
        apiClient={mockApiClient}
        features={{ search: false, categoryFilter: true, tagFilter: true }}
      >
        <div style={{ minWidth: "350px" }}>
          <Story />
        </div>
      </BlogProvider>
    ),
  ],
  args: {},
};

export const WithCallbacks: Story = {
  args: {
    onSearch: (query) => console.log("Search:", query),
    onCategoryClick: (category) => console.log("Category:", category),
    onTagClick: (tag) => console.log("Tag:", tag),
  },
};
