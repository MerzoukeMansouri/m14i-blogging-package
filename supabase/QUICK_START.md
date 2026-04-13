# Quick Start Guide - 5 Minutes to Production

This guide gets you up and running with Supabase persistence for `m14i-blogging` in under 5 minutes.

## ⚡ Prerequisites

- Supabase account ([sign up free](https://supabase.com))
- Next.js 13+ app
- Node.js 18+

## 🚀 Setup (5 steps)

### Step 1: Install Dependencies (30 seconds)

```bash
npm install @supabase/supabase-js @supabase/ssr m14i-blogging
```

### Step 2: Add Environment Variables (30 seconds)

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Optional, for admin operations
```

Get from: **Supabase Dashboard → Settings → API**

### Step 3: Run Migration (1 minute)

**Option A: Dashboard (No CLI needed)**

1. Open **Supabase Dashboard → SQL Editor**
2. Copy contents of `supabase/migrations/20260405000000_create_blog_schema.sql`
3. Paste → Run

**Option B: CLI**

```bash
npx supabase link --project-ref your-project-ref
cp supabase/migrations/20260405000000_create_blog_schema.sql ./supabase/migrations/
npx supabase db push
```

### Step 4: Set Up Admin User (1 minute)

1. **Supabase Dashboard → Authentication → Users**
2. Click your user (or create one)
3. Edit → User Metadata → Add:
   ```json
   {
     "role": "admin"
   }
   ```
4. Save

## ✅ Test It Works

Create `test-connection.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr';
import { createBlogClient } from 'm14i-blogging/client';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function test() {
  const client = createBlogClient(supabase);
  const { posts, total } = await client.listPosts({ limit: 5 });

  console.log('✅ Success! Connected to Supabase');
  console.log('Posts:', total);
}

test();
```

Run: `npx tsx test-connection.ts`

## 🎯 Next Steps

### Create Your First Post (via code)

```typescript
import { createBlogClient } from 'm14i-blogging/client';

const client = createBlogClient(supabase);

const post = await client.createPost({
  title: 'My First Post',
  sections: [
    {
      id: 'section-1',
      type: '1-column',
      columns: [
        [
          {
            id: 'block-1',
            type: 'text',
            content: '# Hello World\n\nMy first blog post!',
          },
        ],
      ],
    },
  ],
  category: 'getting-started',
  tags: ['intro'],
});

console.log('Created post:', post);
```

### Create a Blog Admin Page

```tsx
// app/admin/blog/page.tsx
import { BlogAdmin } from 'm14i-blogging/admin';
import { BlogBuilder } from 'm14i-blogging';
import { Button, Input, Card, Badge } from '@/components/ui';

export default async function BlogAdminPage() {
  const user = await getUser();
  return (
    <BlogAdmin
      isAllowed={user?.role === "admin"}
      currentUser={user}
      basePath="/admin/blog"
      apiBasePath="/api/blog"
      components={{ Button, Input, Card, Badge, BlogBuilder }}
    />
  );
}
```

### Create a Public Blog Page

```tsx
// app/blog/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { createBlogClient } from 'm14i-blogging/client';
import { BlogPreview } from 'm14i-blogging';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const client = createBlogClient(supabase);
  const post = await client.getPostBySlug(params.slug);

  if (!post) return <div>Post not found</div>;

  return <BlogPreview title={post.title} sections={post.sections} />;
}
```

### Create API Routes

Use the built-in handler factories from `m14i-blogging/server`:

```typescript
// app/api/blog/route.ts
import { createClient } from "@/lib/supabase/server";
import { createListPostsHandler, createCreatePostHandler } from "m14i-blogging/server";
import { createBlogClient } from "m14i-blogging/client";

async function getBlogClient() {
  const supabase = await createClient();
  return createBlogClient(supabase);
}

export const GET = createListPostsHandler(getBlogClient);
export const POST = createCreatePostHandler(getBlogClient, checkAuth);
```

## 📊 Verify in Supabase Dashboard

1. **Table Editor** → `blog` schema → `posts` table
2. You should see your created posts
3. Try filtering by status: `published`

## 🔧 Common Operations

### List all posts

```typescript
import { createBlogClient } from 'm14i-blogging/client';

const client = createBlogClient(supabase);
const { posts, total } = await client.listPosts({
  status: 'published',
  limit: 10,
});
```

### Get post by slug

```typescript
const post = await client.getPostBySlug('my-first-post');
```

### Update a post

```typescript
const updated = await client.updatePost(postId, {
  title: 'Updated Title',
  sections: [...],
});
```

### Search posts

```typescript
const results = await client.searchPosts('typescript');
```

## 🎨 Using BlogBuilder Component

```tsx
'use client';

import { useState } from 'react';
import { BlogBuilder } from 'm14i-blogging';
import { createBlogClient } from 'm14i-blogging/client';

export default function Editor({ postId, initialSections, supabase }) {
  const [sections, setSections] = useState(initialSections);

  const handleSave = async () => {
    const client = createBlogClient(supabase);
    await client.updatePost(postId, { sections });
  };

  return (
    <>
      <button onClick={handleSave}>Save</button>
      <BlogBuilder
        sections={sections}
        onChange={setSections}
        components={{/* shadcn/ui components */}}
      />
    </>
  );
}
```

## 🐛 Troubleshooting

### "permission denied for schema blog"

Run the migration - it includes GRANT statements.

### "RLS policy violation"

Make sure your user has `"role": "admin"` in user metadata.

### Posts not appearing

Check `status` field - only `published` posts are public by default.

### TypeScript errors

Generate Supabase types:
```bash
npx supabase gen types typescript --local > src/types/supabase.ts
```

## 📚 Learn More

- [Full README](./README.md) - Complete documentation
- [Best Practices](./BEST_PRACTICES.md) - Architecture guidelines
- [Schema Migration](./migrations/20260405000000_create_blog_schema.sql) - Database schema

## 🎉 You're Done!

You now have:
- ✅ Database schema deployed
- ✅ Type-safe API functions
- ✅ Admin authentication
- ✅ Ready to build blog UI

**Next:** Start building your blog editor and public pages!

---

**Need help?** Check the [troubleshooting section](./README.md#troubleshooting) or open an issue.
