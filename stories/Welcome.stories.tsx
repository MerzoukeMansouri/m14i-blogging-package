import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogPreview } from "../src/components/BlogPreview";

const meta: Meta = {
  title: "Getting Started/Welcome",
  component: BlogPreview,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Welcome to m14i-blogging

A powerful, flexible React blogging system with support for rich layouts, multimedia content, and complete customization.

## Quick Links

- **Core Components** - BlogBuilder, BlogPreview, and basic usage
- **Complete Examples** - Real-world blog posts, portfolios, and more
- **Content Blocks** - Text, images, videos, quotes, carousels, PDFs
- **Layouts** - Column layouts and grid systems
- **Theming** - CSS variables and className customization
- **Advanced** - Feature combinations and complex use cases
- **SEO** - Metadata, Open Graph, and structured data

## Get Started

Explore the stories in the sidebar to see what's possible!
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BlogPreview>;

export const Overview: Story = {
  name: "📖 Feature Overview",
  args: {
    title: "Welcome to m14i-blogging - A Complete Guide",
    sections: [
      {
        id: "intro",
        type: "1-column",
        columns: [
          [
            {
              id: "intro-text",
              type: "text",
              content: `# Welcome to m14i-blogging! 👋

A powerful, flexible React blogging system that makes creating beautiful content effortless.

## What Can You Build?

✅ **Blog Posts** - Rich articles with markdown, images, and videos
✅ **Portfolios** - Showcase your work with galleries and carousels
✅ **Documentation** - Technical guides with PDFs and code examples
✅ **Landing Pages** - Marketing content with grids and CTAs
✅ **Course Content** - Educational material with structured lessons
✅ **Case Studies** - In-depth project showcases
✅ **Event Pages** - Conferences, workshops, and announcements
✅ **News Articles** - Magazine-style multimedia stories

And much more! If you can imagine it, you can build it.`,
            },
          ],
        ],
      },
      {
        id: "features",
        type: "1-column",
        columns: [
          [
            {
              id: "features-title",
              type: "text",
              content: "## Core Features",
            },
          ],
        ],
      },
      {
        id: "features-grid",
        type: "grid-3x3",
        columns: [
          [
            {
              id: "f1",
              type: "text",
              content: "### 📝 Rich Content\n\nMarkdown support with text, images, videos, quotes, PDFs, galleries, and carousels.",
            },
          ],
          [
            {
              id: "f2",
              type: "text",
              content: "### 📐 Flexible Layouts\n\n1, 2, 3 columns, plus grid layouts (2x2, 3x3, 2x3, 4-even) for any design.",
            },
          ],
          [
            {
              id: "f3",
              type: "text",
              content: "### 🎨 Full Customization\n\nCSS variables, className props, and theme presets for complete control.",
            },
          ],
          [
            {
              id: "f4",
              type: "text",
              content: "### 📱 Responsive Design\n\nMobile-first, works beautifully on all screen sizes automatically.",
            },
          ],
          [
            {
              id: "f5",
              type: "text",
              content: "### 🔍 SEO Ready\n\nBuilt-in meta tags, Open Graph, Twitter Cards, and JSON-LD structured data.",
            },
          ],
          [
            {
              id: "f6",
              type: "text",
              content: "### ⚡ TypeScript\n\nFull TypeScript support with comprehensive types for safety and autocomplete.",
            },
          ],
          [
            {
              id: "f7",
              type: "text",
              content: "### 🧩 Component Library\n\nBring your own UI components (shadcn, MUI, Chakra, etc.).",
            },
          ],
          [
            {
              id: "f8",
              type: "text",
              content: "### 🎯 Accessibility\n\nWCAG 2.1 compliant with semantic HTML and ARIA labels.",
            },
          ],
          [
            {
              id: "f9",
              type: "text",
              content: "### 📦 Framework Agnostic\n\nWorks with Next.js, Remix, Vite, CRA, or any React setup.",
            },
          ],
        ],
      },
      {
        id: "content-blocks",
        type: "1-column",
        columns: [
          [
            {
              id: "blocks-title",
              type: "text",
              content: "## Content Block Types",
            },
          ],
        ],
      },
      {
        id: "blocks-grid",
        type: "grid-2x3",
        columns: [
          [
            {
              id: "b1",
              type: "text",
              content: `### 📄 Text Block

Markdown-powered text with:
- Headings (h1-h6)
- **Bold**, *italic*, \`code\`
- Lists (ordered & unordered)
- Links and more

Perfect for articles and documentation.`,
            },
          ],
          [
            {
              id: "b2",
              type: "text",
              content: `### 🖼️ Image Block

Display images with:
- Captions
- Alt text (SEO)
- Responsive sizing
- Multiple sources

Great for visual storytelling.`,
            },
          ],
          [
            {
              id: "b3",
              type: "text",
              content: `### 🎬 Video Block

Embed videos with:
- Thumbnails
- Descriptions
- Multiple formats
- Controls

Ideal for tutorials and demos.`,
            },
          ],
          [
            {
              id: "b4",
              type: "text",
              content: `### 💬 Quote Block

Beautiful blockquotes with:
- Quote content
- Author attribution
- Role/title
- Custom styling

Perfect for testimonials.`,
            },
          ],
          [
            {
              id: "b5",
              type: "text",
              content: `### 🎠 Carousel Block

Image carousels with:
- Auto-play
- Navigation (dots/arrows)
- Multiple aspect ratios
- Captions & titles

Showcase portfolios.`,
            },
          ],
          [
            {
              id: "b6",
              type: "text",
              content: `### 📑 PDF Block

Embed PDFs with:
- Inline viewer
- Download button
- Title & description
- Custom height

Share documents easily.`,
            },
          ],
        ],
      },
      {
        id: "layouts",
        type: "1-column",
        columns: [
          [
            {
              id: "layouts-title",
              type: "text",
              content: "## Layout Options",
            },
          ],
        ],
      },
      {
        id: "layouts-showcase",
        type: "2-columns",
        columns: [
          [
            {
              id: "column-layouts",
              type: "text",
              content: `### Column Layouts

**1-column**
Full-width content, perfect for:
- Hero sections
- Introductions
- Full-width images

**2-columns**
Side-by-side content, ideal for:
- Text + Image
- Comparisons
- Before/After

**3-columns**
Three equal columns for:
- Feature cards
- Pricing tables
- Team members`,
            },
          ],
          [
            {
              id: "grid-layouts",
              type: "text",
              content: `### Grid Layouts

**grid-2x2**
2x2 grid (4 cells) for:
- Services
- Stats
- Features

**grid-3x3**
3x3 grid (9 cells) for:
- Portfolios
- Galleries
- Team pages

**grid-2x3**
2x3 grid (6 cells) for:
- Features
- Benefits
- Use cases

**grid-4-even**
4 equal columns for:
- Stats
- Metrics
- Quick facts`,
            },
          ],
        ],
      },
      {
        id: "customization",
        type: "1-column",
        columns: [
          [
            {
              id: "custom-title",
              type: "text",
              content: "## Customization & Theming",
            },
          ],
        ],
      },
      {
        id: "custom-options",
        type: "3-columns",
        columns: [
          [
            {
              id: "css-vars",
              type: "text",
              content: `### CSS Variables

Control everything:
- Colors (primary, bg, text)
- Typography (fonts, sizes)
- Spacing (margins, padding)
- Border radius
- Shadows

Apply globally with themes.`,
            },
          ],
          [
            {
              id: "classnames",
              type: "text",
              content: `### ClassName Props

Target specific elements:
- Container
- Sections
- Columns
- Content blocks

Use with Tailwind or any CSS framework.`,
            },
          ],
          [
            {
              id: "presets",
              type: "text",
              content: `### Theme Presets

Ready-to-use themes:
- Default (light)
- Dark mode
- Ocean (blue)
- Sunset (warm)
- Forest (green)
- Minimal (serif)

Or create your own!`,
            },
          ],
        ],
      },
      {
        id: "usage",
        type: "1-column",
        columns: [
          [
            {
              id: "usage-title",
              type: "text",
              content: `## Quick Start

### Installation

\`\`\`bash
npm install m14i-blogging
\`\`\`

### Basic Usage

\`\`\`tsx
import { BlogPreview } from 'm14i-blogging';

const sections = [
  {
    id: '1',
    type: '1-column',
    columns: [[
      {
        id: 'intro',
        type: 'text',
        content: '# Hello World\\n\\nMy first blog post!'
      }
    ]]
  }
];

function MyBlog() {
  return (
    <BlogPreview
      title="My First Post"
      sections={sections}
    />
  );
}
\`\`\`

### With Builder (Interactive Editor)

\`\`\`tsx
import { BlogBuilder } from 'm14i-blogging';

function BlogEditor() {
  const [sections, setSections] = useState([]);

  return (
    <BlogBuilder
      sections={sections}
      onChange={setSections}
    />
  );
}
\`\`\`

That's it! Check out the other stories for more examples.`,
            },
          ],
        ],
      },
      {
        id: "examples",
        type: "1-column",
        columns: [
          [
            {
              id: "examples-title",
              type: "text",
              content: "## Explore Examples",
            },
          ],
        ],
      },
      {
        id: "examples-grid",
        type: "grid-2x2",
        columns: [
          [
            {
              id: "ex1",
              type: "text",
              content: `### 📝 Complete Examples

Navigate to **Complete Examples** in the sidebar to see:

- Tech Blog Post
- Creative Portfolio
- Product Launch Page
- Company News
- Documentation
- Magazine Article`,
            },
          ],
          [
            {
              id: "ex2",
              type: "text",
              content: `### 🎨 Theming

Explore **Theming** section:

- CSS Variables
- ClassName Props
- Theme Playground
- Dark Mode
- Custom Themes`,
            },
          ],
          [
            {
              id: "ex3",
              type: "text",
              content: `### 📐 Layouts

Check out **Layouts** folder:

- Gallery Grids
- Column Layouts
- Responsive Examples
- Complex Grids`,
            },
          ],
          [
            {
              id: "ex4",
              type: "text",
              content: `### 🚀 Advanced

See **Advanced Use Cases**:

- Mixed Media Posts
- Event Pages
- Online Courses
- Case Studies
- Feature Combos`,
            },
          ],
        ],
      },
      {
        id: "quote",
        type: "1-column",
        columns: [
          [
            {
              id: "quote-block",
              type: "quote",
              content: "The best blogging system is the one that gets out of your way and lets you create.",
              author: "m14i-blogging Philosophy",
            },
          ],
        ],
      },
      {
        id: "resources",
        type: "2-columns",
        columns: [
          [
            {
              id: "links",
              type: "text",
              content: `## Resources

- **Documentation:** Full API reference
- **GitHub:** Source code & issues
- **NPM:** Package registry
- **Discord:** Community support

### Need Help?

Browse the stories in this Storybook to learn by example. Each story shows real-world usage with code you can copy and adapt.`,
            },
          ],
          [
            {
              id: "next-steps",
              type: "text",
              content: `## Next Steps

1. **Explore** the Complete Examples
2. **Try** the BlogBuilder component
3. **Customize** with theming options
4. **Build** your first blog post
5. **Share** your creation!

### Start Building!

Pick a story that matches your use case and start building. The code is yours to use and modify.`,
            },
          ],
        ],
      },
    ],
  },
};
