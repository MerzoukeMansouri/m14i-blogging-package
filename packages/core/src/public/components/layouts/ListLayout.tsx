"use client";

/**
 * ListLayout Component
 * Displays posts in a vertical list layout with featured image on the side
 */

import type { BlogPostRow } from "../../../types";
import { useBlogContext } from "../../context/BlogContext";
import {
  formatDate,
  getPostExcerpt,
  getPostReadingTime,
  formatReadingTime,
} from "../../utils/formatting";
import { buildPath, navigateTo } from "../../utils/router";
import { useMemo } from "react";

export interface ListLayoutProps {
  posts: BlogPostRow[];
  onPostClick?: (post: BlogPostRow) => void;
  className?: string;
}

/**
 * List layout for displaying posts
 */
export function ListLayout({ posts, onPostClick, className = "" }: ListLayoutProps) {
  const {
    basePath,
    display,
    labels,
    classNames,
    components,
    onPostClick: contextOnPostClick,
    navigate,
  } = useBlogContext();

  const { Badge = "span", Button = "button" } = components || {};

  const handlePostClick = (post: BlogPostRow) => {
    const callback = onPostClick || contextOnPostClick;
    if (callback) {
      callback(post);
    } else {
      const path = buildPath(basePath, "detail", { slug: post.slug });
      if (navigate) {
        navigate(path);
      } else {
        navigateTo(path);
      }
    }
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${classNames?.content || ""} ${className}`}>
      {posts.map((post) => {
        const readingTime = display.showReadingTime
          ? formatReadingTime(getPostReadingTime(post), labels)
          : null;
        const excerpt = display.showExcerpt ? getPostExcerpt(post, 200) : null;

        return (
          <div
            key={post.id}
            className={`flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow ${
              classNames?.postCard || ""
            }`}
          >
            {display.showFeaturedImage && post.featured_image && (
              <div className={`md:w-64 flex-shrink-0 ${classNames?.postImage || ""}`}>
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-40 md:h-full object-cover rounded-lg"
                />
              </div>
            )}

            <div className="flex-1 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {display.showCategory && post.category && (
                  <Badge variant="secondary" className={classNames?.categoryBadge}>
                    {post.category}
                  </Badge>
                )}

                {display.showDate && post.published_at && (
                  <span className="text-sm text-muted-foreground">
                    {formatDate(post.published_at)}
                  </span>
                )}

                {readingTime && (
                  <span className="text-sm text-muted-foreground">{readingTime}</span>
                )}
              </div>

              <h3 className={`text-2xl font-bold mb-2 ${classNames?.postTitle || ""}`}>
                <button
                  onClick={() => handlePostClick(post)}
                  className="text-left hover:underline focus:outline-none"
                >
                  {post.title}
                </button>
              </h3>

              {display.showAuthor && post.author_info && (
                <p className="text-sm text-muted-foreground mb-2">
                  {labels.by} {post.author_info.name}
                </p>
              )}

              {excerpt && (
                <p className={`text-muted-foreground mb-4 ${classNames?.postExcerpt || ""}`}>
                  {excerpt}
                </p>
              )}

              {display.showTags && post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className={classNames?.tagBadge}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mt-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePostClick(post)}
                >
                  {labels.readMore} →
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
