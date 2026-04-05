/**
 * Types for public Blog component
 */

import type { BlogPostRow } from "../types";
import type { ComponentType, ReactNode } from "react";

// ============================================================================
// Layout Types
// ============================================================================

export type BlogLayout = "grid" | "list" | "masonry" | "magazine";

export type BlogSortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc";

// ============================================================================
// View Types
// ============================================================================

export type BlogView = "list" | "detail" | "category" | "tag" | "search";

export interface BlogRoute {
  view: BlogView;
  params?: {
    slug?: string;
    category?: string;
    tag?: string;
    query?: string;
    page?: number;
  };
}

// ============================================================================
// Features
// ============================================================================

export interface BlogFeatures {
  search?: boolean;
  categoryFilter?: boolean;
  tagFilter?: boolean;
  relatedPosts?: boolean;
  readingTime?: boolean;
  shareButtons?: boolean;
  comments?: boolean;
}

// ============================================================================
// Display Options
// ============================================================================

export interface BlogDisplayOptions {
  layout?: BlogLayout;
  postsPerPage?: number;
  showFeaturedImage?: boolean;
  showExcerpt?: boolean;
  showReadingTime?: boolean;
  showAuthor?: boolean;
  showTags?: boolean;
  showCategory?: boolean;
  showDate?: boolean;
  relatedPostsCount?: number;
}

// ============================================================================
// Labels (i18n support)
// ============================================================================

export interface BlogLabels {
  // Navigation
  readMore?: string;
  backToBlog?: string;
  previous?: string;
  next?: string;
  page?: string;

  // Search & Filter
  search?: string;
  searchPlaceholder?: string;
  allCategories?: string;
  allTags?: string;
  filterByCategory?: string;
  filterByTag?: string;
  clear?: string;

  // Post metadata
  publishedOn?: string;
  by?: string;
  in?: string;
  readingTime?: string;
  minuteRead?: string;
  minutesRead?: string;

  // Related content
  relatedPosts?: string;
  moreIn?: string;

  // Messages
  noPostsFound?: string;
  noResults?: string;
  loading?: string;
  error?: string;

  // Share
  share?: string;
  copyLink?: string;
  linkCopied?: string;
}

// ============================================================================
// Components (shadcn/ui)
// ============================================================================

export interface BlogComponents {
  Button?: ComponentType<{
    variant?: string;
    size?: string;
    className?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    disabled?: boolean;
    children: ReactNode;
  }>;
  Card?: ComponentType<{ className?: string; children: ReactNode }>;
  CardContent?: ComponentType<{ className?: string; children: ReactNode }>;
  CardHeader?: ComponentType<{ className?: string; children: ReactNode }>;
  CardTitle?: ComponentType<{ className?: string; children: ReactNode }>;
  Badge?: ComponentType<{
    variant?: string;
    className?: string;
    onClick?: () => void;
    children: ReactNode;
  }>;
  Input?: ComponentType<any>;
  Select?: ComponentType<any>;
  SelectTrigger?: ComponentType<any>;
  SelectValue?: ComponentType<any>;
  SelectContent?: ComponentType<any>;
  SelectItem?: ComponentType<any>;
  Skeleton?: ComponentType<{ className?: string }>;
}

// ============================================================================
// Style Customization
// ============================================================================

export interface BlogClassNames {
  container?: string;
  header?: string;
  sidebar?: string;
  content?: string;
  postCard?: string;
  postTitle?: string;
  postMeta?: string;
  postExcerpt?: string;
  postImage?: string;
  postContent?: string;
  categoryBadge?: string;
  tagBadge?: string;
  pagination?: string;
  searchBox?: string;
}

// ============================================================================
// Blog Props
// ============================================================================

export interface BlogProps {
  /**
   * Base path for API calls (default: "/api/blog")
   * Blog will make requests to:
   * - GET {apiBasePath} (list posts)
   * - GET {apiBasePath}/slug/[slug] (get post by slug)
   * - GET {apiBasePath}/categories (list categories)
   * - GET {apiBasePath}/tags (list tags)
   */
  apiBasePath?: string;

  /**
   * Optional custom API client (for testing/Storybook/SSR)
   * Can be a Supabase client or custom fetch wrapper
   */
  apiClient?: any;

  /**
   * Base path for internal routing (default: "/blog")
   * Used for navigation between views
   */
  basePath?: string;

  /**
   * shadcn/ui components (optional, uses defaults if not provided)
   */
  components?: BlogComponents;

  /**
   * Display options
   */
  display?: BlogDisplayOptions;

  /**
   * Default filters
   */
  defaultCategory?: string;
  defaultTag?: string;
  defaultSort?: BlogSortOption;

  /**
   * Feature toggles
   */
  features?: BlogFeatures;

  /**
   * Style customization
   */
  classNames?: BlogClassNames;

  /**
   * Custom labels for i18n
   */
  labels?: BlogLabels;

  /**
   * Lifecycle callbacks
   */
  onPostClick?: (post: BlogPostRow) => void;
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
  onSearch?: (query: string) => void;

  /**
   * Custom navigation function (for Storybook/testing)
   */
  navigate?: (path: string) => void;
}

// ============================================================================
// Context State
// ============================================================================

export interface BlogState {
  view: BlogView;
  currentSlug?: string;
  currentCategory?: string;
  currentTag?: string;
  searchQuery?: string;
  currentPage: number;
  isLoading: boolean;
  error?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface PostListResponse {
  posts: BlogPostRow[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface CategoryWithCount {
  name: string;
  count: number;
}

export interface TagWithCount {
  name: string;
  count: number;
}
