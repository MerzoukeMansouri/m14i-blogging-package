# m14i-blogging

A powerful, customizable drag & drop blog builder for React applications with rich content blocks, flexible layouts, and automatic SEO optimization.

[![npm version](https://img.shields.io/npm/v/m14i-blogging.svg)](https://www.npmjs.com/package/m14i-blogging)
[![Storybook](https://img.shields.io/badge/Storybook-Live-ff4785?logo=storybook)](https://merzoukemansouri.github.io/m14i-blogging-package)

## Links

- **npm Package**: [https://www.npmjs.com/package/m14i-blogging](https://www.npmjs.com/package/m14i-blogging)
- **Storybook Documentation**: [https://merzoukemansouri.github.io/m14i-blogging-package](https://merzoukemansouri.github.io/m14i-blogging-package)

## What is m14i-blogging?

m14i-blogging is a complete blog content management solution that provides:

- **Visual Editor** - Drag & drop interface to build blog posts without code
- **Flexible Layouts** - Multiple column and grid layouts to structure your content
- **Rich Content Blocks** - Text (Markdown), images, videos, carousels, quotes, and PDFs
- **Automatic SEO** - Built-in meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
- **Full Customization** - Theme with CSS variables, className props, or presets
- **Next.js Integration** - Works seamlessly with both App Router and Pages Router
- **TypeScript First** - Fully typed for excellent developer experience

## How It Works

The package consists of two main components:

1. **BlogBuilder** - An interactive editor where users can:
   - Choose layout types (1-column, 2-columns, grids, etc.)
   - Drag content blocks into layout columns
   - Edit content inline with a rich editor
   - Reorder and remove sections
   - Save structured JSON data

2. **BlogPreview** - A read-only renderer that:
   - Displays the saved blog post data
   - Renders all content blocks with proper styling
   - Shows reading time estimates
   - Provides SEO metadata automatically

The data flows like this:
```
User creates content in BlogBuilder
  → Saves as JSON (LayoutSection[])
  → Store in your database
  → Render with BlogPreview for visitors
```

## Installation

### Basic Installation

```bash
npm install m14i-blogging
# or
pnpm add m14i-blogging
# or
yarn add m14i-blogging
```

Modern package managers (npm 7+, pnpm, yarn) will automatically prompt you to install peer dependencies if they're missing.

### Manual Peer Dependencies (if needed)

If your package manager doesn't auto-install peer dependencies, you may need:

```bash
npm install @hello-pangea/dnd react-markdown remark-gfm lucide-react
```

**Note:** Most React projects already have `react` and `react-dom` installed, so you typically only need the additional dependencies listed above.

### Prerequisites

This package requires the following in your project:

#### 1. Tailwind CSS

This package uses Tailwind CSS for styling. Make sure you have Tailwind CSS installed and configured:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update your `tailwind.config.js` to include the package in the content paths:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // Add this line to scan the m14i-blogging package
    './node_modules/m14i-blogging/dist/**/*.{js,mjs,cjs}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### 2. Import the CSS

In your root layout or main CSS file, import the package styles:

**For Next.js App Router** (`app/layout.tsx`):
```tsx
import 'm14i-blogging/styles';
import './globals.css'; // Your global styles
```

**For Next.js Pages Router** (`pages/_app.tsx`):
```tsx
import 'm14i-blogging/styles';
import '../styles/globals.css';
```

**Or import in your CSS file** (`globals.css`):
```css
@import 'm14i-blogging/styles';
```

#### 3. shadcn/ui Components (Required for BlogBuilder only)

If you're using the **BlogBuilder** component (the editor), you need shadcn/ui components. Install them with:

```bash
npx shadcn@latest add label input textarea select button card
```

**Note:** If you're only using **BlogPreview** or other display components, shadcn/ui is NOT required.

## Quick Start

### Basic Usage

**1. Create an Editor Page**

```tsx
'use client'; // For Next.js App Router

import { useState } from 'react';
import { BlogBuilder } from 'm14i-blogging';
import type { LayoutSection } from 'm14i-blogging';

export default function EditorPage() {
  const [sections, setSections] = useState<LayoutSection[]>([]);

  const handleSave = async () => {
    // Save sections to your database
    await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ sections }),
    });
  };

  return (
    <div>
      <BlogBuilder sections={sections} onChange={setSections} />
      <button onClick={handleSave}>Save Post</button>
    </div>
  );
}
```

**2. Display the Blog Post**

```tsx
import { BlogPreview } from 'm14i-blogging';
import type { LayoutSection } from 'm14i-blogging';

export default function BlogPost({ sections }: { sections: LayoutSection[] }) {
  return (
    <BlogPreview
      title="My Amazing Blog Post"
      sections={sections}
      showReadingTime={true}
    />
  );
}
```

**That's it!** You now have a fully functional blog editor and viewer.

### How Content is Structured

The library uses a simple JSON structure:

```typescript
// A blog post is an array of sections
const sections: LayoutSection[] = [
  {
    id: 'section-1',
    layout: '2-columns',      // Choose your layout
    columns: [
      [
        // Column 1 blocks
        {
          id: 'block-1',
          type: 'text',
          content: '# Hello World\n\nThis is **markdown** content!'
        }
      ],
      [
        // Column 2 blocks
        {
          id: 'block-2',
          type: 'image',
          src: 'https://example.com/image.jpg',
          alt: 'Example image'
        }
      ]
    ]
  }
];
```

This structure makes it easy to:
- Store in any database (JSON field)
- Version control
- Transform or migrate
- Share between applications

## Advanced Configuration

The `BlogBuilder` component accepts an optional `config` prop for deep customization:

```tsx
<BlogBuilder
  sections={sections}
  onChange={setSections}
  config={{
    // Limit available layouts
    layouts: [
      { type: '1-column', label: 'Single Column', icon: LayoutGrid },
      { type: '2-columns', label: 'Two Columns', icon: Columns }
    ],

    // Limit available content blocks
    blocks: [
      { type: 'text', label: 'Text', icon: Type },
      { type: 'image', label: 'Image', icon: ImageIcon }
    ],

    // Theme customization
    theme: {
      colors: {
        primary: '#B87333',
        border: '#e5e7eb',
        background: '#ffffff'
      }
    },

    // Event callbacks
    callbacks: {
      onChange: (sections) => {
        console.log('Content changed:', sections);
        // Auto-save, validation, etc.
      },
      onSave: (sections) => {
        console.log('Save requested:', sections);
        // Trigger your save logic
      }
    },

    // UI customization
    ui: {
      showPreviewToggle: true,  // Toggle between edit/preview
      compactMode: false,        // Compact sidebar
      sidebarWidth: '320px'      // Custom sidebar width
    }
  }}
/>
```

**All config options are optional** - the library provides sensible defaults.

## Customization & Styling

**This package is fully style customizable!** See the [Complete Styling Guide](./STYLING.md) for:

- 📦 **CSS Variables Theme System** - Quick theming with CSS variables
- 🎨 **ClassName Props** - Complete control with custom classes
- 🎭 **Theme Presets** - Pre-configured themes (dark, ocean, sunset, forest, minimal)
- 🔧 **TypeScript Support** - Fully typed theme configuration
- 📚 **Storybook Examples** - Interactive demos and playground

### Quick Styling Examples

**Method 1: CSS Variables (Easiest)**

```css
:root {
  --blog-primary: 220 100% 50%;  /* Blue theme */
  --blog-font-family: 'Inter', sans-serif;
  --blog-radius-lg: 1rem;
}
```

**Method 2: ClassName Props (Most Flexible)**

```tsx
<BlogPreview
  title="My Post"
  sections={sections}
  classNames={{
    container: "max-w-6xl mx-auto px-8",
    title: "text-6xl font-black text-purple-600"
  }}
/>
```

**Method 3: Theme Presets**

```tsx
import { applyTheme, themePresets } from 'm14i-blogging';

useEffect(() => {
  applyTheme(themePresets.ocean.cssVariables!);
}, []);
```

👉 **[Read the Full Styling Guide](./docs/STYLING.md)** for complete documentation and examples.

## Components

### BlogBuilder

Main drag & drop editor component.

**Props:**
- `sections`: `LayoutSection[]` - Current blog sections
- `onChange`: `(sections: LayoutSection[]) => void` - Called when sections change
- `config?`: `BlogBuilderConfig` - Configuration object

### BlogPreview

Read-only preview of blog post with optional reading time display.

**Props:**
- `title`: `string` - Blog post title
- `sections`: `LayoutSection[]` - Blog sections to preview
- `ImageComponent?`: Custom Image component (e.g., Next.js Image)
- `classNames?`: `BlogPreviewClassNames` - Custom styling classes
- `showReadingTime?`: `boolean` - Show reading time estimate (default: false)
- `date?`: `string | Date` - Custom date to display
- `readingTimeText?`: `string` - Custom reading time text

### ContentBlockRenderer

Renders individual content blocks (used internally).

**Props:**
- `block`: `ContentBlock` - Content block to render
- `ImageComponent?`: Custom Image component
- `classNames?`: `ContentBlockClassNames` - Custom styling classes

### ContentBlockInlineEditor

Inline editor for content blocks (requires shadcn/ui components).

### BlogSEO (App Router)

SEO component for Next.js App Router that renders JSON-LD structured data.

**Props:**
- `post`: `BlogPost` - Blog post with SEO metadata
- `config`: `SEOConfig` - SEO configuration
- `options?`: Optional breadcrumbs and author settings

### BlogHead (Pages Router)

SEO component for Next.js Pages Router that renders all meta tags and structured data.

**Props:**
- `post`: `BlogPost` - Blog post with SEO metadata
- `config`: `SEOConfig` - SEO configuration
- `options?`: Optional breadcrumbs and author settings
- `children?`: Additional meta tags to include

## Layouts

The library supports the following layout types:

### Column Layouts
- **1-column** - Single column layout
- **2-columns** - Two equal columns
- **3-columns** - Three equal columns
- **2-columns-wide-left** - Two columns (left wider)
- **2-columns-wide-right** - Two columns (right wider)

### Grid Layouts
- **grid-2x2** - 2×2 grid (4 cells) - Perfect for features, services
- **grid-3x3** - 3×3 grid (9 cells) - Ideal for portfolios, teams
- **grid-2x3** - 2×3 grid (6 cells) - Great for mixed content
- **grid-4-even** - 4 equal columns - Best for stats, galleries

Grid layouts let you place **any content type** in each cell (text, images, videos, PDFs, quotes).

## Content Blocks

The library supports the following content block types:

- **Text** - Markdown-formatted text with full formatting support
- **Image** - Display images with captions and alt text
- **Video** - Embed YouTube and Vimeo videos
- **Carousel** - Interactive image slideshow with navigation, auto-play, and multiple aspect ratios
- **Quote** - Styled blockquotes with author attribution
- **PDF** - Embed or link to PDF documents

### PDF Content Block

Display PDF documents in your blog posts:

```tsx
const pdfBlock: PDFBlock = {
  id: "pdf-1",
  type: "pdf",
  url: "https://example.com/document.pdf",
  title: "Annual Report 2024",
  description: "Financial performance overview",
  displayMode: "both",  // "embed" | "download" | "both"
  height: "600px"       // Custom height for embed
};
```

**Display Modes:**
- `embed` - Show PDF in iframe only
- `download` - Show download button only
- `both` - Show both iframe and download (default)

### Carousel Content Block

Interactive image slideshow with full navigation controls:

```tsx
const carouselBlock: CarouselBlock = {
  id: "carousel-1",
  type: "carousel",
  slides: [
    {
      src: "https://example.com/slide1.jpg",
      alt: "Slide 1",
      title: "Title",        // Optional
      caption: "Description" // Optional
    },
    // ... more slides
  ],
  autoPlay: true,          // Auto-play slides (default: false)
  autoPlayInterval: 3000,  // Interval in ms (default: 3000)
  showDots: true,          // Show dot indicators (default: true)
  showArrows: true,        // Show nav arrows (default: true)
  loop: true,              // Loop back to start (default: true)
  aspectRatio: "16/9"      // "16/9" | "4/3" | "1/1" | "21/9" (default: "16/9")
};
```

**Features:**
- ✅ Auto-play with configurable interval
- ✅ Arrow navigation (left/right)
- ✅ Dot indicators
- ✅ Loop mode
- ✅ Multiple aspect ratios
- ✅ Title & caption overlays
- ✅ Smooth transitions
- ✅ Responsive design

## 🚀 Automatic SEO Features

**NEW!** This package now includes comprehensive automatic SEO optimization:

- ✅ **Automatic meta tag generation** (title, description, keywords)
- ✅ **Open Graph tags** for social media sharing (Facebook, LinkedIn)
- ✅ **Twitter Card tags** for optimized Twitter sharing
- ✅ **JSON-LD structured data** (Schema.org Article/BlogPosting)
- ✅ **Reading time calculation** and display
- ✅ **Auto-generated excerpts** from content
- ✅ **SEO validation and scoring** with actionable warnings
- ✅ **Next.js App Router & Pages Router** integration
- ✅ **Smart defaults** - auto-fills missing SEO fields

### Quick SEO Setup

**1. Configure SEO settings:**

```tsx
import type { SEOConfig } from 'm14i-blogging';

const seoConfig: SEOConfig = {
  siteUrl: 'https://yourblog.com',
  siteName: 'Your Blog Name',
  defaultAuthor: {
    name: 'Your Name',
    url: 'https://yourblog.com/author/yourname',
  },
  twitterSite: '@yourblog',
  enableStructuredData: true,
  autoGenerateDefaults: true,
};
```

**2. Add SEO to your blog posts:**

```tsx
// Extended BlogPost type with SEO fields
const post: BlogPost = {
  title: 'Your Blog Post Title',
  slug: 'your-blog-post-slug',
  excerpt: 'A brief description of your post',
  featuredImage: 'https://example.com/image.jpg',

  // SEO fields (all optional - auto-generated if missing!)
  author: {
    name: 'John Doe',
    social: { twitter: '@johndoe' }
  },
  tags: ['SEO', 'React', 'Next.js'],
  category: 'Web Development',
  publishedDate: '2024-01-15T10:00:00Z',

  sections: [/* your content */],
};
```

**3. Use with Next.js App Router:**

```tsx
import { generateBlogMetadata, BlogSEO } from 'm14i-blogging';

// Generate metadata for SEO
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  return generateBlogMetadata(post, seoConfig);
}

export default function BlogPage({ params }) {
  const post = getPost(params.slug);

  return (
    <>
      <BlogSEO post={post} config={seoConfig} />
      <BlogPreview
        title={post.title}
        sections={post.sections}
        showReadingTime={true}
      />
    </>
  );
}
```

**4. Or use with Next.js Pages Router:**

```tsx
import Head from 'next/head';
import { BlogHead } from 'm14i-blogging';

export default function BlogPage({ post }) {
  return (
    <>
      <Head>
        <BlogHead post={post} config={seoConfig} />
      </Head>
      <BlogPreview
        title={post.title}
        sections={post.sections}
        showReadingTime={true}
      />
    </>
  );
}
```

### What Gets Generated Automatically

The package automatically generates:

1. **Meta Tags:**
   - `<title>` - Page title
   - `<meta name="description">` - Auto-generated from excerpt or content
   - `<meta name="keywords">` - From tags
   - `<link rel="canonical">` - Canonical URL

2. **Open Graph Tags:**
   - `og:title`, `og:description`, `og:image`, `og:url`
   - `article:published_time`, `article:modified_time`
   - `article:author`, `article:section`, `article:tag`

3. **Twitter Card Tags:**
   - `twitter:card`, `twitter:site`, `twitter:creator`
   - `twitter:title`, `twitter:description`, `twitter:image`

4. **JSON-LD Structured Data:**
   - BlogPosting schema with full metadata
   - Person schema for author
   - Breadcrumb schema (optional)

5. **Content Analysis:**
   - Word count
   - Reading time estimation
   - Auto-generated excerpt
   - Heading hierarchy extraction
   - SEO health score

### SEO Utilities

```tsx
import {
  // Content analysis
  analyzeContent,
  calculateReadingTime,
  generateExcerpt,

  // SEO validation
  validateSEO,
  getSEOScore,

  // Meta generation
  generateBlogMetadata,
  generateHTMLMetaTags,

  // Structured data
  generateArticleSchema,
  generateAllStructuredData,
} from 'm14i-blogging';

// Analyze blog content
const analysis = analyzeContent(post);
// { wordCount: 1250, readingTime: 5, autoExcerpt: "...", headings: [...] }

// Get SEO score and warnings
const score = getSEOScore(post, seoConfig);
// { score: 85, grade: 'good', warnings: [...] }
```

👉 **[Read the Complete SEO Guide](./docs/SEO_GUIDE.md)** for detailed documentation, best practices, and advanced usage.

## Types

```typescript
// Core types
import type {
  LayoutSection,
  ContentBlock,
  LayoutType,
  ContentBlockType,
  TextBlock,
  ImageBlock,
  VideoBlock,
  CarouselBlock,
  QuoteBlock,
  PDFBlock,
  BlogPost,
  BlogBuilderConfig
} from 'm14i-blogging'

// Theme & styling types
import type {
  CSSVariablesTheme,
  BlogTheme,
  BlogPreviewClassNames,
  ContentBlockClassNames
} from 'm14i-blogging'

// SEO types
import type {
  SEOConfig,
  SEOMetadata,
  OpenGraphMetadata,
  TwitterCardMetadata,
  AuthorInfo,
  ArticleSchema,
  ContentAnalysis
} from 'm14i-blogging'

// Theme presets and utilities
import { themePresets, applyTheme } from 'm14i-blogging'
```

## Utilities

```typescript
import {
  createEmptyColumns,
  getLayoutClasses,
  getLayoutLabel
} from 'm14i-blogging'
```

## Live Examples

Explore interactive examples and all components in our Storybook:

**[View Storybook →](https://merzoukemansouri.github.io/m14i-blogging-package)**

The Storybook includes:
- All layout types with live previews
- Every content block type with examples
- Theme customization playground
- SEO metadata examples
- Integration code snippets

## Documentation

📚 **Complete documentation is available in the [docs](./docs/) folder:**

- **[Next.js Integration Guide](./docs/NEXTJS_INTEGRATION.md)** - Complete setup for Next.js App Router & Pages Router
- **[Quick Start Guide](./docs/QUICKSTART.md)** - Get started in 5 minutes
- **[Styling Guide](./docs/STYLING.md)** - Complete customization reference
- **[SEO Guide](./docs/SEO_GUIDE.md)** - Comprehensive SEO documentation
- **[Gallery Layouts](./docs/GALLERY_LAYOUTS.md)** - Grid layout examples and usage

## Real-World Usage Example

Here's a complete example of how to use this package in a Next.js application:

```tsx
// app/admin/editor/page.tsx (Admin editor)
'use client';

import { useState } from 'react';
import { BlogBuilder } from 'm14i-blogging';
import type { LayoutSection } from 'm14i-blogging';

export default function AdminEditor() {
  const [sections, setSections] = useState<LayoutSection[]>([]);
  const [title, setTitle] = useState('');

  const handlePublish = async () => {
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        sections,
        publishedDate: new Date().toISOString(),
      }),
    });
  };

  return (
    <div className="container mx-auto p-8">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title..."
        className="text-4xl font-bold mb-8 w-full"
      />
      <BlogBuilder sections={sections} onChange={setSections} />
      <button onClick={handlePublish}>Publish Post</button>
    </div>
  );
}

// app/blog/[slug]/page.tsx (Public blog post)
import { BlogPreview, BlogSEO, generateBlogMetadata } from 'm14i-blogging';
import type { BlogPost, SEOConfig } from 'm14i-blogging';

const seoConfig: SEOConfig = {
  siteUrl: 'https://yourblog.com',
  siteName: 'Your Blog',
  defaultAuthor: { name: 'Your Name' },
};

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return generateBlogMetadata(post, seoConfig);
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);

  return (
    <>
      <BlogSEO post={post} config={seoConfig} />
      <article className="container mx-auto px-4 py-8">
        <BlogPreview
          title={post.title}
          sections={post.sections}
          showReadingTime={true}
          date={post.publishedDate}
        />
      </article>
    </>
  );
}

async function getPost(slug: string): Promise<BlogPost> {
  // Fetch from your database
  const res = await fetch(`https://api.yourblog.com/posts/${slug}`);
  return res.json();
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
