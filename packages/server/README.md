# Server Module - m14i-blogging

This module provides ready-to-use API route handlers for Next.js applications.

## Quick Start

### Installation

```bash
npm install m14i-blogging @supabase/supabase-js @supabase/ssr
```

### Usage

```typescript
// app/api/blog/posts/route.ts
import { createPostsRoutes } from 'm14i-blogging/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';

export const { GET, POST } = createPostsRoutes({
  supabase: createServerSupabaseClient,
});
```

That's it! You now have fully functional API routes.

## Exported Functions

### Route Factories

- **`createPostsRoutes(config)`** - Creates GET and POST handlers for `/api/blog/posts`
- **`createPostByIdRoutes(config)`** - Creates GET, PATCH, DELETE handlers for `/api/blog/posts/[id]`
- **`createPostBySlugRoute(config)`** - Creates GET handler for `/api/blog/posts/slug/[slug]`

### Utilities

- **`getSupabaseClient(config)`** - Resolves Supabase client from config
- **`checkAuth(config)`** - Checks if user is authenticated
- **`checkAdmin(config)`** - Checks if user is admin
- **`requireAdmin(config)`** - Throws if user is not admin
- **`handleError(error, config)`** - Handles errors consistently
- **`parseQueryParams(url)`** - Parses URL query parameters
- **`jsonResponse(data, status)`** - Creates JSON response
- **`errorResponse(error, status)`** - Creates error response
- **`successResponse(data, status)`** - Creates success response

### Types

- **`RouteConfig`** - Configuration for route handlers
- **`ApiResponse<T>`** - Standard API response type
- **`PaginationParams`** - Pagination parameters
- **`PostFilterParams`** - Filter parameters for posts

## Configuration

```typescript
interface RouteConfig {
  // Supabase client (required)
  supabase: SupabaseClient | (() => SupabaseClient) | (() => Promise<SupabaseClient>);

  // Custom authentication (optional)
  getUser?: () => Promise<{ id: string; role?: string } | null>;

  // Custom admin check (optional)
  isAdmin?: () => Promise<boolean>;

  // Error handler (optional)
  onError?: (error: Error) => void;
}
```

## Complete API Routes Setup

Create these three route files:

### 1. `/api/blog/posts/route.ts`

```typescript
import { createPostsRoutes } from 'm14i-blogging/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';

export const { GET, POST } = createPostsRoutes({
  supabase: createServerSupabaseClient,
});
```

### 2. `/api/blog/posts/[id]/route.ts`

```typescript
import { createPostByIdRoutes } from 'm14i-blogging/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';

export const { GET, PATCH, DELETE } = createPostByIdRoutes({
  supabase: createServerSupabaseClient,
});
```

### 3. `/api/blog/posts/slug/[slug]/route.ts`

```typescript
import { createPostBySlugRoute } from 'm14i-blogging/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';

export const { GET } = createPostBySlugRoute({
  supabase: createServerSupabaseClient,
});
```

## Documentation

For complete documentation, see:

- [API Routes Integration Guide](../../docs/API_ROUTES_INTEGRATION.md)
- [Supabase Setup Guide](../../supabase/README.md)
- [Quick Start](../../supabase/QUICK_START.md)

## Requirements

- Next.js 13+ with App Router
- Supabase project with blog schema
- TypeScript (recommended)

## License

MIT
