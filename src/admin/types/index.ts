/**
 * Types for BlogAdmin component
 */

import type { LayoutSection } from "../../types";
import type { ComponentType, ReactNode } from "react";

// ============================================================================
// User Types
// ============================================================================

export interface CurrentUser {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

// ============================================================================
// ============================================================================
// Theme & Colors
// ============================================================================

export interface BlogAdminColors {
  primary?: string;
  background?: string;
  border?: string;
  text?: string;
  textMuted?: string;
  accent?: string;
  error?: string;
  errorBg?: string;
  dialogOverlay?: string;
  dialogBg?: string;
  dialogBorder?: string;
  inputBg?: string;
  inputBorder?: string;
  buttonPrimary?: string;
  buttonPrimaryText?: string;
  buttonSecondary?: string;
  buttonSecondaryText?: string;
}

export type BlogAdminTheme = "light" | "dark" | "system";

// ============================================================================
// Features
// ============================================================================

export interface BlogAdminFeatures {
  categories?: boolean;
  tags?: boolean;
  seo?: boolean;
  autoSave?: boolean;
  preview?: boolean;
  featuredImage?: boolean;
}

// ============================================================================
// Labels (i18n support)
// ============================================================================

export interface BlogAdminLabels {
  // Actions
  newPost?: string;
  editPost?: string;
  saveDraft?: string;
  publish?: string;
  unpublish?: string;
  archive?: string;
  delete?: string;
  edit?: string;
  preview?: string;
  back?: string;
  cancel?: string;
  create?: string;
  update?: string;
  search?: string;
  filter?: string;
  clear?: string;
  newCategory?: string;
  newTag?: string;
  searchTags?: string;
  previous?: string;
  next?: string;

  // Status
  status?: string;
  draft?: string;
  published?: string;
  archived?: string;
  allStatus?: string;
  allCategories?: string;

  // Fields
  title?: string;
  slug?: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
  tags?: string;
  content?: string;
  seo?: string;
  metaTitle?: string;
  metaDescription?: string;
  name?: string;
  icon?: string;
  color?: string;
  description?: string;
  taxonomy?: string;
  posts?: string;
  untitled?: string;
  date?: string;
  actions?: string;

  // Messages
  noAccess?: string;
  noPosts?: string;
  noCategories?: string;
  noTags?: string;
  loading?: string;
  saving?: string;
  saved?: string;
  error?: string;
  confirmDelete?: string;
  unsavedChanges?: string;

  // Placeholders
  searchPlaceholder?: string;
  selectCategory?: string;
  selectTags?: string;
  titlePlaceholder?: string;
  excerptPlaceholder?: string;
}

// ============================================================================
// Components (shadcn/ui)
// ============================================================================

export interface BlogAdminComponents {
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
  Dialog?: ComponentType<any>;
  DialogContent?: ComponentType<any>;
  DialogHeader?: ComponentType<any>;
  DialogTitle?: ComponentType<any>;
  DialogDescription?: ComponentType<any>;
  DialogFooter?: ComponentType<any>;
  DialogTrigger?: ComponentType<any>;
  Input?: ComponentType<any>;
  Textarea?: ComponentType<any>;
  Label?: ComponentType<{ className?: string; children: ReactNode }>;
  Select?: ComponentType<any>;
  SelectTrigger?: ComponentType<any>;
  SelectValue?: ComponentType<any>;
  SelectContent?: ComponentType<any>;
  SelectItem?: ComponentType<any>;
  Table?: ComponentType<any>;
  TableHeader?: ComponentType<any>;
  TableBody?: ComponentType<any>;
  TableRow?: ComponentType<any>;
  TableHead?: ComponentType<any>;
  TableCell?: ComponentType<any>;
  Badge?: ComponentType<{
    variant?: string;
    className?: string;
    onClick?: () => void;
    children: ReactNode;
  }>;
  PlusIcon?: ComponentType<{ className?: string }>;
  XIcon?: ComponentType<{ className?: string }>;
  BlogBuilder?: ComponentType<{
    sections: LayoutSection[];
    onChange: (sections: LayoutSection[]) => void;
    generatingSections?: Set<string>;
  }>;
}

// ============================================================================
// Layout Configuration
// ============================================================================

export interface BlogAdminLayout {
  /**
   * Position of the sidebar in editor view
   * - "right": Sidebar on the right (default for horizontal layout)
   * - "bottom": Sidebar at the bottom (default for vertical layout)
   */
  editorSidebarPosition?: "right" | "bottom";

  /**
   * Width of the main editor area
   * - Can be a percentage string like "70%" or "80%"
   * - Or "full" for full width
   */
  editorMainWidth?: string;
}

export interface BlogAdminClassNames {
  // Container classes
  container?: string;
  header?: string;
  headerTitle?: string;
  headerSubtitle?: string;

  // Component classes
  card?: string;
  button?: string;
  buttonOutline?: string;
  input?: string;
  badge?: string;
  select?: string;
  dialog?: string;
  dialogOverlay?: string;
  dialogContent?: string;
  dialogTitle?: string;
  dialogDescription?: string;

  // Editor layout classes
  editorLayout?: string;
  editorMain?: string;
  editorSidebar?: string;
  sidebarSection?: string;
}

// ============================================================================
// BlogAdmin Props
// ============================================================================

export interface BlogAdminProps {
  /**
   * Base path for API calls (default: "/api/blog")
   * BlogAdmin will make requests to:
   * - GET/POST {apiBasePath} (list/create posts)
   * - GET/PATCH/DELETE {apiBasePath}/[id] (get/update/delete post)
   * - GET/POST {apiBasePath}/categories (list/create categories)
   * - GET/POST {apiBasePath}/tags (list/create tags)
   */
  apiBasePath?: string;

  /**
   * Optional custom API client (for testing/Storybook)
   * If not provided, BlogAdmin will create a default BlogAdminAPIClient
   */
  apiClient?: any;

  /**
   * Security: Controls UI access
   * Developer passes their own logic (e.g., user.role === 'admin')
   * When false, displays access denied screen
   */
  isAllowed: boolean;

  /**
   * Current user info (for displaying author, created_by fields)
   */
  currentUser?: CurrentUser;

  /**
   * Base path for internal routing (default: "/admin/blog")
   * Used for navigation between views
   */
  basePath?: string;

  /**
   * Theme preference
   */
  theme?: BlogAdminTheme;

  /**
   * Custom colors (optional, defaults to Tailwind)
   */
  colors?: BlogAdminColors;

  /**
   * Layout configuration for editor view
   */
  layout?: BlogAdminLayout;

  /**
   * Custom CSS class names for components
   */
  classNames?: BlogAdminClassNames;

  /**
   * Feature toggles
   */
  features?: BlogAdminFeatures;

  /**
   * shadcn/ui components (optional, uses defaults if not provided)
   */
  components?: BlogAdminComponents;

  /**
   * Lifecycle callbacks
   */
  onPostCreate?: (post: any) => void;
  onPostUpdate?: (post: any) => void;
  onPostDelete?: (id: string) => void;
  onPublish?: (post: any) => void;

  /**
   * Custom labels for i18n
   */
  labels?: BlogAdminLabels;
}

// ============================================================================
// Internal View Types
// ============================================================================

export type BlogAdminView = "list" | "create" | "edit" | "preview" | "context";

export interface BlogAdminRoute {
  view: BlogAdminView;
  params?: {
    id?: string;
    slug?: string;
  };
}

// ============================================================================
// Context State
// ============================================================================

export interface BlogAdminState {
  view: BlogAdminView;
  currentPostId?: string;
  currentSlug?: string;
  isDirty: boolean;
  isSaving: boolean;
  error?: string;
}
