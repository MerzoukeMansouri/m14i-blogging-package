# Fresh Installation Guide

Agent-readable instructions for integrating m14i-blogging into a new SaaS application.

---

## Installation Options

Choose based on requirements:

### Option 1: Read-Only Blog (Minimal)
**Use case**: Display published blog posts, no editing
**Bundle**: ~50KB | **Deps**: 3 peer dependencies

```bash
npm install @m14i/blogging-core react react-dom lucide-react
```

### Option 2: Full CMS (Admin Panel)
**Use case**: Complete blog management with WYSIWYG editor
**Bundle**: ~200KB | **Deps**: 11 peer dependencies

```bash
npm install @m14i/blogging-admin \
  react react-dom lucide-react \
  @hello-pangea/dnd \
  @tiptap/react @tiptap/starter-kit \
  @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder \
  react-markdown remark-gfm rehype-stringify remark-parse remark-rehype unified
```

### Option 3: Server-Side (API + AI)
**Use case**: Backend API routes, AI content generation
**Bundle**: ~110KB | **Deps**: 1 required + 1 optional

```bash
npm install @m14i/blogging-server @supabase/supabase-js

# Optional: AI features
npm install @anthropic-ai/sdk
```

### Option 4: Complete Stack
**All features**: Frontend + Admin + Server

```bash
npm install @m14i/blogging-core @m14i/blogging-admin @m14i/blogging-server \
  react react-dom lucide-react \
  @hello-pangea/dnd \
  @tiptap/react @tiptap/starter-kit \
  @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder \
  react-markdown remark-gfm rehype-stringify remark-parse remark-rehype unified \
  @supabase/supabase-js
```

---

## Database Setup (Supabase)

### 1. Create Supabase Project
```bash
# Via CLI
npx supabase init
npx supabase start

# Or use Supabase Dashboard: https://supabase.com
```

### 2. Run Migrations
```bash
# Copy migration file from package
cp node_modules/@m14i/blogging-core/supabase/migrations/20260425000000_add_brand_settings.sql \
   supabase/migrations/

# Apply
npx supabase db push
```

### 3. Environment Variables
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: AI features
ANTHROPIC_API_KEY=your-anthropic-key
```

---

## Code Integration

### Read-Only Blog (Next.js App Router - SSR)

**1. Create blog list page**
```tsx
// app/blog/[[...path]]/page.tsx
import { Suspense } from "react";
import { getBlogClient } from "@/lib/blog-client";
import { BlogPostDetail } from "./BlogPostDetail";
import { BlogPostList } from "./BlogPostList";

interface PageProps {
  params: Promise<{
    path?: string[];
  }>;
}

export default async function BlogPage({ params }: PageProps) {
  const { path } = await params;
  const slug = path?.[0];

  const blogClient = await getBlogClient();

  if (!slug) {
    const result = await blogClient.posts.list({ status: "published" });
    const posts = result?.posts || [];
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <BlogPostList posts={posts} />
      </Suspense>
    );
  }

  const post = await blogClient.posts.getBySlug(slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPostDetail post={post} />
    </Suspense>
  );
}
```

**2. Create blog list component**
```tsx
// app/blog/[[...path]]/BlogPostList.tsx
"use client";

import { BlogPostList as CoreBlogPostList } from "@m14i/blogging-core";
import type { BlogPostRow } from "@m14i/blogging-core";
import Image from "next/image";

interface BlogPostListProps {
  posts: BlogPostRow[];
}

export function BlogPostList({ posts }: BlogPostListProps) {
  return (
    <CoreBlogPostList
      posts={posts}
      ImageComponent={Image}
      pageTitle="Blog"
      basePath="/blog"
      emptyMessage="No posts yet"
      showCategory={true}
      showExcerpt={true}
      showFeaturedImage={true}
    />
  );
}
```

**3. Create blog detail component**
```tsx
// app/blog/[[...path]]/BlogPostDetail.tsx
"use client";

import { BlogPreview } from "@m14i/blogging-core";
import type { BlogPostRow } from "@m14i/blogging-core";
import Image from "next/image";

interface BlogPostDetailProps {
  post: BlogPostRow;
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
  return (
    <BlogPreview
      title={post.title}
      excerpt={post.excerpt || undefined}
      sections={post.sections}
      ImageComponent={Image}
      showReadingTime={true}
      date={post.published_at || post.created_at}
      showMeta={true}
      dateLocale="en-US"
    />
  );
}
```

**4. Create blog client helper**
```tsx
// lib/blog-client.ts
import { createClient } from "@/lib/supabase-server";
import { createBlogClient } from "@m14i/blogging-core";

export async function getBlogClient() {
  const supabase = createClient();
  return createBlogClient(supabase);
}
```

**5. Done**

---

### Admin CMS (Next.js App Router)

**1. Create admin page**
```tsx
// app/admin/blog/[[...path]]/page.tsx
import { BlogAdmin } from '@m14i/blogging-admin';
import '@m14i/blogging-admin/styles';

export default function AdminPage() {
  return (
    <BlogAdmin
      basePath="/admin/blog"
      apiBasePath="/api/blog"
      supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
      supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
      currentUser={{
        id: 'user-id',
        email: 'user@example.com',
        role: 'admin'
      }}
    />
  );
}
```

**2. Create API routes** (see Server Setup below)

---

### Server Setup (Next.js API Routes)

**Create API handler**
```ts
// app/api/blog/route.ts
import { createPostsRoutes } from '@m14i/blogging-server';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export const { GET, POST } = createPostsRoutes({
  supabase: getSupabase,
});
```

**Additional routes**:
```ts
// app/api/blog/[id]/route.ts
import { createPostByIdRoutes } from '@m14i/blogging-server';
export const { GET, PUT, DELETE } = createPostByIdRoutes({ supabase: getSupabase });

// app/api/blog/slug/[slug]/route.ts
import { createPostBySlugRoute } from '@m14i/blogging-server';
export const GET = createPostBySlugRoute({ supabase: getSupabase });

// app/api/blog/generate/complete/route.ts
import { createGenerateCompleteRoute } from '@m14i/blogging-server';
export const POST = createGenerateCompleteRoute({
  supabase: getSupabase,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
});
```

---

## Tailwind CSS Setup

**Add to tailwind.config.js**
```js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './node_modules/@m14i/blogging-**/dist/**/*.{js,mjs}',
  ],
  // ... rest of config
};
```

---

## TypeScript Configuration

**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## Package Exports

### @m14i/blogging-core

**Components**
- `Blog` - Complete blog UI (CSR with routing)
- `BlogPostList` - Themeable blog post grid/list
- `BlogPreview` - Themeable single post renderer
- `PostCard`, `Sidebar`, `Pagination`, `SearchBox`, `CategoryFilter`, `TagCloud`
- `GridLayout`, `ListLayout`, `MasonryLayout`, `MagazineLayout`
- `BlogSEO`, `BlogHead`

**Hooks**
- `usePosts()`, `usePost()`, `useSearch()`, `useCategories()`, `useTags()`, `useRelatedPosts()`
- `useBlogContext()`

**Client**
- `createBlogClient()` - Supabase wrapper

**Utils**
- SEO: `generateSlug()`, `analyzeContent()`, `calculateReadingTime()`, `generateExcerpt()`
- Meta: `generateHTMLMetaTags()`, `generateArticleSchema()`, `generateBreadcrumbSchema()`
- Format: `formatDate()`, `formatReadingTime()`, `truncateText()`

**Types**
- All blog types, layout types, block types, SEO types, database types
- Theme types: `BlogPostListTheme`, `BlogPreviewTheme`

---

### @m14i/blogging-admin

**Components**
- `BlogAdmin` - Full admin interface
- `BlogBuilder` - Drag & drop layout builder
- `WYSIWYGEditor` - Rich text editor
- `ContentBlockRenderer` - Renders all blocks (text, images, videos, code, charts, carousels, PDFs)
- `AIAssistantPanel`, `ContentBuilderPanel`, `DraggableLayerPanel`

**Hooks**
- `usePosts()`, `useTaxonomy()`, `usePostEditor()`
- `useBlogAdminContext()`

**API Client**
- `BlogAdminAPIClient` - Type-safe API wrapper

**Re-exports**
- All `@m14i/blogging-core` exports

---

### @m14i/blogging-server

**Route Handlers**
- Posts: `createPostsRoutes()`, `createPostByIdRoutes()`, `createPostBySlugRoute()`
- AI: `createGenerateCompleteRoute()`, `createGenerateSectionRoute()`, `createGenerateSEORoute()`
- Media: `createMediaHandlers()`
- Stats: `createStatsHandler()`, `createCategoriesHandler()`, `createTagsHandler()`

**AI Services**
- `createAIContentGenerator()`
- `AIContentGenerator` class

**SEO**
- `generateBlogSitemap()`, `generateRSSFeed()`, `generateRobotsTxt()`
- `generateBlogPostMetadata()`, `generateBlogPostJsonLd()`

**Media**
- `handleFileUpload()`, `createSupabaseStorageAdapter()`
- `validateFile()`, `sanitizeFileName()`

**Middleware**
- `applyRateLimit()`, `getRateLimiter()`

**Utils**
- `checkAuth()`, `checkAdmin()`, `requireAdmin()`
- `jsonResponse()`, `errorResponse()`, `successResponse()`

---

## Minimal Example (Full Stack)

```bash
# Install
npm install @m14i/blogging-core @m14i/blogging-admin @m14i/blogging-server \
  react react-dom lucide-react @supabase/supabase-js

# Create pages
mkdir -p app/blog/[[...path]] app/admin/blog/[[...path]] app/api/blog
```

**Blog page** (`app/blog/[[...path]]/page.tsx`):
```tsx
import { Blog } from '@m14i/blogging-core';
import '@m14i/blogging-core/styles';

export default function BlogPage() {
  return <Blog basePath="/blog" supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!} supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!} />;
}
```

**Admin page** (`app/admin/blog/[[...path]]/page.tsx`):
```tsx
import { BlogAdmin } from '@m14i/blogging-admin';
import '@m14i/blogging-admin/styles';

export default function AdminPage() {
  return <BlogAdmin basePath="/admin/blog" apiBasePath="/api/blog" supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!} supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!} currentUser={{ id: '1', email: 'admin@example.com', role: 'admin' }} />;
}
```

**API route** (`app/api/blog/route.ts`):
```ts
import { createPostsRoutes } from '@m14i/blogging-server';
import { createClient } from '@supabase/supabase-js';

export const { GET, POST } = createPostsRoutes({
  supabase: () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
});
```

**Done** - Visit `/blog` (public) and `/admin/blog` (CMS)

---

## Verification Steps

1. **Database**: Check tables exist in Supabase
   ```sql
   SELECT * FROM blog_posts LIMIT 1;
   SELECT * FROM blog_media LIMIT 1;
   ```

2. **API**: Test endpoint
   ```bash
   curl http://localhost:3000/api/blog
   ```

3. **Frontend**: Visit `/blog` - should render (empty state)

4. **Admin**: Visit `/admin/blog` - should render CMS

---

## Troubleshooting

**Build errors**: Ensure peer deps installed
```bash
npm ls @tiptap/react @hello-pangea/dnd
```

**Runtime errors**: Check env vars
```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Type errors**: Add to `tsconfig.json`
```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

**Styles not loading**: Import in layout
```tsx
// app/layout.tsx
import '@m14i/blogging-admin/styles';
```

---

## Repository Structure

```
your-saas/
├── app/
│   ├── blog/[[...path]]/page.tsx          # Public blog
│   ├── admin/blog/[[...path]]/page.tsx    # CMS
│   └── api/blog/
│       ├── route.ts                        # List/create posts
│       ├── [id]/route.ts                   # Get/update/delete
│       ├── slug/[slug]/route.ts            # Get by slug
│       └── generate/
│           └── complete/route.ts           # AI generation
├── supabase/
│   └── migrations/
│       └── 20260425000000_add_brand_settings.sql
├── .env.local
├── package.json
└── tsconfig.json
```

---

## Theme Customization

Both `BlogPostList` and `BlogPreview` support full theme customization via CSS class overrides.

### BlogPostList Theme

```tsx
import { BlogPostList, type BlogPostListTheme } from "@m14i/blogging-core";

const customTheme: BlogPostListTheme = {
  // Container wrapper - default: "container mx-auto px-4 py-8"
  container: "max-w-7xl mx-auto px-6 py-12",

  // Page title - default: "text-4xl font-bold mb-8"
  title: "text-5xl font-extrabold mb-10 text-gray-900",

  // Grid layout - default: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  grid: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8",

  // Post card - default: "block border rounded-lg p-6 hover:shadow-lg transition-shadow"
  card: "block bg-white rounded-xl p-8 shadow-md hover:shadow-2xl transition-all duration-300",

  // Featured image - default: "w-full h-48 object-cover rounded-lg mb-4"
  image: "w-full h-64 object-cover rounded-t-xl mb-6",

  // Post title - default: "text-xl font-bold mb-2"
  postTitle: "text-2xl font-semibold mb-3 text-gray-800",

  // Excerpt - default: "text-muted-foreground mb-4"
  excerpt: "text-gray-600 mb-6 line-clamp-3",

  // Category badge - default: "inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
  category: "inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-xs font-medium",

  // Empty state container - default: "container mx-auto px-4 py-16 text-center"
  emptyContainer: "container mx-auto px-4 py-24 text-center",

  // Empty state text - default: "text-muted-foreground"
  emptyText: "text-gray-500 text-lg",
};

<BlogPostList posts={posts} theme={customTheme} />
```

### BlogPreview Theme

```tsx
import { BlogPreview, type BlogPreviewTheme } from "@m14i/blogging-core";

const customTheme: BlogPreviewTheme = {
  // Main container - default: "max-w-4xl mx-auto px-4 py-8"
  container: "max-w-5xl mx-auto px-6 py-12",

  // Header section - default: "mb-12"
  header: "mb-16 text-center",

  // Article title - default: "text-4xl md:text-5xl font-bold mb-4"
  title: "text-5xl md:text-6xl font-extrabold mb-6 text-gray-900",

  // Excerpt/subtitle - default: "text-xl text-muted-foreground mb-6"
  excerpt: "text-2xl text-gray-600 mb-8 font-light",

  // Metadata (date, reading time) - default: "flex items-center gap-4 text-sm text-muted-foreground"
  meta: "flex items-center justify-center gap-6 text-base text-gray-500",

  // Article content wrapper - default: "space-y-8"
  article: "space-y-12 prose prose-lg max-w-none",

  // Section wrapper - default: "mb-8"
  section: "mb-12",

  // Column wrapper - default: "flex flex-col justify-center space-y-4 min-w-0 overflow-hidden"
  column: "flex flex-col justify-center space-y-6 min-w-0 overflow-hidden",

  // Empty state container - default: "text-center py-20 text-muted-foreground"
  emptyContainer: "text-center py-32 text-gray-400",

  // Empty state text - default: undefined (inherits from parent)
  emptyText: "text-lg italic",

  // "No title" placeholder - default: "text-4xl text-muted-foreground italic"
  noTitlePlaceholder: "text-5xl text-gray-400 italic font-light",
};

<BlogPreview
  title={post.title}
  sections={post.sections}
  theme={customTheme}
  showReadingTime={true}
  dateLocale="en-US"
/>
```

### BlogPostList Props

```tsx
interface BlogPostListProps {
  // Required
  posts: BlogPostRow[];

  // Optional customization
  ImageComponent?: React.ComponentType<{src, alt, className, width, height}>;
  theme?: BlogPostListTheme;
  pageTitle?: string;           // default: "Blog"
  basePath?: string;            // default: "/blog"
  emptyMessage?: string;        // default: "No posts yet"
  showCategory?: boolean;       // default: true
  showExcerpt?: boolean;        // default: true
  showFeaturedImage?: boolean;  // default: true
}
```

### BlogPreview Props

```tsx
interface BlogPreviewProps {
  // Required
  title: string;
  sections: LayoutSection[];

  // Optional customization
  excerpt?: string;
  ImageComponent?: React.ComponentType<{src, alt, fill?, className?}>;
  theme?: BlogPreviewTheme;
  classNames?: BlogPreviewTheme;  // deprecated, use theme
  showReadingTime?: boolean;      // default: false
  date?: string | Date;
  readingTimeText?: string;       // override calculated time
  dateLocale?: string;            // default: "fr-FR"
  showMeta?: boolean;             // default: true
  noTitleText?: string;           // default: "Sans titre"
  emptyStateMessage?: string;     // default: "Aucun contenu pour le moment"
  emptyStateHelper?: string;      // default: "Ajoutez des sections pour voir le preview"
}
```

---

## Support

Issues: https://github.com/MerzoukeMansouri/m14i-blogging-package/issues
Docs: Check package README files in `node_modules/@m14i/blogging-*/`
