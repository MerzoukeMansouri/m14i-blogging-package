# Blog Component Guide

Complete guide for integrating the public-facing Blog component into your Next.js application.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [API Routes Setup](#api-routes-setup)
- [Component Integration](#component-integration)
- [Configuration](#configuration)
- [Custom Layouts](#custom-layouts)
- [Advanced Usage](#advanced-usage)
- [TypeScript](#typescript)

---

## Overview

The `Blog` component provides a complete, drop-in public blog interface for displaying published posts with filtering, search, and multiple layout options. It's the public-facing counterpart to `BlogAdmin`.

### Features

- ✅ **Multiple layouts** (Grid, List, Masonry, Magazine)
- ✅ **Internal routing** (list, detail, category, tag, search views)
- ✅ **Search functionality** with full-text search
- ✅ **Category and tag filtering** with post counts
- ✅ **Pagination** for large datasets
- ✅ **Related posts** suggestions
- ✅ **Reading time** calculation
- ✅ **SEO-ready** with BlogPreview component
- ✅ **Responsive design** mobile-first
- ✅ **Customizable** (components, labels, colors, features)
- ✅ **Composable** (use complete component OR individual pieces)
- ✅ **TypeScript** first with full type safety

---

## Quick Start

### 1. Install the Package

If not already installed:

```bash
npm install @m14i/blogging-core
# or
pnpm add @m14i/blogging-core
```

### 2. Set Up Database

Ensure your blog database is set up (same as BlogAdmin):

```bash
# If using Supabase CLI
supabase db push

# Or apply via Supabase Dashboard
# - Copy content from supabase/migrations/20260405000000_create_blog_schema.sql
# - Copy content from supabase/migrations/20260405000001_add_taxonomy_tables.sql
# - Run both in SQL editor
```

### 3. Create API Routes

Create the following API route files in your Next.js app:

**`app/api/blog/route.ts`** (List posts)

```typescript
import { createClient } from "@/lib/supabase/server";
import { createListPostsHandler } from "@m14i/blogging-core/server";
import { createBlogClient } from "@m14i/blogging-core/client";

function getBlogClient() {
  const supabase = createClient();
  return createBlogClient(supabase);
}

export const GET = createListPostsHandler(getBlogClient);
```

**`app/api/blog/slug/[slug]/route.ts`** (Get post by slug)

```typescript
import { createClient } from "@/lib/supabase/server";
import { createGetPostBySlugHandler } from "@m14i/blogging-core/server";
import { createBlogClient } from "@m14i/blogging-core/client";

function getBlogClient() {
  const supabase = createClient();
  return createBlogClient(supabase);
}

export const GET = createGetPostBySlugHandler(getBlogClient);
```

**`app/api/blog/categories/route.ts`** (List categories)

```typescript
import { createClient } from "@/lib/supabase/server";
import { createListCategoriesHandler } from "@m14i/blogging-core/server";
import { createBlogClient } from "@m14i/blogging-core/client";

function getBlogClient() {
  const supabase = createClient();
  return createBlogClient(supabase);
}

export const GET = createListCategoriesHandler(getBlogClient);
```

**`app/api/blog/tags/route.ts`** (List tags)

```typescript
import { createClient } from "@/lib/supabase/server";
import { createListTagsHandler } from "@m14i/blogging-core/server";
import { createBlogClient } from "@m14i/blogging-core/client";

function getBlogClient() {
  const supabase = createClient();
  return createBlogClient(supabase);
}

export const GET = createListTagsHandler(getBlogClient);
```

### 4. Create Blog Page

**`app/blog/[[...path]]/page.tsx`**

```typescript
import { Blog } from "@m14i/blogging-core/public";
import { Button, Card, Badge, Input } from "@/components/ui";

export default function BlogPage() {
  return (
    <Blog
      basePath="/blog"
      apiBasePath="/api/blog"
      display={{
        layout: "grid",
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

That's it! Your blog is now live at `/blog` with:
- Post list at `/blog`
- Post detail at `/blog/[slug]`
- Category filter at `/blog/category/[name]`
- Tag filter at `/blog/tag/[name]`
- Search at `/blog/search?q=[query]`

---

## API Routes Setup

### Required Routes

The Blog component requires these API routes to function:

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/blog` | GET | List published posts with filtering and pagination |
| `/api/blog/slug/[slug]` | GET | Get a single post by slug |
| `/api/blog/categories` | GET | List categories with post counts |
| `/api/blog/tags` | GET | List tags with post counts |

### Optional Routes

For enhanced functionality:

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/blog/[id]/related` | GET | Get related posts (if using `relatedPosts` feature) |

### Using Supabase Client Directly

Instead of API routes, you can pass a Supabase client directly:

```typescript
import { createClient } from "@/lib/supabase/client";
import { createBlogClient } from "@m14i/blogging-core/client";
import { Blog } from "@m14i/blogging-core/public";

export default function BlogPage() {
  const supabase = createClient();
  const blogClient = createBlogClient(supabase);

  return (
    <Blog
      basePath="/blog"
      apiClient={blogClient}
      // No apiBasePath needed
    />
  );
}
```

---

## Component Integration

### Basic Integration

Minimal setup with defaults:

```typescript
import { Blog } from "@m14i/blogging-core/public";

export default function BlogPage() {
  return <Blog basePath="/blog" />;
}
```

### With shadcn/ui Components

```typescript
import { Blog } from "@m14i/blogging-core/public";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Skeleton,
} from "@/components/ui";

export default function BlogPage() {
  return (
    <Blog
      basePath="/blog"
      components={{
        Button,
        Card,
        CardContent,
        CardHeader,
        CardTitle,
        Badge,
        Input,
        Skeleton,
      }}
    />
  );
}
```

### With Custom Callbacks

```typescript
import { Blog } from "@m14i/blogging-core/public";

export default function BlogPage() {
  return (
    <Blog
      basePath="/blog"
      onPostClick={(post) => {
        console.log("Post clicked:", post.title);
        // Track analytics, etc.
      }}
      onCategoryClick={(category) => {
        console.log("Category clicked:", category);
      }}
      onSearch={(query) => {
        console.log("Search query:", query);
      }}
    />
  );
}
```

---

## Configuration

### Display Options

Control what and how content is displayed:

```typescript
<Blog
  display={{
    layout: "grid", // "grid" | "list" | "masonry" | "magazine"
    postsPerPage: 12,
    showFeaturedImage: true,
    showExcerpt: true,
    showReadingTime: true,
    showAuthor: true,
    showTags: true,
    showCategory: true,
    showDate: true,
    relatedPostsCount: 3,
  }}
/>
```

### Feature Toggles

Enable/disable features:

```typescript
<Blog
  features={{
    search: true,
    categoryFilter: true,
    tagFilter: true,
    relatedPosts: true,
    readingTime: true,
    shareButtons: false,
    comments: false,
  }}
/>
```

### Labels (i18n)

Customize all text labels:

```typescript
<Blog
  labels={{
    readMore: "Continue reading",
    backToBlog: "Back to all posts",
    search: "Search",
    searchPlaceholder: "Search articles...",
    allCategories: "All Categories",
    filterByCategory: "Filter by Category",
    filterByTag: "Filter by Tag",
    publishedOn: "Published on",
    by: "by",
    readingTime: "Reading time",
    minuteRead: "min read",
    minutesRead: "mins read",
    relatedPosts: "Related Articles",
    noPostsFound: "No posts found",
    loading: "Loading...",
  }}
/>
```

### Custom Styling

Apply custom CSS classes:

```typescript
<Blog
  classNames={{
    container: "custom-container",
    header: "custom-header",
    sidebar: "custom-sidebar",
    content: "custom-content",
    postCard: "custom-post-card",
    postTitle: "custom-post-title",
    postMeta: "custom-post-meta",
    categoryBadge: "custom-category-badge",
    tagBadge: "custom-tag-badge",
    pagination: "custom-pagination",
  }}
/>
```

### Default Filters

Set default category or tag:

```typescript
<Blog
  defaultCategory="Tutorials"
  defaultTag="React"
  defaultSort="date-desc" // "date-desc" | "date-asc" | "title-asc" | "title-desc"
/>
```

---

## Custom Layouts

### Using Individual Components

For complete customization, compose your own layout:

```typescript
import {
  BlogProvider,
  PostListView,
  Sidebar,
  SearchBox,
} from "@m14i/blogging-core/public";

export default function CustomBlogPage() {
  return (
    <BlogProvider basePath="/blog" apiBasePath="/api/blog">
      <div className="container mx-auto">
        <header className="my-8">
          <h1>My Custom Blog</h1>
          <SearchBox />
        </header>

        <div className="flex gap-8">
          <main className="flex-1">
            <PostListView />
          </main>

          <aside className="w-64">
            <Sidebar />
          </aside>
        </div>
      </div>
    </BlogProvider>
  );
}
```

### Using Layout Components

Choose specific layout components:

```typescript
import {
  BlogProvider,
  usePosts,
  GridLayout,
  ListLayout,
  MasonryLayout,
  MagazineLayout,
} from "@m14i/blogging-core/public";

function CustomPostList() {
  const { posts, isLoading } = usePosts();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <GridLayout posts={posts} />
      {/* or */}
      <ListLayout posts={posts} />
      {/* or */}
      <MasonryLayout posts={posts} />
      {/* or */}
      <MagazineLayout posts={posts} />
    </div>
  );
}

export default function BlogPage() {
  return (
    <BlogProvider basePath="/blog">
      <CustomPostList />
    </BlogProvider>
  );
}
```

### Using Individual Views

For custom routing (e.g., separate Next.js pages):

```typescript
// app/blog/page.tsx
import { BlogProvider, PostListView } from "@m14i/blogging-core/public";

export default function BlogIndexPage() {
  return (
    <BlogProvider basePath="/blog">
      <PostListView />
    </BlogProvider>
  );
}

// app/blog/[slug]/page.tsx
import { BlogProvider, PostDetailView } from "@m14i/blogging-core/public";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <BlogProvider basePath="/blog">
      <PostDetailView slug={params.slug} />
    </BlogProvider>
  );
}

// app/blog/category/[category]/page.tsx
import { BlogProvider, CategoryView } from "@m14i/blogging-core/public";

export default function CategoryPage({ params }: { params: { category: string } }) {
  return (
    <BlogProvider basePath="/blog">
      <CategoryView category={params.category} />
    </BlogProvider>
  );
}
```

---

## Advanced Usage

### Using Hooks Directly

For complete custom implementations:

```typescript
import {
  BlogProvider,
  usePosts,
  usePost,
  useCategories,
  useTags,
  useSearch,
  useRelatedPosts,
} from "@m14i/blogging-core/public";

function CustomBlogList() {
  const { posts, total, isLoading, error } = usePosts({
    page: 1,
    pageSize: 10,
    category: "Tech",
    sort: "date-desc",
  });

  const { categories } = useCategories();
  const { tags } = useTags();

  // Your custom UI
  return <div>{/* ... */}</div>;
}

function CustomPostDetail({ slug }: { slug: string }) {
  const { post, isLoading } = usePost(slug);
  const { relatedPosts } = useRelatedPosts(post?.id);

  // Your custom UI
  return <div>{/* ... */}</div>;
}

export default function BlogPage() {
  return (
    <BlogProvider basePath="/blog">
      <CustomBlogList />
    </BlogProvider>
  );
}
```

### Custom Routing (External)

If you prefer to handle routing yourself:

```typescript
import { BlogProvider, PostListView, PostDetailView } from "@m14i/blogging-core/public";
import { useRouter, usePathname } from "next/navigation";

export default function BlogPage() {
  const pathname = usePathname();
  const router = useRouter();

  // Your routing logic
  const isDetailView = pathname.includes("/post/");
  const slug = isDetailView ? pathname.split("/post/")[1] : undefined;

  return (
    <BlogProvider
      basePath="/blog"
      navigate={(path) => router.push(path)}
    >
      {isDetailView && slug ? (
        <PostDetailView slug={slug} />
      ) : (
        <PostListView />
      )}
    </BlogProvider>
  );
}
```

### With SSR/SSG

For server-side rendering:

```typescript
import { createClient } from "@/lib/supabase/server";
import { createBlogClient } from "@m14i/blogging-core/client";
import { BlogProvider, PostListView } from "@m14i/blogging-core/public";

export default async function BlogPage() {
  const supabase = await createClient();
  const blogClient = createBlogClient(supabase);

  // Pre-fetch data
  const { posts, total } = await blogClient.posts.list({
    status: "published",
    page: 1,
    pageSize: 10,
  });

  return (
    <BlogProvider basePath="/blog" apiClient={blogClient}>
      <PostListView />
    </BlogProvider>
  );
}
```

---

## TypeScript

The Blog component is fully typed:

```typescript
import type {
  BlogProps,
  BlogLayout,
  BlogSortOption,
  BlogFeatures,
  BlogDisplayOptions,
  BlogLabels,
  BlogClassNames,
  PostListResponse,
  CategoryWithCount,
  TagWithCount,
} from "@m14i/blogging-core/public";

const props: BlogProps = {
  basePath: "/blog",
  display: {
    layout: "grid",
    postsPerPage: 9,
  },
  // Fully typed!
};
```

### Hook Types

```typescript
import type {
  UsePostsParams,
  UsePostsReturn,
  UsePostReturn,
  UseCategoriesReturn,
  UseTagsReturn,
  UseSearchReturn,
} from "@m14i/blogging-core/public";
```

---

## Examples

### Example 1: Simple Blog

```typescript
import { Blog } from "@m14i/blogging-core/public";

export default function SimpleBlog() {
  return <Blog basePath="/blog" />;
}
```

### Example 2: Magazine Layout Blog

```typescript
import { Blog } from "@m14i/blogging-core/public";
import { Button, Card, Badge } from "@/components/ui";

export default function MagazineBlog() {
  return (
    <Blog
      basePath="/blog"
      display={{
        layout: "magazine",
        postsPerPage: 10,
      }}
      components={{ Button, Card, Badge }}
    />
  );
}
```

### Example 3: Tech Blog with Categories

```typescript
import { Blog } from "@m14i/blogging-core/public";

export default function TechBlog() {
  return (
    <Blog
      basePath="/tech"
      defaultCategory="JavaScript"
      display={{ layout: "list" }}
      features={{
        search: true,
        categoryFilter: true,
        tagFilter: true,
        relatedPosts: true,
      }}
    />
  );
}
```

### Example 4: Fully Custom

```typescript
import {
  BlogProvider,
  usePosts,
  useCategories,
  PostCard,
  Pagination,
} from "@m14i/blogging-core/public";

function CustomBlogList() {
  const [page, setPage] = useState(1);
  const { posts, total, pageSize } = usePosts({ page });
  const { categories } = useCategories();

  return (
    <div className="container">
      <aside>
        {categories.map((cat) => (
          <div key={cat.name}>{cat.name} ({cat.count})</div>
        ))}
      </aside>

      <main>
        <div className="grid grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / pageSize)}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}

export default function BlogPage() {
  return (
    <BlogProvider basePath="/blog">
      <CustomBlogList />
    </BlogProvider>
  );
}
```

---

## Need Help?

- Check the [main README](../README.md)
- Review the [BlogAdmin guide](./BLOG_ADMIN_GUIDE.md) for backend setup
- Open an issue on [GitHub](https://github.com/MerzoukeMansouri/@m14i/blogging-core-package)
