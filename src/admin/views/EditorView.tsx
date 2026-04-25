"use client";

/**
 * EditorView Component
 * Blog post editor with BlogBuilder integration
 */

import { useState, useEffect } from "react";
import { useBlogAdminContext } from "../context/BlogAdminContext";
import { usePosts } from "../hooks/usePosts";
import { createEmptyColumns, createDefaultBlock } from "../../utils";
import { usePostEditor } from "../hooks/usePostEditor";
import { TaxonomySelector } from "../components/TaxonomySelector";
import { CategoryDialog } from "../components/CategoryDialog";
import { TagDialog } from "../components/TagDialog";
import { CollapsibleFormSection } from "../components/CollapsibleFormSection";
import { BlogEditorContainer } from "../components/BlogEditorContainer";
import { buildPath } from "../utils/router";
import { BlogAdminAPIClient } from "../api/client";
import type { BlogPostRow, BlogPostInsert } from "../../types/database";
import type { LayoutType, LayoutSection } from "../../types/layouts";
import type { ContentBlockType } from "../../types";

export interface EditorViewProps {
  postId?: string;
}

// Helper component for conditional Card wrapper
function CardWrapper({
  Card,
  children,
  fallbackClassName = "border rounded-lg p-6 space-y-4",
}: {
  Card?: React.ComponentType<{ children: React.ReactNode }>;
  children: React.ReactNode;
  fallbackClassName?: string;
}): React.ReactElement {
  if (Card) {
    return <Card>{children}</Card>;
  }
  return <div className={fallbackClassName}>{children}</div>;
}

// Helper component for conditional Button
function ActionButton({
  Button,
  onClick,
  disabled,
  variant,
  size,
  children,
  fallbackClassName,
}: {
  Button?: React.ComponentType<any>;
  onClick: () => void;
  disabled?: boolean;
  variant?: string;
  size?: string;
  children: React.ReactNode;
  fallbackClassName: string;
}): React.ReactElement {
  if (Button) {
    return (
      <Button variant={variant} size={size} onClick={onClick} disabled={disabled}>
        {children}
      </Button>
    );
  }
  return (
    <button onClick={onClick} disabled={disabled} className={fallbackClassName}>
      {children}
    </button>
  );
}

// Helper component for Input fields
function InputField({
  Input,
  id,
  value,
  onChange,
  placeholder,
  className,
  type = "text",
}: {
  Input?: React.ComponentType<any>;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}): React.ReactElement {
  if (Input) {
    return (
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    );
  }
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className || "w-full px-3 py-2 border rounded-md"}
    />
  );
}

// Fallback components for when shadcn/ui isn't provided
const FallbackComponents = {
  Button: ({ children, onClick, className = "" }: any) => (
    <button onClick={onClick} className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${className}`}>
      {children}
    </button>
  ),
  Card: ({ children, className = "" }: any) => (
    <div className={`border rounded-lg p-4 ${className}`}>{children}</div>
  ),
  CardContent: ({ children, className = "" }: any) => (
    <div className={className}>{children}</div>
  ),
  CardHeader: ({ children, className = "" }: any) => (
    <div className={className}>{children}</div>
  ),
  Label: ({ children, className = "" }: any) => (
    <label className={`block text-sm font-medium text-gray-700 ${className}`}>{children}</label>
  ),
  Input: (props: any) => <input {...props} className={`border rounded px-3 py-2 ${props.className || ""}`} />,
  Textarea: (props: any) => <textarea {...props} className={`border rounded px-3 py-2 ${props.className || ""}`} />,
  Select: ({ children, onValueChange, ...props }: any) => (
    <select
      {...props}
      onChange={(e) => onValueChange?.(e.target.value)}
      className={`border rounded px-3 py-2 ${props.className || ""}`}
    >
      {children}
    </select>
  ),
  SelectTrigger: () => null,
  SelectValue: () => null,
  SelectContent: () => null,
  SelectItem: (props: any) => <option {...props} />,
  PlusIcon: ({ className = "" }: any) => <span className={className}>+</span>,
  XIcon: ({ className = "" }: any) => <span className={className}>✕</span>,
};

// Helper to get components with fallbacks
function getComponentsWithFallbacks(components?: any): any {
  return {
    ...FallbackComponents,
    ...components,
  };
}

export function EditorView({ postId }: EditorViewProps) {
  const { apiClient, components, labels, basePath, features, navigate, colors, layout, classNames } = useBlogAdminContext();
  const { getPost, createPost, updatePost } = usePosts();
  const [initialPost, setInitialPost] = useState<BlogPostRow | undefined>();
  const [loadingPost, setLoadingPost] = useState(!!postId);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(false);

  // AI Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Progressive generation state
  const [generationPhase, setGenerationPhase] = useState<"idle" | "layout" | "sections">("idle");
  const [generatingSections, setGeneratingSections] = useState<Set<string>>(new Set());
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const {
    state,
    isDirty,
    isSaving,
    updateField,
    updateSectionAtIndex,
    updateSEO,
    preparePostData,
    markAsSaved,
    setSaving,
  } = usePostEditor(initialPost);

  const Button = components?.Button;
  const Input = components?.Input;
  const Card = components?.Card;
  const totalSections = state.sections.length;
  const generatingSectionCount = generatingSections.size;
  const completedSectionCount = completedSections.size;

  // Load existing post if editing
  useEffect(() => {
    if (!postId) return;

    async function loadPost() {
      try {
        const post = await getPost(postId!);
        setInitialPost(post);
      } catch (err) {
        console.error("Error loading post:", err);
      } finally {
        setLoadingPost(false);
      }
    }

    loadPost();
  }, [postId, getPost]);

  // Keyboard shortcuts for sidebars
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + L - Toggle Layer Panel
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        setShowLayerPanel(prev => !prev);
      }

      // Cmd/Ctrl + I - Toggle AI Panel
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        setShowAIPanel(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation helper
  const navigateToPath = (path: string): void => {
    if (navigate) {
      navigate(path);
    } else {
      window.location.href = path;
    }
  };

  // Handle save (draft or update)
  const handleSave = async (): Promise<void> => {
    setSaving(true);

    try {
      const postData = preparePostData();
      let savedPost: BlogPostRow;

      if (postId) {
        savedPost = await updatePost(postId, postData);
      } else {
        savedPost = await createPost(postData as BlogPostInsert);
        navigateToPath(buildPath(basePath, "edit", { id: savedPost.id }));
      }

      markAsSaved();
    } catch (err) {
      console.error("Error saving post:", err);
      setSaving(false);
    }
  };

  // Handle publish
  const handlePublish = async (): Promise<void> => {
    setSaving(true);

    try {
      const postData = { ...preparePostData(), status: "published" as const };
      let savedPost: BlogPostRow;

      if (postId) {
        savedPost = await updatePost(postId, postData);
      } else {
        savedPost = await createPost(postData as BlogPostInsert);
        navigateToPath(buildPath(basePath, "edit", { id: savedPost.id }));
      }

      markAsSaved();
    } catch (err) {
      console.error("Error publishing post:", err);
      setSaving(false);
    }
  };

  // AI Generation handlers
  const handleGenerateComplete = async (
    prompt: string,
    language: "en" | "fr" = "en",
    layoutPreference?: LayoutType[],
    tone?: string,
    length?: "short" | "medium" | "long"
  ): Promise<void> => {
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationPhase("layout");
    setGeneratingSections(new Set());
    setCompletedSections(new Set());

    try {
      // Step 1: Generate layout structure only
      const layoutResult = await apiClient.generateLayout({
        prompt,
        length: length || "medium",
        tone: tone || "professional",
        language,
        layoutPreference,
      });

      // Update basic fields immediately
      updateField("title", layoutResult.title);
      updateField("slug", layoutResult.slug);
      updateField("excerpt", layoutResult.excerpt);
      updateField("category", layoutResult.category || "");
      updateField("tags", layoutResult.tags || []);
      updateField("seo_metadata", {
        metaTitle: layoutResult.title,
        metaDescription: layoutResult.excerpt || "",
      });

      // Create placeholder sections with correct column count per layout type
      const placeholderSections: LayoutSection[] = layoutResult.layout.map((layoutSection: any) => ({
        id: String(layoutSection.id),
        type: layoutSection.type,
        columns: createEmptyColumns(layoutSection.type),
      }));

      // Update with placeholder sections immediately so user sees the full layout
      updateField("sections", placeholderSections);

      // Mark ALL sections as generating upfront (spinners on every section)
      setGeneratingSections(new Set(layoutResult.layout.map((s: any) => String(s.id))));

      // Show the layout with loading sections
      setGenerationPhase("sections");

      // Step 2: Generate content for each section progressively
      for (let i = 0; i < layoutResult.layout.length; i++) {
        const layoutSection = layoutResult.layout[i];
        const sectionId = String(layoutSection.id);
        try {
          const sectionResult = await apiClient.generateSection({
            prompt: layoutSection.description,
            layoutType: layoutSection.type,
            context: `${layoutResult.title} - ${layoutResult.excerpt}`,
            language,
          });

          updateSectionAtIndex(i, sectionResult.section);

          setGeneratingSections(prev => {
            const next = new Set(prev);
            next.delete(sectionId);
            return next;
          });
          setCompletedSections(prev => new Set([...prev, sectionId]));
        } catch (sectionErr: any) {
          console.error(`Error generating section ${sectionId}:`, sectionErr);
          setGeneratingSections(prev => {
            const next = new Set(prev);
            next.delete(sectionId);
            return next;
          });
        }
      }

      // All sections generated successfully
      setGenerationPhase("idle");
    } catch (err: any) {
      console.error("Error generating blog post:", err);
      setGenerationError(err.message || "Failed to generate blog post. Please try again.");
      setGenerationPhase("idle");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateFromTemplate = async (
    prompt: string,
    language: "en" | "fr" = "en",
    templateId: string,
    tone?: string
  ): Promise<void> => {
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationPhase("layout");
    setGeneratingSections(new Set());
    setCompletedSections(new Set());

    try {
      const result = await apiClient.generateFromTemplate({
        prompt,
        templateId,
        language,
        tone,
      });

      // Update all fields from template result
      updateField("title", result.title);
      updateField("slug", result.slug);
      updateField("excerpt", result.excerpt);
      updateField("category", result.category || "");
      updateField("tags", result.tags || []);
      updateField("sections", result.sections || []);
      updateField("seo_metadata", result.seo_metadata || {
        metaTitle: result.title,
        metaDescription: result.excerpt || "",
      });

      setGenerationPhase("idle");
    } catch (err: any) {
      console.error("Error generating from template:", err);
      setGenerationError(err.message || "Failed to generate from template. Please try again.");
      setGenerationPhase("idle");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSection = async (
    prompt: string,
    language: "en" | "fr" = "en",
    layoutType: LayoutType = "1-column"
  ): Promise<void> => {

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const result = await apiClient.generateSection({
        prompt,
        layoutType,
        context: state.title,
        language,
      });

      // Add new section to existing sections
      updateField("sections", [...state.sections, result.section]);
    } catch (err: any) {
      console.error("Error generating section:", err);
      setGenerationError(err.message || "Failed to generate section. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle adding layout from sidebar

  const handleGenerateSEO = async (): Promise<void> => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const result = await apiClient.generateSEO({
        title: state.title,
        excerpt: state.excerpt,
        category: state.category,
        tags: state.tags,
      });

      // Update SEO metadata and tags
      updateField("seo_metadata", {
        metaTitle: result.seo_metadata?.description || state.title,
        metaDescription: result.seo_metadata?.description || state.excerpt || "",
      });
      if (result.tags && result.tags.length > 0) {
        updateField("tags", result.tags);
      }
    } catch (err: any) {
      console.error("Error generating SEO:", err);
      setGenerationError(err.message || "Failed to generate SEO metadata. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle content improvement for individual text blocks
  const handleImproveContent = async (
    content: string,
    instruction: "expand" | "shorten" | "rewrite" | "add-examples" | "improve-clarity" | "make-engaging"
  ): Promise<string> => {
    const result = await apiClient.improveContent({
      content,
      instruction,
    });

    return result.content;
  };

  if (loadingPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{labels.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white relative">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 z-20 bg-white border-b border-gray-200 py-4 px-6">
        <div className="flex items-center gap-4">
          <ActionButton
            Button={Button}
            variant="ghost"
            onClick={() => navigateToPath(buildPath(basePath, "list"))}
            fallbackClassName="px-3 py-1.5 hover:bg-gray-100 rounded"
          >
            ← {labels.back}
          </ActionButton>
          <h1 className="text-2xl font-bold text-gray-900">
            {postId ? labels.editPost : labels.newPost}
          </h1>
          {isDirty && (
            <span className="text-sm text-gray-500">
              {labels.unsavedChanges}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <ActionButton
            Button={Button}
            variant="outline"
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            fallbackClassName="px-3 py-2 border border-gray-300 rounded-md flex items-center gap-2 transition-colors hover:bg-gray-50 text-gray-700"
          >
            <span className="text-lg">📐</span>
            <span className="hidden sm:inline">Layers</span>
            <kbd className="hidden lg:inline text-xs ml-1 px-1 py-0.5 bg-gray-100 border border-gray-300 rounded opacity-60">⌘L</kbd>
          </ActionButton>

          <ActionButton
            Button={Button}
            variant="outline"
            onClick={() => setShowAIPanel(true)}
            fallbackClassName="px-3 py-2 border border-gray-300 rounded-md flex items-center gap-2 transition-colors hover:bg-gray-50 text-gray-700"
          >
            <span className="text-lg">✨</span>
            <span className="hidden sm:inline">AI</span>
            <kbd className="hidden lg:inline text-xs ml-1 px-1 py-0.5 bg-gray-100 border border-gray-300 rounded opacity-60">⌘I</kbd>
          </ActionButton>

          <ActionButton
            Button={Button}
            variant="outline"
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            fallbackClassName="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 text-gray-700 hover:bg-gray-50"
          >
            {isSaving ? labels.saving : labels.saveDraft}
          </ActionButton>

          <ActionButton
            Button={Button}
            onClick={handlePublish}
            disabled={isSaving}
            fallbackClassName="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 hover:bg-blue-700"
          >
            {labels.publish}
          </ActionButton>
        </div>
      </div>

        {/* Metadata Section */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="space-y-3 max-w-5xl mx-auto">
          {/* Title & Slug */}
          <CollapsibleFormSection
            title={labels.title || "Title & Slug"}
            icon="✍️"
            isComplete={!!state.title && !!state.slug}
            modalContent={
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">{labels.title} *</label>
                    <InputField
                      Input={Input}
                      id="title"
                      value={state.title}
                      onChange={(value) => updateField("title", value)}
                      placeholder={labels.titlePlaceholder}
                      className={Input ? "text-xl font-bold" : "w-full px-3 py-2 border rounded-md text-xl font-bold"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="slug" className="text-sm font-medium">{labels.slug} *</label>
                    <InputField
                      Input={Input}
                      id="slug"
                      value={state.slug}
                      onChange={(value) => updateField("slug", value)}
                      placeholder="url-friendly-slug"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="excerpt" className="text-sm font-medium">{labels.excerpt}</label>
                  <textarea
                    id="excerpt"
                    value={state.excerpt}
                    onChange={(e) => updateField("excerpt", e.target.value)}
                    placeholder={labels.excerptPlaceholder}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md resize-none"
                  />
                </div>
              </div>
            }
            Button={Button}
          />

          {/* Taxonomy */}
          <CollapsibleFormSection
            title={labels.taxonomy}
            icon="🏷️"
            isComplete={!!state.category || state.tags.length > 0}
            modalContent={
              <TaxonomySelector
                selectedCategory={state.category}
                selectedTags={state.tags}
                onCategoryChange={(category) => updateField("category", category)}
                onTagsChange={(tags) => updateField("tags", tags)}
                onCreateCategory={() => setShowCategoryDialog(true)}
                onCreateTag={() => setShowTagDialog(true)}
              />
            }
            Button={Button}
          />

          {/* Featured Image */}
          {features.featuredImage && (
            <CollapsibleFormSection
              title={labels.featuredImage}
              icon="🖼️"
              isComplete={!!state.featured_image}
              modalContent={
                <div className="space-y-4">
                  <InputField
                    Input={Input}
                    id="featured_image"
                    value={state.featured_image}
                    onChange={(value) => updateField("featured_image", value)}
                    placeholder="https://..."
                  />
                  {state.featured_image && (
                    <img
                      src={state.featured_image}
                      alt="Featured"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  )}
                </div>
              }
              Button={Button}
            />
          )}

          {/* SEO */}
          {features.seo && (
            <CollapsibleFormSection
              title={labels.seo}
              icon="🔍"
              isComplete={!!state.seo_metadata.metaTitle && !!state.seo_metadata.metaDescription}
              modalContent={
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Meta Title</label>
                    <InputField
                      Input={Input}
                      id="meta_title"
                      value={state.seo_metadata.metaTitle}
                      onChange={(value) => updateSEO("metaTitle", value)}
                      placeholder={state.title}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Meta Description</label>
                    <textarea
                      value={state.seo_metadata.metaDescription}
                      onChange={(e) => updateSEO("metaDescription", e.target.value)}
                      placeholder={state.excerpt}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-md resize-none"
                    />
                  </div>
                </div>
              }
              Button={Button}
            />
          )}
          </div>
        </div>

        {/* Blog Editor - Takes remaining height */}
        <BlogEditorContainer
          sections={state.sections}
          onChange={(sections) => updateField("sections", sections)}
          generatingSections={generatingSections}
          components={getComponentsWithFallbacks(components)}
          showLayerPanel={showLayerPanel}
          onToggleLayerPanel={() => setShowLayerPanel(!showLayerPanel)}
          showAIPanel={showAIPanel}
          onToggleAIPanel={() => setShowAIPanel(!showAIPanel)}
          aiPanelProps={{
            isGenerating,
            generationPhase,
            generationError,
            onGenerateComplete: handleGenerateComplete,
            onGenerateFromTemplate: handleGenerateFromTemplate,
            onGenerateSection: handleGenerateSection,
            onGenerateSEO: handleGenerateSEO,
            completedSectionCount,
            totalSections,
            generatingSectionCount,
            hasTitle: !!state.title,
            Button,
            Input,
          }}
        />

        {/* Modals & Dialogs */}
        <CategoryDialog
          open={showCategoryDialog}
          onOpenChange={setShowCategoryDialog}
          onSuccess={(category) => {
            updateField("category", category.name);
            setShowCategoryDialog(false);
          }}
        />

        <TagDialog
          open={showTagDialog}
          onOpenChange={setShowTagDialog}
          onSuccess={(tag) => {
            updateField("tags", [...state.tags, tag.name]);
            setShowTagDialog(false);
          }}
        />
      </div>
  );
}
