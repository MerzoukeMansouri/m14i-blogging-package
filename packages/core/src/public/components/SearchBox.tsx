"use client";

/**
 * SearchBox Component
 * Search input for filtering blog posts
 */

import { useState, useCallback } from "react";
import { useBlogContext } from "../context/BlogContext";
import { buildPath, navigateTo } from "../utils/router";

export interface SearchBoxProps {
  initialValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

/**
 * SearchBox component for searching posts
 */
export function SearchBox({ initialValue = "", onSearch, className = "" }: SearchBoxProps) {
  const { basePath, labels, classNames, components, onSearch: contextOnSearch, navigate } = useBlogContext();
  const [query, setQuery] = useState(initialValue);

  const { Input = "input", Button = "button" } = components || {};

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const callback = onSearch || contextOnSearch;
      if (callback) {
        callback(query);
      } else if (query.trim()) {
        // Navigate to search view
        const path = buildPath(basePath, "search", { query: query.trim() });
        if (navigate) {
          navigate(path);
        } else {
          navigateTo(path);
        }
      }
    },
    [query, onSearch, contextOnSearch, basePath, navigate]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    const callback = onSearch || contextOnSearch;
    if (callback) {
      callback("");
    }
  }, [onSearch, contextOnSearch]);

  return (
    <form
      onSubmit={handleSearch}
      className={`flex gap-2 ${classNames?.searchBox || ""} ${className}`}
    >
      <Input
        type="search"
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        placeholder={labels.searchPlaceholder}
        className="flex-1"
      />

      <Button type="submit" variant="default">
        {labels.search}
      </Button>

      {query && (
        <Button type="button" variant="outline" onClick={handleClear}>
          {labels.clear}
        </Button>
      )}
    </form>
  );
}
