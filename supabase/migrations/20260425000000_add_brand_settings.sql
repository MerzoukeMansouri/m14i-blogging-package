/**
 * Migration: Add Brand Settings Table
 *
 * Creates table for storing brand context/voice settings used by AI generation.
 * Allows customization of site identity, tone, vocabulary preferences.
 */

-- Create brand_settings table
CREATE TABLE IF NOT EXISTS blog_brand_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'My Blog',
  description TEXT,
  industry TEXT,
  target_audience TEXT,
  tone TEXT,
  vocabulary_prefer TEXT[],  -- Array of preferred words/phrases
  vocabulary_avoid TEXT[],   -- Array of words/phrases to avoid
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default row with sensible defaults
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
  ARRAY[
    'game-changing',
    'transformative',
    'revolutionary',
    'unlock',
    'leverage',
    'synergy',
    'paradigm',
    'cutting-edge',
    'best-in-class',
    'world-class',
    'next-level',
    'seamless'
  ]
) ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE blog_brand_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read brand settings
CREATE POLICY "Authenticated users can read brand settings"
  ON blog_brand_settings
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to update brand settings
CREATE POLICY "Authenticated users can update brand settings"
  ON blog_brand_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Prevent deletion (brand settings should always exist)
CREATE POLICY "Prevent deletion of brand settings"
  ON blog_brand_settings
  FOR DELETE
  USING (false);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_brand_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_blog_brand_settings_updated_at
  BEFORE UPDATE ON blog_brand_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_brand_settings_updated_at();

-- Add helpful comment
COMMENT ON TABLE blog_brand_settings IS 'Stores brand context and voice guidelines for AI content generation';
COMMENT ON COLUMN blog_brand_settings.vocabulary_prefer IS 'Array of words/phrases to prefer in generated content';
COMMENT ON COLUMN blog_brand_settings.vocabulary_avoid IS 'Array of words/phrases to avoid in generated content (e.g., marketing buzzwords)';
