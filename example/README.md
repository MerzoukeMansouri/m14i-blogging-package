# m14i-blogging — Full Example

A complete blog application using [m14i-blogging](https://www.npmjs.com/package/m14i-blogging) with a self-hosted Supabase instance via Docker Compose.

## What's Included

- **Self-hosted Supabase** — PostgreSQL, GoTrue (auth), PostgREST (REST API), Kong (API gateway), Studio (dashboard), Storage (image upload)
- **Next.js 15 app** — Blog admin panel + public blog, pre-wired API routes
- **Auto-provisioned database** — Blog schema, categories, tags, seed data, and storage bucket applied on first boot
- **Media library** — Upload images, browse gallery, and search free stock photos
- **Zero config** — Pre-generated JWT keys for local development

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js 18+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (or npm/yarn)

## Quick Start

### 1. Start Supabase

```bash
cd example
cp .env.example .env
docker compose up -d
```

Wait ~30 seconds for all services to initialize. Check status:

```bash
docker compose ps
```

All services should show `running` (or `healthy` for `db`).

### 2. Start the Next.js App

```bash
cd app
cp .env.local.example .env.local
pnpm install
pnpm dev
```

### 3. Open the App

| URL | Description |
|-----|-------------|
| [localhost:3000](http://localhost:3000) | Next.js app (home page) |
| [localhost:3000/blog](http://localhost:3000/blog) | Public blog |
| [localhost:3000/admin/blog](http://localhost:3000/admin/blog) | Blog admin panel |
| [localhost:3001](http://localhost:3001) | Supabase Studio |
| [localhost:54321](http://localhost:54321) | Supabase API gateway |

> **Studio login**: `supabase` / `supabase` (configurable in `.env`)

## Architecture

```
example/
├── docker-compose.yml          # Supabase services
├── .env.example                # Environment variables template
├── volumes/
│   ├── api/
│   │   └── kong.yml            # API gateway routes
│   └── db/
│       └── migrations/
│           ├── 20260404000000_set_role_passwords.sql  # DB role passwords
│           ├── 20260405000000_create_blog_schema.sql  # Blog posts & media
│           ├── 20260405000001_add_taxonomy_tables.sql  # Categories & tags
│           └── 20260405000002_seed_data.sql            # Sample content
└── app/                        # Next.js application
    ├── app/
    │   ├── api/blog/           # API routes (m14i-blogging handlers)
    │   ├── admin/blog/         # Admin panel page
    │   └── blog/[[...path]]/   # Public blog page
    └── lib/
        ├── supabase-server.ts  # Server-side Supabase client
        ├── supabase-browser.ts # Client-side Supabase client
        ├── blog-client.ts      # m14i-blogging client factory
        └── auth.ts             # Auth check helper
```

## How It Works

### Database

Docker Compose starts a Supabase-flavored PostgreSQL. On first boot, it auto-runs:

1. `20260404000000_set_role_passwords.sql` — Sets passwords for `authenticator` and `supabase_auth_admin` roles
2. `20260405000000_create_blog_schema.sql` — Creates `blog` schema with `posts` and `media` tables, RLS policies, full-text search, and public views
3. `20260405000001_add_taxonomy_tables.sql` — Creates `blog_categories` and `blog_tags` tables in `public` schema
4. `20260405000002_seed_data.sql` — Inserts sample categories, tags, and a welcome post
5. `20260427000000_create_blog_storage.sql` — Creates `blog-images` storage bucket with public access and RLS policies for image uploads

### API Routes

The Next.js app uses pre-built handler factories from `m14i-blogging/server`:

```
GET    /api/blog              → listPosts
POST   /api/blog              → createPost (auth required)
PATCH  /api/blog/[id]         → updatePost (auth required)
DELETE /api/blog/[id]         → deletePost (auth required)
GET    /api/blog/slug/[slug]  → getPostBySlug
GET    /api/blog/categories   → listCategories
POST   /api/blog/categories   → createCategory (auth required)
GET    /api/blog/tags         → listTags
POST   /api/blog/tags         → createTag (auth required)
GET    /api/blog/search?q=    → searchPosts
GET    /api/blog/stats        → getStats
GET    /api/blog/media        → listMedia
POST   /api/blog/media        → createMedia (auth required)
```

### Admin Panel

Uses `BlogAdmin` with `BlogBuilderWithDefaults` (no shadcn/ui required). Set `isAllowed={true}` for demo purposes — in production, wire this to your auth logic.

**Media Library**: The admin includes a built-in media library with:
- Image upload (JPG, PNG, GIF, WebP, max 5MB)
- Gallery view of uploaded images
- Free stock photo search via Picsum Photos
- Media library button in toolbar for quick access

For more details, see [Media Library Setup Guide](../docs/MEDIA_LIBRARY_SETUP.md).

### Public Blog

Uses `Blog` component with grid layout, search, and category/tag filtering.

## Resetting the Database

To start fresh, remove the Docker volume and restart:

```bash
docker compose down -v
docker compose up -d
```

## Customization

### Using Your Own UI Components

Replace `BlogBuilderWithDefaults` with `BlogBuilder` and pass your own shadcn/ui components:

```tsx
import { BlogBuilder } from "@m14i/blogging-admin";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PlusIcon, XIcon } from "lucide-react";

<BlogAdmin
  components={{
    BlogBuilder: (props) => (
      <BlogBuilder
        {...props}
        components={{
          Button, Card, CardContent: Card, CardHeader: Card,
          Label, Input, Textarea,
          Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
          PlusIcon, XIcon,
        }}
      />
    ),
  }}
/>
```

### Adding Authentication

1. Open Supabase Studio → Authentication → Users
2. Create a user with email/password
3. Edit user metadata and add `{ "role": "admin" }`
4. Update the admin page to check the actual user session instead of `isAllowed={true}`

### Production Deployment

1. **Generate new JWT keys** — never use the dev keys in production
2. **Set real environment variables** — use a secrets manager
3. **Enable HTTPS** — configure Kong or use a reverse proxy
4. **Restrict CORS** — update Kong plugins
5. **Disable Studio** — or put it behind authentication

## Documentation

- **[Media Library Setup](../docs/MEDIA_LIBRARY_SETUP.md)** — Configure image upload and storage
- **[Blog Admin Guide](../docs/BLOG_ADMIN_GUIDE.md)** — Complete BlogAdmin component reference
- **[Installation Guide](../docs/INSTALLATION.md)** — Package installation instructions

## Troubleshooting

### Package development workflow (important)

The example app is wired to the local package through the workspace:

- root `pnpm-workspace.yaml`
- `example/app/package.json` uses `"m14i-blogging": "workspace:*"`

That means the example app should always be treated as a consumer of the package, not as a place to hot-fix package code.

**Rules:**

1. **Never edit `example/app/node_modules/...`**
2. **Never hand-edit compiled package files like `dist/index.mjs`, `dist/admin/index.mjs`, or other built outputs as the source of truth**
3. **Always edit package source under `src/`**
4. **After package changes, always rebuild the package from the repo root**
5. **Then restart the example app so Next.js reloads the rebuilt package**

Correct workflow:

```bash
# from repo root
pnpm build

# if needed, clear example cache and restart
rm -rf example/app/.next
cd example/app
pnpm dev
```

If the example app does not reflect a package change:

- check that the source change was made in `src/`
- run `pnpm build` from the package root
- restart the example app
- only then debug runtime behavior

Do **not** patch generated files inside `node_modules` to “make it work quickly”.
That creates drift and makes the package and example app disagree about what the real code is.

### "Connection refused" on API calls

Supabase services may still be starting. Wait 30 seconds and check:
```bash
docker compose logs kong
```

### Database not initialized

If the seed data doesn't appear, the DB volume may contain old data:
```bash
docker compose down -v
docker compose up -d
```

### Port conflicts

Default ports: 54322 (Postgres), 54321 (Kong API), 3001 (Studio), 3000 (Next.js). Change in `.env` or `docker-compose.yml` if they conflict.
