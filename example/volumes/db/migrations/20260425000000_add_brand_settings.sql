-- ============================================================================
-- M14I Blogging Package - Brand Settings
-- ============================================================================
-- Single-row table for brand context used by AI generation
-- Uses public schema with blog_ prefix
-- ============================================================================

CREATE TABLE blog_brand_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'My Blog',
  description TEXT,
  industry TEXT,
  target_audience TEXT,
  tone TEXT,
  vocabulary_prefer TEXT[],
  vocabulary_avoid TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default row
INSERT INTO blog_brand_settings (
  site_name,
  description,
  industry,
  tone,
  vocabulary_avoid
) VALUES (
  'My Blog',
  'A blog about technology, design, and innovation',
  'technology',
  'professional, approachable',
  ARRAY['game-changing', 'transformative', 'revolutionary', 'unlock', 'leverage',
        'synergy', 'paradigm', 'cutting-edge', 'best-in-class', 'world-class',
        'next-level', 'seamless']
) ON CONFLICT DO NOTHING;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION blog_update_brand_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER brand_settings_update_timestamp
  BEFORE UPDATE ON blog_brand_settings
  FOR EACH ROW
  EXECUTE FUNCTION blog_update_brand_settings_timestamp();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE blog_brand_settings ENABLE ROW LEVEL SECURITY;

-- Public read (AI needs brand context)
CREATE POLICY "Anyone can read brand settings"
  ON blog_brand_settings FOR SELECT
  USING (true);

-- Service role can update
CREATE POLICY "Service role can update brand settings"
  ON blog_brand_settings FOR UPDATE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- PERMISSIONS
-- ============================================================================

GRANT SELECT ON blog_brand_settings TO anon, authenticated;
GRANT UPDATE ON blog_brand_settings TO authenticated;
