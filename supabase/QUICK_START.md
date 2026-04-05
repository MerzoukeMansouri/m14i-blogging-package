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

### Step 4: Copy Files to Your Project (1 minute)

```bash
# Create lib directory if it doesn't exist
mkdir -p src/lib

# Copy files
cp supabase/examples/nextjs/supabase-client.ts src/lib/
cp supabase/examples/nextjs/blog-api.ts src/lib/
cp supabase/adapters.ts src/lib/
```

### Step 5: Create Admin User (1 minute)

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
import { supabaseClient } from './src/lib/supabase-client';

async function test() {
  const { data, error } = await supabaseClient
    .from('blog.posts')
    .select('count');

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Success! Connected to Supabase');
    console.log('Posts count:', data);
  }
}

test();
```

Run: `npx tsx test-connection.ts`

## 🎯 Next Steps

### Create Your First Post (via code)

```typescript
import { supabaseClient } from '@/lib/supabase-client';
import { createPost } from '@/lib/blog-api';

const { post, error } = await createPost(supabaseClient, {
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

### Create a Blog Editor Page

1. **Create:** `app/admin/blog/edit/[id]/page.tsx`
2. **Copy:** Content from `supabase/examples/nextjs/blog-editor-page.tsx`
3. **Navigate to:** `/admin/blog/edit/post-id-here`

### Create a Public Blog Page

```tsx
// app/blog/[slug]/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase-client';
import { getPostBySlug } from '@/lib/blog-api';
import { BlogPreview } from 'm14i-blogging';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabaseClient();
  const post = await getPostBySlug(supabase, params.slug);

  if (!post) return <div>Post not found</div>;

  return <BlogPreview title={post.title} sections={post.sections} />;
}
```

### Create API Routes (optional)

See `supabase/examples/nextjs/app-routes-example.ts` for complete REST API implementation.

## 📊 Verify in Supabase Dashboard

1. **Table Editor** → `blog` schema → `posts` table
2. You should see your created posts
3. Try filtering by status: `published`

## 🔧 Common Operations

### List all posts

```typescript
import { getPosts } from '@/lib/blog-api';

const { posts, total } = await getPosts(supabaseClient, {
  status: 'published',
  limit: 10,
});
```

### Get post by slug

```typescript
import { getPostBySlug } from '@/lib/blog-api';

const post = await getPostBySlug(supabaseClient, 'my-first-post');
```

### Update a post

```typescript
import { updatePost } from '@/lib/blog-api';

const { post } = await updatePost(supabaseClient, postId, {
  title: 'Updated Title',
  sections: [...],
});
```

### Publish a draft

```typescript
import { publishPost } from '@/lib/blog-api';

const { post } = await publishPost(supabaseClient, postId);
```

### Search posts

```typescript
import { searchPosts } from '@/lib/blog-api';

const results = await searchPosts(supabaseClient, 'typescript');
```

## 🎨 Using BlogBuilder Component

```tsx
'use client';

import { useState } from 'react';
import { BlogBuilder } from 'm14i-blogging';
import { updatePostSections } from '@/lib/blog-api';

export default function Editor({ postId, initialSections }) {
  const [sections, setSections] = useState(initialSections);

  const handleSave = async () => {
    await updatePostSections(supabaseClient, postId, sections);
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
- [Example Routes](./examples/nextjs/app-routes-example.ts) - API implementation
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
