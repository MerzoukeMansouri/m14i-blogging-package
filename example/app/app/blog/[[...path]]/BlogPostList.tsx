"use client";

import { BlogPostList as CoreBlogPostList } from "@m14i/blogging-core";
import type { BlogPostRow } from "@m14i/blogging-core";
import Image from "next/image";

interface BlogPostListProps {
  posts: BlogPostRow[];
}

export function BlogPostList({ posts }: BlogPostListProps) {
  return (
    <CoreBlogPostList
      posts={posts}
      ImageComponent={Image}
      pageTitle="Blog"
      basePath="/blog"
      emptyMessage="No posts yet"
      showCategory={true}
      showExcerpt={true}
      showFeaturedImage={true}
    />
  );
}
