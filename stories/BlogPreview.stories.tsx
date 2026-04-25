import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogPreview } from "../src/components/BlogPreview";
import type { LayoutSection } from "../src/types";

const meta: Meta<typeof BlogPreview> = {
  title: "Core Components/BlogPreview",
  component: BlogPreview,
  parameters: {
    layout: "padded",
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
          id: "block-1",
          type: "text",
          content: "# Introduction\n\nThis is a **sample** blog post demonstrating the preview component with *markdown* support.",
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
          content: "## Left Column\n\nThis content appears in the left column of a two-column layout.",
        },
      ],
      [
        {
          id: "block-3",
          type: "text",
          content: "## Right Column\n\nThis content appears in the right column.",
        },
      ],
    ],
  },
  {
    id: "section-3",
    type: "grid-2x2",
    columns: [
      [
        {
          id: "block-4",
          type: "text",
          content: "### Column 1\n\nFirst column content.",
        },
      ],
      [
        {
          id: "block-5",
          type: "text",
          content: "### Column 2\n\nSecond column content.",
        },
      ],
      [
        {
          id: "block-6",
          type: "text",
          content: "### Column 3\n\nThird column content.",
        },
      ],
    ],
  },
];

export const Default: Story = {
  args: {
    title: "Sample Blog Post",
    sections: sampleSections,
  },
};

export const Empty: Story = {
  args: {
    title: "Empty Blog Post",
    sections: [],
  },
};

export const TwoColumnsOnly: Story = {
  args: {
    title: "Two Column Layout Test",
    sections: [
      {
        id: "section-1",
        type: "2-columns",
        columns: [
          [
            {
              id: "block-1",
              type: "text",
              content: "# Left Column\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            },
          ],
          [
            {
              id: "block-2",
              type: "text",
              content: "# Right Column\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            },
          ],
        ],
      },
    ],
  },
};

export const WithPDF: Story = {
  args: {
    title: "Article with PDF Document",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "intro",
              type: "text",
              content: "# Research Paper\n\nRead our latest findings on sustainable technology.",
            },
          ],
        ],
      },
      {
        id: "section-2",
        type: "1-column",
        columns: [
          [
            {
              id: "pdf-1",
              type: "pdf",
              url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
              title: "Full Research Report",
              description: "Complete methodology and results in PDF format",
              displayMode: "both",
            },
          ],
        ],
      },
    ],
  },
};
