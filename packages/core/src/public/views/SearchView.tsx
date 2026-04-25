"use client";

/**
 * SearchView Component
 * View for displaying search results
 */

import { useMemo } from "react";
import { useBlogContext } from "../context/BlogContext";
import { usePosts } from "../hooks/usePosts";
import { SearchBox } from "../components/SearchBox";
import { Pagination } from "../components/Pagination";
import { GridLayout } from "../components/layouts/GridLayout";
import { updateSearchParams } from "../utils/router";

export interface SearchViewProps {
  query: string;
  page?: number;
  className?: string;
}

/**
 * SearchView for displaying search results
 */
export function SearchView({ query, page = 1, className = "" }: SearchViewProps) {
  const { labels, classNames } = useBlogContext();

  const { posts, total, pageSize, isLoading, error } = usePosts({
    page,
    search: query,
  });

  const totalPages = useMemo(() => {
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  const handlePageChange = (newPage: number) => {
    updateSearchParams({ page: newPage.toString() });
  };

  const handleSearch = (newQuery: string) => {
    updateSearchParams({ page: "1", q: newQuery });
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${classNames?.container || ""} ${className}`}>
      {/* Search Header */}
      <div className={`mb-8 ${classNames?.header || ""}`}>
        <h1 className="text-3xl font-bold mb-4">
          {labels.search}
          {query && (
            <>
              : <span className="text-primary">&quot;{query}&quot;</span>
            </>
          )}
        </h1>

        <div className="max-w-2xl">
          <SearchBox initialValue={query} onSearch={handleSearch} />
        </div>

        {!isLoading && (
          <p className="mt-4 text-muted-foreground">
            {total} {total === 1 ? "résultat trouvé" : "résultats trouvés"}
          </p>
        )}
      </div>

      {/* Search Results */}
      {error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{labels.error}</p>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{labels.loading}</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {query ? labels.noResults : labels.noPostsFound}
          </p>
        </div>
      ) : (
        <>
          <GridLayout posts={posts} />

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
    </div>
  );
}
