"use client";

import type { BlogPostRow } from "../types";

export interface BlogPostListTheme {
  /** Container wrapper classes */
  container?: string;
  /** Page title classes */
  title?: string;
  /** Grid wrapper classes */
  grid?: string;
  /** Individual post card classes */
  card?: string;
  /** Post featured image classes */
  image?: string;
  /** Post title classes */
  postTitle?: string;
  /** Post excerpt classes */
  excerpt?: string;
  /** Category badge classes */
  category?: string;
  /** Empty state container classes */
  emptyContainer?: string;
  /** Empty state text classes */
  emptyText?: string;
}

export interface BlogPostListProps {
  /** Array of blog posts to display */
  posts: BlogPostRow[];
  /** Optional image component (e.g., Next.js Image) */
  ImageComponent?: React.ComponentType<{
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
  }>;
  /** Custom theme classes */
  theme?: BlogPostListTheme;
  /** Page title */
  pageTitle?: string;
  /** Base path for blog links */
  basePath?: string;
  /** Custom empty state message */
  emptyMessage?: string;
  /** Show category badges */
  showCategory?: boolean;
  /** Show excerpts */
  showExcerpt?: boolean;
  /** Show featured images */
  showFeaturedImage?: boolean;
}

export function BlogPostList({
  posts,
  ImageComponent,
  theme,
  pageTitle = "Blog",
  basePath = "/blog",
  emptyMessage = "No posts yet",
  showCategory = true,
  showExcerpt = true,
  showFeaturedImage = true,
}: BlogPostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className={theme?.emptyContainer || "container mx-auto px-4 py-16 text-center"}>
        <p className={theme?.emptyText || "text-muted-foreground"}>{emptyMessage}</p>
      </div>
    );
  }

  const ImageTag = ImageComponent || "img";

  return (
    <div className={theme?.container || "container mx-auto px-4 py-8"}>
      {pageTitle && (
        <h1 className={theme?.title || "text-4xl font-bold mb-8"}>{pageTitle}</h1>
      )}
      <div className={theme?.grid || "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {posts.map((post) => {
          const href = `${basePath}/${post.slug}`;

          return (
            <a
              key={post.id}
              href={href}
              className={theme?.card || "block border rounded-lg p-6 hover:shadow-lg transition-shadow"}
            >
              {showFeaturedImage && post.featured_image && (
                <ImageTag
                  src={post.featured_image}
                  alt={post.title}
                  className={theme?.image || "w-full h-48 object-cover rounded-lg mb-4"}
                  {...(ImageComponent ? { width: 400, height: 192 } : {})}
                />
              )}
              <h2 className={theme?.postTitle || "text-xl font-bold mb-2"}>{post.title}</h2>
              {showExcerpt && post.excerpt && (
                <p className={theme?.excerpt || "text-muted-foreground mb-4"}>{post.excerpt}</p>
              )}
              {showCategory && post.category && (
                <span className={theme?.category || "inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"}>
                  {post.category}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
