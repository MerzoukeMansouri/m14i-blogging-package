# m14i-blogging

Drag & drop blog builder with customizable layouts and content blocks for React applications.

## Installation

```bash
npm install m14i-blogging @hello-pangea/dnd react-markdown remark-gfm lucide-react
# or
pnpm add m14i-blogging @hello-pangea/dnd react-markdown remark-gfm lucide-react
# or
yarn add m14i-blogging @hello-pangea/dnd react-markdown remark-gfm lucide-react
```

### Prerequisites

This package requires the following in your Next.js project:

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

```tsx
import { BlogBuilder } from 'm14i-blogging'
import type { LayoutSection } from 'm14i-blogging'

function MyEditor() {
  const [sections, setSections] = useState<LayoutSection[]>([])

  return (
    <BlogBuilder
      sections={sections}
      onChange={setSections}
    />
  )
}
```

## Configuration

```tsx
<BlogBuilder
  sections={sections}
  onChange={setSections}
  config={{
    // Customize available layouts
    layouts: [
      { type: '1-column', label: 'Une colonne', icon: LayoutGrid },
      { type: '2-columns', label: 'Deux colonnes', icon: Columns }
    ],

    // Customize available blocks
    blocks: [
      { type: 'text', label: 'Texte', icon: Type },
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

    // Callbacks
    callbacks: {
      onChange: (sections) => console.log('Changed:', sections),
      onSave: (sections) => console.log('Saved:', sections)
    },

    // UI options
    ui: {
      showPreviewToggle: true,
      compactMode: false,
      sidebarWidth: '320px'
    }
  }}
/>
```

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

## Documentation

📚 **Complete documentation is available in the [docs](./docs/) folder:**

- **[Next.js Integration Guide](./docs/NEXTJS_INTEGRATION.md)** - Complete setup for Next.js App Router & Pages Router
- **[Quick Start Guide](./docs/QUICKSTART.md)** - Get started in 5 minutes
- **[Styling Guide](./docs/STYLING.md)** - Complete customization reference
- **[SEO Guide](./docs/SEO_GUIDE.md)** - Comprehensive SEO documentation
- **[Gallery Layouts](./docs/GALLERY_LAYOUTS.md)** - Grid layout examples and usage

## License

MIT
