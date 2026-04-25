# @m14i/blogging-admin

Full-featured blog CMS with WYSIWYG editor and drag & drop layouts.

## Installation

```bash
npm install @m14i/blogging-admin \
  react react-dom lucide-react \
  @hello-pangea/dnd \
  @tiptap/react @tiptap/starter-kit \
  @tiptap/extension-{image,link,placeholder} \
  react-markdown remark-gfm rehype-stringify remark-parse remark-rehype unified
```

## Features

- ✍️ WYSIWYG editor (TipTap)
- 🎨 Drag & drop layout builder
- 📦 Rich content blocks (text, images, videos, code, charts, PDFs, carousels)
- 🤖 AI content generation (Claude)
- 📸 Media upload & management
- 🏷️ Category & tag management
- 📋 Post list with filters
- 👁️ Live preview

## Quick Start

```tsx
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
      features={{
        aiGeneration: true,
        media: true
      }}
    />
  );
}
```

## Components

### Main
- `<BlogAdmin />` - Complete admin interface
- `<BlogBuilder />` - Layout builder
- `<WYSIWYGEditor />` - Rich text editor
- `<ContentBlockRenderer />` - Block renderer

### Panels
- `<AIAssistantPanel />` - AI generation UI
- `<ContentBuilderPanel />` - Content blocks
- `<DraggableLayerPanel />` - Layer manager

### Views
- `<ListView />` - Post list
- `<EditorView />` - Post editor

## Hooks

```tsx
// Admin data
const { posts, createPost } = usePosts();
const { categories, tags } = useTaxonomy();
const { post, savePost } = usePostEditor(id);
const { context } = useBlogAdminContext();
```

## API Client

```ts
import { BlogAdminAPIClient } from '@m14i/blogging-admin';

const api = new BlogAdminAPIClient('/api/blog');

await api.createPost(postData);
await api.updatePost(id, updates);
await api.generateContent({ prompt, template });
```

## Content Blocks

Supported block types:
- Text (markdown, WYSIWYG)
- Image (with captions)
- Video (embed or upload)
- Code (syntax highlighting)
- Quote
- PDF (embed viewer)
- Carousel (image slideshow)
- Chart (bar, line, area, pie)

## AI Features

Requires `@anthropic-ai/sdk` and API key:

```tsx
<BlogAdmin
  features={{ aiGeneration: true }}
  aiConfig={{
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 4000
  }}
/>
```

Capabilities:
- Generate complete blog posts
- Generate sections
- Improve existing content
- SEO optimization
- Generate from templates

## Peer Dependencies

```json
{
  "@hello-pangea/dnd": "^16.0.0",
  "@tiptap/react": "^2.10.0",
  "@tiptap/starter-kit": "^2.10.0",
  "@tiptap/extension-image": "^2.10.0",
  "@tiptap/extension-link": "^2.10.0",
  "@tiptap/extension-placeholder": "^2.10.0",
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "react-markdown": "^9.0.0",
  "rehype-stringify": "^10.0.0",
  "remark-gfm": "^4.0.0",
  "remark-parse": "^11.0.0",
  "remark-rehype": "^11.0.0",
  "unified": "^11.0.0",
  "lucide-react": "^0.0.0"
}
```

## Dependencies

```json
{
  "@m14i/blogging-core": "workspace:*",
  "@m14i/blogging-server": "workspace:*",
  "recharts": "^3.8.1",
  "react-syntax-highlighter": "^16.1.1"
}
```

## Re-exports

All `@m14i/blogging-core` exports available:
```ts
import { Blog, usePosts, createBlogClient } from '@m14i/blogging-admin';
```

## License

MIT
