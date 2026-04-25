"use client";

/**
 * GridLayout Component
 * Displays posts in a responsive grid layout
 */

import type { BlogPostRow } from "../../../types";
import { PostCard } from "../PostCard";
import { useBlogContext } from "../../context/BlogContext";

export interface GridLayoutProps {
  posts: BlogPostRow[];
  onPostClick?: (post: BlogPostRow) => void;
  className?: string;
}

/**
 * Grid layout for displaying posts
 */
export function GridLayout({ posts, onPostClick, className = "" }: GridLayoutProps) {
  const { classNames } = useBlogContext();

  if (posts.length === 0) {
    return null;
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
        classNames?.content || ""
      } ${className}`}
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onClick={onPostClick} />
      ))}
    </div>
  );
}
