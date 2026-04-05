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
import type { BlogPostRow } from "../../types/database";
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
}): JSX.Element {
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
}): JSX.Element {
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
}): JSX.Element {
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
  const { components, labels, basePath, features, navigate } = useBlogAdminContext();
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

  const Button = components.Button;
  const Input = components.Input;
  const Card = components.Card;
  const { BlogBuilder, ...blogBuilderComponents } = components;

  // Load existing post if editing
  useEffect(() => {
    if (!postId) return;

    async function loadPost() {
      try {
        const post = await getPost(postId);
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
        savedPost = await createPost(postData);
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
        savedPost = await createPost(postData);
        navigateToPath(buildPath(basePath, "edit", { id: savedPost.id }));
      }

      markAsSaved();
    } catch (err) {
      console.error("Error publishing post:", err);
      setSaving(false);
    }
  };

  // AI Generation handlers
  const apiClient = new BlogAdminAPIClient(basePath);

  const handleGenerateComplete = async (): Promise<void> => {
    if (!generatePrompt.trim()) {
      setGenerationError("Please enter a topic or prompt");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const result = await apiClient.generateBlogPost({
        prompt: generatePrompt,
        length: "medium",
        tone: "professional",
      });

      // Update all fields with generated content
      updateField("title", result.title);
      updateField("slug", result.slug);
      updateField("excerpt", result.excerpt);
      updateField("sections", result.sections);
      updateField("category", result.category || "");
      updateField("tags", result.tags || []);
      updateField("seo_metadata", result.seo_metadata || {});

      setShowGenerateDialog(false);
      setGeneratePrompt("");
    } catch (err: any) {
      console.error("Error generating blog post:", err);
      setGenerationError(err.message || "Failed to generate blog post. Please try again.");
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
      updateField("seo_metadata", result.seo_metadata || {});
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - BlogBuilder */}
        <div className="lg:col-span-2 space-y-6">
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
          {BlogBuilder && (
            <CardWrapper Card={Card}>
              <div className="p-6">
                <BlogBuilder
                  sections={state.sections}
                  onChange={(sections: any) => updateField("sections", sections)}
                  components={blogBuilderComponents}
                  onImproveContent={handleImproveContent}
                />
              </div>
            </CardWrapper>
          )}
        </div>

        {/* Sidebar - Metadata */}
        <div className="space-y-6">
          {/* Taxonomy */}
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

          {/* Featured Image */}
          {features.featuredImage && (
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
          )}

          {/* Excerpt */}
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

          {/* SEO */}
          {features.seo && (
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {generateAction === "complete" && "Generate Full Blog Post"}
                {generateAction === "section" && "Generate Section"}
                {generateAction === "seo" && "Generate SEO Metadata"}
              </h2>
              <button
                onClick={() => setShowGenerateDialog(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={isGenerating}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {generateAction === "complete" &&
                  "Describe the topic or theme for your blog post. The AI will generate a complete post with title, sections, and SEO metadata."}
                {generateAction === "section" &&
                  "Describe what this section should cover. You can also choose the layout type."}
                {generateAction === "seo" &&
                  "AI will analyze your post content and generate optimized SEO metadata including meta description, keywords, and social media tags."}
              </p>

              {generateAction !== "seo" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
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
                    className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isGenerating}
                  />
                </div>
              )}

              {generateAction === "section" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Layout Type</label>
                  <select
                    value={selectedLayoutType}
                    onChange={(e) => setSelectedLayoutType(e.target.value as LayoutType)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{generationError}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowGenerateDialog(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || (generateAction !== "seo" && !generatePrompt.trim())}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
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