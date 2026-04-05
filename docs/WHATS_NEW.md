# What's New in v0.3.0

## 🎉 Major Release: 10x Easier Integration

Version 0.3.0 is a game-changer for `m14i-blogging`. We've listened to feedback and made the package **dramatically easier to integrate** while keeping all the power and customization you love.

### Integration Time Reduced

- **Before v0.3.0**: 4-6 hours of setup
- **After v0.3.0**: 30-60 minutes

---

## ✨ What's New

### 1. 🚀 Pre-built Data Access Layer

**No more writing database queries!**

```typescript
import { createBlogClient } from 'm14i-blogging/client';

const blog = await createBlogClient(supabase);

// Everything you need out of the box:
const { posts } = await blog.posts.list({ status: 'published' });
const post = await blog.posts.getBySlug('my-post');
await blog.posts.create({ title, slug, sections });
await blog.posts.update(id, updates);
await blog.posts.publish(id);
const related = await blog.posts.getRelated(postId);
const stats = await blog.stats.getStats();
// ... and 15+ more operations
```

**Features:**
- ✅ Complete CRUD operations
- ✅ Pagination & filtering
- ✅ Full-text search
- ✅ Related posts
- ✅ Statistics & analytics
- ✅ Media management
- ✅ TypeScript types included
- ✅ Consistent error handling
- ✅ Configurable table names

### 2. 🎨 BlogBuilder with Default Components

**No shadcn/ui setup required!**

```typescript
import { BlogBuilderWithDefaults } from 'm14i-blogging';

<BlogBuilderWithDefaults
  sections={sections}
  onChange={setSections}
/>
```

**Benefits:**
- ✅ Works immediately - zero configuration
- ✅ Default UI components included
- ✅ Fully styled with Tailwind
- ✅ Can still use custom components if needed

**Before (required shadcn/ui setup):**
```typescript
// Install 7 shadcn/ui components
npx shadcn@latest add button card label input textarea select

// Pass all components as props
<BlogBuilder
  sections={sections}
  onChange={setSections}
  components={{
    Button, Card, CardContent, CardHeader,
    Label, Input, Textarea, Select,
    SelectTrigger, SelectValue, SelectContent, SelectItem,
    PlusIcon, XIcon,
  }}
/>
```

**After (zero setup):**
```typescript
<BlogBuilderWithDefaults
  sections={sections}
  onChange={setSections}
/>
```

### 3. ⚡ Ready-to-use API Route Handlers

**Copy-paste Next.js API routes!**

```typescript
// app/api/blog/posts/route.ts
import { createListPostsHandler } from 'm14i-blogging/server';
import { getBlogClient } from '@/lib/blog-client';

export const GET = createListPostsHandler(getBlogClient);
```

**Available handlers:**
- `createListPostsHandler` - List with filtering & pagination
- `createGetPostBySlugHandler` - Get single post
- `createCreatePostHandler` - Create post (admin only)
- `createUpdatePostHandler` - Update post (admin only)
- `createDeletePostHandler` - Delete post (admin only)
- `createPublishPostHandler` - Publish post (admin only)
- `createSearchPostsHandler` - Full-text search
- `createMediaHandlers` - Media CRUD (GET + POST)
- `createStatsHandler` - Blog statistics

**Before:**
```typescript
// Had to write everything manually
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;

  // Build query manually
  let query = supabase
    .from('blog_posts')
    .select('*, author:users!created_by(...)')
    .range(from, to)
    .order(orderBy, { ascending: ... });

  // Apply filters manually
  if (status) query = query.eq('status', status);
  if (category) query = query.eq('category', category);
  // ... many more lines

  const { data, error, count } = await query;

  // Error handling
  if (error) { /* ... */ }

  // Format response
  return NextResponse.json({ /* ... */ });
}
```

**After:**
```typescript
// One line!
export const GET = createListPostsHandler(getBlogClient);
```

### 4. 📦 Complete TypeScript Types

**All database types exported:**

```typescript
import type {
  // Database types
  BlogPostRow,
  BlogPostInsert,
  BlogPostUpdate,
  BlogPostWithAuthor,
  BlogMediaRow,
  BlogMediaInsert,
  BlogMediaUpdate,
  BlogFilterParams,
  BlogPostListResponse,
  BlogStats,
  BlogCategory,
  BlogTag,

  // Client types
  BlogClient,
  BlogClientConfig,

  // Component types
  BlogBuilderProps,
  BlogBuilderConfig,
} from 'm14i-blogging';
```

### 5. 📚 Comprehensive Documentation

New comprehensive guides:
- **[Integration Guide](./INTEGRATION_GUIDE.md)** - Complete step-by-step walkthrough
  - Database setup
  - Data access layer examples
  - UI component usage
  - API routes templates
  - Complete working examples
  - Best practices

---

## 🔧 How to Upgrade

```bash
npm update m14i-blogging
# or
pnpm update m14i-blogging
```

**All changes are opt-in and non-breaking!**

Your existing code continues to work. New features are available when you need them.

---

## 📊 Before & After Comparison

### Before v0.3.0

**To list blog posts:**
```typescript
// lib/data/blog.ts - You had to write this manually
export async function getBlogPosts(params = {}) {
  const supabase = await createClient();
  const { page = 1, pageSize = 10, status, category, tag, search } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("blog_posts")
    .select(`*, author:users!created_by(full_name, email, avatar_url)`, { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (category) query = query.eq("category", category);
  if (tag) query = query.contains("tags", [tag]);
  if (search) query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error:", error);
    return { posts: [], total: 0, page, pageSize, totalPages: 0 };
  }

  return {
    posts: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}
```

**API Route:**
```typescript
// app/api/blog/posts/route.ts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const params = {
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
    status: searchParams.get("status") || undefined,
    category: searchParams.get("category") || undefined,
    // ... more param parsing
  };

  const response = await getBlogPosts(params);
  return NextResponse.json(response);
}
```

**Editor Component:**
```typescript
// Install shadcn/ui first
npx shadcn@latest add button card label input textarea select

// Then import and pass everything
import { BlogBuilder } from 'm14i-blogging';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
// ... 10 more imports

<BlogBuilder
  sections={sections}
  onChange={setSections}
  components={{
    Button, Card, CardContent, CardHeader,
    Label, Input, Textarea,
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
    PlusIcon: Plus, XIcon: X,
  }}
/>
```

### After v0.3.0

**To list blog posts:**
```typescript
// lib/blog-client.ts - Setup once
import { createClient } from "@/lib/supabase/server";
import { createBlogClient } from "m14i-blogging/client";

export async function getBlogClient() {
  const supabase = await createClient();
  return createBlogClient(supabase);
}

// Usage anywhere:
const blog = await getBlogClient();
const { posts } = await blog.posts.list({ status: 'published', page: 1 });
```

**API Route:**
```typescript
// app/api/blog/posts/route.ts - One line!
import { createListPostsHandler } from 'm14i-blogging/server';
import { getBlogClient } from '@/lib/blog-client';

export const GET = createListPostsHandler(getBlogClient);
```

**Editor Component:**
```typescript
// No setup required - just use it!
import { BlogBuilderWithDefaults } from 'm14i-blogging';

<BlogBuilderWithDefaults
  sections={sections}
  onChange={setSections}
/>
```

---

## 🎯 Who Benefits

### New Projects
- Get a complete blog system in **30 minutes** instead of 6 hours
- Focus on your unique features, not boilerplate

### Existing Projects
- Opt-in upgrade path - no breaking changes
- Gradually replace manual queries with the client
- Reduce maintenance burden

### Teams
- Consistent patterns across the codebase
- Less code to review and maintain
- Easier onboarding for new developers

---

## 🚀 Getting Started

1. **Update the package:**
   ```bash
   pnpm update m14i-blogging
   ```

2. **Follow the new Quick Start:**
   - See [README](../README.md#-quick-start-new-way)
   - See [Integration Guide](./INTEGRATION_GUIDE.md)

3. **Start using new features:**
   - Replace database queries with `createBlogClient()`
   - Use `BlogBuilderWithDefaults` for new editors
   - Copy-paste API route handlers

---

## 💡 Tips

### Gradual Migration

You don't have to migrate everything at once:

1. ✅ Keep existing code working
2. ✅ Use `createBlogClient()` for new features
3. ✅ Gradually refactor old queries
4. ✅ Replace API routes as needed

### When to Use What

**Use `BlogBuilderWithDefaults` when:**
- Prototyping quickly
- Don't need custom branding
- Want zero setup time

**Use `BlogBuilder` with custom components when:**
- Need to match your design system
- Already have shadcn/ui configured
- Want full control over UI

**Use `createBlogClient()` when:**
- Any database operation
- You value type safety
- You want consistent error handling

---

## 📝 Feedback

We'd love to hear your thoughts! If you have feedback or suggestions:

- [Open an issue](https://github.com/MerzoukeMansouri/m14i-blogging-package/issues)
- [Start a discussion](https://github.com/MerzoukeMansouri/m14i-blogging-package/discussions)

Happy blogging! 🎉
