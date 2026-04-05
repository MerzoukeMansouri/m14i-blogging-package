# m14i-blogging Integration Guide

Complete guide for integrating m14i-blogging into your Next.js application.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Database Setup](#database-setup)
3. [Data Access Layer](#data-access-layer)
4. [UI Components](#ui-components)
5. [API Routes](#api-routes)
6. [Complete Example](#complete-example)

---

## Quick Start

### Installation

```bash
npm install m14i-blogging
# or
pnpm add m14i-blogging
# or
yarn add m14i-blogging
```

### Peer Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr \
  react react-dom @hello-pangea/dnd lucide-react \
  react-markdown remark-gfm
```

---

## Database Setup

### 1. Run the Migration

The package includes a complete database schema. Copy it to your Supabase migrations:

```bash
cp node_modules/m14i-blogging/supabase/migration.sql \
   supabase/migrations/003_blog_system.sql
```

Or apply it directly via Supabase CLI:

```bash
supabase db push
```

### 2. Configure RLS Policies

The migration includes Row Level Security policies that:
- Allow public read access to published posts
- Restrict write/update/delete operations to admin users
- Protect draft content from public view

Make sure your `users` table has an appropriate `role` column for admin checks.

---

## Data Access Layer

### Creating the Blog Client

The easiest way to interact with your blog database is using the pre-built data access layer:

```typescript
// lib/blog-client.ts
import { createClient } from "@/lib/supabase/server";
import { createBlogClient } from "m14i-blogging/client";

export async function getBlogClient() {
  const supabase = await createClient();

  return createBlogClient(supabase, {
    postsTable: "blog_posts",      // default
    mediaTable: "blog_media",      // default
    includeAuthor: true,           // default
    usersTable: "users",           // default
  });
}
```

### Available Operations

The blog client provides comprehensive CRUD operations:

#### Posts

```typescript
const blog = await getBlogClient();

// List posts with filtering and pagination
const { posts, total, page, totalPages } = await blog.posts.list({
  page: 1,
  pageSize: 10,
  status: 'published',
  category: 'tutorial',
  tag: 'nextjs',
  search: 'react',
  orderBy: 'created_at',
  orderDirection: 'desc',
});

// Get single post
const post = await blog.posts.getBySlug('my-post-slug');
const post = await blog.posts.getById('uuid');

// Create post
const newPost = await blog.posts.create({
  title: 'My Post',
  slug: 'my-post',
  sections: [],
  status: 'draft',
});

// Update post
const updated = await blog.posts.update('uuid', {
  title: 'Updated Title',
});

// Publish/Archive
await blog.posts.publish('uuid');
await blog.posts.archive('uuid');

// Delete post
await blog.posts.delete('uuid');

// Search
const results = await blog.posts.search('query', 10);

// Get by tag/category
const posts = await blog.posts.getByTag('nextjs');
const posts = await blog.posts.getByCategory('tutorial');

// Get related posts
const related = await blog.posts.getRelated('post-id', 3);
```

#### Media

```typescript
// List media
const media = await blog.media.list('image', 50);

// Create media
const newMedia = await blog.media.create({
  file_path: '/path/to/file',
  file_name: 'image.jpg',
  type: 'image',
});

// Update media
await blog.media.update('uuid', { file_name: 'new-name.jpg' });

// Delete media
await blog.media.delete('uuid');
```

#### Statistics

```typescript
// Get stats
const stats = await blog.stats.getStats();
// Returns: { totalPosts, publishedPosts, draftPosts, archivedPosts, categoryCounts, tagCounts }

// Get categories with counts
const categories = await blog.stats.getCategories();
// Returns: [{ name, slug, postCount }, ...]

// Get tags with counts
const tags = await blog.stats.getTags();
// Returns: [{ name, slug, postCount }, ...]
```

---

## UI Components

### Option 1: BlogBuilder with Default Components (Easiest)

No need to pass any UI components - it just works:

```typescript
'use client';

import { useState } from 'react';
import { BlogBuilderWithDefaults } from 'm14i-blogging';

export function BlogEditor() {
  const [sections, setSections] = useState([]);

  return (
    <BlogBuilderWithDefaults
      sections={sections}
      onChange={setSections}
    />
  );
}
```

### Option 2: BlogBuilder with Custom Components

Pass your own shadcn/ui components for full customization:

```typescript
'use client';

import { useState } from 'react';
import { BlogBuilder } from 'm14i-blogging';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

export function BlogEditor() {
  const [sections, setSections] = useState([]);

  return (
    <BlogBuilder
      sections={sections}
      onChange={setSections}
      components={{
        Button,
        Card,
        CardContent,
        CardHeader,
        Label,
        Input,
        Textarea,
        Select,
        SelectTrigger,
        SelectValue,
        SelectContent,
        SelectItem,
        PlusIcon: Plus,
        XIcon: X,
      }}
    />
  );
}
```

### BlogPreview

Display rendered blog content:

```typescript
import { BlogPreview } from 'm14i-blogging';

export function PostView({ post }) {
  return (
    <BlogPreview
      sections={post.sections}
      theme="light"
    />
  );
}
```

---

## API Routes

### Using Pre-Built Route Handlers

The package includes ready-to-use Next.js API route handlers:

#### List Posts

```typescript
// app/api/blog/posts/route.ts
import { NextRequest } from 'next/server';
import { createListPostsHandler } from 'm14i-blogging/server';
import { getBlogClient } from '@/lib/blog-client';

export const GET = createListPostsHandler(getBlogClient);
```

#### Get Post by Slug

```typescript
// app/api/blog/posts/[slug]/route.ts
import { createGetPostBySlugHandler } from 'm14i-blogging/server';
import { getBlogClient } from '@/lib/blog-client';

export const GET = createGetPostBySlugHandler(getBlogClient);
```

#### Create Post (Admin Only)

```typescript
// app/api/blog/posts/route.ts
import { createCreatePostHandler } from 'm14i-blogging/server';
import { getBlogClient } from '@/lib/blog-client';

// Your custom auth check
async function isAdmin(request: NextRequest): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  return userData?.role === 'admin' || userData?.role === 'super_admin';
}

export const POST = createCreatePostHandler(getBlogClient, isAdmin);
```

#### Update/Delete Post

```typescript
// app/api/blog/posts/[id]/route.ts
import {
  createUpdatePostHandler,
  createDeletePostHandler,
} from 'm14i-blogging/server';
import { getBlogClient } from '@/lib/blog-client';
import { isAdmin } from '@/lib/auth';

export const PATCH = createUpdatePostHandler(getBlogClient, isAdmin);
export const DELETE = createDeletePostHandler(getBlogClient, isAdmin);
```

#### Publish Post

```typescript
// app/api/blog/posts/[id]/publish/route.ts
import { createPublishPostHandler } from 'm14i-blogging/server';
import { getBlogClient } from '@/lib/blog-client';
import { isAdmin } from '@/lib/auth';

export const POST = createPublishPostHandler(getBlogClient, isAdmin);
```

#### Search Posts

```typescript
// app/api/blog/search/route.ts
import { createSearchPostsHandler } from 'm14i-blogging/server';
import { getBlogClient } from '@/lib/blog-client';

export const GET = createSearchPostsHandler(getBlogClient);
```

#### Media Management

```typescript
// app/api/blog/media/route.ts
import { createMediaHandlers } from 'm14i-blogging/server';
import { getBlogClient } from '@/lib/blog-client';
import { isAdmin } from '@/lib/auth';

const { GET, POST } = createMediaHandlers(getBlogClient, isAdmin);
export { GET, POST };
```

#### Statistics

```typescript
// app/api/blog/stats/route.ts
import { createStatsHandler } from 'm14i-blogging/server';
import { getBlogClient } from '@/lib/blog-client';

export const GET = createStatsHandler(getBlogClient);
```

---

## Complete Example

### 1. Admin Page for Creating Posts

```typescript
// app/(protected)/admin/blog/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogBuilderWithDefaults } from 'm14i-blogging';
import type { LayoutSection } from 'm14i-blogging';

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [sections, setSections] = useState<LayoutSection[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          sections,
          status: 'draft',
        }),
      });

      if (!response.ok) throw new Error('Failed to create post');

      const post = await response.json();
      router.push(`/admin/blog/${post.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 space-y-4">
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>
      </div>

      <BlogBuilderWithDefaults
        sections={sections}
        onChange={setSections}
      />

      <div className="mt-6">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}
```

### 2. Public Blog Post Page

```typescript
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { BlogPreview, generateBlogMetadata } from 'm14i-blogging';
import { getBlogClient } from '@/lib/blog-client';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = await getBlogClient();
  const post = await blog.posts.getBySlug(params.slug);

  if (!post) return {};

  return generateBlogMetadata({
    title: post.title,
    description: post.excerpt || '',
    slug: post.slug,
    image: post.featured_image || undefined,
    author: post.author_info,
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogClient();
  const post = await blog.posts.getBySlug(params.slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        {post.author && (
          <p>By {post.author.full_name}</p>
        )}
      </header>

      <BlogPreview sections={post.sections} />
    </article>
  );
}
```

### 3. Blog Index Page

```typescript
// app/blog/page.tsx
import Link from 'next/link';
import { getBlogClient } from '@/lib/blog-client';

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const blog = await getBlogClient();
  const page = Number(searchParams.page) || 1;

  const { posts, totalPages } = await blog.posts.list({
    page,
    pageSize: 10,
    status: 'published',
    orderBy: 'published_at',
    orderDirection: 'desc',
  });

  return (
    <div>
      <h1>Blog</h1>

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id}>
            <Link href={`/blog/${post.slug}`}>
              <h2>{post.title}</h2>
              {post.excerpt && <p>{post.excerpt}</p>}
            </Link>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-2 mt-8">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <Link
            key={pageNum}
            href={`/blog?page=${pageNum}`}
            className={pageNum === page ? 'font-bold' : ''}
          >
            {pageNum}
          </Link>
        ))}
      </div>
    </div>
  );
}
```

---

## TypeScript Types

All types are exported for type safety:

```typescript
import type {
  // Database types
  BlogPostRow,
  BlogPostInsert,
  BlogPostUpdate,
  BlogPostWithAuthor,
  BlogMediaRow,
  BlogMediaInsert,
  BlogFilterParams,
  BlogPostListResponse,
  BlogStats,
  BlogCategory,
  BlogTag,

  // Content types
  LayoutSection,
  ContentBlock,
  TextBlock,
  ImageBlock,
  VideoBlock,

  // Client types
  BlogClient,
  BlogClientConfig,

  // Component types
  BlogBuilderProps,
  BlogBuilderConfig,
} from 'm14i-blogging';
```

---

## Styling

Import the package styles in your root layout:

```typescript
// app/layout.tsx
import 'm14i-blogging/styles';
```

The package uses Tailwind CSS. Make sure to include it in your `tailwind.config.ts`:

```typescript
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/m14i-blogging/dist/**/*.{js,mjs,cjs}',
  ],
  // ... rest of your config
};
```

---

## Best Practices

1. **Always use the data access layer** instead of writing raw Supabase queries
2. **Use BlogBuilderWithDefaults** for rapid prototyping, then switch to custom components for branding
3. **Implement proper authentication checks** in your API routes
4. **Use TypeScript types** for better developer experience
5. **Enable RLS policies** in production for security
6. **Cache frequently accessed data** (categories, tags, stats)
7. **Use ISR or SSG** for public blog pages when possible

---

## Support

- Documentation: https://github.com/MerzoukeMansouri/m14i-blogging-package
- Issues: https://github.com/MerzoukeMansouri/m14i-blogging-package/issues
