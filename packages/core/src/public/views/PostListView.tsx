"use client";

/**
 * PostListView Component
 * Main view for displaying a list of blog posts
 */

import { useMemo } from "react";
import { useBlogContext } from "../context/BlogContext";
import { usePosts } from "../hooks/usePosts";
import { Sidebar } from "../components/Sidebar";
import { Pagination } from "../components/Pagination";
import { GridLayout } from "../components/layouts/GridLayout";
import { ListLayout } from "../components/layouts/ListLayout";
import { MasonryLayout } from "../components/layouts/MasonryLayout";
import { MagazineLayout } from "../components/layouts/MagazineLayout";
import { updateSearchParams } from "../utils/router";

export interface PostListViewProps {
  page?: number;
  category?: string;
  tag?: string;
  className?: string;
}

/**
 * PostListView for displaying paginated posts
 */
export function PostListView({
  page = 1,
  category,
  tag,
  className = "",
}: PostListViewProps) {
  const { display, labels, classNames } = useBlogContext();

  const { posts, total, pageSize, hasMore, isLoading, error } = usePosts({
    page,
    category,
    tag,
  });

  const totalPages = useMemo(() => {
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage.toString() });
  };

  const handleSearch = (query: string) => {
    updateSearchParams({ page: "1", q: query });
  };

  const handleCategoryClick = (selectedCategory: string) => {
    updateSearchParams({ page: "1", category: selectedCategory });
  };

  const handleTagClick = (selectedTag: string) => {
    updateSearchParams({ page: "1", tag: selectedTag });
  };

  // Select layout component
  const LayoutComponent = useMemo(() => {
    const layouts = {
      list: ListLayout,
      masonry: MasonryLayout,
      magazine: MagazineLayout,
      grid: GridLayout,
    };
    return layouts[display.layout] || GridLayout;
  }, [display.layout]);

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-red-500">{labels.error}</p>
        <p className="text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${classNames?.container || ""} ${className}`}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <main className="flex-1">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{labels.loading}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{labels.noPostsFound}</p>
            </div>
          ) : (
            <>
              <LayoutComponent posts={posts} />

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </main>

        {/* Sidebar */}
        <Sidebar
          activeCategory={category}
          activeTag={tag}
          onSearch={handleSearch}
          onCategoryClick={handleCategoryClick}
          onTagClick={handleTagClick}
          className="lg:w-80"
        />
      </div>
    </div>
  );
}
