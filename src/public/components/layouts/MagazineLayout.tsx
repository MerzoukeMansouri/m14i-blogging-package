"use client";

/**
 * MagazineLayout Component
 * Displays the first post as a large featured article, followed by a grid of smaller posts
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
import { PostCard } from "../PostCard";

export interface MagazineLayoutProps {
  posts: BlogPostRow[];
  onPostClick?: (post: BlogPostRow) => void;
  className?: string;
}

/**
 * Magazine layout for displaying posts
 * First post is featured, remaining posts in grid
 */
export function MagazineLayout({ posts, onPostClick, className = "" }: MagazineLayoutProps) {
  const {
    basePath,
    display,
    labels,
    classNames,
    components,
    onPostClick: contextOnPostClick,
    navigate,
  } = useBlogContext();

  const Badge = components?.Badge || "span";
  const Button = components?.Button || "button";

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

  const [featuredPost, ...remainingPosts] = posts;

  return (
    <div className={`space-y-8 ${classNames?.content || ""} ${className}`}>
      {/* Featured Post */}
      <div
        className={`relative rounded-lg overflow-hidden shadow-lg ${classNames?.postCard || ""}`}
      >
        {display.showFeaturedImage && featuredPost.featured_image && (
          <div className="relative h-96">
            <img
              src={featuredPost.featured_image}
              alt={featuredPost.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
        )}

        <div className={`${featuredPost.featured_image ? "absolute bottom-0 left-0 right-0" : ""} p-6 ${featuredPost.featured_image ? "text-white" : ""}`}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {display.showCategory && featuredPost.category && (
              <Badge
                variant="secondary"
                className={classNames?.categoryBadge}
              >
                {featuredPost.category}
              </Badge>
            )}

            {display.showDate && featuredPost.published_at && (
              <span className="text-sm">
                {formatDate(featuredPost.published_at)}
              </span>
            )}

            {display.showReadingTime && (
              <span className="text-sm">
                {formatReadingTime(getPostReadingTime(featuredPost), labels)}
              </span>
            )}
          </div>

          <h2 className={`text-4xl font-bold mb-3 ${classNames?.postTitle || ""}`}>
            <button
              onClick={() => handlePostClick(featuredPost)}
              className="text-left hover:underline focus:outline-none"
            >
              {featuredPost.title}
            </button>
          </h2>

          {display.showAuthor && featuredPost.author_info && (
            <p className="text-sm mb-3">
              {labels.by} {featuredPost.author_info.name}
            </p>
          )}

          {display.showExcerpt && (
            <p className={`text-lg mb-4 ${classNames?.postExcerpt || ""}`}>
              {getPostExcerpt(featuredPost, 200)}
            </p>
          )}

          {display.showTags && featuredPost.tags && featuredPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {featuredPost.tags.map((tag) => (
                <Badge key={tag} variant="outline" className={classNames?.tagBadge}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Button
            variant="default"
            onClick={() => handlePostClick(featuredPost)}
          >
            {labels.readMore} →
          </Button>
        </div>
      </div>

      {/* Remaining Posts Grid */}
      {remainingPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingPosts.map((post) => (
            <PostCard key={post.id} post={post} onClick={onPostClick} />
          ))}
        </div>
      )}
    </div>
  );
}
