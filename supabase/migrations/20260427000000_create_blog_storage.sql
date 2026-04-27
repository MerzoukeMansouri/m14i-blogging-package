-- Create blog-images storage bucket for user uploads
-- This migration sets up Supabase Storage for blog media uploads

-- Create storage bucket for blog images (public = true for /object/public access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Note: File size limits and mime type restrictions should be configured in:
-- 1. Supabase Dashboard: Storage > blog-images > Configuration
-- 2. Or via application-level validation (already implemented in utils/supabase-storage.ts)

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow update" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Policy: Allow public read access to blog images
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- Policy: Allow anon and authenticated users to upload images
CREATE POLICY "Allow upload"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Policy: Allow anon and authenticated users to update images
CREATE POLICY "Allow update"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');

-- Policy: Allow anon and authenticated users to delete images
CREATE POLICY "Allow delete"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'blog-images');

-- Optional: Per-user folder organization (comment out above policies and use these instead)
-- This restricts users to only manage images in their own folder

-- CREATE POLICY "Public read access"
-- ON storage.objects FOR SELECT
-- TO public
-- USING (bucket_id = 'blog-images');

-- CREATE POLICY "Users can upload to own folder"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'blog-images'
--   AND (storage.foldername(name))[1] = auth.uid()::text
-- );

-- CREATE POLICY "Users can update own images"
-- ON storage.objects FOR UPDATE
-- TO authenticated
-- USING (
--   bucket_id = 'blog-images'
--   AND (storage.foldername(name))[1] = auth.uid()::text
-- )
-- WITH CHECK (
--   bucket_id = 'blog-images'
--   AND (storage.foldername(name))[1] = auth.uid()::text
-- );

-- CREATE POLICY "Users can delete own images"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (
--   bucket_id = 'blog-images'
--   AND (storage.foldername(name))[1] = auth.uid()::text
-- );
