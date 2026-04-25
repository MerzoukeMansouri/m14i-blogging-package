"use client";

/**
 * CategoryFilter Component
 * Displays categories with post counts for filtering
 */

import { useBlogContext } from "../context/BlogContext";
import { useCategories } from "../hooks/useCategories";
import { buildPath, navigateTo } from "../utils/router";

export interface CategoryFilterProps {
  activeCategory?: string;
  onCategoryClick?: (category: string) => void;
  className?: string;
}

/**
 * CategoryFilter component for filtering posts by category
 */
export function CategoryFilter({
  activeCategory,
  onCategoryClick,
  className = "",
}: CategoryFilterProps) {
  const { basePath, labels, components, onCategoryClick: contextOnCategoryClick, navigate } = useBlogContext();
  const { categories, isLoading, error } = useCategories();

  const { Button = "button", Skeleton = "div" } = components || {};

  const handleCategoryClick = (category: string) => {
    const callback = onCategoryClick || contextOnCategoryClick;
    if (callback) {
      callback(category);
    } else {
      // Navigate to category view
      const path = buildPath(basePath, "category", { category });
      if (navigate) {
        navigate(path);
      } else {
        navigateTo(path);
      }
    }
  };

  const handleAllClick = () => {
    const path = buildPath(basePath, "list");
    if (navigate) {
      navigate(path);
    } else {
      navigateTo(path);
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (error || categories.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="font-semibold mb-3">{labels.filterByCategory}</h3>

      <Button
        variant={!activeCategory ? "default" : "ghost"}
        size="sm"
        onClick={handleAllClick}
        className="w-full justify-start"
      >
        {labels.allCategories}
      </Button>

      {categories.map((category) => (
        <Button
          key={category.name}
          variant={activeCategory === category.name ? "default" : "ghost"}
          size="sm"
          onClick={() => handleCategoryClick(category.name)}
          className="w-full justify-between"
        >
          <span>{category.name}</span>
          <span className="text-xs text-muted-foreground">({category.count})</span>
        </Button>
      ))}
    </div>
  );
}
