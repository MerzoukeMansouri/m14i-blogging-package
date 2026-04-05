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
import type { BlogPostRow } from "../../types/database";

export interface EditorViewProps {
  postId?: string;
}

export function EditorView({ postId }: EditorViewProps) {
  const { components, labels, basePath, features, navigate } = useBlogAdminContext();
  const { getPost, createPost, updatePost } = usePosts();
  const [initialPost, setInitialPost] = useState<BlogPostRow | undefined>();
  const [loadingPost, setLoadingPost] = useState(!!postId);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);

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

  // Handle save (draft or update)
  const handleSave = async () => {
    setSaving(true);

    try {
      const postData = preparePostData();

      if (postId) {
        // Update existing post
        await updatePost(postId, postData);
      } else {
        // Create new post
        const newPost = await createPost(postData);
        // Navigate to edit view for the new post
        const path = buildPath(basePath, "edit", { id: newPost.id });
        navigate ? navigate(path) : (window.location.href = path);
      }

      markAsSaved();
    } catch (err) {
      console.error("Error saving post:", err);
      setSaving(false);
    }
  };

  // Handle publish
  const handlePublish = async () => {
    setSaving(true);

    try {
      const postData = { ...preparePostData(), status: "published" as const };

      if (postId) {
        await updatePost(postId, postData);
      } else {
        const newPost = await createPost(postData);
        const path = buildPath(basePath, "edit", { id: newPost.id });
        navigate ? navigate(path) : (window.location.href = path);
      }

      markAsSaved();
    } catch (err) {
      console.error("Error publishing post:", err);
      setSaving(false);
    }
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
          {Button ? (
            <Button
              variant="ghost"
              onClick={() => {
                const path = buildPath(basePath, "list");
                navigate ? navigate(path) : (window.location.href = path);
              }}
            >
              ← {labels.back}
            </Button>
          ) : (
            <button
              onClick={() => {
                const path = buildPath(basePath, "list");
                navigate ? navigate(path) : (window.location.href = path);
              }}
              className="px-3 py-1.5 hover:bg-accent rounded"
            >
              ← {labels.back}
            </button>
          )}
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
          {features.preview && Button ? (
            <Button variant="outline" onClick={openPreview}>
              {labels.preview}
            </Button>
          ) : features.preview ? (
            <button
              onClick={openPreview}
              className="px-4 py-2 border rounded-md"
            >
              {labels.preview}
            </button>
          ) : null}

          {Button ? (
            <>
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isSaving || !isDirty}
              >
                {isSaving ? labels.saving : labels.saveDraft}
              </Button>
              <Button onClick={handlePublish} disabled={isSaving}>
                {labels.publish}
              </Button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving || !isDirty}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                {isSaving ? labels.saving : labels.saveDraft}
              </button>
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
              >
                {labels.publish}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - BlogBuilder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          {Card ? (
            <Card>
              <div className="space-y-4 p-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    {labels.title} *
                  </label>
                  {Input ? (
                    <Input
                      id="title"
                      value={state.title}
                      onChange={(e: any) => updateField("title", e.target.value)}
                      placeholder={labels.titlePlaceholder}
                      className="text-2xl font-bold"
                    />
                  ) : (
                    <input
                      id="title"
                      type="text"
                      value={state.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder={labels.titlePlaceholder}
                      className="w-full px-3 py-2 border rounded-md text-2xl font-bold"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-medium">
                    {labels.slug} *
                  </label>
                  {Input ? (
                    <Input
                      id="slug"
                      value={state.slug}
                      onChange={(e: any) => updateField("slug", e.target.value)}
                      placeholder="url-friendly-slug"
                    />
                  ) : (
                    <input
                      id="slug"
                      type="text"
                      value={state.slug}
                      onChange={(e) => updateField("slug", e.target.value)}
                      placeholder="url-friendly-slug"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <div className="border rounded-lg p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  {labels.title} *
                </label>
                <input
                  id="title"
                  type="text"
                  value={state.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder={labels.titlePlaceholder}
                  className="w-full px-3 py-2 border rounded-md text-2xl font-bold"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">
                  {labels.slug} *
                </label>
                <input
                  id="slug"
                  type="text"
                  value={state.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="url-friendly-slug"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          )}

          {/* BlogBuilder */}
          {BlogBuilder && (
            <Card>
              <div className="p-6">
                <BlogBuilder
                  sections={state.sections}
                  onChange={(sections: any) => updateField("sections", sections)}
                  components={blogBuilderComponents}
                />
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar - Metadata */}
        <div className="space-y-6">
          {/* Taxonomy */}
          {Card ? (
            <Card>
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
            </Card>
          ) : (
            <div className="border rounded-lg p-6">
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
          )}

          {/* Featured Image */}
          {features.featuredImage && (Card ? (
            <Card>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold">{labels.featuredImage}</h3>
                {Input ? (
                  <Input
                    value={state.featured_image}
                    onChange={(e: any) => updateField("featured_image", e.target.value)}
                    placeholder="https://..."
                  />
                ) : (
                  <input
                    type="text"
                    value={state.featured_image}
                    onChange={(e) => updateField("featured_image", e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border rounded-md"
                  />
                )}
                {state.featured_image && (
                  <img
                    src={state.featured_image}
                    alt="Featured"
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}
              </div>
            </Card>
          ) : (
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">{labels.featuredImage}</h3>
              <input
                type="text"
                value={state.featured_image}
                onChange={(e) => updateField("featured_image", e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border rounded-md"
              />
              {state.featured_image && (
                <img
                  src={state.featured_image}
                  alt="Featured"
                  className="w-full h-40 object-cover rounded-md"
                />
              )}
            </div>
          ))}

          {/* Excerpt */}
          {Card ? (
            <Card>
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
            </Card>
          ) : (
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">{labels.excerpt}</h3>
              <textarea
                value={state.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                placeholder={labels.excerptPlaceholder}
                rows={4}
                className="w-full px-3 py-2 border rounded-md resize-none"
              />
            </div>
          )}

          {/* SEO */}
          {features.seo && (Card ? (
            <Card>
              <div className="p-6 space-y-4">
                <h3 className="font-semibold">{labels.seo}</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Title</label>
                  {Input ? (
                    <Input
                      value={state.seo_metadata.metaTitle}
                      onChange={(e: any) => updateSEO("metaTitle", e.target.value)}
                      placeholder={state.title}
                    />
                  ) : (
                    <input
                      type="text"
                      value={state.seo_metadata.metaTitle}
                      onChange={(e) => updateSEO("metaTitle", e.target.value)}
                      placeholder={state.title}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  )}
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
            </Card>
          ) : (
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">{labels.seo}</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Meta Title</label>
                <input
                  type="text"
                  value={state.seo_metadata.metaTitle}
                  onChange={(e) => updateSEO("metaTitle", e.target.value)}
                  placeholder={state.title}
                  className="w-full px-3 py-2 border rounded-md"
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
          ))}
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
    </div>
  );
}
