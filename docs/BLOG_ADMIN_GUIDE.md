# BlogAdmin Component Guide

Complete guide for integrating the BlogAdmin component into your Next.js application.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [API Routes Setup](#api-routes-setup)
- [Component Integration](#component-integration)
- [Configuration](#configuration)
- [Advanced Usage](#advanced-usage)
- [TypeScript](#typescript)

---

## Overview

The `BlogAdmin` component provides a complete, drop-in blog administration interface for managing blog posts, categories, and tags. It's designed to work with your existing Supabase setup and can be integrated in ~15 minutes.

### Features

- ✅ **Complete CRUD operations** for posts, categories, and tags
- ✅ **Rich text editor** with drag-and-drop content blocks (BlogBuilder)
- ✅ **Live preview** in new tab with sessionStorage for drafts
- ✅ **Auto-save** (3-second debounce) to sessionStorage
- ✅ **Inline taxonomy creation** (categories and tags)
- ✅ **SEO metadata** fields (meta title, description, OG tags)
- ✅ **Featured images** support
- ✅ **Filtering and search** in posts list
- ✅ **Pagination** for large datasets
- ✅ **Access control** with `isAllowed` prop
- ✅ **Customizable** (components, labels, colors, features)
- ✅ **TypeScript** first with full type safety

---

## Quick Start

### 1. Install the Package

If not already installed:

```bash
npm install m14i-blogging
# or
pnpm add m14i-blogging
```

### 2. Set Up Database Migrations

Run the blog system migrations:

```bash
# If using Supabase CLI
supabase db push

# Or apply via Supabase Dashboard:
# - Copy content from supabase/migrations/20260405000000_create_blog_schema.sql
# - Copy content from supabase/migrations/20260405000001_add_taxonomy_tables.sql
# - Run both in SQL editor
```

### 3. Create API Routes

Create the following API route files in your Next.js app:

**`app/api/blog/route.ts`** (List/Create posts)

```typescript
import { createClient } from "@/lib/supabase/server";
import {
  createListPostsHandler,
  createCreatePostHandler,
} from "m14i-blogging/server";
import { createBlogClient } from "m14i-blogging/client";

// Your auth check function
async function checkAuth(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Optional: Add role check
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden");
  }

  return user;
}

// Supabase client factory
async function getBlogClient() {
  const supabase = await createClient();
  return createBlogClient(supabase);
}

export const GET = createListPostsHandler(getBlogClient);
export const POST = createCreatePostHandler(getBlogClient, checkAuth);
```

**`app/api/blog/[id]/route.ts`** (Update/Delete post)

```typescript
import { createClient } from "@/lib/supabase/server";
import {
  createUpdatePostHandler,
  createDeletePostHandler,
} from "m14i-blogging/server";
import { createBlogClient } from "m14i-blogging/client";

async function checkAuth(request: Request) {
  // Same as above
}

async function getBlogClient() {
  const supabase = await createClient();
  return createBlogClient(supabase);
}

export const PATCH = createUpdatePostHandler(getBlogClient, checkAuth);
export const DELETE = createDeletePostHandler(getBlogClient, checkAuth);
```

**`app/api/blog/categories/route.ts`** (Categories)

```typescript
import { createClient } from "@/lib/supabase/server";
import {
  createListCategoriesHandler,
  createCreateCategoryHandler,
} from "m14i-blogging/server";
import { createBlogClient } from "m14i-blogging/client";

async function checkAuth(request: Request) {
  // Same as above
}

async function getBlogClient() {
  const supabase = await createClient();
  return createBlogClient(supabase);
}

export const GET = createListCategoriesHandler(getBlogClient);
export const POST = createCreateCategoryHandler(getBlogClient, checkAuth);
```

**`app/api/blog/tags/route.ts`** (Tags)

```typescript
import { createClient } from "@/lib/supabase/server";
import {
  createListTagsHandler,
  createCreateTagHandler,
} from "m14i-blogging/server";
import { createBlogClient } from "m14i-blogging/client";

async function checkAuth(request: Request) {
  // Same as above
}

async function getBlogClient() {
  const supabase = await createClient();
  return createBlogClient(supabase);
}

export const GET = createListTagsHandler(getBlogClient);
export const POST = createCreateTagHandler(getBlogClient, checkAuth);
```

### 4. Create Admin Page

**`app/(protected)/admin/blog/page.tsx`**

```tsx
import { BlogAdmin } from "m14i-blogging/admin";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogBuilder } from "m14i-blogging";

export default async function BlogAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user role
  const { data: profile } = user
    ? await supabase.from("users").select("role").eq("id", user.id).single()
    : { data: null };

  const isAdmin = profile?.role === "admin";

  return (
    <BlogAdmin
      isAllowed={isAdmin}
      currentUser={
        user
          ? {
              id: user.id,
              name: user.user_metadata?.name,
              email: user.email,
            }
          : undefined
      }
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

### 5. Done!

Visit `/admin/blog` to see your blog admin interface!

---

## API Routes Setup

### Route Structure

The BlogAdmin component expects these API endpoints:

```
GET    /api/blog              → List posts
POST   /api/blog              → Create post
GET    /api/blog/[id]         → Get post
PATCH  /api/blog/[id]         → Update post
DELETE /api/blog/[id]         → Delete post
POST   /api/blog/[id]/publish → Publish post

GET    /api/blog/categories   → List categories
POST   /api/blog/categories   → Create category

GET    /api/blog/tags         → List tags
POST   /api/blog/tags         → Create tag
```

### Handler Factories

The package provides handler factories for all routes:

```typescript
// Posts
import {
  createListPostsHandler,
  createGetPostBySlugHandler,
  createCreatePostHandler,
  createUpdatePostHandler,
  createDeletePostHandler,
  createPublishPostHandler,
  createSearchPostsHandler,
} from "m14i-blogging/server";

// Categories
import {
  createListCategoriesHandler,
  createGetCategoryHandler,
  createCreateCategoryHandler,
  createUpdateCategoryHandler,
  createDeleteCategoryHandler,
} from "m14i-blogging/server";

// Tags
import {
  createListTagsHandler,
  createGetTagHandler,
  createCreateTagHandler,
  createUpdateTagHandler,
  createDeleteTagHandler,
} from "m14i-blogging/server";
```

### Authentication

Pass your auth check function to mutation handlers:

```typescript
async function checkAuth(request: Request) {
  // Your auth logic
  // Throw error if unauthorized
  return user;
}

export const POST = createCreatePostHandler(getBlogClient, checkAuth);
export const PATCH = createUpdatePostHandler(getBlogClient, checkAuth);
export const DELETE = createDeletePostHandler(getBlogClient, checkAuth);
```

---

## Component Integration

### Basic Integration

Minimal setup with defaults:

```tsx
import { BlogAdmin } from "m14i-blogging/admin";
import { BlogBuilder } from "m14i-blogging";

export default function AdminPage() {
  const user = useUser(); // Your auth hook

  return (
    <BlogAdmin
      isAllowed={user?.role === "admin"}
      currentUser={user}
      components={{ BlogBuilder }}
    />
  );
}
```

### With shadcn/ui Components

Full integration with your design system:

```tsx
import { BlogAdmin } from "m14i-blogging/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { BlogBuilder } from "m14i-blogging";

export default function AdminPage() {
  const user = useUser();

  return (
    <BlogAdmin
      isAllowed={user?.role === "admin"}
      currentUser={user}
      components={{
        Button,
        Input,
        Card,
        Badge,
        Dialog,
        Select,
        BlogBuilder,
      }}
    />
  );
}
```

### With Custom Base Path

If your admin is at a different URL:

```tsx
<BlogAdmin
  isAllowed={user?.role === "admin"}
  basePath="/dashboard/content"
  apiBasePath="/api/content"
  // ...
/>
```

---

## Configuration

### Props Reference

```typescript
interface BlogAdminProps {
  // Required
  isAllowed: boolean;

  // Optional
  currentUser?: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
  apiBasePath?: string; // Default: "/api/blog"
  basePath?: string; // Default: "/admin/blog"
  theme?: "light" | "dark" | "system";
  colors?: {
    primary?: string;
    background?: string;
    border?: string;
    text?: string;
  };
  features?: {
    categories?: boolean; // Default: true
    tags?: boolean; // Default: true
    seo?: boolean; // Default: true
    autoSave?: boolean; // Default: true
    preview?: boolean; // Default: true
    featuredImage?: boolean; // Default: true
  };
  components?: {
    Button?: ComponentType;
    Input?: ComponentType;
    Card?: ComponentType;
    Badge?: ComponentType;
    Dialog?: ComponentType;
    Select?: ComponentType;
    BlogBuilder: ComponentType; // Required
  };
  labels?: Partial<BlogAdminLabels>; // See i18n section
  onPostCreate?: (post: any) => void;
  onPostUpdate?: (post: any) => void;
  onPostDelete?: (id: string) => void;
  onPublish?: (post: any) => void;
}
```

### Feature Toggles

Disable features you don't need:

```tsx
<BlogAdmin
  isAllowed={true}
  features={{
    categories: true,
    tags: true,
    seo: false, // Disable SEO fields
    autoSave: true,
    preview: true,
    featuredImage: false, // Disable featured images
  }}
  // ...
/>
```

### Internationalization (i18n)

Customize all labels:

```tsx
<BlogAdmin
  isAllowed={true}
  labels={{
    newPost: "New Post",
    saveDraft: "Save Draft",
    publish: "Publish",
    posts: "Posts",
    category: "Category",
    tags: "Tags",
    // ... all labels
  }}
  // ...
/>
```

Default labels are in French. See `src/admin/types/index.ts` for complete list.

### Callbacks

React to lifecycle events:

```tsx
<BlogAdmin
  isAllowed={true}
  onPostCreate={(post) => {
    console.log("Post created:", post);
    // Analytics, notifications, etc.
  }}
  onPostUpdate={(post) => {
    console.log("Post updated:", post);
  }}
  onPostDelete={(id) => {
    console.log("Post deleted:", id);
  }}
  onPublish={(post) => {
    console.log("Post published:", post);
    // Send notifications, invalidate cache, etc.
  }}
  // ...
/>
```

---

## Advanced Usage

### Custom Routing

The BlogAdmin component handles internal routing automatically:

- `/admin/blog` → List view
- `/admin/blog/new` → Create view
- `/admin/blog/edit/[id]` → Edit view
- `/admin/blog/preview/[slug]` → Preview view

You can use a catch-all route to make this work:

**`app/(protected)/admin/blog/[[...slug]]/page.tsx`**

```tsx
export default function BlogAdminPage() {
  return <BlogAdmin isAllowed={true} basePath="/admin/blog" />;
}
```

### Using Hooks Independently

For custom implementations, use the provided hooks:

```tsx
import {
  usePosts,
  useTaxonomy,
  usePostEditor,
} from "m14i-blogging/admin";

function CustomPostList() {
  const { posts, loading, fetchPosts, deletePost } = usePosts();

  useEffect(() => {
    fetchPosts({ status: "published" });
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <button onClick={() => deletePost(post.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### Using API Client Directly

```tsx
import { BlogAdminAPIClient } from "m14i-blogging/admin";

const apiClient = new BlogAdminAPIClient("/api/blog");

// List posts
const { posts, total } = await apiClient.listPosts({
  status: "published",
  page: 1,
  limit: 10,
});

// Create post
const newPost = await apiClient.createPost({
  title: "My Post",
  slug: "my-post",
  sections: [],
  status: "draft",
});

// Update post
const updatedPost = await apiClient.updatePost(postId, {
  title: "Updated Title",
});
```

### Preview System

The preview system uses sessionStorage for unsaved drafts:

```tsx
import {
  savePreviewData,
  loadPreviewData,
  clearPreviewData,
} from "m14i-blogging/admin";

// Save draft preview
savePreviewData("my-slug", {
  title: "My Post",
  sections: [],
  excerpt: "Brief summary",
  featured_image: "https://...",
  category: "Tutorials",
  tags: ["react", "nextjs"],
});

// Load preview
const previewData = loadPreviewData("my-slug");

// Clear preview
clearPreviewData("my-slug");
```

---

## TypeScript

The package is fully typed. Import types as needed:

```typescript
import type {
  BlogAdminProps,
  CurrentUser,
  PreviewData,
  BlogAdminFeatures,
  BlogAdminLabels,
  BlogAdminComponents,
} from "m14i-blogging/admin";

import type {
  BlogPostRow,
  BlogPostInsert,
  BlogPostUpdate,
  CategoryRow,
  TagRow,
} from "m14i-blogging/server";
```

---

## Troubleshooting

### "Must be used within BlogAdminProvider" Error

This error occurs if you try to use hooks outside the BlogAdmin component. Ensure hooks are only used within custom components rendered inside BlogAdmin.

### API Routes Not Working

1. Verify route paths match `apiBasePath` prop
2. Check auth function is working correctly
3. Ensure Supabase client has proper permissions
4. Check browser network tab for error responses

### Preview Not Showing

1. Verify `features.preview` is enabled (default: true)
2. Check browser allows popup windows
3. Ensure sessionStorage is available
4. Check preview route is accessible

### Auto-save Not Working

1. Verify `features.autoSave` is enabled (default: true)
2. Check browser console for errors
3. Ensure sessionStorage quota not exceeded

---

## Support

For issues, questions, or feature requests:

- GitHub Issues: [m14i-blogging-package](https://github.com/MerzoukeMansouri/m14i-blogging-package/issues)
- Documentation: [README.md](../README.md)

---

**Next Steps:**

- Customize the look with your shadcn/ui components
- Add custom callbacks for notifications
- Translate labels for your language
- Explore advanced hooks for custom views
