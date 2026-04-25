"use client";

/**
 * MasonryLayout Component
 * Displays posts in a Pinterest-style masonry layout with variable heights
 */

import type { BlogPostRow } from "../../../types";
import { PostCard } from "../PostCard";
import { useBlogContext } from "../../context/BlogContext";

export interface MasonryLayoutProps {
  posts: BlogPostRow[];
  onPostClick?: (post: BlogPostRow) => void;
  className?: string;
}

/**
 * Masonry layout for displaying posts
 * Uses CSS columns for a Pinterest-style layout
 */
export function MasonryLayout({ posts, onPostClick, className = "" }: MasonryLayoutProps) {
  const { classNames } = useBlogContext();

  if (posts.length === 0) {
    return null;
  }

  return (
    <div
      className={`columns-1 md:columns-2 lg:columns-3 gap-6 ${
        classNames?.content || ""
      } ${className}`}
      style={{ columnFill: "balance" }}
    >
      {posts.map((post) => (
        <div key={post.id} className="break-inside-avoid mb-6">
          <PostCard post={post} onClick={onPostClick} />
        </div>
      ))}
    </div>
  );
}
