# Quick Start Guide - M14I Blogging

Get started with m14i-blogging in 5 minutes.

## Installation

```bash
npm install m14i-blogging @hello-pangea/dnd react-markdown remark-gfm lucide-react
```

## Basic Setup

### 1. Import Styles

In your main app file (e.g., `_app.tsx`, `layout.tsx`, or `main.tsx`):

```tsx
import 'm14i-blogging/dist/index.css';
```

### 2. Create a Blog Post Preview

```tsx
import { BlogPreview } from 'm14i-blogging';
import type { LayoutSection } from 'm14i-blogging';

const sections: LayoutSection[] = [
  {
    id: "intro",
    type: "1-column",
    columns: [
      [
        {
          id: "text-1",
          type: "text",
          content: "# Hello World\n\nThis is my first blog post!"
        }
      ]
    ]
  }
];

function MyBlogPost() {
  return (
    <BlogPreview
      title="My First Post"
      sections={sections}
    />
  );
}
```

### 3. Add the Blog Editor

```tsx
import { BlogBuilder } from 'm14i-blogging';
import { useState } from 'react';

function MyEditor() {
  const [sections, setSections] = useState<LayoutSection[]>([]);

  return (
    <BlogBuilder
      sections={sections}
      onChange={setSections}
    />
  );
}
```

## Customization

### Quick Theme with CSS Variables

Create a `blog-theme.css` file:

```css
:root {
  --blog-primary: 220 100% 50%;        /* Your brand blue */
  --blog-font-family: 'Inter', sans-serif;
  --blog-radius-lg: 1rem;
}
```

Import it after the library CSS:

```tsx
import 'm14i-blogging/dist/index.css';
import './blog-theme.css';  // Your custom theme
```

### Quick Theme with Presets

```tsx
import { useEffect } from 'react';
import { applyTheme, themePresets } from 'm14i-blogging';

function App() {
  useEffect(() => {
    // Apply a preset theme
    applyTheme(themePresets.ocean.cssVariables!);
  }, []);

  return <BlogPreview {...props} />;
}
```

### Quick Styling with ClassName Props

```tsx
<BlogPreview
  title="My Post"
  sections={sections}
  classNames={{
    container: "max-w-6xl mx-auto px-8 py-12",
    title: "text-5xl font-bold text-blue-600"
  }}
/>
```

## Framework Integration

### Next.js (App Router)

```tsx
// app/layout.tsx
import 'm14i-blogging/dist/index.css';
import './globals.css';

// app/blog/[slug]/page.tsx
import { BlogPreview } from 'm14i-blogging';

export default function BlogPost({ params }) {
  const { sections } = getPost(params.slug); // Your data fetching

  return <BlogPreview title="Article" sections={sections} />;
}
```

### Next.js (Pages Router)

```tsx
// pages/_app.tsx
import 'm14i-blogging/dist/index.css';

// pages/blog/[slug].tsx
import { BlogPreview } from 'm14i-blogging';

export default function BlogPost({ post }) {
  return <BlogPreview title={post.title} sections={post.sections} />;
}
```

### Vite + React

```tsx
// main.tsx
import 'm14i-blogging/dist/index.css';
import './index.css';

// App.tsx
import { BlogPreview } from 'm14i-blogging';
```

### Remix

```tsx
// app/root.tsx
import blogStyles from 'm14i-blogging/dist/index.css?url';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: blogStyles },
];

// app/routes/blog.$slug.tsx
import { BlogPreview } from 'm14i-blogging';
```

## Common Patterns

### With Next.js Image Component

```tsx
import Image from 'next/image';
import { BlogPreview } from 'm14i-blogging';

<BlogPreview
  title="My Post"
  sections={sections}
  ImageComponent={Image}
/>
```

### With Dark Mode Toggle

```tsx
import { useState, useEffect } from 'react';
import { applyTheme, themePresets } from 'm14i-blogging';

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    applyTheme(
      isDark
        ? themePresets.dark.cssVariables!
        : themePresets.default.cssVariables!
    );
  }, [isDark]);

  return (
    <>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle Theme
      </button>
      <BlogPreview {...props} />
    </>
  );
}
```

### Save to Backend

```tsx
import { BlogBuilder } from 'm14i-blogging';

function Editor() {
  const [sections, setSections] = useState<LayoutSection[]>([]);

  const handleSave = async () => {
    await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ sections }),
      headers: { 'Content-Type': 'application/json' },
    });
  };

  return (
    <>
      <BlogBuilder
        sections={sections}
        onChange={setSections}
      />
      <button onClick={handleSave}>Save</button>
    </>
  );
}
```

## Next Steps

- 📖 **[Complete Styling Guide](./STYLING.md)** - Full customization documentation
- 🔍 **[SEO Guide](./SEO_GUIDE.md)** - Optimize for search engines
- 📊 **[Gallery Layouts](./GALLERY_LAYOUTS.md)** - Advanced grid layouts
- 📚 **Storybook** - Run `npm run storybook` to explore interactive examples
- 🎨 **Theme Playground** - Try the Theme Playground story in Storybook
- 📘 **[Full README](../README.md)** - Complete API reference

## Need Help?

- Check the [Styling Guide](./STYLING.md) for customization examples
- Review the [SEO Guide](./SEO_GUIDE.md) for optimization tips
- Browse Storybook for live examples
- Explore [all documentation](./README.md) for complete guides
- Open an issue on GitHub for bugs or questions

---

Happy Blogging! 🚀
