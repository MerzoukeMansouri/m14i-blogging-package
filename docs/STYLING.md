# Styling Guide for M14I Blogging

Complete guide to customizing the appearance of your blog components.

**Package Links:**
- npm: [https://www.npmjs.com/package/m14i-blogging](https://www.npmjs.com/package/m14i-blogging)
- Storybook: [https://merzoukemansouri.github.io/m14i-blogging-package](https://merzoukemansouri.github.io/m14i-blogging-package)

## Table of Contents

1. [Quick Start](#quick-start)
2. [CSS Variables Theme System](#css-variables-theme-system)
3. [ClassName Props Customization](#classname-props-customization)
4. [Theme Presets](#theme-presets)
5. [Complete Customization Examples](#complete-customization-examples)
6. [CSS Variables Reference](#css-variables-reference)

---

## Quick Start

There are **two main ways** to customize the styling:

### 1. CSS Variables (Easiest)

Override CSS variables in your global CSS:

```css
:root {
  --blog-primary: 220 100% 50%;
  --blog-font-family: 'Inter', sans-serif;
  --blog-radius-lg: 1rem;
}
```

### 2. ClassName Props (Most Flexible)

Pass custom classes to components:

```tsx
<BlogPreview
  title="My Post"
  sections={sections}
  classNames={{
    container: "max-w-6xl mx-auto px-8",
    title: "text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
  }}
/>
```

---

## CSS Variables Theme System

### Available Variable Categories

#### Colors

All colors use **HSL format without the hsl() wrapper**.

```css
:root {
  /* Base Colors */
  --blog-background: 0 0% 100%;           /* Page background */
  --blog-foreground: 0 0% 3.9%;           /* Main text color */
  --blog-primary: 0 0% 9%;                /* Primary accent color */
  --blog-primary-foreground: 0 0% 98%;    /* Text on primary color */
  --blog-secondary: 0 0% 96.1%;           /* Secondary accent */
  --blog-secondary-foreground: 0 0% 9%;   /* Text on secondary */
  --blog-muted: 0 0% 96.1%;               /* Muted backgrounds */
  --blog-muted-foreground: 0 0% 45.1%;    /* Muted text */
  --blog-accent: 0 0% 96.1%;              /* Accent backgrounds */
  --blog-accent-foreground: 0 0% 9%;      /* Text on accent */
  --blog-border: 0 0% 89.8%;              /* Border color */
  --blog-card: 0 0% 100%;                 /* Card background */
  --blog-card-foreground: 0 0% 3.9%;      /* Card text */
}
```

**HSL Color Examples:**
- Black: `0 0% 0%`
- White: `0 0% 100%`
- Blue: `220 100% 50%`
- Red: `0 84% 60%`
- Green: `142 71% 45%`

#### Typography

```css
:root {
  /* Font Families */
  --blog-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --blog-font-family-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;

  /* Font Sizes */
  --blog-font-size-xs: 12px;
  --blog-font-size-sm: 14px;
  --blog-font-size-base: 16px;
  --blog-font-size-lg: 18px;
  --blog-font-size-xl: 20px;
  --blog-font-size-2xl: 24px;
  --blog-font-size-3xl: 30px;
  --blog-font-size-4xl: 36px;
  --blog-font-size-5xl: 48px;

  /* Line Heights */
  --blog-line-height-base: 1.5;
  --blog-line-height-tight: 1.25;
  --blog-line-height-relaxed: 1.75;

  /* Font Weights */
  --blog-font-weight-normal: 400;
  --blog-font-weight-medium: 500;
  --blog-font-weight-semibold: 600;
  --blog-font-weight-bold: 700;
}
```

#### Spacing

```css
:root {
  --blog-spacing-xs: 0.25rem;    /* 4px */
  --blog-spacing-sm: 0.5rem;     /* 8px */
  --blog-spacing-md: 1rem;       /* 16px */
  --blog-spacing-lg: 1.5rem;     /* 24px */
  --blog-spacing-xl: 2rem;       /* 32px */
  --blog-spacing-2xl: 3rem;      /* 48px */
  --blog-spacing-3xl: 4rem;      /* 64px */
  --blog-spacing-4xl: 6rem;      /* 96px */
}
```

#### Border Radius

```css
:root {
  --blog-radius-none: 0;
  --blog-radius-sm: 0.125rem;
  --blog-radius-md: 0.375rem;
  --blog-radius-lg: 0.5rem;
  --blog-radius-xl: 0.75rem;
  --blog-radius-2xl: 1rem;
  --blog-radius-full: 9999px;
}
```

#### Shadows

```css
:root {
  --blog-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --blog-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --blog-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --blog-shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

#### Layout

```css
:root {
  --blog-container-max-width: 1024px;
  --blog-container-padding: 1rem;
  --blog-section-gap: 2rem;
  --blog-column-gap: 1.5rem;
  --blog-block-gap: 1rem;
}
```

#### Quote Component

```css
:root {
  --blog-quote-border-color: #B87333;
  --blog-quote-border-width: 4px;
}
```

---

## ClassName Props Customization

### BlogPreview Component

```tsx
interface BlogPreviewClassNames {
  container?: string;   // Main wrapper
  header?: string;      // Header section
  title?: string;       // Title heading
  meta?: string;        // Metadata (date, author)
  article?: string;     // Article content wrapper
  section?: string;     // Individual sections
  column?: string;      // Column containers
}
```

**Example:**

```tsx
<BlogPreview
  title="My Article"
  sections={sections}
  classNames={{
    container: "max-w-6xl mx-auto px-8 py-16 bg-gray-50",
    title: "text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600",
    meta: "flex gap-6 text-gray-600",
    section: "mb-16 p-8 bg-white rounded-2xl shadow-lg"
  }}
/>
```

### ContentBlockRenderer Component

```tsx
interface ContentBlockClassNames {
  text?: string;           // Text/Markdown blocks
  image?: string;          // Image wrapper
  imageCaption?: string;   // Image caption
  video?: string;          // Video wrapper
  videoCaption?: string;   // Video caption
  quote?: string;          // Quote blockquote
  quoteContent?: string;   // Quote text
  quoteFooter?: string;    // Quote attribution
  pdf?: string;            // PDF wrapper
  pdfEmbed?: string;       // PDF iframe embed
  pdfTitle?: string;       // PDF title
  pdfDescription?: string; // PDF description
  pdfDownloadButton?: string; // PDF download button
  carousel?: string;       // Carousel wrapper
  carouselSlide?: string;  // Individual slide
  carouselImage?: string;  // Slide image
  carouselCaption?: string; // Slide caption
  carouselTitle?: string;  // Slide title
  carouselArrow?: string;  // Navigation arrows
  carouselDot?: string;    // Dot indicators
  carouselDotActive?: string; // Active dot
}
```

**Example:**

```tsx
<ContentBlockRenderer
  block={block}
  classNames={{
    quote: "my-8 border-l-8 border-blue-500 pl-6 bg-blue-50 p-6 rounded-r-xl",
    quoteContent: "text-2xl font-serif italic text-blue-900",
    quoteFooter: "text-sm text-blue-700 mt-4"
  }}
/>
```

---

## Theme Presets

Use pre-configured themes with the `applyTheme` utility:

```tsx
import { applyTheme, themePresets } from 'm14i-blogging';

// Apply in useEffect or on mount
useEffect(() => {
  applyTheme(themePresets.ocean.cssVariables!);
}, []);
```

### Available Presets

#### `themePresets.default`
Clean, minimal light theme.

#### `themePresets.dark`
Dark mode theme with light text on dark background.

#### `themePresets.ocean`
Blue ocean-inspired theme.

#### `themePresets.sunset`
Warm orange/amber sunset theme.

#### `themePresets.forest`
Green nature-inspired theme.

#### `themePresets.minimal`
Ultra-minimal theme with serif fonts and zero border radius.

---

## Complete Customization Examples

### Example 1: Brand Colors via CSS

Create a `blog-theme.css` file:

```css
:root {
  /* Your brand colors */
  --blog-primary: 280 100% 70%;      /* Purple brand */
  --blog-accent: 340 82% 52%;         /* Pink accent */
  --blog-background: 270 20% 98%;     /* Subtle purple background */
  --blog-foreground: 270 15% 10%;     /* Dark purple text */

  /* Custom typography */
  --blog-font-family: 'Poppins', sans-serif;
  --blog-font-size-base: 18px;
  --blog-line-height-base: 1.7;

  /* Rounded design */
  --blog-radius-lg: 1.5rem;
  --blog-radius-md: 1rem;
}
```

Import in your app:

```tsx
import 'm14i-blogging/styles';
import './blog-theme.css';
```

### Example 2: Programmatic Theme with TypeScript

```tsx
import { applyTheme, CSSVariablesTheme } from 'm14i-blogging';

const myCustomTheme: CSSVariablesTheme = {
  colors: {
    primary: "220 100% 50%",
    primaryForeground: "0 0% 100%",
    background: "220 15% 97%",
    foreground: "220 15% 10%",
    border: "220 15% 85%",
  },
  typography: {
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontSize: {
      base: "17px",
      "4xl": "42px",
      "5xl": "56px",
    },
    lineHeight: {
      base: "1.6",
    },
  },
  radius: {
    lg: "0.75rem",
    md: "0.5rem",
  },
  layout: {
    containerMaxWidth: "1200px",
    sectionGap: "3rem",
  },
  quote: {
    borderColor: "#3b82f6",
    borderWidth: "6px",
  },
};

// Apply theme
useEffect(() => {
  applyTheme(myCustomTheme);
}, []);
```

### Example 3: Combining CSS Variables + ClassName Props

```tsx
// In your CSS
:root {
  --blog-primary: 142 71% 45%;  /* Green theme */
  --blog-radius-lg: 1rem;
}

// In your component
<BlogPreview
  title="Sustainable Living"
  sections={sections}
  classNames={{
    container: "max-w-5xl mx-auto px-6 py-12",
    title: "text-5xl font-bold text-green-600 mb-6",
    section: "mb-12 p-8 bg-green-50 rounded-2xl border-2 border-green-200"
  }}
/>
```

### Example 4: Magazine-Style Layout

```tsx
<BlogPreview
  title="Feature Article"
  sections={sections}
  classNames={{
    container: "max-w-screen-xl mx-auto",
    header: "mb-20 text-center",
    title: "text-7xl font-black tracking-tight leading-none uppercase",
    meta: "flex justify-center gap-4 text-xs uppercase tracking-widest text-gray-500",
    article: "space-y-0",
    section: "py-16 border-t border-gray-200 first:border-0",
    column: "space-y-8"
  }}
/>

<ContentBlockRenderer
  block={block}
  classNames={{
    text: "prose prose-lg max-w-none columns-2 gap-12",
    quote: "my-12 border-0 text-center not-italic bg-black text-white p-12",
    quoteContent: "text-3xl font-serif",
    image: "my-16 -mx-32",
    gallery: "grid grid-cols-4 gap-2"
  }}
/>
```

### Example 5: Dark Mode with Theme Toggle

```tsx
import { applyTheme, themePresets } from 'm14i-blogging';
import { useState, useEffect } from 'react';

function BlogWithThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      applyTheme(themePresets.dark.cssVariables!);
    } else {
      applyTheme(themePresets.default.cssVariables!);
    }
  }, [isDark]);

  return (
    <>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle {isDark ? 'Light' : 'Dark'} Mode
      </button>
      <BlogPreview title="Article" sections={sections} />
    </>
  );
}
```

---

## CSS Variables Reference

### Complete Variable List

```css
/* Colors (HSL values) */
--blog-background
--blog-foreground
--blog-card
--blog-card-foreground
--blog-popover
--blog-popover-foreground
--blog-primary
--blog-primary-foreground
--blog-secondary
--blog-secondary-foreground
--blog-muted
--blog-muted-foreground
--blog-accent
--blog-accent-foreground
--blog-destructive
--blog-destructive-foreground
--blog-border
--blog-input
--blog-ring

/* Typography */
--blog-font-family
--blog-font-family-mono
--blog-font-size-xs
--blog-font-size-sm
--blog-font-size-base
--blog-font-size-lg
--blog-font-size-xl
--blog-font-size-2xl
--blog-font-size-3xl
--blog-font-size-4xl
--blog-font-size-5xl
--blog-line-height-base
--blog-line-height-tight
--blog-line-height-relaxed
--blog-font-weight-normal
--blog-font-weight-medium
--blog-font-weight-semibold
--blog-font-weight-bold

/* Spacing */
--blog-spacing-xs
--blog-spacing-sm
--blog-spacing-md
--blog-spacing-lg
--blog-spacing-xl
--blog-spacing-2xl
--blog-spacing-3xl
--blog-spacing-4xl

/* Radius */
--blog-radius-none
--blog-radius-sm
--blog-radius-md
--blog-radius-lg
--blog-radius-xl
--blog-radius-2xl
--blog-radius-full

/* Shadows */
--blog-shadow-sm
--blog-shadow-md
--blog-shadow-lg
--blog-shadow-xl

/* Layout */
--blog-container-max-width
--blog-container-padding
--blog-section-gap
--blog-column-gap
--blog-block-gap

/* Quote */
--blog-quote-border-color
--blog-quote-border-width
```

---

## Best Practices

1. **Start with CSS Variables** for global theming
2. **Use className props** for component-specific overrides
3. **Test responsive behavior** when customizing layouts
4. **Maintain accessibility** - ensure sufficient color contrast
5. **Use HSL for colors** - easier to adjust lightness/saturation
6. **Version control your theme** - keep custom CSS in separate files
7. **Document your theme** - maintain a style guide for your team

---

## Framework Integration

### Next.js

```tsx
// app/layout.tsx
import 'm14i-blogging/styles';
import './blog-theme.css';  // Your overrides

// app/blog/[slug]/page.tsx
import { BlogPreview } from 'm14i-blogging';

export default function BlogPost({ params }: { params: { slug: string } }) {
  return <BlogPreview title="Article" sections={sections} />;
}
```

### Vite + React

```tsx
// main.tsx
import 'm14i-blogging/styles';
import './index.css';  // Your theme

// App.tsx
import { BlogPreview } from 'm14i-blogging';
```

### Tailwind Integration

The library works seamlessly with Tailwind CSS:

```tsx
<BlogPreview
  classNames={{
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    title: "text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
  }}
/>
```

---

## Troubleshooting

### Colors not applying?

Ensure colors are in HSL format without `hsl()`:
- ✅ `--blog-primary: 220 100% 50%;`
- ❌ `--blog-primary: hsl(220, 100%, 50%);`

### Styles being overridden?

Check CSS specificity. Your custom CSS should be imported **after** the library CSS:

```tsx
import 'm14i-blogging/styles';  // Library styles
import './custom-theme.css';     // Your overrides (wins)
```

### className props not working?

Ensure you're using the correct prop structure:

```tsx
classNames={{ container: "..." }}  // ✅ Correct
className="..."                      // ❌ Wrong prop name
```

---

## Resources

- **npm Package**: [https://www.npmjs.com/package/m14i-blogging](https://www.npmjs.com/package/m14i-blogging)
- **Storybook**: [https://merzoukemansouri.github.io/m14i-blogging-package](https://merzoukemansouri.github.io/m14i-blogging-package)
- **GitHub**: [https://github.com/MerzoukeMansouri/m14i-blogging-package](https://github.com/MerzoukeMansouri/m14i-blogging-package)
- **Theme Playground**: Check the "Theme Playground" story in Storybook for interactive customization

---

**Happy Styling!** 🎨
