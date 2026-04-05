# Publication Date Management Guide

This guide explains how to handle publication dates, scheduled publishing, and date-based workflows in the `m14i-blogging` package.

## 📅 Overview

The package supports three publication scenarios:

1. **Immediate Publishing** - Publish a post right now
2. **Scheduled Publishing** - Schedule a post for future publication
3. **Backdated Publishing** - Publish with a past date (for migrations, etc.)

## 🎯 How It Works

### Database Fields

- **`status`**: `'draft'`, `'published'`, or `'archived'`
- **`published_at`**: Timestamp when the post was/will be published
- **`created_at`**: When the post was created
- **`updated_at`**: Last modification time (auto-updated)

### Publishing Logic

```typescript
// When creating or updating a post:

1. If publishedDate is in the PAST/PRESENT → status = 'published'
2. If publishedDate is in the FUTURE → status = 'draft' (scheduled)
3. If status = 'published' and no publishedDate → published_at = NOW
4. If status = 'draft' and no publishedDate → published_at = NULL
```

## 🚀 Usage Examples

### 1. Publish Immediately

```javascript
// Create and publish now
const res = await fetch('/api/blog/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Post',
    sections: [...],
    status: 'published', // Will use current time
  }),
});

// Or explicitly set the time
const res = await fetch('/api/blog/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Post',
    sections: [...],
    publishedDate: new Date().toISOString(),
  }),
});
```

### 2. Schedule for Future Publication

```javascript
// Schedule for next week
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

const res = await fetch('/api/blog/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Scheduled Post',
    sections: [...],
    publishedDate: nextWeek.toISOString(),
    // status will automatically be 'draft' until published_at arrives
  }),
});
```

### 3. Backdate a Post

```javascript
// Publish with a past date (e.g., migrating old content)
const pastDate = new Date('2024-01-15T10:00:00Z');

const res = await fetch('/api/blog/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Migrated Post',
    sections: [...],
    publishedDate: pastDate.toISOString(),
    // Will be immediately published with this past date
  }),
});
```

### 4. Update Publication Date

```javascript
// Change publication date of existing post
const res = await fetch('/api/blog/posts/post-id', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    publishedDate: '2026-12-25T00:00:00Z', // Christmas 2026
  }),
});

// Clear publication date (revert to draft)
const res = await fetch('/api/blog/posts/post-id', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    publishedDate: null,
    status: 'draft',
  }),
});
```

### 5. Quick Publish/Unpublish Actions

```javascript
// Publish now (uses current time)
const res = await fetch('/api/blog/posts/post-id?action=publish', {
  method: 'PATCH',
});

// Publish with specific date
const res = await fetch('/api/blog/posts/post-id?action=publish&publishedAt=2026-01-01T00:00:00Z', {
  method: 'PATCH',
});

// Unpublish (sets status to draft and clears published_at)
const res = await fetch('/api/blog/posts/post-id?action=unpublish', {
  method: 'PATCH',
});
```

## ⏰ Scheduled Publishing

### View Scheduled Posts

```javascript
// Get all posts scheduled for future publication
const res = await fetch('/api/blog/scheduled');
const { posts, total } = await res.json();

// Posts are ordered by published_at (soonest first)
posts.forEach(post => {
  console.log(`${post.title} will publish at ${post.published_at}`);
});
```

### Manual Publishing of Scheduled Posts

```javascript
// Publish all posts whose published_at has passed
const res = await fetch('/api/blog/scheduled/publish', {
  method: 'POST',
});

const { published, posts, message } = await res.json();
console.log(message); // "Successfully published 3 post(s)"
```

### Automated Publishing (Cron Job)

#### Option 1: Vercel Cron

```typescript
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/publish-scheduled",
      "schedule": "*/15 * * * *" // Every 15 minutes
    }
  ]
}
```

```typescript
// app/api/cron/publish-scheduled/route.ts
import { publishScheduledPosts } from 'm14i-blogging/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const result = await publishScheduledPosts(supabaseAdmin);

  return Response.json(result);
}
```

#### Option 2: Supabase Edge Function + pg_cron

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to publish scheduled posts
CREATE OR REPLACE FUNCTION blog.publish_scheduled_posts()
RETURNS void AS $$
BEGIN
  UPDATE blog.posts
  SET status = 'published'
  WHERE status = 'draft'
    AND published_at IS NOT NULL
    AND published_at <= NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule it to run every 15 minutes
SELECT cron.schedule(
  'publish-scheduled-posts',
  '*/15 * * * *',
  $$SELECT blog.publish_scheduled_posts()$$
);
```

#### Option 3: External Cron Service

Use services like:
- **Cron-job.org**
- **EasyCron**
- **GitHub Actions**

```yaml
# .github/workflows/publish-scheduled.yml
name: Publish Scheduled Posts

on:
  schedule:
    - cron: '*/15 * * * *' # Every 15 minutes

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger publish endpoint
        run: |
          curl -X POST https://your-app.com/api/blog/scheduled/publish \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

#### Option 4: Node.js Script with node-cron

```typescript
// scripts/publish-scheduled.ts
import cron from 'node-cron';
import { publishScheduledPosts } from 'm14i-blogging/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Run every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  console.log('Checking for scheduled posts...');

  const result = await publishScheduledPosts(supabaseAdmin);

  if (result.success && result.published > 0) {
    console.log(`✅ Published ${result.published} post(s)`);
    result.posts.forEach(post => {
      console.log(`  - ${post.title} (${post.slug})`);
    });
  } else if (!result.success) {
    console.error('❌ Error publishing scheduled posts:', result.message);
  }
});

console.log('Scheduled post publisher started');
```

```json
// package.json
{
  "scripts": {
    "publish:scheduled": "tsx scripts/publish-scheduled.ts"
  }
}
```

## 📊 Query Posts by Publication Date

### Get Posts Published in a Date Range

```javascript
// Get posts published in January 2026
const { data } = await supabase
  .from('blog.posts')
  .select('*')
  .eq('status', 'published')
  .gte('published_at', '2026-01-01T00:00:00Z')
  .lt('published_at', '2026-02-01T00:00:00Z')
  .order('published_at', { ascending: false });
```

### Get Recently Published Posts

```javascript
// Get posts published in the last 7 days
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const { data } = await supabase
  .from('blog.posts')
  .select('*')
  .eq('status', 'published')
  .gte('published_at', sevenDaysAgo.toISOString())
  .order('published_at', { ascending: false });
```

### Get Posts Scheduled for Today

```javascript
const today = new Date();
today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const { data } = await supabase
  .from('blog.posts')
  .select('*')
  .eq('status', 'draft')
  .gte('published_at', today.toISOString())
  .lt('published_at', tomorrow.toISOString())
  .order('published_at', { ascending: true });
```

## 🎨 UI Components

### Date Picker for Scheduling

```tsx
'use client';

import { useState } from 'react';

export function PublishDatePicker({ onDateChange }: { onDateChange: (date: string | null) => void }) {
  const [publishNow, setPublishNow] = useState(true);
  const [scheduledDate, setScheduledDate] = useState('');

  const handlePublishModeChange = (mode: 'now' | 'schedule' | 'draft') => {
    if (mode === 'now') {
      setPublishNow(true);
      onDateChange(new Date().toISOString());
    } else if (mode === 'schedule') {
      setPublishNow(false);
      onDateChange(scheduledDate);
    } else {
      setPublishNow(false);
      onDateChange(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => handlePublishModeChange('draft')}
          className="btn"
        >
          Save as Draft
        </button>
        <button
          onClick={() => handlePublishModeChange('now')}
          className="btn-primary"
        >
          Publish Now
        </button>
        <button
          onClick={() => handlePublishModeChange('schedule')}
          className="btn"
        >
          Schedule
        </button>
      </div>

      {!publishNow && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Publish Date & Time
          </label>
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => {
              setScheduledDate(e.target.value);
              onDateChange(new Date(e.target.value).toISOString());
            }}
            className="input"
          />
          {scheduledDate && (
            <p className="text-sm text-gray-600 mt-1">
              Will publish on {new Date(scheduledDate).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

### Usage in Blog Editor

```tsx
'use client';

import { useState } from 'react';
import { BlogBuilder } from 'm14i-blogging';
import { PublishDatePicker } from './PublishDatePicker';

export function BlogEditorWithScheduling({ postId }: { postId: string }) {
  const [sections, setSections] = useState([]);
  const [publishedDate, setPublishedDate] = useState<string | null>(null);

  const handleSave = async () => {
    const res = await fetch(`/api/blog/posts/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sections,
        publishedDate,
      }),
    });

    if (res.ok) {
      const message = publishedDate
        ? new Date(publishedDate) > new Date()
          ? `Scheduled for ${new Date(publishedDate).toLocaleString()}`
          : 'Published successfully!'
        : 'Saved as draft';

      alert(message);
    }
  };

  return (
    <div>
      <PublishDatePicker onDateChange={setPublishedDate} />

      <BlogBuilder
        sections={sections}
        onChange={setSections}
        components={{/* ... */}}
      />

      <button onClick={handleSave}>Save</button>
    </div>
  );
}
```

## 🔍 Best Practices

### 1. Always Use ISO 8601 Format

```javascript
// ✅ Good
publishedDate: new Date().toISOString()
publishedDate: '2026-12-25T00:00:00Z'

// ❌ Bad
publishedDate: 'Dec 25, 2026'
publishedDate: Date.now() // Use timestamp in milliseconds
```

### 2. Handle Timezones Properly

```javascript
// Store in UTC, display in user's timezone
const publishDate = new Date('2026-12-25T10:00:00Z');

// Display in user's timezone
const localString = publishDate.toLocaleString('en-US', {
  timeZone: 'America/New_York',
  dateStyle: 'full',
  timeStyle: 'short',
});
```

### 3. Validate Future Dates

```javascript
function validatePublishDate(dateString: string): boolean {
  const date = new Date(dateString);

  // Check if valid date
  if (isNaN(date.getTime())) {
    return false;
  }

  // Optional: Prevent scheduling too far in the future (e.g., 1 year)
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  if (date > oneYearFromNow) {
    return false;
  }

  return true;
}
```

### 4. Provide Clear Feedback

```tsx
function getPublishStatus(post: BlogPost) {
  if (post.status === 'published') {
    return {
      label: 'Published',
      color: 'green',
      date: `on ${new Date(post.publishedDate!).toLocaleDateString()}`,
    };
  }

  if (post.status === 'draft' && post.publishedDate) {
    const publishDate = new Date(post.publishedDate);

    if (publishDate > new Date()) {
      return {
        label: 'Scheduled',
        color: 'blue',
        date: `for ${publishDate.toLocaleString()}`,
      };
    }
  }

  return {
    label: 'Draft',
    color: 'gray',
    date: '',
  };
}
```

## 📝 Migration Guide

### Migrating Existing Posts with Dates

```typescript
// Script to migrate old posts
import { supabaseAdmin } from '@/lib/supabase-admin';

async function migratePosts() {
  const oldPosts = [
    { title: 'Old Post 1', date: '2024-01-15', content: '...' },
    { title: 'Old Post 2', date: '2024-02-20', content: '...' },
    // ... more posts
  ];

  for (const oldPost of oldPosts) {
    await supabaseAdmin.from('blog.posts').insert({
      title: oldPost.title,
      sections: convertContentToSections(oldPost.content),
      published_at: new Date(oldPost.date).toISOString(),
      status: 'published',
      // ... other fields
    });
  }

  console.log(`Migrated ${oldPosts.length} posts`);
}
```

## 🎉 Summary

Publication date management in `m14i-blogging` supports:

✅ Immediate publishing
✅ Scheduled publishing (future dates)
✅ Backdated publishing (past dates)
✅ Update publication dates
✅ Automatic scheduled post publishing via cron
✅ Query by publication date ranges
✅ Timezone-aware date handling
✅ Clear status indicators

The system is flexible enough to handle all common blogging workflows while being simple to use!
