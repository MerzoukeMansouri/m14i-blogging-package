# m14i-blogging

Modular blog system for React/Next.js - Split into focused packages for easy SaaS integration.

[![npm](https://img.shields.io/badge/npm-package-red)](https://www.npmjs.com/org/m14i)
[![Storybook](https://img.shields.io/badge/Storybook-Live-ff4785?logo=storybook)](https://merzoukemansouri.github.io/m14i-blogging-package)

---

## 📦 Packages

| Package | Size | Peer Deps | Use Case |
|---------|------|-----------|----------|
| **[@m14i/blogging-core](./packages/core)** | ~50KB | 3 | Public blog frontend |
| **[@m14i/blogging-admin](./packages/admin)** | ~200KB | 11 | CMS with WYSIWYG editor |
| **[@m14i/blogging-server](./packages/server)** | ~110KB | 1 | API routes, AI, SEO |

---

## 🚀 Quick Start

**Read-only blog**:
```bash
npm install @m14i/blogging-core react react-dom lucide-react
```

**Full CMS**:
```bash
npm install @m14i/blogging-admin \
  react react-dom lucide-react \
  @hello-pangea/dnd \
  @tiptap/react @tiptap/starter-kit \
  @tiptap/extension-{image,link,placeholder} \
  react-markdown remark-gfm rehype-stringify remark-parse remark-rehype unified
```

**Server/API**:
```bash
npm install @m14i/blogging-server @supabase/supabase-js
```

See **[INSTALL.md](./INSTALL.md)** for complete integration guide.

---

## 🎯 Features

### @m14i/blogging-core
- ✅ Public blog UI with multiple layouts
- ✅ SEO optimization built-in
- ✅ Search, filtering, pagination
- ✅ Supabase data layer
- ✅ Zero heavy dependencies

### @m14i/blogging-admin
- ✅ Drag & drop layout builder
- ✅ WYSIWYG editor (TipTap)
- ✅ Rich content blocks (code, charts, PDFs, carousels)
- ✅ AI content generation
- ✅ Media upload

### @m14i/blogging-server
- ✅ Next.js API route handlers
- ✅ AI content generation (Claude)
- ✅ SEO utilities (sitemap, RSS, robots.txt)
- ✅ Media upload with validation
- ✅ Rate limiting middleware

---

## 📖 Documentation

- **[Installation Guide](./INSTALL.md)** - Fresh install for new projects
- **[Core Package](./packages/core/README.md)** - Public blog components
- **[Admin Package](./packages/admin/README.md)** - CMS interface
- **[Server Package](./packages/server/README.md)** - API & utilities
- **[Docs](./docs/README.md)** - Detailed guides

---

## 🏗️ Architecture

```
@m14i/blogging-core          (Base package)
     ↑          ↑
     |          |
@m14i/blogging-admin    @m14i/blogging-server
```

**Core** = Types + public UI + client  
**Admin** = Editor + builder (depends on core)  
**Server** = API routes + AI (depends on core)  

---

## 💻 Example

**Public blog**:
```tsx
import { Blog } from '@m14i/blogging-core';
import '@m14i/blogging-core/styles';

export default function BlogPage() {
  return <Blog basePath="/blog" />;
}
```

**Admin CMS**:
```tsx
import { BlogAdmin } from '@m14i/blogging-admin';
import '@m14i/blogging-admin/styles';

export default function AdminPage() {
  return <BlogAdmin basePath="/admin/blog" apiBasePath="/api/blog" />;
}
```

**API route**:
```ts
import { createPostsRoutes } from '@m14i/blogging-server';

export const { GET, POST } = createPostsRoutes({ supabase: getSupabase });
```

---

## 🔧 Development

```bash
# Install
pnpm install

# Build all
pnpm -r build

# Dev mode
pnpm -r dev

# Run example
cd example/app && pnpm dev
```

---

## 📊 Bundle Comparison

| Use Case | Before (monolith) | After (modular) |
|----------|-------------------|-----------------|
| Read-only blog | 15 peer deps | 3 peer deps |
| node_modules | 672MB | ~50MB |
| Integration | Complex | Simple |

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📝 License

MIT

---

## 🔗 Links

- **NPM**: [@m14i organization](https://www.npmjs.com/org/m14i)
- **Storybook**: [Live demos](https://merzoukemansouri.github.io/m14i-blogging-package)
- **Issues**: [GitHub Issues](https://github.com/MerzoukeMansouri/m14i-blogging-package/issues)
- **Repository**: [GitHub](https://github.com/MerzoukeMansouri/m14i-blogging-package)
