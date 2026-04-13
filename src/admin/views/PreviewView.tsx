"use client";

/**
 * PreviewView Component
 * Displays blog post preview with data from sessionStorage or API
 */

import { useState, useEffect } from "react";
import { useBlogAdminContext } from "../context/BlogAdminContext";
import { loadPreviewData } from "../utils/storage";
import { sanitizeSections } from "../utils/sanitize";
import { BlogPreview } from "../../components/BlogPreview";
import type { PreviewData } from "../types";

export interface PreviewViewProps {
  slug: string;
}

export function PreviewView({ slug }: PreviewViewProps) {
  const { apiClient, labels } = useBlogAdminContext();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // First, try to load from sessionStorage (for unsaved drafts)
        const storedData = loadPreviewData(slug);

        if (storedData) {
          setPreviewData({
            ...storedData,
            sections: sanitizeSections(storedData.sections),
          });
          setLoading(false);
          return;
        }

        // If not in sessionStorage, try to fetch from API
        try {
          const post = await apiClient.getPostBySlug(slug);
          setPreviewData({
            title: post.title,
            sections: sanitizeSections(post.sections),
            excerpt: post.excerpt || undefined,
            featured_image: post.featured_image || undefined,
            category: post.category || undefined,
            tags: post.tags || [],
          });
        } catch (apiError) {
          // If slug doesn't exist, try fetching by ID (for new posts)
          setError("Article introuvable");
        }
      } catch (err) {
        console.error("Error loading preview data:", err);
        setError(labels.error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug, apiClient, labels.error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{labels.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !previewData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-2">{error || "Aucune donnée d'aperçu"}</h2>
          <p className="text-muted-foreground mb-6">
            Impossible de charger l'aperçu de cet article
          </p>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Header */}
      <div className="bg-background/95 border-b sticky top-0 z-50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-primary/20 border border-primary text-primary text-xs font-semibold rounded">
                MODE APERÇU
              </div>
              <h1 className="text-lg font-semibold">
                {previewData.title || "Sans titre"}
              </h1>
            </div>
            <button
              onClick={() => window.close()}
              className="px-3 py-1.5 text-sm border rounded-md hover:bg-accent"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {previewData.featured_image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={previewData.featured_image}
              alt={previewData.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {(previewData.category || previewData.tags.length > 0) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {previewData.category && (
              <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded">
                {previewData.category}
              </span>
            )}
            {previewData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 border text-sm rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <BlogPreview
          title={previewData.title}
          sections={previewData.sections}
          showReadingTime={true}
        />
      </div>

      {/* Preview Footer */}
      <div className="border-t mt-12 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-muted-foreground text-sm">
          Ceci est un aperçu. Les modifications ne sont pas enregistrées.
        </div>
      </div>
    </div>
  );
}
