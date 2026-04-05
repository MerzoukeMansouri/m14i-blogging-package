"use client";

/**
 * TagCloud Component
 * Displays tags with post counts for filtering
 */

import { useBlogContext } from "../context/BlogContext";
import { useTags } from "../hooks/useTags";
import { buildPath, navigateTo } from "../utils/router";

export interface TagCloudProps {
  activeTag?: string;
  onTagClick?: (tag: string) => void;
  className?: string;
  maxTags?: number;
}

/**
 * TagCloud component for filtering posts by tag
 */
export function TagCloud({
  activeTag,
  onTagClick,
  className = "",
  maxTags = 20,
}: TagCloudProps) {
  const { basePath, labels, components, onTagClick: contextOnTagClick, navigate } = useBlogContext();
  const { tags, isLoading, error } = useTags();

  const { Badge = "span", Skeleton = "div" } = components || {};

  const handleTagClick = (tag: string) => {
    const callback = onTagClick || contextOnTagClick;
    if (callback) {
      callback(tag);
    } else {
      // Navigate to tag view
      const path = buildPath(basePath, "tag", { tag });
      if (navigate) {
        navigate(path);
      } else {
        navigateTo(path);
      }
    }
  };

  if (isLoading) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-6 w-16" />
        ))}
      </div>
    );
  }

  if (error || tags.length === 0) {
    return null;
  }

  const displayTags = tags.slice(0, maxTags);

  return (
    <div className={className}>
      <h3 className="font-semibold mb-3">{labels.filterByTag}</h3>

      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag) => (
          <Badge
            key={tag.name}
            variant={activeTag === tag.name ? "default" : "outline"}
            className="cursor-pointer hover:bg-accent"
            onClick={() => handleTagClick(tag.name)}
          >
            {tag.name} ({tag.count})
          </Badge>
        ))}
      </div>
    </div>
  );
}
