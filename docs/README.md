# m14i-blogging Documentation

Complete documentation for the m14i-blogging package - a blog management system for React applications.

## 📖 Table of Contents

### Getting Started

- **[Installation Guide](./INSTALLATION.md)** - Complete installation and setup
  - Package installation
  - Tailwind CSS configuration
  - Framework-specific setup
  - Troubleshooting

- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running in 5 minutes
  - Basic setup examples
  - Common patterns
  - Next steps

### Main Components

- **[BlogAdmin Guide](./BLOG_ADMIN_GUIDE.md)** - Complete admin interface guide
  - API routes setup
  - Component integration
  - Features and configuration
  - Advanced usage
  - TypeScript types

- **[Blog Guide](./BLOG_GUIDE.md)** - Public blog interface guide
  - API routes setup
  - Component integration
  - Layout options
  - Custom implementations
  - TypeScript types

### Customization & Features

- **[Styling Guide](./STYLING.md)** - Complete customization reference
  - CSS Variables theme system
  - ClassName props
  - Theme presets
  - Advanced examples

- **[SEO Guide](./SEO_GUIDE.md)** - SEO optimization
  - Automatic meta tags
  - Open Graph & Twitter Cards
  - JSON-LD structured data
  - Content analysis
  - Best practices

## 🚀 Quick Links

### For First-Time Users
1. **[Installation Guide](./INSTALLATION.md)** - Set up the package
2. **[Quick Start Guide](./QUICKSTART.md)** - Build your first blog
3. **[BlogAdmin Guide](./BLOG_ADMIN_GUIDE.md)** - Set up the admin interface
4. **[Blog Guide](./BLOG_GUIDE.md)** - Set up the public blog

### For Customization
- Visual customization: **[Styling Guide](./STYLING.md)**
- Search optimization: **[SEO Guide](./SEO_GUIDE.md)**

## 📦 What's in the Package

### Main Components

- **BlogAdmin** - Complete admin interface
  - Post management (CRUD)
  - Category and tag management
  - Rich text editor (BlogBuilder)
  - Live preview
  - Auto-save
  - SEO fields

- **Blog** - Public blog interface
  - Multiple layouts (Grid, List, Masonry, Magazine)
  - Search and filtering
  - Category/tag navigation
  - Pagination
  - Related posts
  - SEO-ready

### Additional Components

- **BlogBuilder** - Drag & drop content editor
- **BlogPreview** - Read-only content renderer
- **BlogSEO** / **BlogHead** - SEO metadata components

### Content Blocks

- Text (Markdown)
- Images
- Videos (YouTube, Vimeo)
- Carousel (with auto-play, navigation)
- Quotes
- PDFs (embed or download)

### Layouts

- Column layouts (1, 2, 3 columns with variants)
- Grid layouts (2×2, 3×3, 2×3, 4-column)

## 🎨 Customization Methods

### 1. CSS Variables
Quick theming with CSS variables:
```css
:root {
  --blog-primary: 220 100% 50%;
  --blog-font-family: 'Inter', sans-serif;
}
```

### 2. ClassName Props
Component-level customization:
```tsx
<Blog
  classNames={{
    postTitle: "text-6xl font-black text-purple-600"
  }}
/>
```

### 3. Theme Presets
Pre-configured themes:
```tsx
import { applyTheme, themePresets } from 'm14i-blogging';
applyTheme(themePresets.ocean.cssVariables!);
```

## 🔍 SEO Features

- Auto-generated meta tags
- Open Graph for social sharing
- Twitter Card optimization
- JSON-LD structured data (Schema.org)
- Reading time calculation
- Content analysis & SEO scoring
- Smart defaults & auto-fill

## 💡 Need Help?

- Check the [Installation Guide](./INSTALLATION.md) for setup issues
- Review the [BlogAdmin Guide](./BLOG_ADMIN_GUIDE.md) for admin features
- Review the [Blog Guide](./BLOG_GUIDE.md) for public blog features
- Explore the [Styling Guide](./STYLING.md) for customization
- Read the [SEO Guide](./SEO_GUIDE.md) for optimization
- Browse the [Live Storybook](https://merzoukemansouri.github.io/m14i-blogging-package) for examples

## 📄 License

MIT
