"use client";

/**
 * usePostEditor Hook
 * Manages post editor state and auto-save
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { useBlogAdminContext } from "../context/BlogAdminContext";
import { savePreviewData, clearPreviewData } from "../utils/storage";
import { sanitizeSections } from "../utils/sanitize";
import type { BlogPostRow, BlogPostInsert, BlogPostUpdate } from "../../types/database";
import type { LayoutSection } from "../../types";

export interface PostEditorState {
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  category: string;
  tags: string[];
  sections: LayoutSection[];
  status: "draft" | "published" | "archived";
  seo_metadata: {
    metaTitle: string;
    metaDescription: string;
  };
}

export function usePostEditor(initialPost?: BlogPostRow) {
  const { features, currentUser, basePath } = useBlogAdminContext();

  // Editor state
  const [state, setState] = useState<PostEditorState>(() => ({
    title: initialPost?.title || "",
    slug: initialPost?.slug || "",
    excerpt: initialPost?.excerpt || "",
    featured_image: initialPost?.featured_image || "",
    category: initialPost?.category || "",
    tags: initialPost?.tags || [],
    sections: sanitizeSections(initialPost?.sections),
    status: initialPost?.status || "draft",
    seo_metadata: {
      metaTitle: (initialPost?.seo_metadata as any)?.metaTitle || "",
      metaDescription: (initialPost?.seo_metadata as any)?.metaDescription || "",
    },
  }));

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Update a field in the state
   */
  const updateField = useCallback(<K extends keyof PostEditorState>(
    field: K,
    value: PostEditorState[K]
  ) => {
    setState((prev) => ({
      ...prev,
      [field]: field === "sections" ? sanitizeSections(value) : value,
    }));
    setIsDirty(true);
  }, []);

  const updateSectionAtIndex = useCallback((index: number, section: LayoutSection) => {
    setState((prev) => {
      const next = [...prev.sections];
      const sanitizedSection = sanitizeSections([section])[0];
      if (!sanitizedSection) {
        return prev;
      }
      const existingSection = next[index];
      next[index] = existingSection
        ? {
            ...sanitizedSection,
            id: existingSection.id,
          }
        : sanitizedSection;
      return { ...prev, sections: next };
    });
    setIsDirty(true);
  }, []);

  useEffect(() => {
    if (!initialPost) return;

    setState({
      title: initialPost.title || "",
      slug: initialPost.slug || "",
      excerpt: initialPost.excerpt || "",
      featured_image: initialPost.featured_image || "",
      category: initialPost.category || "",
      tags: initialPost.tags || [],
      sections: sanitizeSections(initialPost.sections),
      status: initialPost.status || "draft",
      seo_metadata: {
        metaTitle: (initialPost.seo_metadata as any)?.metaTitle || "",
        metaDescription: (initialPost.seo_metadata as any)?.metaDescription || "",
      },
    });
  }, [initialPost]);

  const updateSEO = useCallback((field: "metaTitle" | "metaDescription", value: string) => {
    setState((prev) => ({
      ...prev,
      seo_metadata: {
        ...prev.seo_metadata,
        [field]: value,
      },
    }));
    setIsDirty(true);
  }, []);

  /**
   * Open preview in new tab
   */
  const openPreview = useCallback(() => {
    if (!features.preview) return;

    const previewSlug = state.slug || "draft";

    // Save current state to sessionStorage
      savePreviewData(previewSlug, {
        title: state.title,
        sections: sanitizeSections(state.sections),
        excerpt: state.excerpt,
        featured_image: state.featured_image,
        category: state.category,
      tags: state.tags,
    });

    // Open preview in new tab
    window.open(`${basePath}/preview/${previewSlug}`, "_blank");
  }, [state, features.preview, basePath]);

  /**
   * Auto-save to sessionStorage
   */
  useEffect(() => {
    if (!features.autoSave || !isDirty) return;

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new timer
    autoSaveTimerRef.current = setTimeout(() => {
      const key = state.slug || "draft";
      savePreviewData(key, {
        title: state.title,
        sections: sanitizeSections(state.sections),
        excerpt: state.excerpt,
        featured_image: state.featured_image,
        category: state.category,
        tags: state.tags,
      });
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [state, isDirty, features.autoSave]);

  /**
   * Prepare post data for API
   */
  const preparePostData = useCallback((): BlogPostInsert | BlogPostUpdate => {
    return {
      title: state.title,
      slug: state.slug,
      excerpt: state.excerpt || null,
      featured_image: state.featured_image || null,
      sections: sanitizeSections(state.sections),
      category: state.category || null,
      tags: state.tags,
      status: state.status,
      seo_metadata: {
        metaTitle: state.seo_metadata.metaTitle || state.title,
        metaDescription: state.seo_metadata.metaDescription || state.excerpt,
        ogTitle: state.seo_metadata.metaTitle || state.title,
        ogDescription: state.seo_metadata.metaDescription || state.excerpt,
        ogImage: state.featured_image || null,
        twitterTitle: state.seo_metadata.metaTitle || state.title,
        twitterDescription: state.seo_metadata.metaDescription || state.excerpt,
        twitterImage: state.featured_image || null,
      },
      created_by: currentUser?.id || null,
    };
  }, [state, currentUser]);

  /**
   * Mark as saved (clear dirty flag)
   */
  const markAsSaved = useCallback(() => {
    setIsDirty(false);
    setIsSaving(false);
    // Clear preview data after successful save
    if (state.slug) {
      clearPreviewData(state.slug);
    }
  }, [state.slug]);

  /**
   * Set saving state
   */
  const setSaving = useCallback((saving: boolean) => {
    setIsSaving(saving);
  }, []);

  return {
    state,
    isDirty,
    isSaving,
    updateField,
    updateSectionAtIndex,
    updateSEO,
    openPreview,
    preparePostData,
    markAsSaved,
    setSaving,
  };
}
