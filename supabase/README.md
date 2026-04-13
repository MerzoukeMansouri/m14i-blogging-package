# Supabase Integration for m14i-blogging

This directory contains everything you need to persist blog posts from the `m14i-blogging` package using Supabase (PostgreSQL).

## 📁 Directory Structure

```
supabase/
├── migrations/
│   ├── 20260405000000_create_blog_schema.sql  # Blog posts, media, search
│   └── 20260405000001_add_taxonomy_tables.sql # Categories and tags
├── adapters.ts                                 # Type adapters (DB ↔ Package types)
└── README.md                                   # This file
```

## 🚀 Quick Start

### 1. Prerequisites

- Supabase project ([create one here](https://supabase.com))
- Next.js 13+ application (or any framework)
- Node.js 18+

### 2. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr m14i-blogging
```

### 3. Set Up Environment Variables

Create `.env.local` in your Next.js project:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these values from your Supabase project settings: **Project Settings → API**

### 4. Initialize Supabase CLI (Optional but Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref your-project-ref

# Or start local development
npx supabase init
npx supabase start
```

### 5. Run the Migration

**Option A: Using Supabase Dashboard**

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `migrations/20260405000000_create_blog_schema.sql`
3. Paste and run the SQL

**Option B: Using Supabase CLI** (Recommended)

```bash
# Copy migration file to your Supabase project
cp supabase/migrations/20260405000000_create_blog_schema.sql ./supabase/migrations/

# Push to remote database
npx supabase db push

# Or apply to local database
npx supabase migration up
```

### 6. Generate TypeScript Types

```bash
# Generate types from your Supabase schema
npx supabase gen types typescript --local > src/types/supabase.ts

# Or for remote database
npx supabase gen types typescript --project-id your-project-ref > src/types/supabase.ts
```

### 7. Set Up Admin User

To create posts, you need an admin user:

1. Go to **Authentication → Users** in Supabase dashboard
2. Create a user or select an existing one
3. Click the user → **Edit user**
4. In **User Metadata**, add:
   ```json
   {
     "role": "admin"
   }
   ```
5. Save

## 📊 Database Schema

### Tables

#### `blog.posts`

Main posts table with all content and metadata:

| Column           | Type               | Description                                          |
| ---------------- | ------------------ | ---------------------------------------------------- |
| `id`             | UUID               | Primary key                                          |
| `title`          | TEXT               | Post title                                           |
| `slug`           | TEXT               | URL-friendly slug (unique)                           |
| `excerpt`        | TEXT               | Short description                                    |
| `featured_image` | TEXT               | Featured image URL                                   |
| `sections`       | JSONB              | Complete LayoutSection[] array                       |
| `seo_metadata`   | JSONB              | SEO, OpenGraph, Twitter card data                    |
| `author_info`    | JSONB              | Author information                                   |
| `status`         | ENUM               | 'draft', 'published', or 'archived'                  |
| `category`       | TEXT               | Post category                                        |
| `tags`           | TEXT[]             | Array of tags                                        |
| `created_at`     | TIMESTAMPTZ        | Creation timestamp                                   |
| `updated_at`     | TIMESTAMPTZ        | Last update timestamp (auto-updated)                 |
| `published_at`   | TIMESTAMPTZ        | Publication timestamp (auto-set on publish)          |
| `created_by`     | UUID               | User ID (references auth.users)                      |
| `search_vector`  | tsvector           | Full-text search vector (auto-generated)             |

#### `blog.media`

Media library for images, videos, and PDFs:

| Column          | Type        | Description                              |
| --------------- | ----------- | ---------------------------------------- |
| `id`            | UUID        | Primary key                              |
| `file_path`     | TEXT        | Storage path or external URL             |
| `file_name`     | TEXT        | Original file name                       |
| `file_size`     | BIGINT      | File size in bytes                       |
| `mime_type`     | TEXT        | MIME type                                |
| `type`          | ENUM        | 'image', 'video', 'pdf', 'other'         |
| `metadata`      | JSONB       | Alt text, captions, dimensions, etc.     |
| `usage_count`   | INTEGER     | Number of times used in posts            |
| `last_used_at`  | TIMESTAMPTZ | Last usage timestamp                     |
| `uploaded_at`   | TIMESTAMPTZ | Upload timestamp                         |
| `uploaded_by`   | UUID        | User ID                                  |

### Row Level Security (RLS)

**Posts:**
- ✅ Public can read published posts
- ✅ Admin users can read all posts
- ✅ Admin users can create, update, delete posts

**Media:**
- ✅ Public can read all media
- ✅ Admin users can manage media

### Helper Functions

```sql
-- Full-text search
SELECT * FROM blog.search_posts('typescript react');

-- Get posts by tag
SELECT * FROM blog.get_posts_by_tag('tutorial');

-- Get posts by category
SELECT * FROM blog.get_posts_by_category('engineering');
```

## 🔧 Usage Examples

### 1. Create API Routes

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

### 2. Create a Blog Editor Page

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

### 3. Display a Blog Post

```tsx
// app/blog/[slug]/page.tsx
import { BlogPreview } from 'm14i-blogging';
import { createClient } from '@/lib/supabase/server';
import { createBlogClient } from 'm14i-blogging/client';

export default async function BlogPostPage({ params }) {
  const supabase = await createClient();
  const client = createBlogClient(supabase);
  const post = await client.getPostBySlug(params.slug);

  return (
    <BlogPreview
      title={post.title}
      sections={post.sections}
      date={post.publishedDate}
      showReadingTime={true}
    />
  );
}
```

### 4. Fetch Posts Client-Side

```tsx
'use client';
import { createBlogClient } from 'm14i-blogging/client';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const client = createBlogClient(supabase);

const { posts, total, hasMore } = await client.listPosts({
  limit: 10,
  offset: 0,
});
```

### 5. Create a Post via API

```tsx
const response = await fetch('/api/blog/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
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
              content: '# Hello World\n\nThis is my first post!',
            },
          ],
        ],
      },
    ],
    category: 'tutorials',
    tags: ['getting-started'],
  }),
});

const { post } = await response.json();
```

## 🎨 Best Practices

### 1. **Use JSONB for Nested Content**

✅ **DO**: Store `sections` as JSONB (already implemented)

```sql
-- Fast queries with JSONB operators
SELECT * FROM blog.posts
WHERE sections @> '[{"type": "1-column"}]';
```

❌ **DON'T**: Create separate tables for sections/blocks (over-normalized)

### 2. **Index Strategically**

The migration includes optimized indexes:
- GIN indexes on JSONB columns for fast queries
- B-tree indexes on commonly filtered columns (status, category, tags)
- Full-text search index on `search_vector`

### 3. **Use Auto-Generated Fields**

- `updated_at` auto-updates on every change
- `published_at` auto-sets when status changes to 'published'
- `search_vector` auto-generates from title, excerpt, category

### 4. **Validate Before Insert**

Use the adapter functions for validation:

```ts
import { validateSlug, generateSlug } from '@/lib/adapters';

// Auto-generate valid slug
const slug = generateSlug('My Blog Post!'); // "my-blog-post"

// Validate manually
if (!validateSlug(userInput)) {
  throw new Error('Invalid slug format');
}
```

### 5. **Handle SEO Metadata Properly**

```ts
const post = {
  title: 'My Post',
  sections: [...],
  seo: {
    description: 'A compelling description',
    keywords: ['react', 'typescript'],
  },
  openGraph: {
    title: 'My Post - Acme Blog',
    description: 'A compelling description',
    image: 'https://example.com/og-image.jpg',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@acmeblog',
  },
};
```

### 6. **Leverage Full-Text Search**

```ts
// Full-text search is built-in
const results = await searchPosts(supabase, 'typescript tutorial');

// Or use SQL directly
const { data } = await supabase.rpc('blog.search_posts', {
  search_query: 'typescript tutorial',
});
```

### 7. **Use Media Library**

Track media usage for cleanup and management:

```ts
// After uploading to Supabase Storage
await supabase.from('blog.media').insert({
  file_path: 'blog-images/hero.jpg',
  file_name: 'hero.jpg',
  file_size: 1024000,
  mime_type: 'image/jpeg',
  type: 'image',
  metadata: {
    alt: 'Hero image',
    width: 1920,
    height: 1080,
  },
});
```

## 🔒 Security Considerations

### Row Level Security

RLS policies are enabled and configured. Make sure to:

1. **Never disable RLS** unless you know what you're doing
2. **Use service role key carefully** - only on the server
3. **Verify admin status** before allowing mutations

### Admin Check Example

```ts
// Always verify admin before mutations
import { requireAdmin } from '@/lib/supabase-client';

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  try {
    await requireAdmin(supabase); // Throws if not admin

    // Safe to proceed with mutation
    const { data } = await supabase.from('blog.posts').insert(...);

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

## 📈 Performance Tips

### 1. Use Indexes

All important columns are indexed. For custom queries, add indexes:

```sql
-- Example: Index on custom JSONB field
CREATE INDEX idx_posts_seo_keywords
ON blog.posts USING GIN ((seo_metadata -> 'seo' -> 'keywords'));
```

### 2. Limit JSONB Depth

When querying sections, limit depth if possible:

```ts
// Good: Specific JSONB query
const { data } = await supabase
  .from('blog.posts')
  .select('id, title, sections->0->columns')
  .limit(10);

// Better: Only select what you need
const { data } = await supabase
  .from('blog.posts')
  .select('id, title, slug, excerpt')
  .limit(10);
```

### 3. Pagination

Always use pagination for lists:

```ts
const { posts, total, hasMore } = await getPosts(supabase, {
  limit: 20,
  offset: page * 20,
});
```

### 4. Enable Realtime (Optional)

For live updates in admin dashboard:

```sql
-- Enable realtime for posts table
ALTER PUBLICATION supabase_realtime ADD TABLE blog.posts;
```

Then subscribe in your app:

```ts
const channel = supabaseClient
  .channel('blog-posts')
  .on(
    'postgres_changes',
    { event: '*', schema: 'blog', table: 'posts' },
    (payload) => {
      console.log('Change received!', payload);
      // Refresh your UI
    }
  )
  .subscribe();
```

## 🧪 Testing

Example test for CRUD operations:

```ts
import { createBlogClient } from 'm14i-blogging/client';

describe('Blog API', () => {
  it('should create, read, update, delete a post', async () => {
    const client = createBlogClient(supabase);

    // Create
    const post = await client.createPost({
      title: 'Test Post',
      sections: [],
    });

    expect(post).toBeDefined();
    expect(post.title).toBe('Test Post');

    // Read
    const retrieved = await client.getPostBySlug(post.slug);
    expect(retrieved?.title).toBe('Test Post');

    // Update
    const updated = await client.updatePost(post.id!, {
      title: 'Updated Title',
    });
    expect(updated?.title).toBe('Updated Title');

    // Delete
    await client.deletePost(post.id!);
  });
});
```

## 🆘 Troubleshooting

### Issue: "permission denied for schema blog"

**Solution**: Make sure to run the migration which includes GRANT statements:

```sql
GRANT USAGE ON SCHEMA blog TO anon, authenticated;
```

### Issue: "RLS policy violation"

**Solution**: Check that your user has the `admin` role in user metadata:

```json
{
  "role": "admin"
}
```

### Issue: "Cannot read properties of null"

**Solution**: Ensure Supabase client is initialized correctly with env vars.

### Issue: Full-text search not working

**Solution**: The `search_vector` is auto-generated. If it's not working:

```sql
-- Manually regenerate search vectors
UPDATE blog.posts SET updated_at = NOW();
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [m14i-blogging Package](https://www.npmjs.com/package/m14i-blogging)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🤝 Contributing

Found an issue or want to improve the schema? Open an issue or PR in the main repository.

## 📄 License

MIT
