"use client";

/**
 * TagDialog Component
 * Modal for creating new tags
 */

import { useState } from "react";
import { useBlogAdminContext } from "../context/BlogAdminContext";
import { useTaxonomy } from "../hooks/useTaxonomy";
import type { TagInsert } from "../../types/database";

export interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (tag: any) => void;
}

export function TagDialog({ open, onOpenChange, onSuccess }: TagDialogProps) {
  const { components, labels } = useBlogAdminContext();
  const { createTag } = useTaxonomy();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    color: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const Dialog = components.Dialog;
  const Input = components.Input;
  const Button = components.Button;

  // Generate slug from name
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const tagData: TagInsert = {
        name: formData.name,
        slug: formData.slug,
        color: formData.color || null,
      };

      const newTag = await createTag(tagData);
      onSuccess?.(newTag);
      onOpenChange(false);

      // Reset form
      setFormData({
        name: "",
        slug: "",
        color: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{labels.newTag}</h2>
        <p className="text-sm text-muted-foreground">
          Créer un nouveau tag pour classifier vos articles
        </p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive text-destructive text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="tag-name" className="text-sm font-medium">
            {labels.name} *
          </label>
          {Input ? (
            <Input
              id="tag-name"
              value={formData.name}
              onChange={(e: any) => handleNameChange(e.target.value)}
              required
              placeholder="Ex: React"
              disabled={isSubmitting}
            />
          ) : (
            <input
              id="tag-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              placeholder="Ex: React"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border rounded-md"
            />
          )}
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label htmlFor="tag-slug" className="text-sm font-medium">
            {labels.slug} *
          </label>
          {Input ? (
            <Input
              id="tag-slug"
              value={formData.slug}
              onChange={(e: any) => setFormData({ ...formData, slug: e.target.value })}
              required
              placeholder="react"
              disabled={isSubmitting}
            />
          ) : (
            <input
              id="tag-slug"
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              placeholder="react"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border rounded-md"
            />
          )}
          <p className="text-xs text-muted-foreground">
            URL-friendly identifier (auto-généré)
          </p>
        </div>

        {/* Color (optional) */}
        <div className="space-y-2">
          <label htmlFor="tag-color" className="text-sm font-medium">
            {labels.color}
          </label>
          <div className="flex gap-2">
            <input
              id="tag-color"
              type="color"
              value={formData.color || "#3b82f6"}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              disabled={isSubmitting}
              className="h-10 w-20 border rounded-md cursor-pointer"
            />
            {Input ? (
              <Input
                value={formData.color}
                onChange={(e: any) => setFormData({ ...formData, color: e.target.value })}
                placeholder="#3b82f6"
                disabled={isSubmitting}
                className="flex-1"
              />
            ) : (
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="#3b82f6"
                disabled={isSubmitting}
                className="flex-1 px-3 py-2 border rounded-md"
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Couleur d'affichage du tag
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        {Button ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {labels.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? labels.saving : labels.create}
            </Button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="px-4 py-2 border rounded-md"
            >
              {labels.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              {isSubmitting ? labels.saving : labels.create}
            </button>
          </>
        )}
      </div>
    </form>
  );

  if (Dialog) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <div className="p-6">{dialogContent}</div>
      </Dialog>
    );
  }

  // Fallback: Simple modal without Dialog component
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4 shadow-lg">
        {dialogContent}
      </div>
    </div>
  );
}
