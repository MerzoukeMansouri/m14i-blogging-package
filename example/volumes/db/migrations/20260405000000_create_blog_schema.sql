-- ============================================================================
-- M14I Blogging Package - Supabase Schema Migration
-- ============================================================================
-- Minimal schema for dev: posts + media with RLS
-- Uses public schema with blog_ prefix for compatibility
-- For production: customize RLS policies for your auth setup
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE blog_post_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE blog_media_type AS ENUM ('image', 'video', 'pdf', 'other');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Posts Table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  featured_image TEXT,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  seo_metadata JSONB DEFAULT '{}'::jsonb,
  author_info JSONB,
  status blog_post_status NOT NULL DEFAULT 'draft',
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::text[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  created_by UUID, -- Optional FK to auth.users if needed

  -- Full-text search
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(category, '')), 'C')
  ) STORED,

  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT valid_sections CHECK (jsonb_typeof(sections) = 'array')
);

-- Media Library Table
CREATE TABLE blog_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  type blog_media_type NOT NULL DEFAULT 'other',
  metadata JSONB DEFAULT '{}'::jsonb,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  uploaded_by UUID,

  CONSTRAINT positive_file_size CHECK (file_size IS NULL OR file_size > 0),
  CONSTRAINT positive_usage_count CHECK (usage_count >= 0)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_posts_status ON blog_posts(status);
CREATE INDEX idx_posts_slug ON blog_posts(slug);
CREATE INDEX idx_posts_published_at ON blog_posts(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_posts_category ON blog_posts(category) WHERE category IS NOT NULL;
CREATE INDEX idx_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX idx_posts_search_vector ON blog_posts USING GIN(search_vector);
CREATE INDEX idx_posts_sections ON blog_posts USING GIN(sections);

CREATE INDEX idx_media_type ON blog_media(type);
CREATE INDEX idx_media_uploaded_at ON blog_media(uploaded_at DESC);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION blog_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_update_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION blog_update_updated_at();

-- Auto-set published_at on status change
CREATE OR REPLACE FUNCTION blog_set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_set_published_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION blog_set_published_at();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_media ENABLE ROW LEVEL SECURITY;

-- Posts: Public read published, service_role full access
CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Service role can manage posts"
  ON blog_posts FOR ALL
  USING (auth.role() = 'service_role');

-- Media: Public read, service_role manage
CREATE POLICY "Public can read media"
  ON blog_media FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage media"
  ON blog_media FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Search posts
CREATE OR REPLACE FUNCTION blog_search_posts(search_query TEXT)
RETURNS SETOF blog_posts AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM blog_posts
  WHERE status = 'published'
    AND search_vector @@ plainto_tsquery('english', search_query)
  ORDER BY ts_rank(search_vector, plainto_tsquery('english', search_query)) DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- PERMISSIONS
-- ============================================================================

GRANT SELECT ON blog_posts TO anon, authenticated;
GRANT SELECT ON blog_media TO anon, authenticated;
GRANT ALL ON blog_posts TO authenticated;
GRANT ALL ON blog_media TO authenticated;

-- ============================================================================
-- SETUP NOTES
-- ============================================================================
-- 1. Run: npx supabase db reset
-- 2. Set admin user in Supabase Studio: User Meta Data -> {"role": "admin"}
-- 3. For demo mode: use service role key to bypass RLS
-- 4. For production: customize RLS policies for your auth implementation
