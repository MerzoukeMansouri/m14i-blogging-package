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

### Read-Only Blog (Next.js App Router)

**1. Create blog page**
```tsx
// app/blog/[[...path]]/page.tsx
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

**2. Done**

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
- `Blog` - Complete blog UI
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

## Support

Issues: https://github.com/MerzoukeMansouri/m14i-blogging-package/issues  
Docs: Check package README files in `node_modules/@m14i/blogging-*/`
