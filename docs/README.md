# m14i-blogging Documentation

Complete documentation for the m14i-blogging package - a customizable blog builder for React applications.

## 📖 Table of Contents

### Getting Started
- **[Installation Guide](./INSTALLATION.md)** - Complete installation instructions
  - Step-by-step installation
  - Peer dependencies explained
  - Tailwind CSS setup
  - Framework-specific setup (Next.js, Vite, Remix)
  - Troubleshooting

- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running in 5 minutes
  - Basic setup
  - First blog post
  - Common patterns

### Customization & Styling
- **[Complete Styling Guide](./STYLING.md)** - Full customization reference
  - CSS Variables theme system (60+ variables)
  - ClassName props customization
  - Theme presets (dark, ocean, sunset, forest, minimal)
  - Advanced examples and best practices

### SEO & Optimization
- **[SEO Guide](./SEO_GUIDE.md)** - Comprehensive SEO documentation
  - Automatic meta tag generation
  - Open Graph & Twitter Cards
  - JSON-LD structured data
  - Content analysis & validation
  - Next.js integration
  - Best practices

### Features & Usage
- **[Gallery Layouts](./GALLERY_LAYOUTS.md)** - Grid layout documentation
  - Grid 2×2, 3×3, 2×3, and 4-column layouts
  - Usage examples
  - Best practices
  - Use cases

## 🚀 Quick Links

### For First-Time Users
1. **[Installation Guide](./INSTALLATION.md)** - Set up the package
2. **[Quick Start Guide](./QUICKSTART.md)** - Build your first blog

### For Customization
Visual customization: **[Styling Guide](./STYLING.md)**

### For SEO Optimization
Improve search rankings: **[SEO Guide](./SEO_GUIDE.md)**

### For Advanced Layouts
Complex layouts: **[Gallery Layouts](./GALLERY_LAYOUTS.md)**

## 📦 What's in the Package

### Components
- **BlogBuilder** - Drag & drop editor
- **BlogPreview** - Read-only preview
- **ContentBlockRenderer** - Individual block rendering
- **BlogSEO** - SEO metadata (App Router)
- **BlogHead** - SEO metadata (Pages Router)

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

### Features
- ✅ Drag & drop editing
- ✅ Markdown support
- ✅ Customizable themes
- ✅ Automatic SEO optimization
- ✅ Reading time calculation
- ✅ Responsive design
- ✅ TypeScript support

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
<BlogPreview
  classNames={{
    title: "text-6xl font-black text-purple-600"
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

- Check the [Quick Start Guide](./QUICKSTART.md) for basic usage
- Review the [Styling Guide](./STYLING.md) for customization
- Read the [SEO Guide](./SEO_GUIDE.md) for optimization
- Explore the [Gallery Layouts](./GALLERY_LAYOUTS.md) for advanced layouts

## 📄 License

MIT
