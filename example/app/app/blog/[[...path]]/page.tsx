import { Suspense } from "react";
import { getBlogClient } from "@/lib/blog-client";
import { BlogPostDetail } from "./BlogPostDetail";
import { BlogPostList } from "./BlogPostList";

interface PageProps {
  params: Promise<{
    path?: string[];
  }>;
}

export default async function BlogPage({ params }: PageProps) {
  const { path } = await params;
  const slug = path?.[0];

  const blogClient = await getBlogClient();

  if (!slug) {
    const result = await blogClient.posts.list({ status: "published" });
    const posts = result?.posts || [];
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <BlogPostList posts={posts} />
      </Suspense>
    );
  }

  const post = await blogClient.posts.getBySlug(slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPostDetail post={post} />
    </Suspense>
  );
}
