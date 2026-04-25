import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogPreview } from "../src/components/BlogPreview";
import type { LayoutSection } from "../src/types";

const meta: Meta<typeof BlogPreview> = {
  title: "Theming/ClassName Props",
  component: BlogPreview,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# ClassName Props Customization

This demonstrates how to use \`classNames\` prop to completely customize component styling.
This approach gives you maximum flexibility and works perfectly with Tailwind CSS or any CSS framework.

## Usage

\`\`\`tsx
<BlogPreview
  title="My Article"
  sections={sections}
  classNames={{
    container: "max-w-6xl mx-auto px-8",
    title: "text-6xl font-black text-purple-600",
    section: "mb-16 p-8 bg-white rounded-2xl shadow-lg"
  }}
/>
\`\`\`

## Available ClassName Props

### BlogPreview
- \`container\` - Main wrapper
- \`header\` - Header section
- \`title\` - Title heading
- \`meta\` - Metadata (date, author)
- \`article\` - Article content wrapper
- \`section\` - Individual sections
- \`column\` - Column containers

### ContentBlockRenderer
- \`text\` - Text/Markdown blocks
- \`image\` - Image wrapper
- \`imageCaption\` - Image caption
- \`video\` - Video wrapper
- \`videoCaption\` - Video caption
- \`gallery\` - Gallery grid
- \`galleryImage\` - Individual gallery images
- \`galleryCaption\` - Gallery image captions
- \`quote\` - Quote blockquote
- \`quoteContent\` - Quote text
- \`quoteFooter\` - Quote attribution
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BlogPreview>;

const sampleSections: LayoutSection[] = [
  {
    id: "section-1",
    type: "1-column",
    columns: [
      [
        {
          id: "intro",
          type: "text",
          content: "# Customizable Design System\n\nTake full control of your blog's appearance with className props.",
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
          id: "content-1",
          type: "text",
          content: "## Flexible Styling\n\nUse any CSS framework or custom classes to style your content exactly how you want.",
        },
      ],
      [
        {
          id: "quote",
          type: "quote",
          content: "Great design is invisible. It just works.",
          author: "Jony Ive",
          role: "Designer",
        },
      ],
    ],
  },
];

// Default (no customization)
export const Default: Story = {
  args: {
    title: "Default Styling",
    sections: sampleSections,
  },
};

// Wide Layout
export const WideLayout: Story = {
  args: {
    title: "Wide Layout Example",
    sections: sampleSections,
    classNames: {
      container: "max-w-7xl mx-auto px-8 py-16",
      title: "text-6xl font-black tracking-tight",
      section: "mb-20",
    },
  },
};

// Compact Layout
export const CompactLayout: Story = {
  args: {
    title: "Compact Layout",
    sections: sampleSections,
    classNames: {
      container: "max-w-2xl mx-auto px-4 py-6",
      header: "mb-8",
      title: "text-3xl font-semibold",
      meta: "text-xs text-gray-500",
      section: "mb-6",
      column: "space-y-3",
    },
  },
};

// Gradient Title
export const GradientTitle: Story = {
  args: {
    title: "Beautiful Gradient Title",
    sections: sampleSections,
    classNames: {
      title: "text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent",
      meta: "flex gap-4 text-sm text-purple-600 font-medium",
    },
  },
};

// Card-based Sections
export const CardSections: Story = {
  args: {
    title: "Card-Based Layout",
    sections: sampleSections,
    classNames: {
      container: "max-w-6xl mx-auto px-6 py-12",
      section: "mb-8 p-8 bg-white rounded-2xl shadow-xl border border-gray-200",
      column: "space-y-6",
    },
  },
  parameters: {
    backgrounds: { default: "light-gray" },
  },
};

// Magazine Style
export const MagazineStyle: Story = {
  args: {
    title: "MAGAZINE FEATURE",
    sections: sampleSections,
    classNames: {
      container: "max-w-screen-xl mx-auto px-12",
      header: "mb-20 text-center border-b-4 border-black pb-8",
      title: "text-7xl font-black tracking-tight uppercase leading-none",
      meta: "flex justify-center gap-6 text-xs uppercase tracking-widest text-gray-500 mt-6",
      article: "space-y-0",
      section: "py-16 border-t border-gray-300 first:border-0",
      column: "space-y-8",
    },
  },
};

// Colorful Sections
export const ColorfulSections: Story = {
  args: {
    title: "Vibrant Design",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "intro",
              type: "text",
              content: "# Section One\n\nThis section has a blue background.",
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
              id: "left",
              type: "text",
              content: "## Left Column\n\nGreen section with white text.",
            },
          ],
          [
            {
              id: "right",
              type: "text",
              content: "## Right Column\n\nMore content here.",
            },
          ],
        ],
      },
    ],
    classNames: {
      container: "max-w-5xl mx-auto px-6 py-12",
      section: "mb-8 p-10 rounded-3xl [&:nth-child(1)]:bg-blue-50 [&:nth-child(1)]:border-4 [&:nth-child(1)]:border-blue-500 [&:nth-child(2)]:bg-green-50 [&:nth-child(2)]:border-4 [&:nth-child(2)]:border-green-500",
    },
  },
};

// Minimalist
export const Minimalist: Story = {
  args: {
    title: "Minimal Aesthetic",
    sections: sampleSections,
    classNames: {
      container: "max-w-3xl mx-auto px-8 py-20",
      header: "mb-16",
      title: "text-4xl font-light tracking-wide",
      meta: "text-xs uppercase tracking-widest text-gray-400 mt-8",
      section: "mb-16",
      column: "space-y-8 text-gray-700 leading-relaxed",
    },
  },
};

// Bordered Sections
export const BorderedSections: Story = {
  args: {
    title: "Bordered Design",
    sections: sampleSections,
    classNames: {
      container: "max-w-4xl mx-auto px-6 py-12",
      section: "mb-8 p-8 border-4 border-black",
      column: "space-y-6 border-l-4 border-gray-300 pl-6",
    },
  },
};

// Dark Mode Example (using inline styles for demo)
export const DarkMode: Story = {
  args: {
    title: "Dark Mode Design",
    sections: sampleSections,
    classNames: {
      container: "max-w-5xl mx-auto px-8 py-16 bg-gray-900 text-white",
      title: "text-5xl font-bold text-white",
      meta: "text-gray-400",
      section: "mb-12 p-8 bg-gray-800 rounded-xl border border-gray-700",
      column: "space-y-6 text-gray-300",
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Newspaper Style
export const NewspaperStyle: Story = {
  args: {
    title: "The Daily Blog",
    sections: [
      {
        id: "section-1",
        type: "grid-2x2",
        columns: [
          [
            {
              id: "col-1",
              type: "text",
              content: "## Column One\n\nNewspaper-style multi-column text layout for easy reading.",
            },
          ],
          [
            {
              id: "col-2",
              type: "text",
              content: "## Column Two\n\nContent flows naturally across columns like traditional print media.",
            },
          ],
          [
            {
              id: "col-3",
              type: "text",
              content: "## Column Three\n\nPerfect for dense information presentation.",
            },
          ],
        ],
      },
    ],
    classNames: {
      container: "max-w-screen-xl mx-auto px-12 py-16 bg-amber-50",
      header: "mb-12 border-t-8 border-b-8 border-black py-6",
      title: "text-6xl font-black font-serif tracking-tight text-center uppercase",
      meta: "text-center text-sm font-serif",
      section: "columns-3 gap-8 text-justify leading-relaxed",
      column: "break-inside-avoid",
    },
  },
};

// Custom Interactive with Controls
export const CustomWithControls: Story = {
  args: {
    title: "Interactive Customization",
    sections: sampleSections,
    classNames: {
      container: "max-w-4xl mx-auto px-4 py-8",
    },
  },
  argTypes: {
    "classNames.container": {
      control: "text",
      description: "Container classes",
      table: { category: "ClassNames" },
    },
    "classNames.title": {
      control: "text",
      description: "Title classes",
      table: { category: "ClassNames" },
    },
    "classNames.section": {
      control: "text",
      description: "Section classes",
      table: { category: "ClassNames" },
    },
  },
};
