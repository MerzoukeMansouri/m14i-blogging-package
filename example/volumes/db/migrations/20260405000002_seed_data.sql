-- Seed data for m14i-blogging example
-- Creates sample categories, tags, and a demo blog post

-- Sample categories
INSERT INTO public.blog_categories (name, slug, description, color, icon, display_order)
VALUES
  ('Engineering', 'engineering', 'Technical articles and tutorials', '#3B82F6', '⚙️', 1),
  ('Design', 'design', 'UI/UX and design thinking', '#EC4899', '🎨', 2),
  ('Product', 'product', 'Product updates and announcements', '#10B981', '📦', 3)
ON CONFLICT (name) DO NOTHING;

-- Sample tags
INSERT INTO public.blog_tags (name, slug, description, color)
VALUES
  ('react', 'react', 'React.js framework', '#61DAFB'),
  ('nextjs', 'nextjs', 'Next.js framework', '#000000'),
  ('typescript', 'typescript', 'TypeScript language', '#3178C6'),
  ('tutorial', 'tutorial', 'Step-by-step guides', '#F59E0B'),
  ('supabase', 'supabase', 'Supabase platform', '#3FCF8E')
ON CONFLICT (name) DO NOTHING;

-- Sample blog post
INSERT INTO blog.posts (title, slug, excerpt, status, category, tags, sections)
VALUES (
  'Welcome to m14i-blogging',
  'welcome-to-m14i-blogging',
  'A complete blog management system for React and Next.js applications.',
  'published',
  'Engineering',
  ARRAY['react', 'nextjs', 'tutorial'],
  '[
    {
      "id": "section-1",
      "type": "1-column",
      "columns": [
        [
          {
            "id": "block-1",
            "type": "text",
            "content": "# Welcome to m14i-blogging!\n\nThis is a demo blog post created automatically by the example setup.\n\n## Features\n\n- **Rich content editor** with drag-and-drop sections\n- **Multiple layout types** — 1-column, 2-columns, 3-columns, grids\n- **Content blocks** — text, images, videos, carousels, quotes, PDFs\n- **Full SEO support** — meta tags, Open Graph, Twitter cards, JSON-LD\n- **Category & tag management** with dedicated admin UI\n- **Full-text search** powered by PostgreSQL tsvector\n\n## Getting Started\n\nVisit [/admin/blog](/admin/blog) to manage posts, or [/blog](/blog) to see the public blog."
          }
        ]
      ]
    },
    {
      "id": "section-2",
      "type": "2-columns",
      "columns": [
        [
          {
            "id": "block-2",
            "type": "text",
            "content": "### For Developers\n\nBuilt with TypeScript, this package provides:\n- Pre-built API route handlers\n- Type-safe Supabase client\n- Customizable UI components\n- Tailwind CSS styling"
          }
        ],
        [
          {
            "id": "block-3",
            "type": "text",
            "content": "### For Content Creators\n\nThe admin interface offers:\n- Visual drag-and-drop editor\n- Live preview\n- Auto-save\n- SEO metadata fields\n- Media library"
          }
        ]
      ]
    }
  ]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
