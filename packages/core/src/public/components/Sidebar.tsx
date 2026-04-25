"use client";

/**
 * Sidebar Component
 * Combined sidebar with search, categories, and tags
 */

import { useBlogContext } from "../context/BlogContext";
import { SearchBox } from "./SearchBox";
import { CategoryFilter } from "./CategoryFilter";
import { TagCloud } from "./TagCloud";

export interface SidebarProps {
  activeCategory?: string;
  activeTag?: string;
  onSearch?: (query: string) => void;
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
  className?: string;
}

/**
 * Sidebar component with search and filters
 */
export function Sidebar({
  activeCategory,
  activeTag,
  onSearch,
  onCategoryClick,
  onTagClick,
  className = "",
}: SidebarProps) {
  const { features, classNames, components } = useBlogContext();

  const { Card = "div", CardContent = "div" } = components || {};

  const sidebarSections = [
    {
      enabled: features.search,
      content: <SearchBox onSearch={onSearch} />,
    },
    {
      enabled: features.categoryFilter,
      content: (
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryClick={onCategoryClick}
        />
      ),
    },
    {
      enabled: features.tagFilter,
      content: <TagCloud activeTag={activeTag} onTagClick={onTagClick} />,
    },
  ];

  return (
    <aside className={`space-y-6 ${classNames?.sidebar || ""} ${className}`}>
      {sidebarSections
        .filter((section) => section.enabled)
        .map((section, index) => (
          <Card key={index}>
            <CardContent className="pt-6">{section.content}</CardContent>
          </Card>
        ))}
    </aside>
  );
}
