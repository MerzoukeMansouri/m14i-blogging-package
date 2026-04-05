"use client";

/**
 * CategoryView Component
 * View for displaying posts filtered by category
 */

import { useBlogContext } from "../context/BlogContext";
import { PostListView } from "./PostListView";

export interface CategoryViewProps {
  category: string;
  page?: number;
  className?: string;
}

/**
 * CategoryView for displaying posts by category
 */
export function CategoryView({ category, page = 1, className = "" }: CategoryViewProps) {
  const { labels, classNames } = useBlogContext();

  return (
    <div className={className}>
      <div className={`container mx-auto px-4 pt-8 ${classNames?.container || ""}`}>
        <div className={`mb-6 ${classNames?.header || ""}`}>
          <h1 className="text-3xl font-bold">
            {labels.in} <span className="text-primary">{category}</span>
          </h1>
        </div>
      </div>

      <PostListView page={page} category={category} />
    </div>
  );
}
