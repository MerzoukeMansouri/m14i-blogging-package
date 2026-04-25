/**
 * m14i-blogging Admin Module
 * Complete blog administration interface
 */

// Main component
export { BlogAdmin } from "./BlogAdmin";

// Types
export type {
  BlogAdminProps,
  BlogAdminTheme,
  BlogAdminColors,
  BlogAdminFeatures,
  BlogAdminComponents,
  BlogAdminLabels,
  CurrentUser,
  BlogAdminView,
  BlogAdminRoute,
} from "./types";

// API Client (for advanced usage)
export { BlogAdminAPIClient } from "./api/client";

// Context (for custom components)
export { useBlogAdminContext } from "./context/BlogAdminContext";

// Hooks (for custom views)
export { usePosts } from "./hooks/usePosts";
export { useTaxonomy } from "./hooks/useTaxonomy";
export { usePostEditor } from "./hooks/usePostEditor";

// Components (for custom layouts)
export { TaxonomySelector } from "./components/TaxonomySelector";
export { CategoryDialog } from "./components/CategoryDialog";
export { TagDialog } from "./components/TagDialog";
export { AIAssistantPanel } from "./components/AIAssistantPanel";
export { ContentBuilderPanel } from "./components/ContentBuilderPanel";
export { CollapsibleFormSection } from "./components/CollapsibleFormSection";
export { AccessDenied } from "./components/AccessDenied";

// Blog builder components
export { BlogEditorWithSidebar } from "../components/BlogEditorWithSidebar";

// Views (for custom routing)
export { ListView } from "./views/ListView";
export { EditorView } from "./views/EditorView";

// Utilities
export { parseRoute, buildPath, navigateTo } from "./utils/router";
