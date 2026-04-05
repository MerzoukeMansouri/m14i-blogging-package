# Best Practices for Blog Package Persistence

This guide outlines best practices specifically for packages that manage persisted data like `m14i-blogging`.

## 🎯 Architecture Principles

### 1. **Schema Isolation**

✅ **DO**: Use a dedicated database schema

```sql
CREATE SCHEMA IF NOT EXISTS blog;

CREATE TABLE blog.posts (...);
CREATE TABLE blog.media (...);
```

**Benefits:**
- Clear namespace separation
- Easier permission management
- Simpler migrations
- Better multi-tenancy support

❌ **DON'T**: Mix package tables with application tables in the same schema

### 2. **JSON vs Normalized**

For rich, nested content like blog posts:

✅ **DO**: Use JSONB for flexible content structures

```sql
CREATE TABLE blog.posts (
  sections JSONB NOT NULL DEFAULT '[]'::jsonb
);
```

**When to use JSONB:**
- Content structure is complex and nested
- Schema changes frequently
- Content is always fetched together
- You need flexible querying

❌ **DON'T**: Over-normalize highly nested structures

```sql
-- Avoid this complexity for blog content:
CREATE TABLE sections (...);
CREATE TABLE columns (...);
CREATE TABLE blocks (...);
CREATE TABLE carousel_slides (...);
```

**Exception**: Use normalization for:
- Frequently queried standalone entities
- Many-to-many relationships
- Data that updates independently

### 3. **Type Safety**

✅ **DO**: Create adapters between DB types and package types

```typescript
// Database type
interface BlogPostRow {
  id: string;
  sections: LayoutSection[];
  created_at: string; // ISO timestamp
}

// Package type
interface BlogPost {
  id?: string;
  sections: LayoutSection[];
  createdAt?: string;
}

// Adapter
function dbRowToBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    sections: row.sections,
    createdAt: row.created_at,
  };
}
```

**Benefits:**
- Single source of truth
- Compile-time safety
- Easy refactoring
- Clear API boundaries

### 4. **Automatic Timestamps**

✅ **DO**: Use database triggers for timestamp management

```sql
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
```

**Benefits:**
- Guaranteed accuracy
- No client-side manipulation
- Consistent across all updates
- Audit trail reliability

### 5. **Smart Defaults**

✅ **DO**: Set sensible defaults in the database

```sql
CREATE TABLE blog.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status blog.post_status NOT NULL DEFAULT 'draft',
  tags TEXT[] DEFAULT ARRAY[]::text[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Benefits:**
- Reduced client-side logic
- Consistency across clients
- Safer data integrity

## 🔍 Querying & Indexing

### 1. **Index Strategy**

✅ **DO**: Index commonly filtered/sorted columns

```sql
-- Frequently queried columns
CREATE INDEX idx_posts_status ON blog.posts(status);
CREATE INDEX idx_posts_published_at ON blog.posts(published_at DESC)
  WHERE status = 'published';

-- JSONB columns
CREATE INDEX idx_posts_sections ON blog.posts USING GIN(sections);

-- Arrays
CREATE INDEX idx_posts_tags ON blog.posts USING GIN(tags);

-- Full-text search
CREATE INDEX idx_posts_search_vector ON blog.posts USING GIN(search_vector);
```

### 2. **Full-Text Search**

✅ **DO**: Use generated tsvector columns

```sql
ALTER TABLE blog.posts ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B')
  ) STORED;

CREATE INDEX idx_posts_search_vector ON blog.posts USING GIN(search_vector);
```

**Benefits:**
- Automatic updates
- Better performance than runtime generation
- Weighted results (title > excerpt > content)

### 3. **Partial Indexes**

✅ **DO**: Use partial indexes for common filters

```sql
-- Only index published posts for public queries
CREATE INDEX idx_posts_published_at ON blog.posts(published_at DESC)
  WHERE status = 'published';

-- Index non-null categories only
CREATE INDEX idx_posts_category ON blog.posts(category)
  WHERE category IS NOT NULL;
```

**Benefits:**
- Smaller index size
- Faster queries
- Less storage

## 🔒 Security

### 1. **Row Level Security**

✅ **DO**: Always enable RLS for user-facing tables

```sql
ALTER TABLE blog.posts ENABLE ROW LEVEL SECURITY;

-- Public read for published
CREATE POLICY "Public can read published posts"
  ON blog.posts FOR SELECT
  USING (status = 'published');

-- Admin full access
CREATE POLICY "Admin can manage posts"
  ON blog.posts FOR ALL
  USING (
    auth.role() = 'authenticated' AND
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );
```

### 2. **Validation Constraints**

✅ **DO**: Add database-level validation

```sql
CREATE TABLE blog.posts (
  slug TEXT NOT NULL UNIQUE,
  sections JSONB NOT NULL,

  -- Validate slug format
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),

  -- Validate JSONB structure
  CONSTRAINT valid_sections CHECK (jsonb_typeof(sections) = 'array'),

  -- Validate positive numbers
  CONSTRAINT positive_size CHECK (file_size IS NULL OR file_size > 0)
);
```

**Benefits:**
- Defense in depth
- Catches bugs at the source
- Consistent across all clients
- Self-documenting schema

### 3. **Separate Service Key Usage**

✅ **DO**: Use service role key only on server, never client

```typescript
// ❌ NEVER expose service key to client
export const supabaseClient = createClient(url, SERVICE_KEY); // BAD!

// ✅ Use anon key for client
export const supabaseClient = createClient(url, ANON_KEY); // GOOD!

// ✅ Use service key only on server
export const supabaseAdmin = createClient(url, SERVICE_KEY); // GOOD!
```

## 📊 Data Modeling

### 1. **Denormalization for Performance**

✅ **DO**: Denormalize when data is always fetched together

```sql
-- Store complete author info in posts table
CREATE TABLE blog.posts (
  author_info JSONB,  -- { name, email, avatar, bio }
  ...
);
```

**When to denormalize:**
- Data rarely changes independently
- Performance is critical
- Consistency is manageable
- Reads >> Writes

### 2. **Nullable vs Required**

✅ **DO**: Make fields nullable when appropriate

```sql
CREATE TABLE blog.posts (
  title TEXT NOT NULL,        -- Always required
  excerpt TEXT,               -- Optional, can be auto-generated
  featured_image TEXT,        -- Optional
  published_at TIMESTAMPTZ,   -- Null for drafts
  category TEXT,              -- Optional taxonomy
);
```

### 3. **Enums for Fixed Values**

✅ **DO**: Use enums for status fields

```sql
CREATE TYPE blog.post_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE blog.posts (
  status blog.post_status NOT NULL DEFAULT 'draft'
);
```

**Benefits:**
- Type safety
- Database validation
- Self-documenting
- Prevents typos

## 🔄 Migrations

### 1. **Idempotent Migrations**

✅ **DO**: Make migrations safe to re-run

```sql
-- Safe to run multiple times
CREATE SCHEMA IF NOT EXISTS blog;

CREATE TABLE IF NOT EXISTS blog.posts (...);

CREATE INDEX IF NOT EXISTS idx_posts_status ON blog.posts(status);

-- Drop and recreate for functions
CREATE OR REPLACE FUNCTION blog.update_updated_at() ...
```

### 2. **Migration Organization**

✅ **DO**: One migration per logical change

```
migrations/
├── 20260405000000_create_blog_schema.sql     # Initial schema
├── 20260406000000_add_reading_time.sql       # Add feature
├── 20260407000000_add_author_index.sql       # Optimize
```

### 3. **Rollback Support**

✅ **DO**: Document how to rollback if needed

```sql
-- In migration comments
/*
ROLLBACK PROCEDURE:
1. DROP INDEX idx_posts_new_field;
2. ALTER TABLE blog.posts DROP COLUMN new_field;
*/
```

## 🚀 Performance

### 1. **Connection Pooling**

✅ **DO**: Use Supabase connection pooler for serverless

```typescript
// Use transaction mode for short connections
const connectionString = `${supabaseUrl}/db?pgbouncer=true`;
```

### 2. **Select Only What You Need**

✅ **DO**: Limit selected columns

```typescript
// Good
const { data } = await supabase
  .from('blog.posts')
  .select('id, title, slug, excerpt');

// Bad - fetches entire JSONB sections
const { data } = await supabase.from('blog.posts').select('*');
```

### 3. **Pagination**

✅ **DO**: Always paginate lists

```typescript
const { data, count } = await supabase
  .from('blog.posts')
  .select('*', { count: 'exact' })
  .range(offset, offset + limit - 1);
```

## 📦 Package-Specific Patterns

### 1. **Version Schema with Package**

✅ **DO**: Document compatible schema versions

```typescript
// In package
export const SCHEMA_VERSION = '1.0.0';

// In migration
COMMENT ON SCHEMA blog IS 'Blog schema v1.0.0 for m14i-blogging';
```

### 2. **Provide Migration Scripts**

✅ **DO**: Include migration files in package

```
npm-package/
├── src/
├── supabase/
│   ├── migrations/
│   └── README.md
└── package.json
```

### 3. **Example Implementations**

✅ **DO**: Provide framework-specific examples

```
supabase/examples/
├── nextjs/
├── remix/
└── sveltekit/
```

## 🧪 Testing

### 1. **Test Migrations**

✅ **DO**: Test migrations in local environment

```bash
# Start local Supabase
npx supabase start

# Apply migrations
npx supabase db reset

# Run tests
npm test
```

### 2. **Test RLS Policies**

✅ **DO**: Test policies with different user roles

```typescript
test('public can read published posts', async () => {
  const { data, error } = await supabaseAnon
    .from('blog.posts')
    .select('*')
    .eq('status', 'published');

  expect(error).toBeNull();
  expect(data).toBeDefined();
});

test('public cannot read drafts', async () => {
  const { data, error } = await supabaseAnon
    .from('blog.posts')
    .select('*')
    .eq('status', 'draft');

  expect(data).toHaveLength(0);
});
```

## 📝 Documentation

### 1. **Schema Documentation**

✅ **DO**: Add comments to schema objects

```sql
COMMENT ON TABLE blog.posts IS 'Blog posts with rich content blocks';
COMMENT ON COLUMN blog.posts.sections IS 'Complete LayoutSection[] array matching TypeScript type';
COMMENT ON COLUMN blog.posts.search_vector IS 'Full-text search vector (auto-generated)';
```

### 2. **Example Queries**

✅ **DO**: Provide example SQL queries

```sql
/*
EXAMPLE QUERIES:

-- Get all published posts
SELECT * FROM blog.posts WHERE status = 'published' ORDER BY published_at DESC;

-- Search posts
SELECT * FROM blog.search_posts('react typescript');

-- Query JSONB sections
SELECT title FROM blog.posts
WHERE sections @> '[{"type": "1-column"}]';
*/
```

## 🎓 Key Takeaways

1. **Use dedicated schema** for package tables
2. **JSONB for nested content**, normalize for entities
3. **Type-safe adapters** between DB and package types
4. **Index strategically** - don't over-index
5. **Enable RLS** for all user-facing tables
6. **Database validation** is your friend
7. **Make migrations idempotent**
8. **Document everything** - schema, examples, rollbacks
9. **Test migrations** and RLS policies
10. **Provide examples** for popular frameworks

## 🔗 References

- [PostgreSQL JSONB Best Practices](https://www.postgresql.org/docs/current/datatype-json.html)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Normalization Guidelines](https://en.wikipedia.org/wiki/Database_normalization)
- [Index Optimization](https://www.postgresql.org/docs/current/indexes.html)
