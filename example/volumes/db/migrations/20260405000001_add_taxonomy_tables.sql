-- ============================================================================
-- M14I Blogging Package - Taxonomy Management (Categories & Tags)
-- ============================================================================
-- Description: Add dedicated tables for managing categories and tags
--              Allows apps to dynamically create and manage their own taxonomy
-- Schema: PUBLIC (not blog)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Categories Table
-- ----------------------------------------------------------------------------
-- Store blog categories with metadata
-- Each app can create their own categories

CREATE TABLE public.blog_categories (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Category information
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,

  -- Display options
  color TEXT, -- Hex color code for UI (e.g., "#3B82F6")
  icon TEXT,  -- Icon name or emoji (e.g., "📰", "news")

  -- Ordering
  display_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ownership
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Constraints
  CONSTRAINT valid_category_slug CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT valid_color CHECK (color IS NULL OR color ~ '^#[0-9A-Fa-f]{6}$')
);

-- ----------------------------------------------------------------------------
-- Tags Table
-- ----------------------------------------------------------------------------
-- Store blog tags with metadata
-- More flexible than categories - posts can have multiple tags

CREATE TABLE public.blog_tags (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Tag information
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,

  -- Display options
  color TEXT, -- Hex color code for UI

  -- Usage tracking (will be updated by trigger)
  usage_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ownership
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Constraints
  CONSTRAINT valid_tag_slug CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT valid_tag_color CHECK (color IS NULL OR color ~ '^#[0-9A-Fa-f]{6}$'),
  CONSTRAINT positive_usage_count CHECK (usage_count >= 0)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_categories_slug ON public.blog_categories(slug);
CREATE INDEX idx_categories_display_order ON public.blog_categories(display_order);
CREATE INDEX idx_categories_created_by ON public.blog_categories(created_by);

CREATE INDEX idx_tags_slug ON public.blog_tags(slug);
CREATE INDEX idx_tags_usage_count ON public.blog_tags(usage_count DESC);
CREATE INDEX idx_tags_created_by ON public.blog_tags(created_by);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update timestamp triggers
CREATE TRIGGER categories_update_updated_at
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER tags_update_updated_at
  BEFORE UPDATE ON public.blog_tags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Categories RLS Policies
-- ----------------------------------------------------------------------------

-- Public read: Everyone can read categories
CREATE POLICY "Public can read categories"
  ON public.blog_categories
  FOR SELECT
  USING (true);

-- Admin manage: Only admin users can create/update/delete categories
CREATE POLICY "Admin can manage categories"
  ON public.blog_categories
  FOR ALL
  USING (
    auth.role() = 'authenticated' AND
    (
      auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR
      auth.uid() IN (
        SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
      )
    )
  );

-- ----------------------------------------------------------------------------
-- Tags RLS Policies
-- ----------------------------------------------------------------------------

-- Public read: Everyone can read tags
CREATE POLICY "Public can read tags"
  ON public.blog_tags
  FOR SELECT
  USING (true);

-- Admin manage: Only admin users can create/update/delete tags
CREATE POLICY "Admin can manage tags"
  ON public.blog_tags
  FOR ALL
  USING (
    auth.role() = 'authenticated' AND
    (
      auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR
      auth.uid() IN (
        SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
      )
    )
  );

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Get categories with post counts
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_blog_categories_with_counts()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  color TEXT,
  icon TEXT,
  display_order INTEGER,
  post_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.slug,
    c.description,
    c.color,
    c.icon,
    c.display_order,
    COUNT(p.id) FILTER (WHERE p.status = 'published') AS post_count
  FROM public.blog_categories c
  LEFT JOIN blog.posts p ON p.category = c.name
  GROUP BY c.id, c.name, c.slug, c.description, c.color, c.icon, c.display_order
  ORDER BY c.display_order, c.name;
END;
$$ LANGUAGE plpgsql STABLE;

-- ----------------------------------------------------------------------------
-- Get tags with post counts
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_blog_tags_with_counts()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  color TEXT,
  post_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.name,
    t.slug,
    t.description,
    t.color,
    COUNT(p.id) FILTER (WHERE p.status = 'published' AND t.name = ANY(p.tags)) AS post_count
  FROM public.blog_tags t
  LEFT JOIN blog.posts p ON t.name = ANY(p.tags)
  GROUP BY t.id, t.name, t.slug, t.description, t.color
  ORDER BY post_count DESC, t.name;
END;
$$ LANGUAGE plpgsql STABLE;

-- ----------------------------------------------------------------------------
-- Auto-create category if it doesn't exist (optional helper)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ensure_blog_category_exists(category_name TEXT)
RETURNS UUID AS $$
DECLARE
  category_id UUID;
  category_slug TEXT;
BEGIN
  -- Generate slug from name
  category_slug := lower(regexp_replace(category_name, '[^a-zA-Z0-9]+', '-', 'g'));
  category_slug := trim(both '-' from category_slug);

  -- Try to find existing category
  SELECT id INTO category_id
  FROM public.blog_categories
  WHERE name = category_name;

  -- If not found, create it
  IF category_id IS NULL THEN
    INSERT INTO public.blog_categories (name, slug)
    VALUES (category_name, category_slug)
    RETURNING id INTO category_id;
  END IF;

  RETURN category_id;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- Auto-create tag if it doesn't exist (optional helper)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ensure_blog_tag_exists(tag_name TEXT)
RETURNS UUID AS $$
DECLARE
  tag_id UUID;
  tag_slug TEXT;
BEGIN
  -- Generate slug from name
  tag_slug := lower(regexp_replace(tag_name, '[^a-zA-Z0-9]+', '-', 'g'));
  tag_slug := trim(both '-' from tag_slug);

  -- Try to find existing tag
  SELECT id INTO tag_id
  FROM public.blog_tags
  WHERE name = tag_name;

  -- If not found, create it
  IF tag_id IS NULL THEN
    INSERT INTO public.blog_tags (name, slug)
    VALUES (tag_name, tag_slug)
    RETURNING id INTO tag_id;
  END IF;

  RETURN tag_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant select on tables for read operations
GRANT SELECT ON public.blog_categories TO anon, authenticated;
GRANT SELECT ON public.blog_tags TO anon, authenticated;

-- Grant all on tables for authenticated users (RLS will handle actual permissions)
GRANT ALL ON public.blog_categories TO authenticated;
GRANT ALL ON public.blog_tags TO authenticated;

-- ============================================================================
-- COMMENTS & DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.blog_categories IS 'Blog categories - allows dynamic category management per app';
COMMENT ON TABLE public.blog_tags IS 'Blog tags - flexible tagging system with usage tracking';

COMMENT ON FUNCTION public.get_blog_categories_with_counts() IS 'Get all categories with published post counts';
COMMENT ON FUNCTION public.get_blog_tags_with_counts() IS 'Get all tags with published post counts';
COMMENT ON FUNCTION public.ensure_blog_category_exists(TEXT) IS 'Helper to auto-create categories when assigning to posts';
COMMENT ON FUNCTION public.ensure_blog_tag_exists(TEXT) IS 'Helper to auto-create tags when assigning to posts';

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================

/*

-- Create categories
INSERT INTO public.blog_categories (name, slug, description, color, icon, display_order)
VALUES
  ('Actualités', 'actualites', 'Dernières nouvelles', '#3B82F6', '📰', 1),
  ('Tutoriels', 'tutoriels', 'Guides pratiques', '#10B981', '📚', 2),
  ('Podcast', 'podcast', 'Épisodes podcast', '#8B5CF6', '🎙️', 3);

-- Create tags
INSERT INTO public.blog_tags (name, slug, description, color)
VALUES
  ('podcast', 'podcast', 'Contenu podcast', '#8B5CF6'),
  ('audio', 'audio', 'Production audio', '#EC4899'),
  ('vidéo', 'video', 'Production vidéo', '#EF4444');

-- Get categories with counts
SELECT * FROM public.get_blog_categories_with_counts();

-- Get tags with counts
SELECT * FROM public.get_blog_tags_with_counts();

-- Auto-create category when creating post
SELECT public.ensure_blog_category_exists('New Category');

*/
