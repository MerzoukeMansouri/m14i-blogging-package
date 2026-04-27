"use client";

/**
 * TagDialog Component
 * Modal for entering new tag names (free-text)
 */

import { useState } from "react";
import { useBlogAdminContext } from "../context/BlogAdminContext";

export interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (tag: { name: string }) => void;
}

export function TagDialog({ open, onOpenChange, onSuccess }: TagDialogProps) {
  const { components, labels } = useBlogAdminContext();

  const [name, setName] = useState("");

  const Dialog = components?.Dialog;
  const Input = components?.Input;
  const Button = components?.Button;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    onSuccess?.({ name: name.trim() });
    onOpenChange(false);
    setName("");
  };

  const dialogContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{labels.newTag}</h2>
        <p className="text-sm text-muted-foreground">
          Enter a tag name for your post
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="tag-name" className="text-sm font-medium">
          {labels.name} *
        </label>
        {Input ? (
          <Input
            id="tag-name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            required
            placeholder="Ex: TypeScript"
            autoFocus
          />
        ) : (
          <input
            id="tag-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ex: TypeScript"
            autoFocus
            className="w-full px-3 py-2 border rounded-md"
          />
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {Button ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {labels.cancel}
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {labels.create}
            </Button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {labels.cancel}
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {labels.create}
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-lg">
        {dialogContent}
      </div>
    </div>
  );
}
