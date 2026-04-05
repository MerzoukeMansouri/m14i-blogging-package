import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { BlogBuilder } from "../src/components/BlogBuilder";
import type { LayoutSection } from "../src/types";
import * as ShadcnComponents from "./mocks/shadcn-components";

const meta: Meta<typeof BlogBuilder> = {
  title: "Core Components/BlogBuilder",
  component: BlogBuilder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BlogBuilder>;

// Wrapper component to handle state
const BlogBuilderWrapper = () => {
  const [sections, setSections] = useState<LayoutSection[]>([]);

  return (
    <div style={{ height: "100vh" }}>
      <BlogBuilder
        sections={sections}
        onChange={setSections}
        components={ShadcnComponents as any}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <BlogBuilderWrapper />,
};

// Pre-populated example
const BlogBuilderWithContent = () => {
  const [sections, setSections] = useState<LayoutSection[]>([
    {
      id: "section-1",
      type: "2-columns",
      columns: [
        [
          {
            id: "block-1",
            type: "text",
            content: "# Welcome to the Blog Builder\n\nThis is a **markdown** enabled text block in the first column.",
          },
        ],
        [
          {
            id: "block-2",
            type: "text",
            content: "This is the second column with some text content.",
          },
        ],
      ],
    },
  ]);

  return (
    <div style={{ height: "100vh" }}>
      <BlogBuilder
        sections={sections}
        onChange={setSections}
        components={ShadcnComponents as any}
      />
    </div>
  );
};

export const WithContent: Story = {
  render: () => <BlogBuilderWithContent />,
};
