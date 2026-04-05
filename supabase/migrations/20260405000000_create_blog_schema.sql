-- ============================================================================
-- M14I Blogging Package - Supabase Schema Migration
-- ============================================================================
-- Description: Complete schema for blog posts with rich content blocks,
--              layouts, SEO metadata, and media library
-- Best Practices:
--   - Uses dedicated 'blog' schema for namespace isolation
--   - JSONB columns for flexible nested content storage
--   - Row Level Security (RLS) for public read, admin write
--   - GIN indexes for fast JSONB queries
--   - Full-text search support with tsvector
--   - Automatic timestamp management
-- ============================================================================

-- Create blog schema
CREATE SCHEMA IF NOT EXISTS blog;

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE blog.post_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE blog.media_type AS ENUM ('image', 'video', 'pdf', 'other');

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Posts Table
-- ----------------------------------------------------------------------------
-- Stores blog posts with all content, metadata, and SEO information
-- sections: Complete LayoutSection[] array as JSONB
-- seo_metadata: SEO, OpenGraph, Twitter card data
-- author_info: Author details matching AuthorInfo interface

CREATE TABLE blog.posts (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic post information
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  featured_image TEXT,

  -- Content structure (stores entire sections array from BlogPost type)
  -- Matches LayoutSection[] from the package
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- SEO and metadata (combined SEO, OpenGraph, Twitter card data)
  seo_metadata JSONB DEFAULT '{}'::jsonb,

  -- Author information (matches AuthorInfo interface)
  author_info JSONB,

  -- Publishing workflow
  status blog.post_status NOT NULL DEFAULT 'draft',

  -- Taxonomy
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::text[],

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- Ownership (references Supabase auth.users)
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Full-text search
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(category, '')), 'C')
  ) STORED,

  -- Constraints
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT valid_sections CHECK (jsonb_typeof(sections) = 'array')
);

-- ----------------------------------------------------------------------------
-- Media Library Table
-- ----------------------------------------------------------------------------
-- Centralized media asset management for images, videos, PDFs
-- Tracks usage, metadata, and file information

CREATE TABLE blog.media (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- File information
  file_path TEXT NOT NULL UNIQUE, -- Path in Supabase Storage or external URL
  file_name TEXT NOT NULL,
  file_size BIGINT, -- Size in bytes
  mime_type TEXT,

  -- Media classification
  type blog.media_type NOT NULL DEFAULT 'other',

  -- Metadata (alt text, captions, dimensions, etc.)
  -- For images: { alt, caption, width, height }
  -- For videos: { caption, duration, thumbnail }
  -- For PDFs: { title, description, pageCount }
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,

  -- Timestamps
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Constraints
  CONSTRAINT positive_file_size CHECK (file_size IS NULL OR file_size > 0),
  CONSTRAINT positive_usage_count CHECK (usage_count >= 0)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Posts indexes
CREATE INDEX idx_posts_status ON blog.posts(status);
CREATE INDEX idx_posts_slug ON blog.posts(slug);
CREATE INDEX idx_posts_created_by ON blog.posts(created_by);
CREATE INDEX idx_posts_published_at ON blog.posts(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_posts_category ON blog.posts(category) WHERE category IS NOT NULL;
CREATE INDEX idx_posts_tags ON blog.posts USING GIN(tags);
CREATE INDEX idx_posts_search_vector ON blog.posts USING GIN(search_vector);

-- JSONB indexes for fast querying
CREATE INDEX idx_posts_sections ON blog.posts USING GIN(sections);
CREATE INDEX idx_posts_seo_metadata ON blog.posts USING GIN(seo_metadata);

-- Media indexes
CREATE INDEX idx_media_type ON blog.media(type);
CREATE INDEX idx_media_uploaded_by ON blog.media(uploaded_by);
CREATE INDEX idx_media_uploaded_at ON blog.media(uploaded_at DESC);
CREATE INDEX idx_media_metadata ON blog.media USING GIN(metadata);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Update timestamp trigger
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION blog.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_update_updated_at
  BEFORE UPDATE ON blog.posts
  FOR EACH ROW
  EXECUTE FUNCTION blog.update_updated_at();

-- ----------------------------------------------------------------------------
-- Auto-set published_at on status change
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION blog.set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_set_published_at
  BEFORE UPDATE ON blog.posts
  FOR EACH ROW
  EXECUTE FUNCTION blog.set_published_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE blog.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog.media ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Posts RLS Policies
-- ----------------------------------------------------------------------------

-- Public read: Everyone can read published posts
CREATE POLICY "Public can read published posts"
  ON blog.posts
  FOR SELECT
  USING (status = 'published');

-- Admin read: Authenticated admin users can read all posts
-- Note: You'll need to set up an 'is_admin' claim in your JWT or use a custom check
-- For now, using a simple check - customize based on your auth setup
CREATE POLICY "Admin can read all posts"
  ON blog.posts
  FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    (
      auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR
      auth.uid() IN (
        SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
      )
    )
  );

-- Admin insert: Only admin users can create posts
CREATE POLICY "Admin can insert posts"
  ON blog.posts
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    (
      auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR
      auth.uid() IN (
        SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
      )
    )
  );

-- Admin update: Only admin users can update posts
CREATE POLICY "Admin can update posts"
  ON blog.posts
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    (
      auth.jwt() -> 'user_metadata' ->> 'role' = 'admin' OR
      auth.uid() IN (
        SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
      )
    )
  );

-- Admin delete: Only admin users can delete posts
CREATE POLICY "Admin can delete posts"
  ON blog.posts
  FOR DELETE
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
-- Media RLS Policies
-- ----------------------------------------------------------------------------

-- Public read: Everyone can read media (if media is referenced in published posts)
CREATE POLICY "Public can read media"
  ON blog.media
  FOR SELECT
  USING (true);

-- Admin full access: Admin users can manage all media
CREATE POLICY "Admin can manage media"
  ON blog.media
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
-- Search posts by text
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION blog.search_posts(search_query TEXT)
RETURNS SETOF blog.posts AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM blog.posts
  WHERE
    status = 'published' AND
    search_vector @@ plainto_tsquery('english', search_query)
  ORDER BY ts_rank(search_vector, plainto_tsquery('english', search_query)) DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ----------------------------------------------------------------------------
-- Get posts by tag
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION blog.get_posts_by_tag(tag_name TEXT)
RETURNS SETOF blog.posts AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM blog.posts
  WHERE
    status = 'published' AND
    tag_name = ANY(tags)
  ORDER BY published_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ----------------------------------------------------------------------------
-- Get posts by category
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION blog.get_posts_by_category(category_name TEXT)
RETURNS SETOF blog.posts AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM blog.posts
  WHERE
    status = 'published' AND
    category = category_name
  ORDER BY published_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- COMMENTS & DOCUMENTATION
-- ============================================================================

COMMENT ON SCHEMA blog IS 'Blog content management schema for m14i-blogging package';

COMMENT ON TABLE blog.posts IS 'Blog posts with rich content blocks, layouts, and SEO metadata';
COMMENT ON COLUMN blog.posts.sections IS 'Complete LayoutSection[] array matching TypeScript type from m14i-blogging package';
COMMENT ON COLUMN blog.posts.seo_metadata IS 'Combined SEO, OpenGraph, and Twitter card metadata';
COMMENT ON COLUMN blog.posts.search_vector IS 'Full-text search vector (auto-generated)';

COMMENT ON TABLE blog.media IS 'Centralized media library for images, videos, and PDFs';
COMMENT ON COLUMN blog.media.metadata IS 'Flexible metadata storage: alt, caption, dimensions, etc.';

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA blog TO anon, authenticated;

-- Grant select on tables for read operations
GRANT SELECT ON blog.posts TO anon, authenticated;
GRANT SELECT ON blog.media TO anon, authenticated;

-- Grant all on tables for authenticated users (RLS will handle actual permissions)
GRANT ALL ON blog.posts TO authenticated;
GRANT ALL ON blog.media TO authenticated;

-- ============================================================================
-- NOTES FOR IMPLEMENTATION
-- ============================================================================

/*
SETUP INSTRUCTIONS:

1. Run this migration via Supabase CLI:
   npx supabase migration new create_blog_schema
   (copy this file content into the migration file)
   npx supabase db push

2. Generate TypeScript types:
   npx supabase gen types typescript --local > src/types/supabase.ts

3. Set up admin user:
   In Supabase Dashboard > Authentication > Users
   Edit user metadata and add: { "role": "admin" }

4. Optional: Enable Realtime for live updates:
   ALTER PUBLICATION supabase_realtime ADD TABLE blog.posts;

5. Storage integration (for media uploads):
   Create a 'blog-media' bucket in Supabase Storage
   Update blog.media.file_path to use Storage URLs

EXAMPLE QUERIES:

-- Get all published posts
SELECT * FROM blog.posts WHERE status = 'published' ORDER BY published_at DESC;

-- Search posts
SELECT * FROM blog.search_posts('react tutorial');

-- Get posts by tag
SELECT * FROM blog.get_posts_by_tag('typescript');

-- Query JSONB sections (find posts with video blocks)
SELECT title, slug
FROM blog.posts
WHERE sections @> '[{"columns": [[{"type": "video"}]]}]';

-- Count posts by category
SELECT category, COUNT(*)
FROM blog.posts
WHERE status = 'published'
GROUP BY category;

*/
