import type { Meta, StoryObj } from "@storybook/react";
import { BlogPreview } from "@m14i/blogging-core";
import type { LayoutSection } from "@m14i/blogging-core";

const sampleSections: LayoutSection[] = [
  {
    id: "intro",
    type: "full",
    columns: [
      [
        {
          id: "intro-text",
          type: "text",
          content: "# Introduction\n\nThis is a sample blog post demonstrating the BlogPreview component with various content blocks and layouts.",
        },
      ],
    ],
  },
  {
    id: "two-col",
    type: "two-column",
    columns: [
      [
        {
          id: "left-text",
          type: "text",
          content: "## Left Column\n\nThis demonstrates a two-column layout. The content flows naturally between columns, creating a magazine-style reading experience.",
        },
      ],
      [
        {
          id: "right-text",
          type: "text",
          content: "## Right Column\n\nYou can mix different content types in each column - text, images, quotes, code blocks, and more.",
        },
      ],
    ],
  },
  {
    id: "quote",
    type: "full",
    columns: [
      [
        {
          id: "sample-quote",
          type: "quote",
          content: "The best way to predict the future is to invent it.",
          author: "Alan Kay",
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
          id: "sample-code",
          type: "code",
          content: `import { BlogPreview } from '@m14i/blogging-core';

export default function BlogPost() {
  return (
    <BlogPreview
      title="My Blog Post"
      sections={sections}
      showReadingTime={true}
    />
  );
}`,
          language: "typescript",
        },
      ],
    ],
  },
];

const meta = {
  title: "Components/BlogPreview",
  component: BlogPreview,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BlogPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Getting Started with m14i-blogging",
    excerpt: "Learn how to integrate a powerful blogging system into your Next.js application",
    sections: sampleSections,
    showReadingTime: true,
    showMeta: true,
  },
};

export const WithCustomTheme: Story = {
  args: {
    title: "Custom Themed Blog Post",
    excerpt: "This post uses a custom theme with different styling",
    sections: sampleSections,
    showReadingTime: true,
    theme: {
      container: "max-w-6xl mx-auto px-8 py-16 bg-gray-50",
      header: "mb-16 text-center border-b pb-8",
      title: "text-6xl font-extrabold mb-6 text-blue-900",
      excerpt: "text-2xl text-gray-600 mb-8 font-light italic",
      meta: "flex items-center justify-center gap-6 text-base text-gray-500",
      article: "space-y-12 prose prose-lg max-w-none",
      section: "mb-16 bg-white p-8 rounded-lg shadow-sm",
      column: "flex flex-col justify-center space-y-6",
    },
  },
};

export const MinimalTheme: Story = {
  args: {
    title: "Minimal Design",
    excerpt: "Clean and simple typography-focused layout",
    sections: sampleSections,
    showReadingTime: false,
    showMeta: false,
    theme: {
      container: "max-w-2xl mx-auto px-4 py-12",
      title: "text-3xl font-serif mb-4",
      excerpt: "text-lg text-gray-600 mb-8 font-serif",
      article: "space-y-6 font-serif text-gray-800",
    },
  },
};

export const NoExcerpt: Story = {
  args: {
    title: "Blog Post Without Excerpt",
    sections: sampleSections,
    showReadingTime: true,
  },
};

export const EmptyState: Story = {
  args: {
    title: "Empty Blog Post",
    sections: [],
    emptyStateMessage: "This post has no content yet",
    emptyStateHelper: "Start adding sections to see them here",
  },
};

export const FrenchLocale: Story = {
  args: {
    title: "Article en Français",
    excerpt: "Ceci est un exemple d'article de blog en français",
    sections: sampleSections,
    showReadingTime: true,
    dateLocale: "fr-FR",
    date: new Date("2024-03-15"),
  },
};
