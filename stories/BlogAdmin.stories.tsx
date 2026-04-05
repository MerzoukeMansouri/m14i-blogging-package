import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { BlogAdminWrapper } from "./mocks/BlogAdminWrapper";
import { BlogBuilder } from "../src/components/BlogBuilder";
import * as ShadcnComponents from "./mocks/shadcn-components";
import { MockBlogAdminAPIClient } from "./mocks/blog-admin-api";

const meta: Meta<typeof BlogAdminWrapper> = {
  title: "Admin/BlogAdmin",
  component: BlogAdminWrapper,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# BlogAdmin Component

Complete, drop-in blog administration interface for managing posts, categories, and tags.

## 🎮 Interactive Stories

**These stories are fully interactive!** Each story includes a **yellow navigation toolbar** at the top for switching between views:

- **List** → View all posts
- **New Post** → Create a new post
- **Edit Post 1** → Edit an existing post

Within each view, you can:
- ✅ Fill out forms and edit content
- ✅ Use BlogBuilder to drag and drop content blocks
- ✅ Create categories and tags via dialogs
- ✅ Filter and search through posts
- ✅ Delete posts with confirmation
- ✅ Interact with all UI elements

**Note:** Use the yellow toolbar to navigate between views within Storybook.

## Features

- ✅ **Complete CRUD** - Posts, categories, tags
- ✅ **Rich Editor** - Drag-and-drop BlogBuilder integration
- ✅ **Live Preview** - Opens in dialog with sessionStorage
- ✅ **Auto-save** - 3-second debounce to sessionStorage
- ✅ **Inline Creation** - Create categories/tags without leaving editor
- ✅ **SEO Fields** - Meta title, description, OG tags
- ✅ **Filtering** - Status, category, search
- ✅ **Pagination** - Handle large datasets
- ✅ **Access Control** - isAllowed prop for security

## Usage

\`\`\`tsx
import { BlogAdmin } from 'm14i-blogging/admin';
import { BlogBuilder } from 'm14i-blogging';

export default function AdminPage() {
  const user = useUser();

  return (
    <BlogAdmin
      isAllowed={user?.role === 'admin'}
      currentUser={user}
      components={{ BlogBuilder, Button, Input, Card, Badge }}
    />
  );
}
\`\`\`

## Setup

1. Create API routes (see documentation)
2. Pass \`isAllowed\` prop for access control
3. Customize with your shadcn/ui components
4. Optional: Add callbacks for lifecycle events

## Storybook Navigation

Each story includes a yellow toolbar at the top with:
- Quick navigation buttons
- Current route display
- Current post ID/slug (when applicable)

This toolbar is **Storybook-only** - it doesn't appear in production.
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", overflow: "auto" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BlogAdminWrapper>;

// Create mock API client instance
const mockApiClient = new MockBlogAdminAPIClient();

/**
 * Default BlogAdmin with full access and all features enabled.
 * This is the standard admin interface with posts list as the landing page.
 *
 * **How to use:**
 * - Use the **yellow toolbar** at the top to navigate between views
 * - In List view: filter, search, delete posts
 * - In New Post/Edit: use BlogBuilder to create content, add categories/tags
 * - Try creating categories and tags via the "+ Nouvelle catégorie" buttons
 */
export const Default: Story = {
  render: () => (
    <BlogAdminWrapper
      isAllowed={true}
      currentUser={{
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
      }}
      apiClient={mockApiClient}
      components={{
        ...ShadcnComponents,
        BlogBuilder,
      }}
    />
  ),
};

/**
 * Access denied state when user doesn't have permission.
 * Shows a polite message with access denied UI.
 */
export const AccessDenied: Story = {
  render: () => (
    <BlogAdminWrapper
      isAllowed={false}
      apiClient={mockApiClient}
      components={{
        ...ShadcnComponents,
        BlogBuilder,
      }}
    />
  ),
};

/**
 * English labels instead of default French.
 * Demonstrates complete i18n customization.
 *
 * **Try it:** Use the toolbar to navigate and observe all labels in English.
 */
export const EnglishLabels: Story = {
  render: () => (
    <BlogAdminWrapper
      isAllowed={true}
      currentUser={{
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
      }}
      apiClient={mockApiClient}
      labels={{
        newPost: "New Post",
        saveDraft: "Save Draft",
        publish: "Publish",
        posts: "Posts",
        category: "Category",
        tags: "Tags",
        title: "Title",
        slug: "Slug",
        excerpt: "Excerpt",
        featuredImage: "Featured Image",
        seo: "SEO",
        taxonomy: "Taxonomy",
        newCategory: "New Category",
        newTag: "New Tag",
        search: "Search",
        loading: "Loading...",
        saving: "Saving...",
        edit: "Edit",
        delete: "Delete",
        preview: "Preview",
        back: "Back",
        cancel: "Cancel",
        create: "Create",
        confirmDelete: "Are you sure you want to delete this item?",
        noPosts: "No posts found",
        noCategories: "No categories available",
        noTags: "No tags available",
        untitled: "Untitled",
        draft: "Draft",
        published: "Published",
        archived: "Archived",
        allStatus: "All statuses",
        allCategories: "All categories",
        titlePlaceholder: "Enter post title",
        excerptPlaceholder: "Brief summary of the post",
        searchTags: "Search tags...",
        previous: "Previous",
        next: "Next",
        date: "Date",
        actions: "Actions",
      }}
      components={{
        ...ShadcnComponents,
        BlogBuilder,
      }}
    />
  ),
};

/**
 * Minimal features - only basic post editing without categories, tags, or SEO.
 * Useful for simple blog setups.
 *
 * **Try it:** Click "New Post" in the toolbar and notice the simplified sidebar.
 */
export const MinimalFeatures: Story = {
  render: () => (
    <BlogAdminWrapper
      isAllowed={true}
      currentUser={{
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
      }}
      apiClient={mockApiClient}
      features={{
        categories: false,
        tags: false,
        seo: false,
        autoSave: true,
        preview: true,
        featuredImage: false,
      }}
      components={{
        ...ShadcnComponents,
        BlogBuilder,
      }}
    />
  ),
};

/**
 * With lifecycle callbacks for tracking events.
 * Demonstrates integration with analytics, notifications, etc.
 *
 * **Try it:**
 * 1. Click "New Post" in toolbar
 * 2. Fill in title and content
 * 3. Click "Publier" to see the alert
 * 4. Check browser console for detailed logs
 */
export const WithCallbacks: Story = {
  render: () => (
    <BlogAdminWrapper
      isAllowed={true}
      currentUser={{
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
      }}
      apiClient={mockApiClient}
      onPostCreate={(post) => {
        console.log("✅ Post created:", post);
        alert(`Post created: ${post.title}`);
      }}
      onPostUpdate={(post) => {
        console.log("✏️ Post updated:", post);
        alert(`Post updated: ${post.title}`);
      }}
      onPostDelete={(id) => {
        console.log("🗑️ Post deleted:", id);
        alert(`Post deleted: ${id}`);
      }}
      onPublish={(post) => {
        console.log("🚀 Post published:", post);
        alert(`Post published: ${post.title}`);
      }}
      components={{
        ...ShadcnComponents,
        BlogBuilder,
      }}
    />
  ),
};

/**
 * Dark theme with custom colors.
 * Shows theming capabilities (requires Tailwind dark mode setup).
 */
export const DarkTheme: Story = {
  render: () => (
    <div className="dark" style={{ minHeight: "100vh" }}>
      <BlogAdminWrapper
        isAllowed={true}
        currentUser={{
          id: "user-1",
          name: "John Doe",
          email: "john@example.com",
        }}
        apiClient={mockApiClient}
        theme="dark"
        components={{
          ...ShadcnComponents,
          BlogBuilder,
        }}
      />
    </div>
  ),
};

/**
 * Preview-only mode - no categories/tags, just content editing and preview.
 * Perfect for writers focused on content creation.
 *
 * **Try it:** Click "New Post" and notice the custom French labels ("Nouvelle histoire") and simplified interface.
 */
export const ContentCreatorMode: Story = {
  render: () => (
    <BlogAdminWrapper
      isAllowed={true}
      currentUser={{
        id: "user-1",
        name: "Jane Writer",
        email: "jane@example.com",
      }}
      apiClient={mockApiClient}
      features={{
        categories: false,
        tags: false,
        seo: false,
        autoSave: true,
        preview: true,
        featuredImage: true,
      }}
      labels={{
        newPost: "Nouvelle histoire",
        saveDraft: "Sauvegarder",
        publish: "Publier",
        posts: "Mes histoires",
        titlePlaceholder: "Donnez un titre à votre histoire",
      }}
      components={{
        ...ShadcnComponents,
        BlogBuilder,
      }}
    />
  ),
};

/**
 * Editor View - Direct access to post creation.
 * Opens directly in the editor with BlogBuilder ready.
 *
 * **Try it:** Start creating content immediately with drag-and-drop blocks.
 */
export const DirectToEditor: Story = {
  render: () => (
    <BlogAdminWrapper
      isAllowed={true}
      currentUser={{
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
      }}
      apiClient={mockApiClient}
      initialRoute={{ view: "create" }}
      components={{
        ...ShadcnComponents,
        BlogBuilder,
      }}
    />
  ),
};

/**
 * Edit Existing Post - Opens directly in edit mode.
 * Shows how the editor looks when editing an existing post.
 *
 * **Try it:** Edit the "Getting Started with React" post.
 */
export const EditExistingPost: Story = {
  render: () => (
    <BlogAdminWrapper
      isAllowed={true}
      currentUser={{
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
      }}
      apiClient={mockApiClient}
      initialRoute={{ view: "edit", params: { id: "post-1" } }}
      components={{
        ...ShadcnComponents,
        BlogBuilder,
      }}
    />
  ),
};
