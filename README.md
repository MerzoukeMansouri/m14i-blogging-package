# m14i-blogging

Drag & drop blog builder with customizable layouts and content blocks for React applications.

## Installation

```bash
npm install m14i-blogging @hello-pangea/dnd react-markdown remark-gfm lucide-react
# or
pnpm add m14i-blogging @hello-pangea/dnd react-markdown remark-gfm lucide-react
```

### Prerequisites

This package requires **shadcn/ui components** in your project. Install them with:

```bash
npx shadcn@latest add label input textarea select button card
```

## Quick Start

```tsx
import { BlogBuilder } from 'm14i-blogging'
import type { LayoutSection } from 'm14i-blogging'

function MyEditor() {
  const [sections, setSections] = useState<LayoutSection[]>([])

  return (
    <BlogBuilder
      sections={sections}
      onChange={setSections}
    />
  )
}
```

## Configuration

```tsx
<BlogBuilder
  sections={sections}
  onChange={setSections}
  config={{
    // Customize available layouts
    layouts: [
      { type: '1-column', label: 'Une colonne', icon: LayoutGrid },
      { type: '2-columns', label: 'Deux colonnes', icon: Columns }
    ],

    // Customize available blocks
    blocks: [
      { type: 'text', label: 'Texte', icon: Type },
      { type: 'image', label: 'Image', icon: ImageIcon }
    ],

    // Theme customization
    theme: {
      colors: {
        primary: '#B87333',
        border: '#e5e7eb',
        background: '#ffffff'
      }
    },

    // Callbacks
    callbacks: {
      onChange: (sections) => console.log('Changed:', sections),
      onSave: (sections) => console.log('Saved:', sections)
    },

    // UI options
    ui: {
      showPreviewToggle: true,
      compactMode: false,
      sidebarWidth: '320px'
    }
  }}
/>
```

## Components

### BlogBuilder

Main drag & drop editor component.

**Props:**
- `sections`: `LayoutSection[]` - Current blog sections
- `onChange`: `(sections: LayoutSection[]) => void` - Called when sections change
- `config?`: `BlogBuilderConfig` - Configuration object

### BlogPreview

Read-only preview of blog post.

**Props:**
- `title`: `string` - Blog post title
- `sections`: `LayoutSection[]` - Blog sections to preview
- `ImageComponent?`: Custom Image component (e.g., Next.js Image)

### ContentBlockRenderer

Renders individual content blocks (used internally).

### ContentBlockInlineEditor

Inline editor for content blocks (requires shadcn/ui components).

## Types

```typescript
import type {
  LayoutSection,
  ContentBlock,
  LayoutType,
  ContentBlockType,
  BlogPost,
  BlogBuilderConfig
} from 'm14i-blogging'
```

## Utilities

```typescript
import {
  createEmptyColumns,
  getLayoutClasses,
  getLayoutLabel
} from 'm14i-blogging'
```

## License

MIT
