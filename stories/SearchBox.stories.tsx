import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogProvider } from "../src/public/context/BlogContext";
import { SearchBox } from "../src/public/components/SearchBox";

const meta: Meta<typeof SearchBox> = {
  title: "Public/Components/SearchBox",
  component: SearchBox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BlogProvider basePath="/blog">
        <div style={{ minWidth: "500px" }}>
          <Story />
        </div>
      </BlogProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchBox>;

export const Default: Story = {
  args: {},
};

export const WithInitialValue: Story = {
  args: {
    initialValue: "React",
  },
};

export const WithCallback: Story = {
  args: {
    onSearch: (query) => {
      console.log("Search query:", query);
      alert(`Searching for: ${query}`);
    },
  },
};

export const CustomLabels: Story = {
  decorators: [
    (Story) => (
      <BlogProvider
        basePath="/blog"
        labels={{
          search: "Find",
          searchPlaceholder: "What are you looking for?",
          clear: "Reset",
        }}
      >
        <div style={{ minWidth: "500px" }}>
          <Story />
        </div>
      </BlogProvider>
    ),
  ],
  args: {},
};
