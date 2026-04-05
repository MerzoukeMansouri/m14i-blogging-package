import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { BlogProvider } from "../src/public/context/BlogContext";
import { Pagination } from "../src/public/components/Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Public/Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BlogProvider basePath="/blog">
        <Story />
      </BlogProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 15,
    totalPages: 50,
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

export const Interactive: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    return (
      <div>
        <p className="text-center mb-4">
          Current Page: <strong>{currentPage}</strong> of {totalPages}
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  },
};
