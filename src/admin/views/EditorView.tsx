"use client";

/**
 * EditorView Component
 * Blog post editor with BlogBuilder integration
 */

import { useState, useEffect } from "react";
import { useBlogAdminContext } from "../context/BlogAdminContext";
import { usePosts } from "../hooks/usePosts";
import { usePostEditor } from "../hooks/usePostEditor";
import { TaxonomySelector } from "../components/TaxonomySelector";
import { CategoryDialog } from "../components/CategoryDialog";
import { TagDialog } from "../components/TagDialog";
import { buildPath } from "../utils/router";
import { BlogAdminAPIClient } from "../api/client";
import type { BlogPostRow, BlogPostInsert } from "../../types/database";
import type { LayoutType } from "../../types/layouts";

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

export function EditorView({ postId }: EditorViewProps) {
  const { apiClient, components, labels, basePath, features, navigate, colors, layout, classNames } = useBlogAdminContext();
  const { getPost, createPost, updatePost } = usePosts();
  const [initialPost, setInitialPost] = useState<BlogPostRow | undefined>();
  const [loadingPost, setLoadingPost] = useState(!!postId);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);

  // AI Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState("");
  const [generateAction, setGenerateAction] = useState<"complete" | "section" | "seo">("complete");
  const [selectedLayoutType, setSelectedLayoutType] = useState<LayoutType>("1-column");

  // Progressive generation state
  const [generationPhase, setGenerationPhase] = useState<"idle" | "layout" | "sections">("idle");
  const [generatingSections, setGeneratingSections] = useState<Set<string>>(new Set());
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const {
    state,
    isDirty,
    isSaving,
    updateField,
    updateSEO,
    openPreview,
    preparePostData,
    markAsSaved,
    setSaving,
  } = usePostEditor(initialPost);

  const Button = components?.Button;
  const Input = components?.Input;
  const Card = components?.Card;
  const BlogBuilder = components?.BlogBuilder;

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
  const handleGenerateComplete = async (): Promise<void> => {
    if (!generatePrompt.trim()) {
      setGenerationError("Please enter a topic or prompt");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationPhase("layout");
    setGeneratingSections(new Set());
    setCompletedSections(new Set());

    try {
      // Step 1: Generate layout structure only
      const layoutResult = await apiClient.generateLayout({
        prompt: generatePrompt,
        length: "medium",
        tone: "professional",
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

      // Transition to sections phase (keep dialog open to show progress)
      setGenerationPhase("sections");

      // Step 2: Generate content for each section progressively
      const sections = [];
      for (const layoutSection of layoutResult.layout) {
        try {
          // Mark this section as generating
          setGeneratingSections(prev => new Set([...prev, layoutSection.id]));

          const sectionResult = await apiClient.generateSection({
            prompt: layoutSection.description,
            layoutType: layoutSection.type,
            context: `${layoutResult.title} - ${layoutResult.excerpt}`,
          });

          sections.push(sectionResult.section);

          // Update sections progressively so user sees them appear
          updateField("sections", [...sections]);

          // Mark section as completed
          setGeneratingSections(prev => {
            const next = new Set(prev);
            next.delete(layoutSection.id);
            return next;
          });
          setCompletedSections(prev => new Set([...prev, layoutSection.id]));
        } catch (sectionErr: any) {
          console.error(`Error generating section ${layoutSection.id}:`, sectionErr);
          // Remove from generating set even if failed
          setGeneratingSections(prev => {
            const next = new Set(prev);
            next.delete(layoutSection.id);
            return next;
          });
          // Continue with other sections even if one fails
        }
      }

      // All sections generated successfully - close dialog
      setGenerationPhase("idle");
      setShowGenerateDialog(false);
      setGeneratePrompt("");
    } catch (err: any) {
      console.error("Error generating blog post:", err);
      setGenerationError(err.message || "Failed to generate blog post. Please try again.");
      setGenerationPhase("idle");
      // Keep dialog open on error so user sees the error message
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSection = async (): Promise<void> => {
    if (!generatePrompt.trim()) {
      setGenerationError("Please enter a topic for this section");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const result = await apiClient.generateSection({
        prompt: generatePrompt,
        layoutType: selectedLayoutType,
        context: state.title,
      });

      // Add new section to existing sections
      updateField("sections", [...state.sections, result.section]);

      setShowGenerateDialog(false);
      setGeneratePrompt("");
    } catch (err: any) {
      console.error("Error generating section:", err);
      setGenerationError(err.message || "Failed to generate section. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

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

      setShowGenerateDialog(false);
    } catch (err: any) {
      console.error("Error generating SEO:", err);
      setGenerationError(err.message || "Failed to generate SEO metadata. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = (): void => {
    const generationHandlers = {
      complete: handleGenerateComplete,
      section: handleGenerateSection,
      seo: handleGenerateSEO,
    };

    generationHandlers[generateAction]();
  };

  const openGenerateDialog = (action: "complete" | "section" | "seo"): void => {
    setGenerateAction(action);
    setGenerationError(null);
    setGeneratePrompt("");
    setShowGenerateDialog(true);
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
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b">
        <div className="flex items-center gap-4">
          <ActionButton
            Button={Button}
            variant="ghost"
            onClick={() => navigateToPath(buildPath(basePath, "list"))}
            fallbackClassName="px-3 py-1.5 hover:bg-accent rounded"
          >
            ← {labels.back}
          </ActionButton>
          <h1 className="text-2xl font-bold">
            {postId ? labels.editPost : labels.newPost}
          </h1>
          {isDirty && (
            <span className="text-sm text-muted-foreground">
              {labels.unsavedChanges}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {features.preview && (
            <ActionButton
              Button={Button}
              variant="outline"
              onClick={openPreview}
              fallbackClassName="px-4 py-2 border rounded-md"
            >
              {labels.preview}
            </ActionButton>
          )}

          <ActionButton
            Button={Button}
            variant="outline"
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            fallbackClassName="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            {isSaving ? labels.saving : labels.saveDraft}
          </ActionButton>

          <ActionButton
            Button={Button}
            onClick={handlePublish}
            disabled={isSaving}
            fallbackClassName="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
          >
            {labels.publish}
          </ActionButton>
        </div>
      </div>

      <div className={classNames?.editorLayout || "grid grid-cols-1 lg:grid-cols-3 gap-6"}>
        {/* Main Content - BlogBuilder */}
        <div className={classNames?.editorMain || "lg:col-span-2 space-y-6"}>
          {/* Title & Slug */}
          <CardWrapper Card={Card}>
            <div className="space-y-4 p-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  {labels.title} *
                </label>
                <InputField
                  Input={Input}
                  id="title"
                  value={state.title}
                  onChange={(value) => updateField("title", value)}
                  placeholder={labels.titlePlaceholder}
                  className={Input ? "text-2xl font-bold" : "w-full px-3 py-2 border rounded-md text-2xl font-bold"}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">
                  {labels.slug} *
                </label>
                <InputField
                  Input={Input}
                  id="slug"
                  value={state.slug}
                  onChange={(value) => updateField("slug", value)}
                  placeholder="url-friendly-slug"
                />
              </div>
            </div>
          </CardWrapper>

          {/* AI Generation Toolbar */}
          <CardWrapper Card={Card} fallbackClassName="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700">AI Assistant:</span>
                <ActionButton
                  Button={Button}
                  variant="outline"
                  size="sm"
                  onClick={() => openGenerateDialog("complete")}
                  disabled={isGenerating}
                  fallbackClassName="px-3 py-1.5 text-sm border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  ✨ Generate Full Post
                </ActionButton>
                <ActionButton
                  Button={Button}
                  variant="outline"
                  size="sm"
                  onClick={() => openGenerateDialog("section")}
                  disabled={isGenerating}
                  fallbackClassName="px-3 py-1.5 text-sm border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  ➕ Generate Section
                </ActionButton>
                <ActionButton
                  Button={Button}
                  variant="outline"
                  size="sm"
                  onClick={() => openGenerateDialog("seo")}
                  disabled={isGenerating || !state.title}
                  fallbackClassName="px-3 py-1.5 text-sm border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  🔍 Generate SEO
                </ActionButton>
              </div>
            </div>
          </CardWrapper>

          {/* BlogBuilder */}
          {/* AI Generation Progress */}
          {generationPhase !== "idle" && (
            <CardWrapper Card={Card}>
              <div className="p-6">
                <div className="space-y-4">
                  {generationPhase === "layout" && (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: colors?.primary || '#000' }}></div>
                      <span style={{ color: colors?.text || '#000' }}>Generating blog structure...</span>
                    </div>
                  )}
                  {generationPhase === "sections" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full h-5 w-5 flex items-center justify-center" style={{ backgroundColor: colors?.primary || '#000', color: colors?.buttonPrimaryText || '#fff' }}>
                          ✓
                        </div>
                        <span style={{ color: colors?.text || '#000' }}>Layout ready! Generating content...</span>
                      </div>
                      {generatingSections.size > 0 && (
                        <div className="ml-8 text-sm" style={{ color: colors?.textMuted || '#666' }}>
                          Generating {generatingSections.size} section{generatingSections.size > 1 ? 's' : ''}...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardWrapper>
          )}

          {BlogBuilder && (
            <CardWrapper Card={Card}>
              <div className="p-6">
                <BlogBuilder
                  sections={state.sections}
                  onChange={(sections: any) => updateField("sections", sections)}
                />
              </div>
            </CardWrapper>
          )}
        </div>

        {/* Sidebar - Metadata */}
        <div className={classNames?.editorSidebar || "space-y-6"}>
          {/* Taxonomy */}
          <div className={classNames?.sidebarSection || ""}>
            <CardWrapper Card={Card}>
              <div className="p-6">
                <h3 className="font-semibold mb-4">{labels.taxonomy}</h3>
              <TaxonomySelector
                selectedCategory={state.category}
                selectedTags={state.tags}
                onCategoryChange={(category) => updateField("category", category)}
                onTagsChange={(tags) => updateField("tags", tags)}
                onCreateCategory={() => setShowCategoryDialog(true)}
                onCreateTag={() => setShowTagDialog(true)}
              />
              </div>
            </CardWrapper>
          </div>

          {/* Featured Image */}
          {features.featuredImage && (
            <div className={classNames?.sidebarSection || ""}>
              <CardWrapper Card={Card}>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold">{labels.featuredImage}</h3>
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
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}
              </div>
            </CardWrapper>
            </div>
          )}

          {/* Excerpt */}
          <div className={classNames?.sidebarSection || ""}>
            <CardWrapper Card={Card}>
            <div className="p-6 space-y-4">
              <h3 className="font-semibold">{labels.excerpt}</h3>
              <textarea
                value={state.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                placeholder={labels.excerptPlaceholder}
                rows={4}
                className="w-full px-3 py-2 border rounded-md resize-none"
              />
            </div>
          </CardWrapper>
          </div>

          {/* SEO */}
          {features.seo && (
            <div className={classNames?.sidebarSection || ""}>
              <CardWrapper Card={Card}>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold">{labels.seo}</h3>
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
            </CardWrapper>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
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

      {/* AI Generation Dialog */}
      {showGenerateDialog && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: colors?.dialogOverlay || 'rgba(0, 0, 0, 0.7)' }}
        >
          <div
            className="border rounded-none shadow-2xl max-w-md w-full p-8 space-y-6"
            style={{
              backgroundColor: colors?.dialogBg || colors?.background || '#0A192F',
              borderColor: colors?.dialogBorder || colors?.border || 'rgba(184, 115, 51, 0.2)'
            }}
          >
            <div
              className="flex items-center justify-between border-b pb-4"
              style={{ borderColor: colors?.dialogBorder || colors?.border || 'rgba(184, 115, 51, 0.2)' }}
            >
              <h2
                className="text-xl font-['Playfair_Display']"
                style={{ color: colors?.text || '#F2F5F7' }}
              >
                {generateAction === "complete" && "Generate Full Blog Post"}
                {generateAction === "section" && "Generate Section"}
                {generateAction === "seo" && "Generate SEO Metadata"}
              </h2>
              <button
                onClick={() => setShowGenerateDialog(false)}
                className="transition-colors"
                style={{
                  color: colors?.textMuted || 'rgba(242, 245, 247, 0.5)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors?.accent || colors?.primary || '#B87333'}
                onMouseLeave={(e) => e.currentTarget.style.color = colors?.textMuted || 'rgba(242, 245, 247, 0.5)'}
                disabled={isGenerating}
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <p
                className="text-sm leading-relaxed"
                style={{ color: colors?.textMuted || 'rgba(242, 245, 247, 0.7)' }}
              >
                {generateAction === "complete" &&
                  "Describe the topic or theme for your blog post. The AI will generate a complete post with title, sections, and SEO metadata."}
                {generateAction === "section" &&
                  "Describe what this section should cover. You can also choose the layout type."}
                {generateAction === "seo" &&
                  "AI will analyze your post content and generate optimized SEO metadata including meta description, keywords, and social media tags."}
              </p>

              {generateAction !== "seo" && (
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium font-['Inter']"
                    style={{ color: colors?.text || '#F2F5F7' }}
                  >
                    {generateAction === "complete" ? "Topic or Prompt" : "Section Topic"}
                  </label>
                  <textarea
                    value={generatePrompt}
                    onChange={(e) => setGeneratePrompt(e.target.value)}
                    placeholder={
                      generateAction === "complete"
                        ? "e.g., Best practices for React performance optimization"
                        : "e.g., Benefits of server-side rendering"
                    }
                    rows={3}
                    className="w-full px-4 py-3 resize-none focus:outline-none transition-colors font-['Inter']"
                    style={{
                      backgroundColor: colors?.inputBg || colors?.background || '#0A192F',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: colors?.inputBorder || colors?.border || 'rgba(184, 115, 51, 0.3)',
                      color: colors?.text || '#F2F5F7',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = colors?.accent || colors?.primary || '#B87333'}
                    onBlur={(e) => e.currentTarget.style.borderColor = colors?.inputBorder || colors?.border || 'rgba(184, 115, 51, 0.3)'}
                    disabled={isGenerating}
                  />
                </div>
              )}

              {generateAction === "section" && (
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium font-['Inter']"
                    style={{ color: colors?.text || '#F2F5F7' }}
                  >
                    Layout Type
                  </label>
                  <select
                    value={selectedLayoutType}
                    onChange={(e) => setSelectedLayoutType(e.target.value as LayoutType)}
                    className="w-full px-4 py-3 focus:outline-none transition-colors font-['Inter']"
                    style={{
                      backgroundColor: colors?.inputBg || colors?.background || '#0A192F',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: colors?.inputBorder || colors?.border || 'rgba(184, 115, 51, 0.3)',
                      color: colors?.text || '#F2F5F7',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = colors?.accent || colors?.primary || '#B87333'}
                    onBlur={(e) => e.currentTarget.style.borderColor = colors?.inputBorder || colors?.border || 'rgba(184, 115, 51, 0.3)'}
                    disabled={isGenerating}
                  >
                    <option value="1-column">1 Column</option>
                    <option value="2-columns">2 Columns (Equal)</option>
                    <option value="3-columns">3 Columns</option>
                    <option value="2-columns-wide-left">2 Columns (Wide Left)</option>
                    <option value="2-columns-wide-right">2 Columns (Wide Right)</option>
                    <option value="grid-2x2">Grid 2x2</option>
                    <option value="grid-3x3">Grid 3x3</option>
                    <option value="grid-2x3">Grid 2x3</option>
                    <option value="grid-4-even">Grid 4 (Even)</option>
                  </select>
                </div>
              )}

              {generationError && (
                <div
                  className="p-4 border"
                  style={{
                    backgroundColor: colors?.errorBg || 'rgba(153, 27, 27, 0.2)',
                    borderColor: colors?.error || 'rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <p
                    className="text-sm"
                    style={{ color: colors?.error || '#FCA5A5' }}
                  >
                    {generationError}
                  </p>
                </div>
              )}

              {/* Generation Progress in Dialog */}
              {isGenerating && generateAction === "complete" && (
                <div className="p-4 border rounded" style={{
                  backgroundColor: colors?.background || '#0A192F',
                  borderColor: colors?.border || 'rgba(184, 115, 51, 0.2)',
                }}>
                  {generationPhase === "layout" && (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: colors?.primary || '#B87333' }}></div>
                      <span className="text-sm" style={{ color: colors?.text || '#F2F5F7' }}>
                        Generating blog structure...
                      </span>
                    </div>
                  )}
                  {generationPhase === "sections" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full h-5 w-5 flex items-center justify-center text-xs" style={{
                          backgroundColor: colors?.primary || '#B87333',
                          color: colors?.buttonPrimaryText || '#0A192F'
                        }}>
                          ✓
                        </div>
                        <span className="text-sm" style={{ color: colors?.text || '#F2F5F7' }}>
                          Layout ready! Generating content...
                        </span>
                      </div>
                      {generatingSections.size > 0 && (
                        <div className="ml-8 text-xs" style={{ color: colors?.textMuted || 'rgba(242, 245, 247, 0.7)' }}>
                          {generatingSections.size} section{generatingSections.size > 1 ? 's' : ''} remaining...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div
              className="flex gap-3 justify-end pt-4 border-t"
              style={{ borderColor: colors?.dialogBorder || colors?.border || 'rgba(184, 115, 51, 0.2)' }}
            >
              <button
                onClick={() => setShowGenerateDialog(false)}
                className="px-6 py-2.5 border transition-all font-['Inter']"
                style={{
                  borderColor: colors?.buttonSecondary || 'rgba(242, 245, 247, 0.2)',
                  color: colors?.buttonSecondaryText || colors?.text || '#F2F5F7',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors?.accent || colors?.primary || 'rgba(184, 115, 51, 0.5)';
                  e.currentTarget.style.color = colors?.accent || colors?.primary || '#B87333';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors?.buttonSecondary || 'rgba(242, 245, 247, 0.2)';
                  e.currentTarget.style.color = colors?.buttonSecondaryText || colors?.text || '#F2F5F7';
                }}
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || (generateAction !== "seo" && !generatePrompt.trim())}
                className="px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-['Inter'] font-medium"
                style={{
                  backgroundColor: colors?.buttonPrimary || colors?.accent || colors?.primary || '#B87333',
                  color: colors?.buttonPrimaryText || colors?.background || '#0A192F',
                }}
                onMouseEnter={(e) => {
                  if (!isGenerating && (generateAction === "seo" || generatePrompt.trim())) {
                    e.currentTarget.style.opacity = '0.9';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0A192F]"></span>
                    Generating...
                  </span>
                ) : (
                  "Generate"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}