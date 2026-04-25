# Development Guide

## Package Architecture

This is a monorepo with 3 packages:

- **@m14i/blogging-core** - Core blog components, public views, types, utils
- **@m14i/blogging-admin** - Admin panel, CMS, editors (depends on core)
- **@m14i/blogging-server** - API routes, server utilities (depends on core)

## Quick Start

### Install dependencies
```bash
pnpm install
```

### Build all packages
```bash
pnpm build
```

### Build specific package
```bash
pnpm build:core
pnpm build:admin
pnpm build:server
```

## Development Workflow

### Option 1: Watch mode for package development
Start all packages in watch mode (rebuilds on file changes):

```bash
pnpm dev:packages
```

Then in another terminal, start the example app:

```bash
pnpm dev:example
```

**How it works:**
- Packages rebuild automatically when source files change
- Next.js in example app hot-reloads when packages rebuild
- Allows rapid iteration without manual rebuilds

### Option 2: Manual rebuild workflow
For simple changes or debugging build issues:

```bash
# 1. Edit package source files in packages/*/src/
vim packages/core/src/components/BlogPreview.tsx

# 2. Rebuild the package
pnpm build:core

# 3. Clear Next.js cache (important!)
rm -rf example/app/.next

# 4. Restart example app
pnpm dev:example
```

### Clean everything
```bash
pnpm clean
```

Removes all build artifacts and Next.js cache.

## Important Rules

### 1. NEVER edit built files
**DON'T:**
- Edit `packages/*/dist/*` files directly
- Edit `example/app/node_modules/@m14i/*` files
- Edit `example/app/.next/*` cache files

**DO:**
- Edit source files in `packages/*/src/`
- Rebuild packages with `pnpm build` or `pnpm build:core`
- Clear Next.js cache with `rm -rf example/app/.next`

### 2. Workspace dependencies
The example app uses workspace protocol:

```json
{
  "dependencies": {
    "@m14i/blogging-core": "workspace:*",
    "@m14i/blogging-admin": "workspace:*",
    "@m14i/blogging-server": "workspace:*"
  }
}
```

This means it always uses the **local** packages, not npm published versions.

### 3. Build order matters
Packages must build in dependency order:

1. **core** (no dependencies)
2. **server** (depends on core)
3. **admin** (depends on core + server)

The root `pnpm build` script handles this automatically.

## Common Tasks

### Add a new component to core
```bash
# 1. Create the component
vim packages/core/src/components/MyComponent.tsx

# 2. Export it
vim packages/core/src/index.ts
# Add: export { MyComponent } from "./components/MyComponent";

# 3. Rebuild
pnpm build:core

# 4. Use it in example app
vim example/app/app/page.tsx
# import { MyComponent } from "@m14i/blogging-core";
```

### Add a new API route to server
```bash
# 1. Create the route
vim packages/server/src/routes/my-route.ts

# 2. Export it
vim packages/server/src/index.ts

# 3. Rebuild
pnpm build:server

# 4. Use it in example app
vim example/app/app/api/my-route/route.ts
```

### Debug build issues
```bash
# Clean everything
pnpm clean

# Rebuild all packages from scratch
pnpm install
pnpm build

# Check what was built
ls -lh packages/core/dist/
ls -lh packages/admin/dist/
ls -lh packages/server/dist/

# Start example app fresh
rm -rf example/app/.next
pnpm dev:example
```

### Test changes in example app
```bash
# Terminal 1: Watch packages
pnpm dev:packages

# Terminal 2: Run example app
pnpm dev:example

# Terminal 3: Make changes
vim packages/core/src/components/BlogPreview.tsx
# Save → packages rebuild → Next.js hot-reloads
```

## Troubleshooting

### "Module not found" errors
**Problem:** Next.js can't find `@m14i/blogging-*` packages

**Solution:**
```bash
pnpm build           # Rebuild packages
rm -rf example/app/.next  # Clear Next.js cache
pnpm dev:example     # Restart
```

### "Dynamic require of 'react' is not supported"
**Problem:** React is getting bundled instead of externalized

**Solution:**
- Check `packages/*/tsup.config.ts` has React in `external` array
- Rebuild: `pnpm build`
- Clear cache: `rm -rf example/app/.next`

### Changes not appearing in example app
**Problem:** Edited package source but changes don't show

**Solution:**
```bash
# 1. Verify you edited source files (not dist or node_modules)
# 2. Rebuild the package
pnpm build:core  # or build:admin, build:server

# 3. Clear Next.js cache (critical!)
rm -rf example/app/.next

# 4. Restart dev server
pnpm dev:example
```

### Stale build cache
**Problem:** Build seems corrupted or outdated

**Solution:**
```bash
pnpm clean           # Remove all dist and .next
pnpm install         # Reinstall dependencies
pnpm build           # Rebuild everything
pnpm dev:example     # Start fresh
```

## Build Configuration

### tsup configs
Each package has `tsup.config.ts` defining:
- Entry points
- Output formats (CJS + ESM)
- External dependencies
- Source maps

**Key externals to maintain:**
- `react`, `react-dom`, `react/jsx-runtime`
- `use-sync-external-store`, `use-sync-external-store/shim`
- `next`, `next/server`, `next/navigation`
- UI libraries (`lucide-react`, `@hello-pangea/dnd`, etc.)

### Next.js config
`example/app/next.config.mjs` transpiles workspace packages:

```js
const nextConfig = {
  transpilePackages: [
    "@m14i/blogging-core",
    "@m14i/blogging-admin",
    "@m14i/blogging-server"
  ],
};
```

## Publishing

Before publishing to npm:

```bash
# 1. Build all packages
pnpm build

# 2. Test in example app
pnpm dev:example
# Verify everything works

# 3. Bump versions (if needed)
# Edit packages/*/package.json

# 4. Publish
pnpm publish -r --access public
```

## Performance Tips

1. **Use watch mode** during active development (`pnpm dev:packages`)
2. **Build only what changed** (`pnpm build:core` vs `pnpm build`)
3. **Clear cache selectively** (only clear `.next` when imports break)
4. **Monitor bundle sizes** (`ls -lh packages/*/dist/`)

## File Structure

```
m14i-blogging/
├── packages/
│   ├── core/
│   │   ├── src/           # Source files (edit these)
│   │   ├── dist/          # Built files (DO NOT edit)
│   │   ├── package.json
│   │   └── tsup.config.ts
│   ├── admin/
│   │   ├── src/
│   │   ├── dist/
│   │   ├── package.json
│   │   └── tsup.config.ts
│   └── server/
│       ├── src/
│       ├── dist/
│       ├── package.json
│       └── tsup.config.ts
├── example/
│   └── app/
│       ├── app/           # Next.js app
│       ├── .next/         # Cache (can delete)
│       └── package.json   # Uses workspace:* deps
├── package.json           # Root workspace
├── pnpm-workspace.yaml    # Workspace config
└── DEVELOPMENT.md         # This file
```

## Best Practices

1. **Always work in source files** (`packages/*/src/`)
2. **Rebuild after changes** (`pnpm build:*`)
3. **Clear Next.js cache when imports break** (`rm -rf example/app/.next`)
4. **Use watch mode for rapid iteration** (`pnpm dev:packages`)
5. **Test in example app before publishing**
6. **Keep externals up to date** (React, Next.js, UI libs)
7. **Don't commit dist or .next** (gitignored)

## Git Workflow

```bash
# 1. Make changes in packages/*/src/
vim packages/core/src/components/BlogPreview.tsx

# 2. Rebuild
pnpm build:core

# 3. Test
pnpm dev:example

# 4. Commit source files only (dist is gitignored)
git add packages/core/src/
git commit -m "feat: improve BlogPreview component"

# 5. Push
git push origin main
```

The `dist/` and `.next/` folders are gitignored - only source files are tracked.
