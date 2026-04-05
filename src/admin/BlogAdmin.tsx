"use client";

/**
 * BlogAdmin Component
 * Main admin component for blog management
 *
 * @example
 * ```tsx
 * import { BlogAdmin } from '@m14i/m14i-blogging/admin';
 *
 * export default function AdminPage() {
 *   const user = useUser(); // Your auth system
 *
 *   return (
 *     <BlogAdmin
 *       isAllowed={user?.role === 'admin'}
 *       currentUser={user}
 *       basePath="/admin/blog"
 *       components={{
 *         Button,
 *         Input,
 *         Card,
 *         Badge,
 *         Select,
 *         Dialog,
 *         BlogBuilder,
 *       }}
 *     />
 *   );
 * }
 * ```
 */

import { useEffect, useState } from "react";
import { BlogAdminProvider } from "./context/BlogAdminContext";
import { BlogAdminAPIClient } from "./api/client";
import { AccessDenied } from "./components/AccessDenied";
import { ListView } from "./views/ListView";
import { EditorView } from "./views/EditorView";
import { PreviewView } from "./views/PreviewView";
import { parseRoute } from "./utils/router";
import type { BlogAdminProps } from "./types";

export function BlogAdmin(props: BlogAdminProps) {
  const {
    apiBasePath = "/api/blog",
    apiClient: customApiClient,
    isAllowed,
    currentUser,
    basePath = "/admin/blog",
    theme,
    colors,
    features,
    components,
    onPostCreate,
    onPostUpdate,
    onPostDelete,
    onPublish,
    labels,
  } = props;

  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== "undefined") {
      return parseRoute(window.location.pathname, basePath);
    }
    return { view: "list" as const };
  });

  // Listen for route changes
  useEffect(() => {
    function handleRouteChange(): void {
      const route = parseRoute(window.location.pathname, basePath);
      setCurrentRoute(route);
    }

    // Initial route parse
    handleRouteChange();

    // Listen for browser navigation
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [basePath]);

  // Create API client (use custom one for testing/Storybook if provided)
  const apiClient = customApiClient || new BlogAdminAPIClient(apiBasePath);

  // Access control
  if (!isAllowed) {
    return (
      <BlogAdminProvider
        apiClient={apiClient}
        currentUser={currentUser}
        basePath={basePath}
        theme={theme}
        colors={colors}
        features={features}
        components={components}
        onPostCreate={onPostCreate}
        onPostUpdate={onPostUpdate}
        onPostDelete={onPostDelete}
        onPublish={onPublish}
        labels={labels}
      >
        <AccessDenied />
      </BlogAdminProvider>
    );
  }

  // Render appropriate view based on current route
  function renderView(): React.ReactElement {
    switch (currentRoute.view) {
      case "list":
        return <ListView />;

      case "create":
        return <EditorView />;

      case "edit":
        return <EditorView postId={currentRoute.params?.id} />;

      case "preview":
        return <PreviewView slug={currentRoute.params?.slug || "draft"} />;

      default:
        return <ListView />;
    }
  }

  return (
    <BlogAdminProvider
      apiClient={apiClient}
      currentUser={currentUser}
      basePath={basePath}
      theme={theme}
      colors={colors}
      features={features}
      components={components}
      onPostCreate={onPostCreate}
      onPostUpdate={onPostUpdate}
      onPostDelete={onPostDelete}
      onPublish={onPublish}
      labels={labels}
    >
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {renderView()}
        </div>
      </div>
    </BlogAdminProvider>
  );
}

// Export types for developer convenience
export type { BlogAdminProps } from "./types";
export { BlogAdminAPIClient } from "./api/client";
