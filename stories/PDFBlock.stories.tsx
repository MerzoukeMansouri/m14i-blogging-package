import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogPreview } from "../src/components/BlogPreview";
import type { LayoutSection } from "../src/types";

const meta: Meta<typeof BlogPreview> = {
  title: "Content Blocks/PDF",
  component: BlogPreview,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# PDF Content Block

Display PDF documents in your blog posts with multiple viewing options.

## Features

- **Embed Mode**: Display PDF inline in an iframe
- **Download Mode**: Show download button only
- **Both Mode**: Embed + Download button (default)
- **Customizable Height**: Set custom iframe height
- **Title & Description**: Add context to the PDF

## Usage

\`\`\`tsx
const pdfBlock: PDFBlock = {
  id: "pdf-1",
  type: "pdf",
  url: "https://example.com/document.pdf",
  title: "Annual Report 2024",
  description: "Our company's financial performance",
  displayMode: "both",  // "embed" | "download" | "both"
  height: "600px"
};
\`\`\`

## Display Modes

- **embed**: Shows PDF in iframe only
- **download**: Shows download button only
- **both**: Shows both iframe and download button (default)
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BlogPreview>;

// Sample PDF URLs (using PDF specifications and public documents)
const SAMPLE_PDF_URL = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

// Default - Both embed and download
export const Default: Story = {
  args: {
    title: "PDF Document Example",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "pdf-1",
              type: "pdf",
              url: SAMPLE_PDF_URL,
              title: "Sample Document",
              description: "This is a sample PDF document showing the default display mode (both embed and download).",
            },
          ],
        ],
      },
    ],
  },
};

// Embed only
export const EmbedOnly: Story = {
  args: {
    title: "Embedded PDF",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "pdf-1",
              type: "pdf",
              url: SAMPLE_PDF_URL,
              title: "Embedded Annual Report",
              description: "View the report directly in the page.",
              displayMode: "embed",
              height: "700px",
            },
          ],
        ],
      },
    ],
  },
};

// Download only
export const DownloadOnly: Story = {
  args: {
    title: "Download PDF",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "text-1",
              type: "text",
              content: "## Important Document\n\nPlease download the PDF below to review our terms and conditions.",
            },
            {
              id: "pdf-1",
              type: "pdf",
              url: SAMPLE_PDF_URL,
              title: "Terms and Conditions",
              description: "Download to read our complete terms of service.",
              displayMode: "download",
            },
          ],
        ],
      },
    ],
  },
};

// Multiple PDFs
export const MultiplePDFs: Story = {
  args: {
    title: "Resource Library",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "text-1",
              type: "text",
              content: "# Company Resources\n\nDownload our essential documents below.",
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
              id: "pdf-1",
              type: "pdf",
              url: SAMPLE_PDF_URL,
              title: "Annual Report 2024",
              description: "Financial performance and key metrics",
              displayMode: "download",
            },
          ],
          [
            {
              id: "pdf-2",
              type: "pdf",
              url: SAMPLE_PDF_URL,
              title: "Product Catalog",
              description: "Complete list of our products and services",
              displayMode: "download",
            },
          ],
        ],
      },
      {
        id: "section-3",
        type: "2-columns",
        columns: [
          [
            {
              id: "pdf-3",
              type: "pdf",
              url: SAMPLE_PDF_URL,
              title: "Safety Guidelines",
              description: "Important safety information",
              displayMode: "download",
            },
          ],
          [
            {
              id: "pdf-4",
              type: "pdf",
              url: SAMPLE_PDF_URL,
              title: "Installation Manual",
              description: "Step-by-step installation instructions",
              displayMode: "download",
            },
          ],
        ],
      },
    ],
  },
};

// Custom height
export const CustomHeight: Story = {
  args: {
    title: "Tall Document",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "pdf-1",
              type: "pdf",
              url: SAMPLE_PDF_URL,
              title: "Extended Document",
              description: "This PDF viewer has a custom height of 900px.",
              displayMode: "embed",
              height: "900px",
            },
          ],
        ],
      },
    ],
  },
};

// Compact height
export const CompactHeight: Story = {
  args: {
    title: "Compact Viewer",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "pdf-1",
              type: "pdf",
              url: SAMPLE_PDF_URL,
              title: "Quick Reference",
              description: "Compact viewer at 400px height.",
              displayMode: "embed",
              height: "400px",
            },
          ],
        ],
      },
    ],
  },
};

// Without title/description
export const MinimalPDF: Story = {
  args: {
    title: "Minimal PDF Display",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "pdf-1",
              type: "pdf",
              url: SAMPLE_PDF_URL,
              displayMode: "both",
            },
          ],
        ],
      },
    ],
  },
};

// Empty PDF (no URL)
export const EmptyPDF: Story = {
  args: {
    title: "No PDF Loaded",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "pdf-1",
              type: "pdf",
              url: "",
              title: "Missing Document",
              description: "The PDF URL is not provided.",
            },
          ],
        ],
      },
    ],
  },
};

// Mixed content with PDF
export const MixedContent: Story = {
  args: {
    title: "Article with PDF Resources",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "text-1",
              type: "text",
              content: "# Understanding Our Process\n\nOur methodology is documented in detail. Read the overview below and download the full specification.",
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
              id: "text-2",
              type: "text",
              content: "## Key Steps\n\n1. **Analysis** - We analyze your requirements\n2. **Design** - Create a tailored solution\n3. **Implementation** - Execute with precision\n4. **Review** - Continuous improvement",
            },
          ],
          [
            {
              id: "pdf-1",
              type: "pdf",
              url: SAMPLE_PDF_URL,
              title: "Full Specification",
              description: "Complete technical documentation",
              displayMode: "download",
            },
          ],
        ],
      },
      {
        id: "section-3",
        type: "1-column",
        columns: [
          [
            {
              id: "quote-1",
              type: "quote",
              content: "Documentation is a love letter that you write to your future self.",
              author: "Damian Conway",
              role: "Software Developer",
            },
          ],
        ],
      },
    ],
  },
};

// Custom styling with className
export const CustomStyling: Story = {
  args: {
    title: "Styled PDF Viewer",
    sections: [
      {
        id: "section-1",
        type: "1-column",
        columns: [
          [
            {
              id: "pdf-1",
              type: "pdf",
              url: SAMPLE_PDF_URL,
              title: "Styled Document",
              description: "This PDF has custom styling applied via classNames prop.",
              displayMode: "both",
            },
          ],
        ],
      },
    ],
  },
  render: (args) => (
    <BlogPreview
      {...args}
      classNames={{
        container: "max-w-5xl mx-auto px-6",
      }}
    />
  ),
};
