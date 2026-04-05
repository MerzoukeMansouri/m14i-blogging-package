# m14i-blogging

A complete blog management system for React/Next.js applications with admin interface and public blog display.

[![npm version](https://img.shields.io/npm/v/m14i-blogging.svg)](https://www.npmjs.com/package/m14i-blogging)
[![Storybook](https://img.shields.io/badge/Storybook-Live-ff4785?logo=storybook)](https://merzoukemansouri.github.io/m14i-blogging-package)

## Links

- **npm Package**: [https://www.npmjs.com/package/m14i-blogging](https://www.npmjs.com/package/m14i-blogging)
- **Live Storybook**: [https://merzoukemansouri.github.io/m14i-blogging-package](https://merzoukemansouri.github.io/m14i-blogging-package)

## What is m14i-blogging?

A complete blog content management solution with two main components:

- **BlogAdmin** - Complete admin interface for managing posts, categories, and tags
- **Blog** - Public-facing blog with multiple layouts, search, and filtering

## Quick Start

### Installation

```bash
npm install m14i-blogging
```

### 1. Setup Database

Apply the blog schema migrations to your Supabase database:

```bash
supabase db push
```

Or copy migrations from `node_modules/m14i-blogging/supabase/migrations/`

### 2. Configure Tailwind

Add to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/m14i-blogging/dist/**/*.{js,mjs,cjs}', // Add this line
  ],
  // ... rest of config
}
```

### 3. Import Styles

In your root layout or `_app.tsx`:

```tsx
import 'm14i-blogging/styles';
```

## Using BlogAdmin

Complete admin interface for managing your blog.

### Create API Routes

**app/api/blog/route.ts**
```typescript
import { createClient } from "@/lib/supabase/server";
import { createListPostsHandler, createCreatePostHandler, createBlogClient } from "m14i-blogging/server";

async function getBlogClient() {
  const supabase = await createClient();
  return createBlogClient(supabase);
}

export const GET = createListPostsHandler(getBlogClient);
export const POST = createCreatePostHandler(getBlogClient, checkAuth);
```

**app/api/blog/[id]/route.ts**
```typescript
import { createClient } from "@/lib/supabase/server";
import { createUpdatePostHandler, createDeletePostHandler, createBlogClient } from "m14i-blogging/server";

async function getBlogClient() {
  const supabase = await createClient();
  return createBlogClient(supabase);
}

export const PATCH = createUpdatePostHandler(getBlogClient, checkAuth);
export const DELETE = createDeletePostHandler(getBlogClient, checkAuth);
```

**app/api/blog/categories/route.ts** and **app/api/blog/tags/route.ts** - Similar pattern

### Create Admin Page

**app/admin/blog/page.tsx**
```tsx
import { BlogAdmin } from "m14i-blogging/admin";
import { Button, Input, Card, Badge } from "@/components/ui";
import { BlogBuilder } from "m14i-blogging";

export default function BlogAdminPage() {
  const user = await getUser(); // Your auth logic
  const isAdmin = user?.role === "admin";

  return (
    <BlogAdmin
      isAllowed={isAdmin}
      currentUser={user}
      basePath="/admin/blog"
      apiBasePath="/api/blog"
      components={{
        Button,
        Input,
        Card,
        Badge,
        BlogBuilder,
      }}
    />
  );
}
```

**Features:**
- ✅ Complete CRUD operations for posts, categories, and tags
- ✅ Rich drag-and-drop editor (BlogBuilder)
- ✅ Live preview system
- ✅ Auto-save functionality
- ✅ SEO metadata fields
- ✅ Inline taxonomy creation
- ✅ Access control
- ✅ Fully customizable

📖 **[Complete BlogAdmin Guide →](./docs/BLOG_ADMIN_GUIDE.md)**

## Using Blog

Public-facing blog interface with multiple layouts and filtering.

### Create Blog Page

**app/blog/[[...path]]/page.tsx**
```tsx
import { Blog } from "m14i-blogging/public";
import { Button, Card, Badge, Input } from "@/components/ui";

export default function BlogPage() {
  return (
    <Blog
      basePath="/blog"
      apiBasePath="/api/blog"
      display={{
        layout: "grid", // "grid" | "list" | "masonry" | "magazine"
        postsPerPage: 9,
      }}
      features={{
        search: true,
        categoryFilter: true,
        tagFilter: true,
        relatedPosts: true,
      }}
      components={{
        Button,
        Card,
        Badge,
        Input,
      }}
    />
  );
}
```

**Features:**
- ✅ Multiple layouts (Grid, List, Masonry, Magazine)
- ✅ Internal routing (list/detail/category/tag/search)
- ✅ Full-text search
- ✅ Category and tag filtering
- ✅ Pagination
- ✅ Related posts
- ✅ SEO-ready
- ✅ Fully customizable

📖 **[Complete Blog Guide →](./docs/BLOG_GUIDE.md)**

## Customization

### Quick Theme with CSS Variables

```css
:root {
  --blog-primary: 220 100% 50%;
  --blog-font-family: 'Inter', sans-serif;
  --blog-radius-lg: 1rem;
}
```

### Custom Styling with ClassName Props

```tsx
<Blog
  classNames={{
    container: "max-w-6xl mx-auto px-8",
    postTitle: "text-5xl font-bold text-blue-600"
  }}
/>
```

📖 **[Complete Styling Guide →](./docs/STYLING.md)**

## SEO Features

Automatic SEO optimization included:

- ✅ Meta tags generation (title, description, keywords)
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card tags
- ✅ JSON-LD structured data (Schema.org)
- ✅ Reading time calculation
- ✅ Auto-generated excerpts

📖 **[Complete SEO Guide →](./docs/SEO_GUIDE.md)**

## Content Blocks

Supported content block types:

- **Text** - Markdown-formatted text
- **Image** - Images with captions and alt text
- **Video** - YouTube and Vimeo embeds
- **Carousel** - Interactive image slideshow
- **Quote** - Styled blockquotes
- **PDF** - Embed or download PDFs

## Layout Options

### Column Layouts
- 1-column, 2-columns, 3-columns
- 2-columns-wide-left, 2-columns-wide-right

### Grid Layouts
- grid-2x2 (4 cells)
- grid-3x3 (9 cells)
- grid-2x3 (6 cells)
- grid-4-even (4 equal columns)

## TypeScript Support

Fully typed with comprehensive type exports:

```typescript
import type {
  // Database types
  BlogPostRow,
  BlogPostInsert,
  BlogPostUpdate,
  CategoryRow,
  TagRow,

  // Component types
  BlogAdminProps,
  BlogProps,
  LayoutSection,
  ContentBlock,
} from 'm14i-blogging';
```

## Package Exports

Clean separation through multiple entry points:

```javascript
import { BlogBuilder, BlogPreview } from 'm14i-blogging';           // Core components
import { BlogAdmin } from 'm14i-blogging/admin';                    // Admin interface
import { Blog } from 'm14i-blogging/public';                        // Public blog
import { createBlogClient } from 'm14i-blogging/client';            // Data layer
import { createListPostsHandler } from 'm14i-blogging/server';      // API handlers
import 'm14i-blogging/styles';                                      // Styles
```

## AI Content Generation

The package includes an AI-powered content generator using Anthropic's Claude API.

### Recommended Model

**Claude Haiku 4.5** (`claude-haiku-4-5`) - Best choice for blog generation:
- ⚡ Fast JSON generation (2x faster than Haiku 3.5)
- 💰 Cost-effective (3x cheaper than Sonnet 4)
- 🎯 Excellent coding performance (similar to Sonnet 4)
- 📊 Consistent structured output with temperature 0.3

### Example Configuration

```typescript
import { createAIContentGenerator } from "m14i-blogging/server";

const generator = createAIContentGenerator({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: "claude-haiku-4-5", // Recommended
  maxTokens: 800,
  temperature: 0.3, // Lower for consistent JSON
});

// Generate layout
const layout = await generator.generateLayout({
  prompt: "Article about web development",
  language: "fr", // "en" | "fr"
});
```

**Note:** Claude Haiku 3.5 (`claude-3-5-haiku-20241022`) was retired on February 19, 2026.

## Documentation

📚 **Complete documentation:**

- **[Installation Guide](./docs/INSTALLATION.md)** - Step-by-step setup
- **[Quick Start Guide](./docs/QUICKSTART.md)** - Get started in 5 minutes
- **[BlogAdmin Guide](./docs/BLOG_ADMIN_GUIDE.md)** - Complete admin interface guide
- **[Blog Guide](./docs/BLOG_GUIDE.md)** - Complete public blog guide
- **[Styling Guide](./docs/STYLING.md)** - Customization reference
- **[SEO Guide](./docs/SEO_GUIDE.md)** - SEO optimization

## Live Examples

Explore interactive examples in our Storybook:

**[View Storybook →](https://merzoukemansouri.github.io/m14i-blogging-package)**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
