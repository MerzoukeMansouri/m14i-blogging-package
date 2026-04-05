"use client";

/**
 * CategoryDialog Component
 * Modal for creating new categories
 */

import { useState } from "react";
import { useBlogAdminContext } from "../context/BlogAdminContext";
import { useTaxonomy } from "../hooks/useTaxonomy";
import type { CategoryInsert } from "../../types/database";

export interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (category: any) => void;
}

export function CategoryDialog({
  open,
  onOpenChange,
  onSuccess,
}: CategoryDialogProps) {
  const { components, labels } = useBlogAdminContext();
  const { createCategory } = useTaxonomy();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    icon: "",
    description: "",
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
      const categoryData: CategoryInsert = {
        name: formData.name,
        slug: formData.slug,
        icon: formData.icon || null,
        description: formData.description || null,
        color: formData.color || null,
      };

      const newCategory = await createCategory(categoryData);
      onSuccess?.(newCategory);
      onOpenChange(false);

      // Reset form
      setFormData({
        name: "",
        slug: "",
        icon: "",
        description: "",
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
        <h2 className="text-lg font-semibold">{labels.newCategory}</h2>
        <p className="text-sm text-muted-foreground">
          Créer une nouvelle catégorie pour organiser vos articles
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
          <label htmlFor="name" className="text-sm font-medium">
            {labels.name} *
          </label>
          {Input ? (
            <Input
              id="name"
              value={formData.name}
              onChange={(e: any) => handleNameChange(e.target.value)}
              required
              placeholder="Ex: Tutoriels"
              disabled={isSubmitting}
            />
          ) : (
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              placeholder="Ex: Tutoriels"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border rounded-md"
            />
          )}
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium">
            {labels.slug} *
          </label>
          {Input ? (
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e: any) => setFormData({ ...formData, slug: e.target.value })}
              required
              placeholder="tutoriels"
              disabled={isSubmitting}
            />
          ) : (
            <input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              placeholder="tutoriels"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border rounded-md"
            />
          )}
          <p className="text-xs text-muted-foreground">
            URL-friendly identifier (auto-généré)
          </p>
        </div>

        {/* Icon (optional) */}
        <div className="space-y-2">
          <label htmlFor="icon" className="text-sm font-medium">
            {labels.icon}
          </label>
          {Input ? (
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e: any) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="📚"
              disabled={isSubmitting}
            />
          ) : (
            <input
              id="icon"
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="📚"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border rounded-md"
            />
          )}
          <p className="text-xs text-muted-foreground">Emoji ou icône</p>
        </div>

        {/* Color (optional) */}
        <div className="space-y-2">
          <label htmlFor="color" className="text-sm font-medium">
            {labels.color}
          </label>
          <div className="flex gap-2">
            <input
              id="color"
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
        </div>

        {/* Description (optional) */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            {labels.description}
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description de la catégorie"
            disabled={isSubmitting}
            rows={3}
            className="w-full px-3 py-2 border rounded-md resize-none"
          />
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
