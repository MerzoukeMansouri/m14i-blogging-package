/**
 * Internal Router Utilities
 * Handles path-based routing within BlogAdmin
 */

import type { BlogAdminView, BlogAdminRoute } from "../types";

/**
 * Parse the current path to determine which view to show
 * Expects paths like:
 * - /admin/blog → list
 * - /admin/blog/new → create
 * - /admin/blog/edit/[id] → edit
 * - /admin/blog/preview/[slug] → preview
 */
export function parseRoute(pathname: string, basePath: string): BlogAdminRoute {
  // Remove basePath from pathname
  const relativePath = pathname.replace(basePath, "").replace(/^\//, "");

  // Root path → list view
  if (!relativePath || relativePath === "") {
    return { view: "list" };
  }

  // Split path into segments
  const segments = relativePath.split("/");

  // /new → create view
  if (segments[0] === "new") {
    return { view: "create" };
  }

  // /edit/[id] → edit view
  if (segments[0] === "edit" && segments[1]) {
    return {
      view: "edit",
      params: { id: segments[1] },
    };
  }

  // /preview/[slug] → preview view
  if (segments[0] === "preview" && segments[1]) {
    return {
      view: "preview",
      params: { slug: segments[1] },
    };
  }

  // Default to list view
  return { view: "list" };
}

/**
 * Build a path for navigation
 */
export function buildPath(basePath: string, view: BlogAdminView, params?: { id?: string; slug?: string }): string {
  switch (view) {
    case "list":
      return basePath;
    case "create":
      return `${basePath}/new`;
    case "edit":
      return `${basePath}/edit/${params?.id || ""}`;
    case "preview":
      return `${basePath}/preview/${params?.slug || ""}`;
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
 * Navigate to a new path (client-side only)
 */
export function navigateTo(path: string): void {
  if (!isClient()) return;
  window.history.pushState({}, "", path);
  // Trigger a popstate event to update the UI
  window.dispatchEvent(new PopStateEvent("popstate"));
}
