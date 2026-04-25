"use client";

import dynamic from "next/dynamic";

const Blog = dynamic(
  () => import("m14i-blogging/public").then((m) => m.Blog),
  { ssr: false },
);

export default function BlogPage() {
  return (
    <Blog
      basePath="/blog"
      apiBasePath="/api/blog"
      display={{
        layout: "grid",
        postsPerPage: 9,
      }}
      features={{
        search: true,
        categoryFilter: true,
        tagFilter: true,
        relatedPosts: true,
      }}
    />
  );
}
