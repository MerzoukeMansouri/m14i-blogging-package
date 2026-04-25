# Development Workflow Guide

## Monorepo Structure

This is a pnpm workspace monorepo:

```
m14i-blogging/
├── src/                    # Library source code
├── dist/                   # Built library (generated)
├── stories/                # Storybook stories
├── example/
│   └── app/               # Next.js demo app
└── package.json           # Root package
```

## Critical Development Rule

**⚠️ Changes to library source code require rebuilding before they appear in the example app**

### Why?

- Example app imports from `m14i-blogging` workspace dependency
- It reads **compiled code** from `dist/`, NOT source from `src/`
- Changes to `src/**` only take effect after building to `dist/`

## Development Workflows

### Option 1: Watch Mode (Recommended)

Run two terminals simultaneously:

```bash
# Terminal 1: Auto-rebuild library on file changes
pnpm dev

# Terminal 2: Run example app
cd example/app
pnpm dev
```

**Pros:**
- Changes to `src/` auto-rebuild
- Example app hot-reloads after rebuild
- Fastest feedback loop

**Cons:**
- Requires two terminal windows
- Watch mode can occasionally miss changes

### Option 2: Manual Build

```bash
# 1. Edit code in src/**

# 2. Build library
pnpm build

# 3. Test in example app (restart if running)
cd example/app
pnpm dev
```

**Pros:**
- Full control over when builds happen
- Reliable, no missed changes

**Cons:**
- Manual rebuild after every change
- Slower feedback loop

## Common Scenarios

### Adding a New Layout Type

```bash
# 1. Update type definition
# Edit: src/types/layouts.ts

# 2. Update UI config
# Edit: src/config/defaults.ts

# 3. Update utilities
# Edit: src/utils/index.ts

# 4. Update AI prompts
# Edit: src/server/services/ai-prompts-compact.ts

# 5. Build
pnpm build

# 6. Test in example app
cd example/app
pnpm dev
```

### Removing a Layout Type

Same as above, plus:

```bash
# Also update story files
# Edit: stories/**/*.tsx

# Update documentation
# Edit: README.md, docs/README.md

# Rebuild
pnpm build
```

### Modifying AI Prompts

```bash
# Edit: src/server/services/ai-prompts-compact.ts

# Build
pnpm build

# Test via example app API
cd example/app
pnpm dev

# Test the /api/blog/generate endpoint
```

### Updating Styles

```bash
# Edit: src/styles.css

# Build (compiles CSS)
pnpm build

# Example app will pick up new styles
cd example/app
pnpm dev
```

## Build Output

After `pnpm build`, check `dist/`:

```
dist/
├── index.js            # Main entry (CommonJS)
├── index.mjs           # Main entry (ESM)
├── index.d.ts          # Types
├── client/             # Client-only exports
├── server/             # Server-only exports
├── admin/              # Admin editor exports
├── public/             # Public preview exports
└── index.css           # Compiled styles
```

## Troubleshooting

### Changes Not Appearing in Example App

1. **Did you rebuild?**
   ```bash
   pnpm build
   ```

2. **Is the example app cache stale?**
   ```bash
   cd example/app
   rm -rf .next
   pnpm dev
   ```

3. **Is watch mode running?**
   ```bash
   # Should see "tsup" watching files
   pnpm dev
   ```

### Watch Mode Not Picking Up Changes

```bash
# Kill watch mode
pkill -f "tsup.*watch"

# Restart
pnpm dev
```

### Type Errors After Changes

```bash
# Rebuild types
pnpm build

# Check example app
cd example/app
npx tsc --noEmit
```

## Testing Changes

### 1. Storybook (Component Testing)

```bash
# Start Storybook
pnpm storybook

# Visit http://localhost:6006
```

**Best for:**
- Visual component changes
- Layout variations
- Block types
- Styling updates

### 2. Example App (Integration Testing)

```bash
# Build library
pnpm build

# Run example
cd example/app
pnpm dev

# Visit http://localhost:3000
```

**Best for:**
- API endpoint changes
- AI generation
- Database integration
- Full user flows

### 3. Local Link Testing (Package Testing)

```bash
# In library directory
pnpm link --global

# In a separate Next.js project
pnpm link --global m14i-blogging

# After changes, rebuild library
cd /path/to/m14i-blogging
pnpm build
```

**Best for:**
- Testing in real apps
- Pre-release validation
- Package integration

## Commit Flow

```bash
# 1. Make changes
# Edit src/**

# 2. Build and test
pnpm build
pnpm storybook  # or cd example/app && pnpm dev

# 3. Commit with conventional format
git add .
git commit -m "feat: add new layout type"

# 4. Push (CI will build and test)
git push
```

## CI/CD Notes

- GitHub Actions builds on every push
- Semantic-release publishes on merge to `main`
- Storybook deploys automatically
- All builds must pass before merge

## Key Files for Development

| File | Purpose | Rebuild Required |
|------|---------|------------------|
| `src/**/*.ts(x)` | Library code | ✅ Yes |
| `src/styles.css` | Styles | ✅ Yes |
| `stories/**` | Storybook stories | ❌ No (hot reload) |
| `example/app/**` | Example app | ❌ No (hot reload) |
| `tsup.config.ts` | Build config | ✅ Yes |
| `package.json` | Dependencies | ✅ Yes (reinstall) |

## Quick Reference

```bash
# Full rebuild
pnpm build

# Watch mode
pnpm dev

# Storybook
pnpm storybook

# Example app
cd example/app && pnpm dev

# Clean build
rm -rf dist && pnpm build

# Full clean
rm -rf dist node_modules && pnpm install && pnpm build
```

## Remember

1. **Always rebuild** after `src/` changes before testing in example app
2. **Use watch mode** for rapid iteration
3. **Test in both** Storybook and example app
4. **Check TypeScript** after structural changes
5. **Update docs** when adding features
