"use client";

/**
 * Blog Component
 * Main public component for blog display
 *
 * @example
 * ```tsx
 * import { Blog } from 'm14i-blogging/public';
 *
 * export default function BlogPage() {
 *   return (
 *     <Blog
 *       basePath="/blog"
 *       display={{ layout: "grid", postsPerPage: 9 }}
 *       features={{
 *         search: true,
 *         categoryFilter: true,
 *         tagFilter: true,
 *         relatedPosts: true,
 *       }}
 *       components={{
 *         Button,
 *         Card,
 *         Badge,
 *         Input,
 *       }}
 *     />
 *   );
 * }
 * ```
 */

import { useEffect, useState } from "react";
import { BlogProvider } from "./context/BlogContext";
import { PostListView } from "./views/PostListView";
import { PostDetailView } from "./views/PostDetailView";
import { CategoryView } from "./views/CategoryView";
import { TagView } from "./views/TagView";
import { SearchView } from "./views/SearchView";
import { parseRoute, getCurrentPathname, getCurrentSearchParams } from "./utils/router";
import type { BlogProps } from "./types";

export function Blog(props: BlogProps) {
  const {
    apiBasePath = "/api/blog",
    apiClient,
    basePath = "/blog",
    components,
    display,
    defaultCategory,
    defaultTag,
    defaultSort,
    features,
    classNames,
    labels,
    onPostClick,
    onCategoryClick,
    onTagClick,
    onSearch,
    navigate,
  } = props;

  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== "undefined" && !navigate) {
      const pathname = getCurrentPathname() || "";
      const searchParams = getCurrentSearchParams() || new URLSearchParams();
      return parseRoute(pathname, basePath, searchParams);
    }
    return { view: "list" as const, params: { page: 1 } };
  });

  // Listen for route changes (only if not using custom navigate)
  useEffect(() => {
    if (navigate || typeof window === "undefined") {
      return;
    }

    function handleRouteChange(): void {
      const pathname = getCurrentPathname() || "";
      const searchParams = getCurrentSearchParams() || new URLSearchParams();
      const route = parseRoute(pathname, basePath, searchParams);
      setCurrentRoute(route);
    }

    handleRouteChange();
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, [basePath, navigate]);

  // Render appropriate view based on current route
  function renderView(): React.ReactElement {
    const { view, params = {} } = currentRoute;
    const { slug = "", category = "", tag = "", query = "", page = 1 } = params;

    switch (view) {
      case "detail":
        return <PostDetailView slug={slug} />;
      case "category":
        return <CategoryView category={category} page={page} />;
      case "tag":
        return <TagView tag={tag} page={page} />;
      case "search":
        return <SearchView query={query} page={page} />;
      default:
        return (
          <PostListView
            page={page}
            category={defaultCategory}
            tag={defaultTag}
          />
        );
    }
  }

  return (
    <BlogProvider
      apiBasePath={apiBasePath}
      apiClient={apiClient}
      basePath={basePath}
      display={display}
      features={features}
      labels={labels}
      classNames={classNames}
      components={components}
      defaultCategory={defaultCategory}
      defaultTag={defaultTag}
      defaultSort={defaultSort}
      onPostClick={onPostClick}
      onCategoryClick={onCategoryClick}
      onTagClick={onTagClick}
      onSearch={onSearch}
      navigate={navigate}
    >
      <div className="min-h-screen bg-background">
        {renderView()}
      </div>
    </BlogProvider>
  );
}
