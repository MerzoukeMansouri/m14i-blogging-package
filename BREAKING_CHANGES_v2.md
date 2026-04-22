# Breaking Changes in v2.0.0

## Removed: Taxonomy Tables (Categories & Tags)

**Motivation:** Simplify the data model by storing categories and tags as free text directly in posts, eliminating unnecessary table dependencies.

### What Changed

#### Database Schema
- **Removed tables:**
  - `public.blog_categories`
  - `public.blog_tags`

- **Posts table unchanged:**
  - `posts.category` remains `TEXT` (free text, no FK)
  - `posts.tags` remains `TEXT[]` (array of strings, no FK)

#### API Routes Removed
The following route handlers have been removed from `m14i-blogging/server`:
- `createListCategoriesHandler`
- `createCreateCategoryHandler`
- `createGetCategoryHandler`
- `createUpdateCategoryHandler`
- `createDeleteCategoryHandler`
- `createListTagsHandler`
- `createCreateTagHandler`
- `createGetTagHandler`
- `createUpdateTagHandler`
- `createDeleteTagHandler`

**If your app uses these:** Remove the corresponding API routes from your app.

#### TypeScript Types Removed
- `CategoryRow`, `CategoryInsert`, `CategoryUpdate`, `CategoryWithCount`
- `TagRow`, `TagInsert`, `TagUpdate`, `TagWithCount`

**Types kept:**
- `BlogCategory` - derived from posts (used by `blog.stats.getCategories()`)
- `BlogTag` - derived from posts (used by `blog.stats.getTags()`)

#### Client Methods Updated

**`blog.stats` methods now derive from posts:**

```typescript
// Before (queried blog_categories table)
const categories = await blog.stats.getCategories();

// After (scans posts.category field)
const categories = await blog.stats.getCategories();
// Returns: BlogCategory[] with { name, slug, postCount }
```

**Removed client methods:**
- `blog.categories.*` - entire namespace removed
- `blog.tags.*` - entire namespace removed

### Migration Guide

#### 1. Remove API Routes

Delete these folders from your app:
```bash
rm -rf app/api/blog/categories
rm -rf app/api/blog/tags
```

#### 2. Update Data Fetching

**Before:**
```typescript
// Fetched from blog_categories table
const { data } = await supabase
  .from('blog_categories')
  .select('*');
```

**After (derive from posts):**
```typescript
const blog = createBlogClient(supabase);
const categories = await blog.stats.getCategories();
// or implement custom derivation:
const { data: posts } = await supabase
  .from('blog.posts')
  .select('category')
  .eq('status', 'published')
  .not('category', 'is', null);

const categoryMap = new Map<string, number>();
posts.forEach(post => {
  if (post.category) {
    categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1);
  }
});

const categories = Array.from(categoryMap, ([name, postCount]) => ({
  name,
  slug: name.toLowerCase().replace(/\s+/g, '-'),
  postCount
}));
```

#### 3. Run Migration

Apply the migration to drop tables:
```bash
# If using Supabase CLI
supabase migration up

# SQL to run manually:
DROP TABLE IF EXISTS public.blog_tags CASCADE;
DROP TABLE IF EXISTS public.blog_categories CASCADE;
DROP FUNCTION IF EXISTS public.get_blog_categories_with_counts();
DROP FUNCTION IF EXISTS public.get_blog_tags_with_counts();
DROP FUNCTION IF EXISTS public.ensure_blog_category_exists(TEXT);
DROP FUNCTION IF EXISTS public.ensure_blog_tag_exists(TEXT);
```

#### 4. Update UI Components

If you have category/tag management UI:
- Remove admin CRUD interfaces
- Categories/tags can still be typed freely when creating posts
- Optionally implement autocomplete by deriving from existing posts

### Benefits

✅ **Simpler schema** - 2 fewer tables to manage
✅ **No referential integrity issues** - posts can use any category/tag text
✅ **Flexible** - no need to pre-create categories/tags
✅ **Self-maintaining** - `stats.getCategories()` and `stats.getTags()` always show what's in use

### FAQ

**Q: Can I still use categories and tags in posts?**
Yes! Posts still have `category: string` and `tags: string[]` fields. They're just free text now.

**Q: How do I get a list of categories/tags?**
Use `blog.stats.getCategories()` and `blog.stats.getTags()` - they scan posts and return unique values with counts.

**Q: What if I want category metadata (colors, icons)?**
Store in your app's config file or use CSS custom properties. Categories are now just strings.

**Q: Can I keep the old tables?**
Not recommended. The package no longer provides routes/types for them. Migrate to v2 pattern.
