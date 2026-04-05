/**
 * BlogAdmin Wrapper for Storybook
 * Provides internal routing using toolbar-based navigation
 * Navigation is controlled via the yellow toolbar at the top of each story
 */

import React, { useState } from "react";
import { BlogAdminProvider } from "../../src/admin/context/BlogAdminContext";
import { ListView } from "../../src/admin/views/ListView";
import { EditorView } from "../../src/admin/views/EditorView";
import { PreviewView } from "../../src/admin/views/PreviewView";
import { AccessDenied } from "../../src/admin/components/AccessDenied";
import type { BlogAdminProps } from "../../src/admin/types";
import { MockBlogAdminAPIClient } from "./blog-admin-api";

export type StorybookRoute = {
  view: "list" | "create" | "edit" | "preview";
  params?: {
    id?: string;
    slug?: string;
  };
};

interface BlogAdminWrapperProps extends Omit<BlogAdminProps, "apiBasePath"> {
  initialRoute?: StorybookRoute;
  apiClient?: MockBlogAdminAPIClient;
}

export function BlogAdminWrapper({
  isAllowed,
  currentUser,
  theme,
  colors,
  features,
  components,
  onPostCreate,
  onPostUpdate,
  onPostDelete,
  onPublish,
  labels,
  initialRoute = { view: "list" },
  apiClient,
}: BlogAdminWrapperProps) {
  const [currentRoute, setCurrentRoute] = useState<StorybookRoute>(initialRoute);
  const mockApiClient = apiClient || new MockBlogAdminAPIClient();

  // Custom navigate function for Storybook
  const navigate = (path: string) => {
    // Parse the path to determine view and params
    const pathParts = path.split('/').filter(Boolean);

    // Handle /admin/blog paths
    if (pathParts.length >= 2 && pathParts[0] === 'admin' && pathParts[1] === 'blog') {
      const action = pathParts[2];

      if (!action || action === 'list') {
        setCurrentRoute({ view: 'list' });
      } else if (action === 'create' || action === 'new') {
        setCurrentRoute({ view: 'create' });
      } else if (action === 'edit') {
        // Extract ID from query string or next segment
        const idMatch = path.match(/[?&]id=([^&]+)/);
        const id = idMatch ? idMatch[1] : pathParts[3];
        setCurrentRoute({ view: 'edit', params: { id } });
      } else if (action === 'preview') {
        // Extract slug from query string or next segment
        const slugMatch = path.match(/[?&]slug=([^&]+)/);
        const slug = slugMatch ? slugMatch[1] : pathParts[3];
        setCurrentRoute({ view: 'preview', params: { slug } });
      }
    }
  };

  // Render appropriate view
  const renderView = () => {
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
  };

  // Access control
  if (!isAllowed) {
    return (
      <BlogAdminProvider
        apiClient={mockApiClient}
        currentUser={currentUser}
        basePath="/admin/blog"
        theme={theme}
        colors={colors}
        features={features}
        components={components}
        onPostCreate={onPostCreate}
        onPostUpdate={onPostUpdate}
        onPostDelete={onPostDelete}
        onPublish={onPublish}
        labels={labels}
        navigate={navigate}
      >
        <AccessDenied />
      </BlogAdminProvider>
    );
  }

  return (
    <BlogAdminProvider
      apiClient={mockApiClient}
      currentUser={currentUser}
      basePath="/admin/blog"
      theme={theme}
      colors={colors}
      features={features}
      components={components}
      onPostCreate={onPostCreate}
      onPostUpdate={onPostUpdate}
      onPostDelete={onPostDelete}
      onPublish={onPublish}
      labels={labels}
      navigate={navigate}
    >
      <div className="min-h-screen bg-background">
        {/* Navigation helper buttons for Storybook */}
        <div className="sticky top-0 z-50 bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-xs">
          <span className="font-semibold text-yellow-900 mr-3">Storybook Navigation:</span>
          <button
            onClick={() => setCurrentRoute({ view: "list" })}
            className="mr-2 px-2 py-1 bg-white border rounded hover:bg-gray-50"
          >
            List
          </button>
          <button
            onClick={() => setCurrentRoute({ view: "create" })}
            className="mr-2 px-2 py-1 bg-white border rounded hover:bg-gray-50"
          >
            New Post
          </button>
          <button
            onClick={() => setCurrentRoute({ view: "edit", params: { id: "post-1" } })}
            className="mr-2 px-2 py-1 bg-white border rounded hover:bg-gray-50"
          >
            Edit Post 1
          </button>
          <span className="ml-4 text-yellow-800">
            Current: <strong>{currentRoute.view}</strong>
            {currentRoute.params?.id && ` (ID: ${currentRoute.params.id})`}
            {currentRoute.params?.slug && ` (Slug: ${currentRoute.params.slug})`}
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">{renderView()}</div>
      </div>
    </BlogAdminProvider>
  );
}
