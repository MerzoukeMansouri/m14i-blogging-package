import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BlogBuilderWithDefaults } from "@m14i/blogging-admin";
import type { LayoutSection } from "@m14i/blogging-core";

const meta = {
  title: "Admin/Blog Editor",
  component: BlogBuilderWithDefaults,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BlogBuilderWithDefaults>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper to handle state
function EditorWrapper({ initialSections }: { initialSections: LayoutSection[] }) {
  const [sections, setSections] = useState<LayoutSection[]>(initialSections);

  return (
    <div className="min-h-screen bg-background p-8">
      <BlogBuilderWithDefaults sections={sections} onChange={setSections} />
    </div>
  );
}

export const EmptyEditor: Story = {
  render: () => <EditorWrapper initialSections={[]} />,
  parameters: {
    docs: {
      description: {
        story: "Start with an empty canvas. Click layout buttons to add sections, then add content blocks to each column.",
      },
    },
  },
};

export const WithBasicContent: Story = {
  render: () => (
    <EditorWrapper
      initialSections={[
        {
          id: "intro",
          type: "full",
          columns: [
            [
              {
                id: "intro-text",
                type: "text",
                content: "# Getting Started\n\nEdit this content by clicking the edit icon.",
              },
            ],
          ],
        },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: "Editor with a single full-width text block. Click the edit icon to modify content.",
      },
    },
  },
};

export const TwoColumnLayout: Story = {
  render: () => (
    <EditorWrapper
      initialSections={[
        {
          id: "two-col",
          type: "two-column",
          columns: [
            [
              {
                id: "left",
                type: "text",
                content: "## Left Column\n\nAdd your content here.",
              },
            ],
            [
              {
                id: "right",
                type: "text",
                content: "## Right Column\n\nAdd your content here.",
              },
            ],
          ],
        },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: "Two-column layout with text blocks in each column.",
      },
    },
  },
};

export const ComplexArticle: Story = {
  render: () => (
    <EditorWrapper
      initialSections={[
        {
          id: "hero",
          type: "full",
          columns: [
            [
              {
                id: "hero-text",
                type: "text",
                content: "# Build Your Blog Post\n\nDrag and drop to reorder sections. Click edit to modify content.",
              },
            ],
          ],
        },
        {
          id: "content",
          type: "two-column",
          columns: [
            [
              {
                id: "main",
                type: "text",
                content: "## Main Content\n\nYour article content goes here. Supports **markdown** formatting.",
              },
            ],
            [
              {
                id: "sidebar",
                type: "quote",
                content: "Important callout or quote",
                author: "Author Name",
              },
            ],
          ],
        },
        {
          id: "code",
          type: "full",
          columns: [
            [
              {
                id: "code-block",
                type: "code",
                content: 'function example() {\n  console.log("Hello World");\n}',
                language: "javascript",
              },
            ],
          ],
        },
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: "Complete article with hero, two-column layout, and code block. Demonstrates drag-and-drop reordering.",
      },
    },
  },
};
