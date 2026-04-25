/**
 * Internal Router Utilities
 * Handles path-based routing within Blog component
 */

import type { BlogView, BlogRoute } from "../types";

/**
 * Parse the current path to determine which view to show
 * Expects paths like:
 * - /blog → list
 * - /blog/category/[name] → category view
 * - /blog/tag/[name] → tag view
 * - /blog/search?q=[query] → search view
 * - /blog/[slug] → detail view (post)
 */
export function parseRoute(pathname: string, basePath: string, searchParams?: URLSearchParams): BlogRoute {
  // Remove basePath from pathname
  const relativePath = pathname.replace(basePath, "").replace(/^\//, "");

  // Root path → list view
  if (!relativePath || relativePath === "") {
    return {
      view: "list",
      params: {
        page: searchParams ? parseInt(searchParams.get("page") || "1", 10) : 1,
      },
    };
  }

  // Split path into segments
  const segments = relativePath.split("/");

  // /category/[name] → category view
  if (segments[0] === "category" && segments[1]) {
    return {
      view: "category",
      params: {
        category: decodeURIComponent(segments[1]),
        page: searchParams ? parseInt(searchParams.get("page") || "1", 10) : 1,
      },
    };
  }

  // /tag/[name] → tag view
  if (segments[0] === "tag" && segments[1]) {
    return {
      view: "tag",
      params: {
        tag: decodeURIComponent(segments[1]),
        page: searchParams ? parseInt(searchParams.get("page") || "1", 10) : 1,
      },
    };
  }

  // /search?q=[query] → search view
  if (segments[0] === "search") {
    return {
      view: "search",
      params: {
        query: searchParams?.get("q") || "",
        page: searchParams ? parseInt(searchParams.get("page") || "1", 10) : 1,
      },
    };
  }

  // /[slug] → detail view (post)
  return {
    view: "detail",
    params: {
      slug: decodeURIComponent(segments[0]),
    },
  };
}

/**
 * Build a path for navigation
 */
export function buildPath(
  basePath: string,
  view: BlogView,
  params?: { slug?: string; category?: string; tag?: string; query?: string; page?: number }
): string {
  const pageQuery = params?.page && params.page > 1 ? `?page=${params.page}` : "";

  switch (view) {
    case "list":
      return `${basePath}${pageQuery}`;
    case "detail":
      return `${basePath}/${params?.slug || ""}`;
    case "category":
      return `${basePath}/category/${encodeURIComponent(params?.category || "")}${pageQuery}`;
    case "tag":
      return `${basePath}/tag/${encodeURIComponent(params?.tag || "")}${pageQuery}`;
    case "search":
      const searchQuery = params?.query ? `q=${encodeURIComponent(params.query)}` : "";
      const searchPage = params?.page && params.page > 1 ? `&page=${params.page}` : "";
      return `${basePath}/search?${searchQuery}${searchPage}`;
    default:
      return basePath;
  }
}

/**
 * Check if we're on the client side
 */
export function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Get current pathname (client-side only)
 */
export function getCurrentPathname(): string | null {
  if (!isClient()) return null;
  return window.location.pathname;
}

/**
 * Get current search params (client-side only)
 */
export function getCurrentSearchParams(): URLSearchParams | null {
  if (!isClient()) return null;
  return new URLSearchParams(window.location.search);
}

/**
 * Navigate to a new path (client-side only)
 */
export function navigateTo(path: string): void {
  if (!isClient()) return;
  window.history.pushState({}, "", path);
  // Trigger a popstate event to update the UI
  window.dispatchEvent(new PopStateEvent("popstate"));
}

/**
 * Update search params without full navigation
 */
export function updateSearchParams(params: Record<string, string>): void {
  if (!isClient()) return;
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.pushState({}, "", url.toString());
  window.dispatchEvent(new PopStateEvent("popstate"));
}
