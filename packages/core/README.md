# @m14i/blogging-core

Zero-dependency blog rendering and data layer for React/Next.js.

## Installation

```bash
npm install @m14i/blogging-core react react-dom lucide-react
```

## Features

- 🎨 Public blog UI with 4 layouts (Grid, List, Masonry, Magazine)
- 🔍 Built-in search, filtering, pagination
- 📱 Responsive and accessible
- 🚀 SEO optimized (meta tags, JSON-LD, sitemaps)
- 💾 Supabase integration
- 📦 Zero heavy dependencies (~50KB)

## Quick Start

```tsx
import { Blog } from '@m14i/blogging-core';
import '@m14i/blogging-core/styles';

export default function BlogPage() {
  return (
    <Blog
      basePath="/blog"
      supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
      supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
    />
  );
}
```

## Components

### Blog UI
- `<Blog />` - Complete blog interface
- `<PostCard />` - Post preview card
- `<Sidebar />` - Sidebar with categories/tags
- `<Pagination />` - Page navigation
- `<SearchBox />` - Search input
- `<CategoryFilter />` - Category filter
- `<TagCloud />` - Tag cloud

### Layouts
- `<GridLayout />` - Grid view
- `<ListLayout />` - List view
- `<MasonryLayout />` - Masonry grid
- `<MagazineLayout />` - Magazine style

### SEO
- `<BlogSEO />` - SEO meta tags
- `<BlogHead />` - HTML head tags
- `generateBlogMetadata()` - Next.js metadata
- `generateBlogJSONLD()` - Structured data

## Hooks

```tsx
// Data fetching
const { posts, loading } = usePosts({ limit: 10 });
const { post } = usePost(slug);
const { results } = useSearch(query);
const { categories } = useCategories();
const { tags } = useTags();
const { related } = useRelatedPosts(postId);

// Context
const { layout, setLayout } = useBlogContext();
```

## Client (Server-Safe)

For server-side usage (API routes, RSC), import from `/client`:

```ts
import { createBlogClient } from '@m14i/blogging-core/client';

const client = createBlogClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
});

const posts = await client.getPosts({ limit: 10 });
```

## Utils

**SEO**
```ts
import {
  generateSlug,
  analyzeContent,
  calculateReadingTime,
  generateExcerpt,
  generateArticleSchema,
} from '@m14i/blogging-core';
```

**Formatting**
```ts
import {
  formatDate,
  formatReadingTime,
  truncateText,
} from '@m14i/blogging-core';
```

## Types

All TypeScript types exported:
```ts
import type {
  BlogPost,
  LayoutSection,
  ContentBlock,
  SEOMetadata,
  BlogClient,
} from '@m14i/blogging-core';
```

## Peer Dependencies

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "lucide-react": "^0.0.0"
}
```

Optional:
```json
{
  "@supabase/supabase-js": "^2.0.0",
  "@supabase/ssr": "^0.6.0",
  "next": "^15.0.0"
}
```

## License

MIT
