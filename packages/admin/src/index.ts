/**
 * @m14i/blogging-admin
 * Full-featured blog CMS with WYSIWYG editor
 */

// Styles
import "./styles.css";

// Main Admin Component
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

// API Client
export { BlogAdminAPIClient } from "./api/client";

// Context
export { useBlogAdminContext } from "./context/BlogAdminContext";

// Hooks
export { usePosts } from "./hooks/usePosts";
export { useTaxonomy } from "./hooks/useTaxonomy";
export { usePostEditor } from "./hooks/usePostEditor";

// Components
export { TaxonomySelector } from "./components/TaxonomySelector";
export { CategoryDialog } from "./components/CategoryDialog";
export { TagDialog } from "./components/TagDialog";
export { AIAssistantPanel } from "./components/AIAssistantPanel";
export { ContentBuilderPanel } from "./components/ContentBuilderPanel";
export { CollapsibleFormSection } from "./components/CollapsibleFormSection";
export { DraggableLayerPanel } from "./components/DraggableLayerPanel";
export { BlogEditorContainer } from "./components/BlogEditorContainer";
export { AccessDenied } from "./components/AccessDenied";

// Editor Components
export { BlogBuilder } from "./components/BlogBuilder";
export { BlogBuilderWithDefaults } from "./components/BlogBuilderWithDefaults";
export { BlogEditorWithSidebar } from "./components/BlogEditorWithSidebar";
export { ContentLayerPanel } from "./components/ContentLayerPanel";
// Re-exported from core
// export { ContentBlockRenderer } from "@m14i/blogging-core";
export { ContentBlockInlineEditor } from "./components/ContentBlockInlineEditor";
export { WYSIWYGEditor } from "./components/WYSIWYGEditor";

// Editor Types
export type { BlogBuilderProps } from "./components/BlogBuilder";
export type { BaseBlockEditorProps, EditorComponents, ImprovementInstruction } from "./types/editorComponents";

// Views
export { ListView } from "./views/ListView";
export { EditorView } from "./views/EditorView";

// Utilities
export { parseRoute, buildPath, navigateTo } from "./utils/router";

// Re-export core for convenience
export * from "@m14i/blogging-core";
