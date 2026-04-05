"use client";

/**
 * TagView Component
 * View for displaying posts filtered by tag
 */

import { useBlogContext } from "../context/BlogContext";
import { PostListView } from "./PostListView";

export interface TagViewProps {
  tag: string;
  page?: number;
  className?: string;
}

/**
 * TagView for displaying posts by tag
 */
export function TagView({ tag, page = 1, className = "" }: TagViewProps) {
  const { labels, classNames, components } = useBlogContext();

  const Badge = components?.Badge || "span";

  return (
    <div className={className}>
      <div className={`container mx-auto px-4 pt-8 ${classNames?.container || ""}`}>
        <div className={`mb-6 ${classNames?.header || ""}`}>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {labels.filterByTag}:{" "}
            <Badge variant="default" className="text-xl py-1 px-3">
              {tag}
            </Badge>
          </h1>
        </div>
      </div>

      <PostListView page={page} tag={tag} />
    </div>
  );
}
