import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BlogEditorContainer } from "@m14i/blogging-admin";
import type { LayoutSection } from "@m14i/blogging-core";
import { Plus, X } from "lucide-react";

// Default Button component for Storybook
function Button({
  variant = "default",
  size = "default",
  className = "",
  onClick,
  children,
  ...props
}: any) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors";
  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent",
    ghost: "hover:bg-accent",
  };
  const sizes: Record<string, string> = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    icon: "h-10 w-10",
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

const defaultComponents = {
  Button,
  Card: ({ children, className }: any) => <div className={`rounded-lg border bg-card shadow-sm ${className}`}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={`p-6 ${className}`}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={`p-6 pt-0 ${className}`}>{children}</div>,
  Label: ({ children, className }: any) => <label className={`text-sm font-medium ${className}`}>{children}</label>,
  Input: (props: any) => <input className="flex h-10 w-full rounded-md border px-3 py-2" {...props} />,
  Textarea: (props: any) => <textarea className="flex min-h-[80px] w-full rounded-md border px-3 py-2" {...props} />,
  Select: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  SelectTrigger: ({ children, ...props }: any) => <button className="flex h-10 w-full items-center justify-between rounded-md border px-3" {...props}>{children}</button>,
  SelectValue: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  SelectContent: ({ children, ...props }: any) => <div className="rounded-md border bg-popover" {...props}>{children}</div>,
  SelectItem: ({ children, ...props }: any) => <div className="px-2 py-1.5 hover:bg-accent" {...props}>{children}</div>,
  PlusIcon: Plus,
  XIcon: X,
};

const meta = {
  title: "Admin/Blog Editor",
  component: BlogEditorContainer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BlogEditorContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper to handle state
function EditorWrapper({ initialSections }: { initialSections: LayoutSection[] }) {
  const [sections, setSections] = useState<LayoutSection[]>(initialSections);
  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);

  return (
    <div className="h-screen flex">
      <BlogEditorContainer
        sections={sections}
        onChange={setSections}
        components={defaultComponents}
        showLayerPanel={showLayerPanel}
        onToggleLayerPanel={() => setShowLayerPanel(!showLayerPanel)}
        showAIPanel={showAIPanel}
        onToggleAIPanel={() => setShowAIPanel(!showAIPanel)}
      />
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
