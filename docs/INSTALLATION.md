# Installation Guide

Complete installation guide for m14i-blogging package.

**Package Links:**
- npm: [https://www.npmjs.com/package/m14i-blogging](https://www.npmjs.com/package/m14i-blogging)
- Storybook: [https://merzoukemansouri.github.io/m14i-blogging-package](https://merzoukemansouri.github.io/m14i-blogging-package)

## Table of Contents

- [Quick Installation](#quick-installation)
- [Step-by-Step Installation](#step-by-step-installation)
- [Peer Dependencies](#peer-dependencies)
- [Tailwind CSS Setup](#tailwind-css-setup)
- [shadcn/ui Setup (Optional)](#shadcnui-setup-optional)
- [Framework-Specific Setup](#framework-specific-setup)
- [Troubleshooting](#troubleshooting)

---

## Quick Installation

For experienced developers who want to get started quickly:

```bash
# Install the package
npm install m14i-blogging

# Install Tailwind CSS (if not already installed)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Optional: Install shadcn/ui for BlogBuilder editor
npx shadcn@latest init
npx shadcn@latest add label input textarea select button card
```

Then configure Tailwind and import styles. See [Step-by-Step Installation](#step-by-step-installation) for details.

---

## Step-by-Step Installation

### 1. Install the Package

```bash
npm install m14i-blogging
# or
pnpm add m14i-blogging
# or
yarn add m14i-blogging
```

Modern package managers (npm 7+, pnpm, yarn) will automatically prompt you to install peer dependencies if they're missing.

### 2. Install Peer Dependencies (If Needed)

If your package manager doesn't automatically install peer dependencies, run:

```bash
npm install @hello-pangea/dnd react-markdown remark-gfm lucide-react
```

**What are these?**
- `@hello-pangea/dnd` - Drag and drop functionality for BlogBuilder
- `react-markdown` - Markdown rendering for text blocks
- `remark-gfm` - GitHub Flavored Markdown support
- `lucide-react` - Icon library

**Note:** `react` and `react-dom` are also peer dependencies, but most React projects already have these installed.

### 3. Install Tailwind CSS

This package uses Tailwind CSS for styling.

#### Install Tailwind

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Configure Tailwind

Update your `tailwind.config.js` or `tailwind.config.ts`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // Add this line to scan the m14i-blogging package
    './node_modules/m14i-blogging/dist/**/*.{js,mjs,cjs}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Important:** The `./node_modules/m14i-blogging/dist/**/*.{js,mjs,cjs}` line is required for Tailwind to find the package's classes.

### 4. Import Package Styles

Choose one of the following methods:

#### Method A: Import in Root Layout (Next.js App Router)

**app/layout.tsx:**
```tsx
import 'm14i-blogging/styles';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

#### Method B: Import in _app.tsx (Next.js Pages Router)

**pages/_app.tsx:**
```tsx
import 'm14i-blogging/styles';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

#### Method C: Import in Main Entry (Vite/React)

**main.tsx or index.tsx:**
```tsx
import 'm14i-blogging/styles';
import './index.css';
```

#### Method D: Import in CSS File

**globals.css or index.css:**
```css
@import 'm14i-blogging/styles';
```

### 5. Install shadcn/ui (Optional - Only for BlogBuilder)

If you plan to use the **BlogBuilder** component (the drag & drop editor), you need shadcn/ui components.

**If you're only using BlogPreview** (read-only display), you can skip this step.

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Install required components
npx shadcn@latest add label input textarea select button card
```

**During shadcn init, choose:**
- Style: Default
- Base color: Your preference
- CSS variables: Yes

---

## Peer Dependencies

### What Are Peer Dependencies?

Peer dependencies are packages that m14i-blogging expects to be present in your project but doesn't bundle itself. This prevents duplicate installations and keeps the package size small.

### Required Peer Dependencies

| Package | Version | Purpose | Auto-installed? |
|---------|---------|---------|-----------------|
| `react` | >=18.0.0 | React framework | Usually ✓ |
| `react-dom` | >=18.0.0 | React DOM rendering | Usually ✓ |
| `@hello-pangea/dnd` | ^16.0.0 | Drag & drop (BlogBuilder only) | Depends on package manager |
| `react-markdown` | ^9.0.0 | Markdown rendering | Depends on package manager |
| `remark-gfm` | ^4.0.0 | GitHub Flavored Markdown | Depends on package manager |
| `lucide-react` | ^0.0.0 | Icons | Depends on package manager |

### Checking Installed Dependencies

To see which peer dependencies are missing:

```bash
npm ls @hello-pangea/dnd react-markdown remark-gfm lucide-react
```

### Installing Missing Peer Dependencies

```bash
npm install @hello-pangea/dnd react-markdown remark-gfm lucide-react
```

---

## Tailwind CSS Setup

### Why Tailwind CSS?

This package uses Tailwind CSS for styling to provide:
- Small bundle size
- Easy customization
- Consistent design system
- Full control over styling

### Minimum Tailwind Version

- Tailwind CSS 3.0 or higher required
- Tailwind CSS 4.0 supported

### Full Tailwind Configuration Example

**tailwind.config.js:**
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // REQUIRED: Scan m14i-blogging package
    './node_modules/m14i-blogging/dist/**/*.{js,mjs,cjs}',
  ],
  theme: {
    extend: {
      // Optional: Extend with your custom styles
    },
  },
  plugins: [
    // Optional: Add Tailwind plugins
  ],
}
```

### CSS Import Order

**Important:** Import order matters for CSS specificity.

**Correct order:**
```tsx
import 'm14i-blogging/styles';  // 1. Package styles first
import './globals.css';          // 2. Your custom styles second
```

**Why?** Your custom styles should override package styles.

### Custom Tailwind Configuration

You can customize the package's appearance using CSS variables. See the [Styling Guide](./STYLING.md) for details.

---

## shadcn/ui Setup (Optional)

### When Do You Need shadcn/ui?

| Component | Requires shadcn/ui? |
|-----------|-------------------|
| `BlogPreview` | ❌ No |
| `ContentBlockRenderer` | ❌ No |
| `BlogSEO` / `BlogHead` | ❌ No |
| `BlogBuilder` | ✅ Yes |
| `ContentBlockInlineEditor` | ✅ Yes |

**Only install shadcn/ui if you're building an editor/admin interface.**

### shadcn/ui Installation

```bash
npx shadcn@latest init
```

**Configuration prompts:**
- Would you like to use TypeScript? → Yes
- Which style would you like to use? → Default
- Which color would you like to use as base color? → Your preference
- Where is your global CSS file? → `app/globals.css` or `styles/globals.css`
- Would you like to use CSS variables for colors? → Yes
- Where is your tailwind.config.js located? → `./tailwind.config.js`
- Configure the import alias for components? → `@/components`
- Configure the import alias for utils? → `@/lib/utils`

### Install Required Components

```bash
npx shadcn@latest add label input textarea select button card
```

### Verify Installation

After installation, you should have:
- `components/ui/` folder with shadcn components
- `lib/utils.ts` file
- Updated `tailwind.config.js`

---

## Framework-Specific Setup

### Next.js (App Router)

**1. Install dependencies:**
```bash
npm install m14i-blogging
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**2. Configure Tailwind** (`tailwind.config.js`):
```js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/m14i-blogging/dist/**/*.{js,mjs,cjs}',
  ],
  // ...
}
```

**3. Import styles** (`app/layout.tsx`):
```tsx
import 'm14i-blogging/styles';
import './globals.css';
```

**4. (Optional) Install shadcn/ui for editor:**
```bash
npx shadcn@latest init
npx shadcn@latest add label input textarea select button card
```

### Next.js (Pages Router)

**1. Install dependencies:**
```bash
npm install m14i-blogging
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**2. Configure Tailwind** (`tailwind.config.js`):
```js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/m14i-blogging/dist/**/*.{js,mjs,cjs}',
  ],
  // ...
}
```

**3. Import styles** (`pages/_app.tsx`):
```tsx
import 'm14i-blogging/styles';
import '../styles/globals.css';
```

### Vite + React

**1. Install dependencies:**
```bash
npm install m14i-blogging
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**2. Configure Tailwind** (`tailwind.config.js`):
```js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/m14i-blogging/dist/**/*.{js,mjs,cjs}',
  ],
  // ...
}
```

**3. Import styles** (`main.tsx`):
```tsx
import 'm14i-blogging/styles';
import './index.css';
```

**4. Ensure CSS is imported** (`index.css`):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Remix

**1. Install dependencies:**
```bash
npm install m14i-blogging
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**2. Configure Tailwind** (`tailwind.config.js`):
```js
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './node_modules/m14i-blogging/dist/**/*.{js,mjs,cjs}',
  ],
  // ...
}
```

**3. Import styles** (`app/root.tsx`):
```tsx
import blogStyles from 'm14i-blogging/styles?url';
import styles from './tailwind.css?url';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: blogStyles },
  { rel: 'stylesheet', href: styles },
];
```

---

## Troubleshooting

### Styles Not Appearing

**Problem:** Components render but have no styling.

**Solutions:**

1. **Check CSS import:**
   ```tsx
   import 'm14i-blogging/styles'; // Must be present
   ```

2. **Verify Tailwind config includes package:**
   ```js
   content: [
     // ...
     './node_modules/m14i-blogging/dist/**/*.{js,mjs,cjs}', // Required
   ]
   ```

3. **Clear build cache:**
   ```bash
   rm -rf .next node_modules/.cache
   npm run dev
   ```

### Peer Dependency Warnings

**Problem:** npm warns about missing peer dependencies.

**Solution:** Install the missing dependencies:
```bash
npm install @hello-pangea/dnd react-markdown remark-gfm lucide-react
```

### TypeScript Errors

**Problem:** TypeScript can't find types for the package.

**Solutions:**

1. **Ensure correct moduleResolution in tsconfig.json:**
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "bundler" // or "node16"
     }
   }
   ```

2. **Install type definitions:**
   ```bash
   npm install --save-dev @types/react @types/react-dom
   ```

3. **Restart TypeScript server** in your IDE.

### shadcn/ui Components Not Found

**Problem:** "Module not found" errors for shadcn components when using BlogBuilder.

**Solution:**

1. **Install shadcn/ui:**
   ```bash
   npx shadcn@latest init
   npx shadcn@latest add label input textarea select button card
   ```

2. **Verify components folder exists:**
   - Check that `components/ui/` folder was created
   - Ensure components are installed: `label.tsx`, `input.tsx`, etc.

### Drag and Drop Not Working

**Problem:** BlogBuilder drag and drop doesn't work.

**Solutions:**

1. **Ensure component is client-side (Next.js):**
   ```tsx
   'use client'; // Add this at the top of the file

   import { BlogBuilder } from 'm14i-blogging';
   ```

2. **Verify @hello-pangea/dnd is installed:**
   ```bash
   npm install @hello-pangea/dnd
   ```

### Build Errors

**Problem:** Build fails with module resolution errors.

**Solutions:**

1. **Clear cache and reinstall:**
   ```bash
   rm -rf .next node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Check Node.js version:** Ensure Node.js 16+ is installed:
   ```bash
   node --version
   ```

3. **Verify all peer dependencies:**
   ```bash
   npm ls @hello-pangea/dnd react-markdown remark-gfm lucide-react
   ```

### Import Path Errors

**Problem:** Can't import from `'m14i-blogging/styles'`.

**Solution:** Ensure you're using a modern package manager that supports package exports:
- npm 7+
- pnpm 6+
- yarn 2+

Update if needed:
```bash
npm install -g npm@latest
```

---

## Verification

After installation, verify everything works:

### 1. Create a Test Component

**app/test/page.tsx:**
```tsx
'use client';

import { BlogPreview } from 'm14i-blogging';
import type { LayoutSection } from 'm14i-blogging';

const sections: LayoutSection[] = [
  {
    id: 'test',
    layout: '1-column',
    columns: [[
      {
        id: 'text-1',
        type: 'text',
        content: '# Hello World\n\nIf you can see this styled, installation was successful!',
      }
    ]]
  }
];

export default function TestPage() {
  return (
    <div className="container mx-auto p-8">
      <BlogPreview title="Installation Test" sections={sections} />
    </div>
  );
}
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Check Results

Visit `http://localhost:3000/test` and verify:
- ✓ Text is rendered
- ✓ Heading is styled
- ✓ Layout looks correct
- ✓ No console errors

---

## Next Steps

After successful installation:

- 📖 **[Quick Start Guide](./QUICKSTART.md)** - Build your first blog
- 🎨 **[Styling Guide](./STYLING.md)** - Customize appearance
- 🔍 **[SEO Guide](./SEO_GUIDE.md)** - Optimize for search engines
- 📚 **[Live Storybook](https://merzoukemansouri.github.io/m14i-blogging-package)** - See examples

---

## Resources

- **npm Package**: [https://www.npmjs.com/package/m14i-blogging](https://www.npmjs.com/package/m14i-blogging)
- **Storybook**: [https://merzoukemansouri.github.io/m14i-blogging-package](https://merzoukemansouri.github.io/m14i-blogging-package)
- **GitHub**: [https://github.com/MerzoukeMansouri/m14i-blogging-package](https://github.com/MerzoukeMansouri/m14i-blogging-package)
- **Issues**: [https://github.com/MerzoukeMansouri/m14i-blogging-package/issues](https://github.com/MerzoukeMansouri/m14i-blogging-package/issues)

---

**Having trouble?** [Open an issue](https://github.com/MerzoukeMansouri/m14i-blogging-package/issues) with your error message and setup details.
