"use client";

/**
 * TaxonomySelector Component
 * Displays category dropdown and tag selection with inline creation
 */

import { useState } from "react";
import { useBlogAdminContext } from "../context/BlogAdminContext";
import { useTaxonomy } from "../hooks/useTaxonomy";

export interface TaxonomySelectorProps {
  selectedCategory?: string;
  selectedTags: string[];
  onCategoryChange: (category: string) => void;
  onTagsChange: (tags: string[]) => void;
  onCreateCategory?: () => void;
  onCreateTag?: () => void;
}

export function TaxonomySelector({
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagsChange,
  onCreateCategory,
  onCreateTag,
}: TaxonomySelectorProps) {
  const { components, labels, features } = useBlogAdminContext();
  const { categories, tags, loading } = useTaxonomy();
  const [tagSearchQuery, setTagSearchQuery] = useState("");

  const Select = components?.Select;
  const Badge = components?.Badge;
  const Button = components?.Button;
  const Input = components?.Input;

  // Filter tags based on search
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
  );

  // Toggle tag selection
  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter((t) => t !== tagName));
    } else {
      onTagsChange([...selectedTags, tagName]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      {features.categories && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{labels.category}</label>
            {onCreateCategory && Button && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCreateCategory}
                className="h-8 text-xs"
              >
                + {labels.newCategory}
              </Button>
            )}
          </div>

          {Select ? (
            <Select
              value={selectedCategory}
              onValueChange={onCategoryChange}
              disabled={loading}
            >
              <option value="">{labels.selectCategory}</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Select>
          ) : (
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">{labels.selectCategory}</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Tags Selection */}
      {features.tags && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{labels.tags}</label>
            {onCreateTag && Button && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCreateTag}
                className="h-8 text-xs"
              >
                + {labels.newTag}
              </Button>
            )}
          </div>

          {/* Tag Search */}
          {Input ? (
            <Input
              placeholder={labels.searchTags}
              value={tagSearchQuery}
              onChange={(e: any) => setTagSearchQuery(e.target.value)}
              disabled={loading}
            />
          ) : (
            <input
              type="text"
              placeholder={labels.searchTags}
              value={tagSearchQuery}
              onChange={(e) => setTagSearchQuery(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border rounded-md"
            />
          )}

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md">
              {selectedTags.map((tagName) => {
                const tag = tags.find((t) => t.name === tagName);
                return Badge ? (
                  <Badge
                    key={tagName}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => toggleTag(tagName)}
                  >
                    {tagName} ×
                  </Badge>
                ) : (
                  <span
                    key={tagName}
                    onClick={() => toggleTag(tagName)}
                    className="px-2 py-1 bg-secondary text-xs rounded cursor-pointer"
                  >
                    {tagName} ×
                  </span>
                );
              })}
            </div>
          )}

          {/* Available Tags */}
          <div className="max-h-48 overflow-y-auto border rounded-md p-2">
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {labels.loading}
              </p>
            ) : filteredTags.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {labels.noTags}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.name);
                  return Badge ? (
                    <Badge
                      key={tag.slug}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag.name)}
                    >
                      {tag.name}
                    </Badge>
                  ) : (
                    <span
                      key={tag.slug}
                      onClick={() => toggleTag(tag.name)}
                      className={`px-2 py-1 text-xs rounded cursor-pointer border ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-background"
                      }`}
                    >
                      {tag.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
