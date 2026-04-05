import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { BlogBuilder } from "../src/components/BlogBuilder";
import { BlogPreview } from "../src/components/BlogPreview";
import type { LayoutSection } from "../src/types";
import * as ShadcnComponents from "./mocks/shadcn-components";

const meta: Meta<typeof BlogBuilder> = {
  title: "Core Components/BlogBuilder with Preview",
  component: BlogBuilder,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BlogBuilder>;

// Combined BlogBuilder + BlogPreview
const BlogBuilderWithPreviewWrapper = () => {
  const [sections, setSections] = useState<LayoutSection[]>([]);
  const [title, setTitle] = useState("My Blog Post");

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      {/* Title Input */}
      <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog post title..."
          style={{
            width: "100%",
            maxWidth: "600px",
            padding: "8px 12px",
            fontSize: "18px",
            fontWeight: "600",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
          }}
        />
      </div>

      {/* Main Content: Builder + Preview */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* BlogBuilder - Left Side */}
        <div style={{ flex: 1, borderRight: "2px solid #e5e7eb", overflow: "hidden" }}>
          <BlogBuilder
            sections={sections}
            onChange={setSections}
            components={ShadcnComponents as any}
          />
        </div>

        {/* BlogPreview - Right Side */}
        <div style={{ flex: 1, overflow: "auto", background: "#ffffff" }}>
          <BlogPreview title={title} sections={sections} />
        </div>
      </div>
    </div>
  );
};

export const BuilderWithLivePreview: Story = {
  render: () => <BlogBuilderWithPreviewWrapper />,
};

// Pre-populated example with both builder and preview
const BlogBuilderWithPreviewAndContent = () => {
  const [sections, setSections] = useState<LayoutSection[]>([
    {
      id: "section-1",
      type: "1-column",
      columns: [
        [
          {
            id: "block-1",
            type: "text",
            content: "# Welcome to the Blog Builder\n\nThis is a **markdown** enabled blog post. You can edit the content on the left and see the preview on the right in real-time!",
          },
        ],
      ],
    },
    {
      id: "section-2",
      type: "2-columns",
      columns: [
        [
          {
            id: "block-2",
            type: "text",
            content: "## Left Column\n\nThis content appears in the left column of a two-column layout.\n\n- Feature 1\n- Feature 2\n- Feature 3",
          },
        ],
        [
          {
            id: "block-3",
            type: "quote",
            content: "The best way to predict the future is to create it.",
            author: "Peter Drucker",
            role: "Management Consultant",
          },
        ],
      ],
    },
  ]);
  const [title, setTitle] = useState("Sample Blog Post with Preview");

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      {/* Title Input */}
      <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog post title..."
          style={{
            width: "100%",
            maxWidth: "600px",
            padding: "8px 12px",
            fontSize: "18px",
            fontWeight: "600",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
          }}
        />
      </div>

      {/* Main Content: Builder + Preview */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* BlogBuilder - Left Side */}
        <div style={{ flex: 1, borderRight: "2px solid #e5e7eb", overflow: "hidden" }}>
          <BlogBuilder
            sections={sections}
            onChange={setSections}
            components={ShadcnComponents as any}
          />
        </div>

        {/* BlogPreview - Right Side */}
        <div style={{ flex: 1, overflow: "auto", background: "#ffffff" }}>
          <BlogPreview title={title} sections={sections} />
        </div>
      </div>
    </div>
  );
};

export const WithContentAndPreview: Story = {
  render: () => <BlogBuilderWithPreviewAndContent />,
};
