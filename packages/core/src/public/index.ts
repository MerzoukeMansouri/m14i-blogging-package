/**
 * m14i-blogging Public Module
 * Public-facing blog components and utilities
 *
 * @example
 * ```typescript
 * import { Blog } from 'm14i-blogging/public';
 *
 * // Quick integration
 * <Blog basePath="/blog" />
 *
 * // Custom layout
 * import { BlogProvider, PostListView, Sidebar } from 'm14i-blogging/public';
 *
 * <BlogProvider basePath="/blog">
 *   <div className="flex gap-8">
 *     <PostListView />
 *     <Sidebar />
 *   </div>
 * </BlogProvider>
 * ```
 */

// ============================================================================
// Main Component
// ============================================================================

export { Blog } from "./Blog";

// ============================================================================
// Views (for custom routing)
// ============================================================================

export { PostListView } from "./views/PostListView";
export { PostDetailView } from "./views/PostDetailView";
export { CategoryView } from "./views/CategoryView";
export { TagView } from "./views/TagView";
export { SearchView } from "./views/SearchView";

// ============================================================================
// Components (for custom layouts)
// ============================================================================

export { PostCard } from "./components/PostCard";
export { Sidebar } from "./components/Sidebar";
export { Pagination } from "./components/Pagination";
export { SearchBox } from "./components/SearchBox";
export { CategoryFilter } from "./components/CategoryFilter";
export { TagCloud } from "./components/TagCloud";

// Layout Components
export { GridLayout } from "./components/layouts/GridLayout";
export { ListLayout } from "./components/layouts/ListLayout";
export { MasonryLayout } from "./components/layouts/MasonryLayout";
export { MagazineLayout } from "./components/layouts/MagazineLayout";

// ============================================================================
// Hooks
// ============================================================================

export { usePosts } from "./hooks/usePosts";
export { usePost } from "./hooks/usePost";
export { useCategories } from "./hooks/useCategories";
export { useTags } from "./hooks/useTags";
export { useSearch } from "./hooks/useSearch";
export { useRelatedPosts } from "./hooks/useRelatedPosts";

// ============================================================================
// Context
// ============================================================================

export { BlogProvider, useBlogContext } from "./context/BlogContext";

// ============================================================================
// Utilities
// ============================================================================

export {
  parseRoute,
  buildPath,
  navigateTo,
  updateSearchParams,
  isClient,
  getCurrentPathname,
  getCurrentSearchParams,
} from "./utils/router";

export {
  formatDate,
  formatRelativeDate,
  calculateReadingTime,
  getPostReadingTime,
  formatReadingTime,
  truncateText,
  getPostExcerpt,
  slugify,
  pluralize,
  formatNumber,
} from "./utils/formatting";

// ============================================================================
// Types
// ============================================================================

export type {
  BlogProps,
  BlogLayout,
  BlogSortOption,
  BlogView,
  BlogRoute,
  BlogFeatures,
  BlogDisplayOptions,
  BlogLabels,
  BlogComponents,
  BlogClassNames,
  BlogState,
  PostListResponse,
  CategoryWithCount,
  TagWithCount,
} from "./types";

export type { BlogProviderProps, BlogContextValue } from "./context/BlogContext";
export type { UsePostsParams, UsePostsReturn } from "./hooks/usePosts";
export type { UsePostReturn } from "./hooks/usePost";
export type { UseCategoriesReturn } from "./hooks/useCategories";
export type { UseTagsReturn } from "./hooks/useTags";
export type { UseSearchReturn } from "./hooks/useSearch";
export type { UseRelatedPostsReturn } from "./hooks/useRelatedPosts";
