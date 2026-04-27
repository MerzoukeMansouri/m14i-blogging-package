"use client";

/**
 * BlogAdminContext
 * Provides state and API client to all BlogAdmin components
 */

import { createContext, useContext, ReactNode, useMemo } from "react";
import { BlogAdminAPIClient } from "../api/client";
import type { SupabaseStorageClient } from "../utils/supabase-storage";
import type {
  CurrentUser,
  BlogAdminTheme,
  BlogAdminColors,
  BlogAdminFeatures,
  BlogAdminLabels,
  BlogAdminComponents,
  BlogAdminLayout,
  BlogAdminClassNames,
} from "../types";

// ============================================================================
// Context Types
// ============================================================================

export interface BlogAdminContextValue {
  // API Client
  apiClient: BlogAdminAPIClient;

  // Supabase Client (optional, for media upload)
  supabaseClient?: SupabaseStorageClient;

  // User
  currentUser?: CurrentUser;

  // Configuration
  basePath: string;
  theme?: BlogAdminTheme;
  colors?: BlogAdminColors;
  layout?: BlogAdminLayout;
  classNames?: BlogAdminClassNames;
  features: Required<BlogAdminFeatures>;
  labels: Required<BlogAdminLabels>;
  components?: BlogAdminComponents;

  // Callbacks
  onPostCreate?: (post: any) => void;
  onPostUpdate?: (post: any) => void;
  onPostDelete?: (id: string) => void;
  onPublish?: (post: any) => void;

  // Custom navigation (for Storybook/testing)
  navigate?: (path: string) => void;
}

// ============================================================================
// Context
// ============================================================================

const BlogAdminContext = createContext<BlogAdminContextValue | undefined>(undefined);

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_FEATURES: Required<BlogAdminFeatures> = {
  categories: true,
  tags: true,
  seo: true,
  autoSave: true,
  preview: true,
  featuredImage: true,
};

const DEFAULT_LABELS: Required<BlogAdminLabels> = {
  // Actions
  newPost: "Nouvel article",
  editPost: "Modifier l'article",
  saveDraft: "Enregistrer le brouillon",
  publish: "Publier",
  unpublish: "Dépublier",
  archive: "Archiver",
  delete: "Supprimer",
  edit: "Modifier",
  preview: "Aperçu",
  back: "Retour",
  cancel: "Annuler",
  create: "Créer",
  update: "Mettre à jour",
  search: "Rechercher",
  filter: "Filtrer",
  clear: "Effacer",
  newCategory: "Nouvelle catégorie",
  newTag: "Nouveau tag",
  searchTags: "Rechercher des tags...",
  previous: "Précédent",
  next: "Suivant",

  // Status
  status: "Statut",
  draft: "Brouillon",
  published: "Publié",
  archived: "Archivé",
  allStatus: "Tous les statuts",
  allCategories: "Toutes les catégories",

  // Fields
  title: "Titre",
  slug: "Slug",
  excerpt: "Extrait",
  featuredImage: "Image à la une",
  category: "Catégorie",
  tags: "Tags",
  content: "Contenu",
  seo: "SEO",
  metaTitle: "Meta Title",
  metaDescription: "Meta Description",
  name: "Nom",
  icon: "Icône",
  color: "Couleur",
  description: "Description",
  taxonomy: "Taxonomie",
  posts: "Articles",
  untitled: "Sans titre",
  date: "Date",
  actions: "Actions",

  // Messages
  noAccess: "Accès refusé",
  noPosts: "Aucun article",
  noCategories: "Aucune catégorie disponible",
  noTags: "Aucun tag disponible",
  loading: "Chargement...",
  saving: "Enregistrement...",
  saved: "Enregistré",
  error: "Erreur",
  confirmDelete: "Êtes-vous sûr de vouloir supprimer cet élément ?",
  unsavedChanges: "Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?",

  // Placeholders
  searchPlaceholder: "Rechercher des articles...",
  selectCategory: "Sélectionner une catégorie",
  selectTags: "Sélectionner des tags",
  titlePlaceholder: "Entrez le titre de l'article",
  excerptPlaceholder: "Bref résumé de l'article (optionnel)",
};

// ============================================================================
// Provider Props
// ============================================================================

export interface BlogAdminProviderProps {
  children: ReactNode;
  apiClient: BlogAdminAPIClient;
  supabaseClient?: SupabaseStorageClient;
  currentUser?: CurrentUser;
  basePath?: string;
  theme?: BlogAdminTheme;
  colors?: BlogAdminColors;
  layout?: BlogAdminLayout;
  classNames?: BlogAdminClassNames;
  features?: BlogAdminFeatures;
  labels?: Partial<BlogAdminLabels>;
  components?: BlogAdminComponents;
  onPostCreate?: (post: any) => void;
  onPostUpdate?: (post: any) => void;
  onPostDelete?: (id: string) => void;
  onPublish?: (post: any) => void;
  navigate?: (path: string) => void;
}

// ============================================================================
// Provider Component
// ============================================================================

export function BlogAdminProvider({
  children,
  apiClient,
  supabaseClient,
  currentUser,
  basePath = "/admin/blog",
  theme,
  colors,
  layout,
  classNames,
  features,
  labels,
  components,
  onPostCreate,
  onPostUpdate,
  onPostDelete,
  onPublish,
  navigate,
}: BlogAdminProviderProps) {
  const value = useMemo<BlogAdminContextValue>(
    () => ({
      apiClient,
      supabaseClient,
      currentUser,
      basePath,
      theme,
      colors,
      layout,
      classNames,
      features: { ...DEFAULT_FEATURES, ...features },
      labels: { ...DEFAULT_LABELS, ...labels },
      components,
      onPostCreate,
      onPostUpdate,
      onPostDelete,
      onPublish,
      navigate,
    }),
    [
      apiClient,
      currentUser,
      basePath,
      theme,
      colors,
      layout,
      classNames,
      features,
      labels,
      components,
      onPostCreate,
      onPostUpdate,
      onPostDelete,
      onPublish,
      navigate,
    ]
  );

  return (
    <BlogAdminContext.Provider value={value}>
      {children}
    </BlogAdminContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access BlogAdmin context
 * Must be used within BlogAdminProvider
 */
export function useBlogAdminContext() {
  const context = useContext(BlogAdminContext);

  if (!context) {
    throw new Error("useBlogAdminContext must be used within BlogAdminProvider");
  }

  return context;
}
