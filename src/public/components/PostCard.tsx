"use client";

/**
 * PostCard Component
 * Displays a preview card for a blog post
 */

import { useMemo } from "react";
import type { BlogPostRow } from "../../types";
import { useBlogContext } from "../context/BlogContext";
import {
  formatDate,
  getPostExcerpt,
  getPostReadingTime,
  formatReadingTime,
} from "../utils/formatting";
import { buildPath, navigateTo } from "../utils/router";

export interface PostCardProps {
  post: BlogPostRow;
  onClick?: (post: BlogPostRow) => void;
  className?: string;
}

/**
 * PostCard component for displaying a blog post preview
 */
export function PostCard({ post, onClick, className = "" }: PostCardProps) {
  const {
    basePath,
    display,
    labels,
    classNames,
    components,
    onPostClick,
    navigate,
  } = useBlogContext();

  // Use provided components or defaults
  const {
    Card = "div",
    CardHeader = "div",
    CardContent = "div",
    CardTitle = "h3",
    Badge = "span",
    Button = "button",
  } = components || {};

  // Calculate reading time
  const readingTime = useMemo(() => {
    if (!display.showReadingTime || !post.sections) return null;
    const minutes = getPostReadingTime(post);
    return formatReadingTime(minutes, labels);
  }, [post, display.showReadingTime, labels]);

  // Get excerpt
  const excerpt = useMemo(() => {
    if (!display.showExcerpt) return null;
    return getPostExcerpt(post);
  }, [post, display.showExcerpt]);

  // Handle click
  const handleClick = () => {
    const callback = onClick || onPostClick;
    if (callback) {
      callback(post);
    } else {
      // Navigate to post detail
      const path = buildPath(basePath, "detail", { slug: post.slug });
      if (navigate) {
        navigate(path);
      } else {
        navigateTo(path);
      }
    }
  };

  return (
    <Card className={`blog-post-card ${classNames?.postCard || ""} ${className}`}>
      {display.showFeaturedImage && post.featured_image && (
        <div className={`post-image ${classNames?.postImage || ""}`}>
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {display.showCategory && post.category && (
            <Badge
              variant="secondary"
              className={classNames?.categoryBadge}
            >
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

        <CardTitle className={`post-title ${classNames?.postTitle || ""}`}>
          <button
            onClick={handleClick}
            className="text-left hover:underline focus:outline-none"
          >
            {post.title}
          </button>
        </CardTitle>

        {display.showAuthor && post.author_info && (
          <p className="text-sm text-muted-foreground mt-1">
            {labels.by} {post.author_info.name}
          </p>
        )}
      </CardHeader>

      {excerpt && (
        <CardContent>
          <p className={`post-excerpt ${classNames?.postExcerpt || ""} text-muted-foreground`}>
            {excerpt}
          </p>
        </CardContent>
      )}

      {display.showTags && post.tags && post.tags.length > 0 && (
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={classNames?.tagBadge}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}

      <CardContent>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClick}
        >
          {labels.readMore} →
        </Button>
      </CardContent>
    </Card>
  );
}
