import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogProvider } from "../src/public/context/BlogContext";
import { CategoryFilter } from "../src/public/components/CategoryFilter";
import { mockApiClient } from "./mockData";

const meta: Meta<typeof CategoryFilter> = {
  title: "Public/Components/CategoryFilter",
  component: CategoryFilter,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BlogProvider basePath="/blog" apiClient={mockApiClient}>
        <div style={{ minWidth: "300px" }}>
          <Story />
        </div>
      </BlogProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CategoryFilter>;

export const Default: Story = {
  args: {},
};

export const WithActiveCategory: Story = {
  args: {
    activeCategory: "React",
  },
};

export const WithCallback: Story = {
  args: {
    onCategoryClick: (category) => {
      console.log("Category clicked:", category);
      alert(`Category: ${category}`);
    },
  },
};
