-- ============================================================================
-- M14I Blogging Package - Remove Taxonomy Tables
-- ============================================================================
-- Description: Remove blog_categories and blog_tags tables
--              Posts already store category/tags as free text (no FK constraints)
--              This simplifies the data model to use only the blog.posts table
-- Breaking Change: v2.0.0
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Drop Helper Functions
-- ----------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.ensure_blog_tag_exists(TEXT);
DROP FUNCTION IF EXISTS public.ensure_blog_category_exists(TEXT);
DROP FUNCTION IF EXISTS public.get_blog_tags_with_counts();
DROP FUNCTION IF EXISTS public.get_blog_categories_with_counts();

-- ----------------------------------------------------------------------------
-- Drop Taxonomy Tables
-- ----------------------------------------------------------------------------

DROP TABLE IF EXISTS public.blog_tags CASCADE;
DROP TABLE IF EXISTS public.blog_categories CASCADE;

-- ============================================================================
-- NOTES
-- ============================================================================

/*
The blog.posts table is UNCHANGED and continues to work:
- posts.category: TEXT (free text, no FK)
- posts.tags: TEXT[] (array of strings, no FK)

Applications should derive category/tag lists from posts when needed:

-- Get unique categories with counts
SELECT
  category,
  COUNT(*) as post_count
FROM blog.posts
WHERE status = 'published' AND category IS NOT NULL
GROUP BY category
ORDER BY post_count DESC;

-- Get unique tags with counts
SELECT
  tag,
  COUNT(*) as post_count
FROM blog.posts,
     UNNEST(tags) as tag
WHERE status = 'published'
GROUP BY tag
ORDER BY post_count DESC;

*/
