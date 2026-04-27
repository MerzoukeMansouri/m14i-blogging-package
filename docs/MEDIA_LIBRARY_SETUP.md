# Media Upload Setup Guide

The blog admin now supports uploading your own images using Supabase Storage.

## Features

- **Upload** your own images (JPG, PNG, GIF, WebP, max 5MB)
- **Media Library** to browse and reuse uploaded images
- **Find Free Images** from Picsum Photos
- **Enter URL** manually

## Setup Instructions

### 1. Start Local Supabase Stack

The docker-compose setup now includes all services including Storage:

```bash
cd example
docker compose up -d
```

This will start all services including `m14i-blog-storage` accessible through Kong on port `54321`.

### 2. Verify Storage Migration

The storage bucket and policies are created automatically on first startup via the migration in `example/volumes/db/migrations/`.

This migration creates:
- `blog-images` storage bucket
- Public read access policy
- Authenticated users can upload/update/delete

To verify the bucket was created, check Supabase Studio at http://localhost:3001 → Storage.

### 3. Update Next.js Config

Add `picsum.photos` and your Supabase storage domain to allowed image hosts:

```js
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: '<your-project-id>.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};
```

Replace `<your-project-id>` with your actual Supabase project ID.

### 4. Pass Supabase Client to BlogAdmin

```tsx
import { createClient } from '@supabase/supabase-js';
import { BlogAdmin } from '@m14i/blogging-admin';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  return (
    <BlogAdmin
      supabaseClient={supabase}
      // ... other props
    />
  );
}
```

### 5. That's It!

Now in the admin:

1. **Featured Image** section has 3 tabs:
   - **URL / Find Image**: Enter URL or search free stock photos
   - **Upload**: Upload your own images
   - **Media Library**: Browse and select previously uploaded images

2. **Image Blocks**: Same upload/gallery functionality in content blocks

## Custom Bucket Name

If you use a different bucket name:

```tsx
// You'll need to configure it when using the utilities directly
import { uploadImage } from '@m14i/blogging-admin';

await uploadImage(supabase, file, 'my-custom-bucket');
```

The components use `blog-images` by default.

## Storage Limits

- **File size**: 5 MB max per image
- **File types**: JPG, PNG, GIF, WebP
- **Bucket limit**: Depends on your Supabase plan (Free: 1 GB)

## Troubleshooting

**Upload fails**: Check that:
- Bucket `blog-images` exists
- Bucket is public
- User is authenticated
- Storage policies are set correctly

**Images don't display**: Check that:
- Bucket is public
- Next.js config includes Supabase domain
- URLs are correct (check network tab)

**"Supabase client not configured"**: Pass `supabaseClient` prop to `<BlogAdmin>`
