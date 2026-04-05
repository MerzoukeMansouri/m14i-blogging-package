/**
 * Example Blog Editor Page Component
 *
 * This demonstrates how to integrate the m14i-blogging package
 * with Supabase for a complete blog editor experience.
 *
 * Place this in: app/admin/blog/edit/[id]/page.tsx
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BlogBuilder, type LayoutSection } from 'm14i-blogging';
import { supabaseClient } from '@/lib/supabase-client';
import { getPostById, updatePostSections, publishPost } from '@/lib/blog-api';
import type { BlogPost } from 'm14i-blogging';

// Shadcn/ui components (install these first)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusIcon, XIcon } from 'lucide-react';

export default function BlogEditorPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [sections, setSections] = useState<LayoutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load post on mount
  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    setLoading(true);
    setError(null);

    try {
      const loadedPost = await getPostById(supabaseClient, postId);

      if (!loadedPost) {
        setError('Post not found');
        return;
      }

      setPost(loadedPost);
      setSections(loadedPost.sections);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  // Auto-save sections on change (debounced)
  const handleSectionsChange = (newSections: LayoutSection[]) => {
    setSections(newSections);

    // Optional: Implement debounced auto-save
    // debouncedSave(newSections);
  };

  // Save sections to database
  const handleSave = async () => {
    if (!post) return;

    setSaving(true);
    setError(null);

    try {
      const { success, error } = await updatePostSections(
        supabaseClient,
        post.id!,
        sections
      );

      if (!success) {
        setError(error || 'Failed to save');
        return;
      }

      // Success feedback
      alert('Post saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Publish the post
  const handlePublish = async () => {
    if (!post) return;

    const confirmed = confirm('Are you sure you want to publish this post?');
    if (!confirmed) return;

    setSaving(true);
    setError(null);

    try {
      const { post: publishedPost, error } = await publishPost(
        supabaseClient,
        post.id!
      );

      if (error || !publishedPost) {
        setError(error || 'Failed to publish');
        return;
      }

      alert('Post published successfully!');
      router.push('/admin/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <p className="text-sm text-gray-500">
              Status: <span className="capitalize">{post.status || 'draft'}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/blog')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>
            {post.status !== 'published' && (
              <Button
                onClick={handlePublish}
                disabled={saving}
                variant="default"
              >
                Publish
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Blog Builder */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BlogBuilder
          sections={sections}
          onChange={handleSectionsChange}
          components={{
            Button,
            Card,
            CardContent,
            CardHeader,
            Label,
            Input,
            Textarea,
            Select,
            SelectTrigger,
            SelectValue,
            SelectContent,
            SelectItem,
            PlusIcon,
            XIcon,
          }}
          config={{
            callbacks: {
              onChange: (sections) => {
                console.log('Sections changed:', sections);
              },
              onSave: async (sections) => {
                await handleSave();
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Alternative: Server Component Example
// ============================================================================

/**
 * Server Component version (app/admin/blog/edit/[id]/page.tsx)
 *
 * This loads data server-side and hydrates a client component
 */

/*
import { createServerSupabaseClient } from '@/lib/supabase-client';
import { getPostById } from '@/lib/blog-api';
import BlogEditorClient from './BlogEditorClient';

export default async function BlogEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerSupabaseClient();
  const post = await getPostById(supabase, params.id);

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Post not found</div>
      </div>
    );
  }

  return <BlogEditorClient initialPost={post} />;
}
*/

// ============================================================================
// Blog List Page Example
// ============================================================================

/**
 * Example blog list/index page
 * Place in: app/admin/blog/page.tsx
 */

/*
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabase-client';
import { getPosts } from '@/lib/blog-api';
import type { BlogPost } from 'm14i-blogging';
import { Button } from '@/components/ui/button';

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const { posts } = await getPosts(supabaseClient, {
      orderBy: 'updated_at',
      orderDirection: 'desc',
      limit: 50,
    });
    setPosts(posts);
    setLoading(false);
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link href="/admin/blog/new">
          <Button>New Post</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border rounded-lg p-6 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-2">{post.excerpt}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="capitalize">{post.status || 'draft'}</span>
                  {post.category && <span>· {post.category}</span>}
                  {post.publishedDate && (
                    <span>· {new Date(post.publishedDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <Link href={`/admin/blog/edit/${post.id}`}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
*/

// ============================================================================
// Public Blog Display Page Example
// ============================================================================

/**
 * Public blog post display page
 * Place in: app/blog/[slug]/page.tsx
 */

/*
import { createServerSupabaseClient } from '@/lib/supabase-client';
import { getPostBySlug } from '@/lib/blog-api';
import { BlogPreview } from 'm14i-blogging';
import { notFound } from 'next/navigation';

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createServerSupabaseClient();
  const post = await getPostBySlug(supabase, params.slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <BlogPreview
        title={post.title}
        sections={post.sections}
        date={post.publishedDate}
        showReadingTime={true}
      />
    </div>
  );
}

// Generate static params for static site generation
export async function generateStaticParams() {
  const supabase = createServerSupabaseClient();
  const { posts } = await getPosts(supabase, {
    status: 'published',
    limit: 100,
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
*/
