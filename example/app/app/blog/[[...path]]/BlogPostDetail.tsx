"use client";

import { BlogPreview } from "@m14i/blogging-core";
import type { BlogPostRow } from "@m14i/blogging-core";
import Image from "next/image";

interface BlogPostDetailProps {
  post: BlogPostRow;
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
  return (
    <BlogPreview
      title={post.title}
      excerpt={post.excerpt || undefined}
      sections={post.sections}
      ImageComponent={Image}
      showReadingTime={true}
      date={post.published_at || post.created_at}
      showMeta={true}
      dateLocale="en-US"
    />
  );
}
