# API Routes Integration Guide

This guide shows you how to integrate the `m14i-blogging` package API routes into your Next.js application.

## 🎯 Overview

The `m14i-blogging` package now exports **route handler factories** that you can use directly in your Next.js API routes. This makes integration extremely simple - just one line of code per route!

## 📦 Installation

```bash
npm install m14i-blogging @supabase/supabase-js @supabase/ssr
```

## 🚀 Quick Setup (3 Steps)

### Step 1: Set up Supabase Client

Create `src/lib/supabase-client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Server-side
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });
}
```

### Step 2: Create API Routes

Create these files in your `app/api/blog/` directory:

#### `app/api/blog/posts/route.ts`

```typescript
import { createPostsRoutes } from 'm14i-blogging/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';

export const { GET, POST } = createPostsRoutes({
  supabase: createServerSupabaseClient,
});
```

That's it! You now have:
- `GET /api/blog/posts` - List posts with filtering
- `POST /api/blog/posts` - Create a new post (admin only)

#### `app/api/blog/posts/[id]/route.ts`

```typescript
import { createPostByIdRoutes } from 'm14i-blogging/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';

export const { GET, PATCH, DELETE } = createPostByIdRoutes({
  supabase: createServerSupabaseClient,
});
```

You now have:
- `GET /api/blog/posts/[id]` - Get post by ID
- `PATCH /api/blog/posts/[id]` - Update post (admin only)
- `DELETE /api/blog/posts/[id]` - Delete post (admin only)

#### `app/api/blog/posts/slug/[slug]/route.ts`

```typescript
import { createPostBySlugRoute } from 'm14i-blogging/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';

export const { GET } = createPostBySlugRoute({
  supabase: createServerSupabaseClient,
});
```

You now have:
- `GET /api/blog/posts/slug/[slug]` - Get post by slug

### Step 3: Set Admin User

In Supabase Dashboard → Authentication → Users:
1. Edit your user
2. Add to User Metadata:
   ```json
   {
     "role": "admin"
   }
   ```

## ✅ Done!

Your API routes are now fully functional!

## 📖 API Reference

### GET /api/blog/posts

List blog posts with filtering, pagination, and sorting.

**Query Parameters:**

| Parameter        | Type   | Description                                    |
| ---------------- | ------ | ---------------------------------------------- |
| `status`         | string | Filter by status: 'draft', 'published', 'archived' |
| `category`       | string | Filter by category                             |
| `tag`            | string | Filter by tag                                  |
| `search`         | string | Full-text search query                         |
| `limit`          | number | Number of posts (default: 10)                  |
| `offset`         | number | Pagination offset (default: 0)                 |
| `orderBy`        | string | Sort field: 'created_at', 'updated_at', 'published_at', 'title' |
| `orderDirection` | string | Sort direction: 'asc', 'desc' (default: 'desc') |
| `categories`     | 'true' | Return list of all categories                  |
| `tags`           | 'true' | Return list of all tags                        |

**Examples:**

```javascript
// Get all published posts
const res = await fetch('/api/blog/posts?status=published');
const { posts, total, hasMore } = await res.json();

// Get posts by category
const res = await fetch('/api/blog/posts?category=tutorials&limit=20');

// Search posts
const res = await fetch('/api/blog/posts?search=typescript');

// Get all categories
const res = await fetch('/api/blog/posts?categories=true');
const { categories } = await res.json();

// Get all tags
const res = await fetch('/api/blog/posts?tags=true');
const { tags } = await res.json();
```

### POST /api/blog/posts

Create a new blog post (admin only).

**Body:**

```typescript
{
  title: string;              // Required
  slug?: string;              // Auto-generated if not provided
  excerpt?: string;           // Auto-generated if not provided
  featuredImage?: string;
  sections: LayoutSection[];  // Required
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  publishedDate?: string;     // ISO 8601 timestamp
  seo?: SEOMetadata;
  openGraph?: OpenGraphMetadata;
  twitter?: TwitterCardMetadata;
  author?: AuthorInfo;
}
```

**Publication Date Handling:**
- If `publishedDate` is in the **past/present** → post is immediately published
- If `publishedDate` is in the **future** → post is scheduled (draft until date arrives)
- If `status: 'published'` without `publishedDate` → uses current time
- If neither provided → saves as draft

**Examples:**

```javascript
// Publish immediately
const res = await fetch('/api/blog/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My New Post',
    sections: [...],
    status: 'published', // Published now
    category: 'tutorials',
    tags: ['getting-started'],
  }),
});

// Schedule for future
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

const res = await fetch('/api/blog/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Scheduled Post',
    sections: [...],
    publishedDate: nextWeek.toISOString(), // Scheduled
    category: 'tutorials',
  }),
});

// Save as draft
const res = await fetch('/api/blog/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Draft Post',
    sections: [...],
    // No status or publishedDate = draft
  }),
});

const { post } = await res.json();
```

### GET /api/blog/posts/[id]

Get a single post by ID.

**Example:**

```javascript
const res = await fetch('/api/blog/posts/123e4567-e89b-12d3-a456-426614174000');
const { post } = await res.json();
```

### PATCH /api/blog/posts/[id]

Update a post (admin only).

**Query Parameters:**

| Parameter | Type   | Description                      |
| --------- | ------ | -------------------------------- |
| `action`  | string | Special actions: 'publish', 'unpublish', 'archive' |

**Body:** Partial `BlogPost` object

**Examples:**

```javascript
// Regular update
const res = await fetch('/api/blog/posts/post-id', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Updated Title',
    sections: [...],
  }),
});

// Publish a post
const res = await fetch('/api/blog/posts/post-id?action=publish', {
  method: 'PATCH',
});

// Unpublish a post
const res = await fetch('/api/blog/posts/post-id?action=unpublish', {
  method: 'PATCH',
});

// Archive a post
const res = await fetch('/api/blog/posts/post-id?action=archive', {
  method: 'PATCH',
});
```

### DELETE /api/blog/posts/[id]

Delete a post (admin only).

**Example:**

```javascript
const res = await fetch('/api/blog/posts/post-id', {
  method: 'DELETE',
});

const { success } = await res.json();
```

### GET /api/blog/posts/slug/[slug]

Get a post by its slug (useful for public blog pages).

**Example:**

```javascript
const res = await fetch('/api/blog/posts/slug/my-blog-post');
const { post } = await res.json();
```

## 🎨 Advanced Configuration

### Custom Authentication

You can provide custom authentication logic:

```typescript
import { createPostsRoutes } from 'm14i-blogging/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';
import { getCurrentUser } from '@/lib/auth';

export const { GET, POST } = createPostsRoutes({
  supabase: createServerSupabaseClient,

  // Custom user getter
  getUser: async () => {
    const user = await getCurrentUser();
    return user ? { id: user.id, role: user.role } : null;
  },

  // Custom admin check
  isAdmin: async () => {
    const user = await getCurrentUser();
    return user?.permissions?.includes('manage:blog') ?? false;
  },

  // Custom error handler
  onError: (error) => {
    console.error('[Blog API Error]', error);
    // Send to error tracking service
  },
});
```

### Using with Different Supabase Clients

```typescript
import { createPostsRoutes } from 'm14i-blogging/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Use admin client (bypasses RLS)
export const { GET, POST } = createPostsRoutes({
  supabase: supabaseAdmin,
});
```

### Async Supabase Client

```typescript
export const { GET, POST } = createPostsRoutes({
  supabase: async () => {
    const session = await getSession();
    return createSupabaseClient(session);
  },
});
```

## 🔧 Customization

### Extending Route Handlers

You can wrap the handlers to add custom logic:

```typescript
import { createPostsRoutes } from 'm14i-blogging/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';
import { trackEvent } from '@/lib/analytics';

const routes = createPostsRoutes({
  supabase: createServerSupabaseClient,
});

// Wrap GET to add analytics
export async function GET(request: Request) {
  trackEvent('blog_posts_viewed');
  return routes.GET(request);
}

// Wrap POST to add custom validation
export async function POST(request: Request) {
  const body = await request.json();

  // Custom validation
  if (!body.title || body.title.length < 3) {
    return Response.json(
      { error: 'Title must be at least 3 characters' },
      { status: 400 }
    );
  }

  return routes.POST(request);
}
```

### Adding Rate Limiting

```typescript
import { ratelimit } from '@/lib/ratelimit';

const routes = createPostsRoutes({ supabase: createServerSupabaseClient });

export async function POST(request: Request) {
  // Check rate limit
  const { success } = await ratelimit.limit(request);

  if (!success) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  return routes.POST(request);
}
```

### Adding CORS Headers

```typescript
const routes = createPostsRoutes({ supabase: createServerSupabaseClient });

export async function GET(request: Request) {
  const response = await routes.GET(request);

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  return response;
}
```

## 🧪 Testing

### Example Test

```typescript
import { createPostsRoutes } from 'm14i-blogging/server';
import { createMockSupabaseClient } from '@/test/utils';

describe('Blog API', () => {
  it('should create a post', async () => {
    const mockSupabase = createMockSupabaseClient();
    const { POST } = createPostsRoutes({ supabase: mockSupabase });

    const request = new Request('http://localhost/api/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Post',
        sections: [],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.post).toBeDefined();
    expect(data.post.title).toBe('Test Post');
  });
});
```

## 📝 Complete Example: Blog Admin Page

```typescript
// app/admin/blog/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const res = await fetch('/api/blog/posts?orderBy=updated_at&limit=50');
    const { posts } = await res.json();
    setPosts(posts);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure?')) return;

    await fetch(`/api/blog/posts/${id}`, { method: 'DELETE' });
    loadPosts();
  }

  async function handlePublish(id: string) {
    await fetch(`/api/blog/posts/${id}?action=publish`, { method: 'PATCH' });
    loadPosts();
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link href="/admin/blog/new" className="btn-primary">
          New Post
        </Link>
      </div>

      <div className="space-y-4">
        {posts.map((post: any) => (
          <div key={post.id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600">{post.excerpt}</p>
            <div className="flex gap-2 mt-4">
              <Link href={`/admin/blog/edit/${post.id}`}>Edit</Link>
              {post.status === 'draft' && (
                <button onClick={() => handlePublish(post.id)}>Publish</button>
              )}
              <button onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🚨 Troubleshooting

### "Module not found: Can't resolve 'm14i-blogging/server'"

Make sure you've built the package:

```bash
npm run build
```

### "Unauthorized: Admin access required"

Make sure your user has `"role": "admin"` in user metadata in Supabase.

### TypeScript errors with route handlers

Make sure you're using Next.js 13+ with App Router and have proper types:

```bash
npm install @types/react @types/react-dom
```

### Supabase client not working

Make sure environment variables are set:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## 📚 Learn More

- [Supabase Integration Guide](../supabase/README.md)
- [Server Utilities API](./SERVER_API.md)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 🎉 Summary

With the `m14i-blogging/server` export, you can:

✅ Set up complete blog API in **3 files, 3 lines of code each**
✅ Full CRUD operations out of the box
✅ Type-safe with TypeScript
✅ Customizable authentication and error handling
✅ Easy to extend with your own logic
✅ Works seamlessly with Supabase

No boilerplate, just import and use!
