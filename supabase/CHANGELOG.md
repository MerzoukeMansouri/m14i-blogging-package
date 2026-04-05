# Database Schema Changelog

All notable changes to the database schema will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-05

### Added - Initial Schema

#### Tables
- **`blog.posts`** - Main posts table with complete blog content
  - UUID primary key with auto-generation
  - Title, slug (unique), excerpt, featured image
  - Sections (JSONB) - complete `LayoutSection[]` array
  - SEO metadata (JSONB) - SEO, OpenGraph, Twitter card data
  - Author info (JSONB) - author metadata
  - Status enum: draft, published, archived
  - Category and tags taxonomy
  - Timestamps: created_at, updated_at, published_at
  - Created_by reference to auth.users
  - Full-text search vector (auto-generated)

- **`blog.media`** - Media library for images, videos, PDFs
  - UUID primary key
  - File path, name, size, MIME type
  - Media type enum: image, video, pdf, other
  - Metadata (JSONB) for alt text, captions, dimensions
  - Usage tracking: usage_count, last_used_at
  - Upload tracking: uploaded_at, uploaded_by

#### Enums
- `blog.post_status` - 'draft' | 'published' | 'archived'
- `blog.media_type` - 'image' | 'video' | 'pdf' | 'other'

#### Indexes
- **Posts**
  - `idx_posts_status` - B-tree index on status
  - `idx_posts_slug` - B-tree index on slug (unique)
  - `idx_posts_created_by` - B-tree index on created_by
  - `idx_posts_published_at` - B-tree index on published_at (DESC, WHERE published)
  - `idx_posts_category` - B-tree index on category (WHERE NOT NULL)
  - `idx_posts_tags` - GIN index on tags array
  - `idx_posts_search_vector` - GIN index on search_vector
  - `idx_posts_sections` - GIN index on sections JSONB
  - `idx_posts_seo_metadata` - GIN index on seo_metadata JSONB

- **Media**
  - `idx_media_type` - B-tree index on type
  - `idx_media_uploaded_by` - B-tree index on uploaded_by
  - `idx_media_uploaded_at` - B-tree index on uploaded_at (DESC)
  - `idx_media_metadata` - GIN index on metadata JSONB

#### Functions
- `blog.update_updated_at()` - Trigger function to auto-update updated_at timestamp
- `blog.set_published_at()` - Trigger function to auto-set published_at on status change
- `blog.search_posts(text)` - Full-text search function
- `blog.get_posts_by_tag(text)` - Get posts by tag
- `blog.get_posts_by_category(text)` - Get posts by category

#### Triggers
- `posts_update_updated_at` - Auto-update updated_at on UPDATE
- `posts_set_published_at` - Auto-set published_at when status changes to 'published'

#### Row Level Security (RLS)
- **Posts**
  - `Public can read published posts` - SELECT for status='published'
  - `Admin can read all posts` - SELECT for admin users
  - `Admin can insert posts` - INSERT for admin users
  - `Admin can update posts` - UPDATE for admin users
  - `Admin can delete posts` - DELETE for admin users

- **Media**
  - `Public can read media` - SELECT for all
  - `Admin can manage media` - ALL operations for admin users

#### Permissions
- USAGE on `blog` schema granted to anon, authenticated
- SELECT on all tables granted to anon, authenticated
- ALL on all tables granted to authenticated (restricted by RLS)

#### Constraints
- `valid_slug` - Slug format validation (lowercase, hyphens only)
- `valid_sections` - Sections must be JSONB array
- `positive_file_size` - File size must be positive or NULL
- `positive_usage_count` - Usage count must be non-negative

#### Comments
- Schema, table, and column documentation
- Example queries in migration file
- Setup instructions included

### Schema Version

**Version:** 1.0.0
**Compatible with:** m14i-blogging ^0.1.x
**PostgreSQL:** 14+
**Supabase:** Compatible

---

## Migration Guide

### From Scratch → v1.0.0

Run the initial migration:
```bash
npx supabase db push
```

Or via SQL Editor:
```sql
-- Copy and run: migrations/20260405000000_create_blog_schema.sql
```

---

## Future Roadmap

### Planned for v1.1.0
- [ ] Add `blog.comments` table for post comments
- [ ] Add post revision history (versioning)
- [ ] Add scheduled publishing (publish_scheduled_at)
- [ ] Add view/analytics tracking

### Planned for v2.0.0
- [ ] Multi-tenancy support (tenant_id columns)
- [ ] Custom fields support (JSONB custom_fields)
- [ ] Workflow states beyond draft/published
- [ ] Multi-language support (translations table)

### Under Consideration
- Media CDN integration columns
- AI-generated content tracking
- A/B testing support
- Related posts recommendations
- Content locking for concurrent editing

---

## Breaking Changes

None yet - this is the initial release.

---

## Deprecations

None yet.

---

## Notes

### Why JSONB for sections?

The decision to use JSONB for the `sections` column (instead of normalized tables) was made because:

1. **Atomicity** - Sections are always fetched/updated together with posts
2. **Flexibility** - Content block types and layouts can evolve without schema migrations
3. **Performance** - Single query vs multiple JOINs
4. **Simplicity** - Matches the TypeScript types exactly
5. **PostgreSQL Features** - GIN indexes allow efficient JSONB queries

### Admin Role Implementation

The admin role is checked via user metadata:
```json
{ "role": "admin" }
```

Alternative approaches for future versions:
- Separate `blog.admins` table
- Integration with custom roles system
- Permission-based access (not just admin boolean)

### Media Library

The media library is designed to be generic and can integrate with:
- Supabase Storage
- External CDNs (Cloudinary, Imgix)
- Direct file uploads
- Remote URLs

Update `file_path` format based on your storage strategy.

---

## Schema Compatibility

| m14i-blogging | Schema Version | PostgreSQL | Supabase |
|---------------|----------------|------------|----------|
| 0.1.x         | 1.0.0          | 14+        | ✅       |

---

## Contributing

When adding new migrations:

1. Create new migration file: `YYYYMMDD_description.sql`
2. Update this CHANGELOG with changes
3. Test with `npx supabase db reset`
4. Document breaking changes
5. Update SCHEMA_VERSION in code
6. Update README examples if needed

---

## Support

For issues or questions:
- Check [Troubleshooting](./README.md#troubleshooting)
- Review [Best Practices](./BEST_PRACTICES.md)
- Open an issue on GitHub
