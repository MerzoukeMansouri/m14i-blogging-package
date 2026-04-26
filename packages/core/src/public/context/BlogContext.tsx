"use client";

/**
 * BlogContext
 * Provides state and configuration to all public Blog components
 */

import { createContext, useContext, ReactNode, useMemo } from "react";
import type {
  BlogFeatures,
  BlogLabels,
  BlogComponents,
  BlogDisplayOptions,
  BlogClassNames,
  BlogSortOption,
  BlogPostRow,
} from "../types";

// ============================================================================
// Context Types
// ============================================================================

export interface BlogContextValue {
  // API Configuration
  apiBasePath: string;
  apiClient?: any;

  // Configuration
  basePath: string;
  display: Required<BlogDisplayOptions>;
  features: Required<BlogFeatures>;
  labels: Required<BlogLabels>;
  classNames?: BlogClassNames;
  components?: BlogComponents;

  // Default filters
  defaultCategory?: string;
  defaultTag?: string;
  defaultSort: BlogSortOption;

  // Callbacks
  onPostClick?: (post: BlogPostRow) => void;
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
  onSearch?: (query: string) => void;

  // Custom navigation (for Storybook/testing)
  navigate?: (path: string) => void;
}

// ============================================================================
// Context
// ============================================================================

const BlogContext = createContext<BlogContextValue | undefined>(undefined);

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_DISPLAY: Required<BlogDisplayOptions> = {
  layout: "grid",
  postsPerPage: 9,
  showFeaturedImage: true,
  showExcerpt: true,
  showReadingTime: true,
  showAuthor: true,
  showTags: true,
  showCategory: true,
  showDate: true,
  relatedPostsCount: 3,
};

const DEFAULT_FEATURES: Required<BlogFeatures> = {
  search: true,
  categoryFilter: true,
  tagFilter: true,
  relatedPosts: true,
  readingTime: true,
  shareButtons: false,
  comments: false,
};

const DEFAULT_LABELS: Required<BlogLabels> = {
  // Navigation
  readMore: "Lire la suite",
  backToBlog: "Retour au blog",
  previous: "Précédent",
  next: "Suivant",
  page: "Page",

  // Search & Filter
  search: "Rechercher",
  searchPlaceholder: "Rechercher des articles...",
  allCategories: "Toutes les catégories",
  allTags: "Tous les tags",
  filterByCategory: "Filtrer par catégorie",
  filterByTag: "Filtrer par tag",
  clear: "Effacer",

  // Post metadata
  publishedOn: "Publié le",
  by: "par",
  in: "dans",
  readingTime: "Temps de lecture",
  minuteRead: "min de lecture",
  minutesRead: "mins de lecture",

  // Related content
  relatedPosts: "Articles similaires",
  moreIn: "Plus dans",

  // Messages
  noPostsFound: "Aucun article trouvé",
  noResults: "Aucun résultat",
  loading: "Chargement...",
  error: "Une erreur s'est produite",

  // Share
  share: "Partager",
  copyLink: "Copier le lien",
  linkCopied: "Lien copié !",
};

// ============================================================================
// Provider Props
// ============================================================================

export interface BlogProviderProps {
  children: ReactNode;
  apiBasePath?: string;
  apiClient?: any;
  basePath?: string;
  display?: BlogDisplayOptions;
  features?: BlogFeatures;
  labels?: Partial<BlogLabels>;
  classNames?: BlogClassNames;
  components?: BlogComponents;
  defaultCategory?: string;
  defaultTag?: string;
  defaultSort?: BlogSortOption;
  onPostClick?: (post: BlogPostRow) => void;
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
  onSearch?: (query: string) => void;
  navigate?: (path: string) => void;
}

// ============================================================================
// Provider Component
// ============================================================================

export function BlogProvider(props: BlogProviderProps) {
  const {
    children,
    apiBasePath = "/api/blog",
    apiClient,
    basePath = "/blog",
    display,
    features,
    labels,
    classNames,
    components,
    defaultCategory,
    defaultTag,
    defaultSort = "date-desc",
    onPostClick,
    onCategoryClick,
    onTagClick,
    onSearch,
    navigate,
  } = props;

  const mergedDisplay = useMemo(
    () => ({ ...DEFAULT_DISPLAY, ...display }),
    [display]
  );

  const mergedFeatures = useMemo(
    () => ({ ...DEFAULT_FEATURES, ...features }),
    [features]
  );

  const mergedLabels = useMemo(
    () => ({ ...DEFAULT_LABELS, ...labels }),
    [labels]
  );

  const value = useMemo<BlogContextValue>(
    () => ({
      apiBasePath,
      apiClient,
      basePath,
      display: mergedDisplay,
      features: mergedFeatures,
      labels: mergedLabels,
      classNames,
      components,
      defaultCategory,
      defaultTag,
      defaultSort,
      onPostClick,
      onCategoryClick,
      onTagClick,
      onSearch,
      navigate,
    }),
    [
      apiBasePath,
      apiClient,
      basePath,
      mergedDisplay,
      mergedFeatures,
      mergedLabels,
      classNames,
      components,
      defaultCategory,
      defaultTag,
      defaultSort,
      onPostClick,
      onCategoryClick,
      onTagClick,
      onSearch,
      navigate,
    ]
  );

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access Blog context
 * Must be used within BlogProvider
 */
export function useBlogContext() {
  const context = useContext(BlogContext);

  if (!context) {
    throw new Error("useBlogContext must be used within BlogProvider");
  }

  return context;
}
