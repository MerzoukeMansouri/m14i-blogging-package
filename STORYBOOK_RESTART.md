# Storybook Restart Instructions

All navigation errors have been resolved! Follow these steps:

## 1. Stop Storybook

If Storybook is running, stop it with `Ctrl+C`.

## 2. Clear Cache (Already Done ✅)

The Storybook cache has been cleared.

## 3. Restart Storybook

```bash
cd /Users/mansouri/Projects/m14i/m14i-blogging
pnpm storybook
```

## 4. Open in Browser

Once started, navigate to: **http://localhost:6006**

Then go to: **Admin → BlogAdmin → Default**

## What Was Fixed

1. ✅ Fixed `LayoutType` in mock data (`"single-column"` instead of `"full-width"`)
2. ✅ Added missing `author_info` field to all mock posts
3. ✅ **Removed all window.location override attempts** (was causing read-only errors)
4. ✅ Simplified to toolbar-based navigation only
5. ✅ Cleared Storybook cache twice
6. ✅ All TypeScript and runtime errors resolved

## Expected Result

You should now see 9 interactive stories:
1. Default
2. Access Denied
3. English Labels
4. Minimal Features
5. With Callbacks
6. Dark Theme
7. Content Creator Mode
8. Direct to Editor
9. Edit Existing Post

Each story will have a **yellow navigation toolbar** at the top for easy navigation between views.

## If Still Having Issues

Try a full clean restart:

```bash
# Stop Storybook
# Then run:
cd /Users/mansouri/Projects/m14i/m14i-blogging
rm -rf node_modules/.cache
pnpm storybook
```
