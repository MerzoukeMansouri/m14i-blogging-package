"use client";

/**
 * ListView Component
 * Displays blog posts table with filters, search, and pagination
 */

import { useState, useEffect } from "react";
import { useBlogAdminContext } from "../context/BlogAdminContext";
import { usePosts } from "../hooks/usePosts";
import { useTaxonomy } from "../hooks/useTaxonomy";
import { buildPath } from "../utils/router";
import type { BlogFilterParams } from "../../types/database";

export function ListView() {
  const { components, labels, basePath, navigate } = useBlogAdminContext();
  const { posts, total, loading, error, fetchPosts, deletePost, publishPost } = usePosts();
  const { categories, tags } = useTaxonomy();

  const Button = components?.Button;
  const Input = components?.Input;
  const Badge = components?.Badge;

  // Filters state
  const [filters, setFilters] = useState<BlogFilterParams>({
    page: 1,
    pageSize: 10,
    status: undefined,
    category: undefined,
    tag: undefined,
    search: undefined,
  });

  const [searchInput, setSearchInput] = useState("");

  // Fetch posts when filters change
  useEffect(() => {
    fetchPosts(filters);
  }, [filters, fetchPosts]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput || undefined, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle filter changes
  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status === "all" ? undefined : (status as any),
      page: 1,
    }));
  };

  const handleCategoryFilter = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category === "all" ? undefined : category,
      page: 1,
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm(labels.confirmDelete)) return;

    try {
      await deletePost(id);
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishPost(id);
    } catch (err) {
      console.error("Error publishing post:", err);
    }
  };

  const totalPages = Math.ceil(total / (filters.pageSize || 10));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{labels.posts}</h1>
          <p className="text-muted-foreground">
            {total} {total === 1 ? "article" : "articles"}
          </p>
        </div>
        <div className="flex gap-3">
          {Button ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = `${basePath}/context`;
                }}
              >
                ⚙️ Brand Context
              </Button>
              <Button onClick={() => {
                const path = buildPath(basePath, "create");
                navigate ? navigate(path) : (window.location.href = path);
              }}>
                {labels.newPost}
              </Button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  window.location.href = `${basePath}/context`;
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                ⚙️ Brand Context
              </button>
              <button
                onClick={() => {
                  const path = buildPath(basePath, "create");
                  navigate ? navigate(path) : (window.location.href = path);
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                {labels.newPost}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[240px]">
          {Input ? (
            <Input
              placeholder={labels.search}
              value={searchInput}
              onChange={(e: any) => setSearchInput(e.target.value)}
            />
          ) : (
            <input
              type="text"
              placeholder={labels.search}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          )}
        </div>

        {/* Status Filter */}
        <select
          value={filters.status || "all"}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">{labels.allStatus}</option>
          <option value="draft">{labels.draft}</option>
          <option value="published">{labels.published}</option>
          <option value="archived">{labels.archived}</option>
        </select>

        {/* Category Filter */}
        <select
          value={filters.category || "all"}
          onChange={(e) => handleCategoryFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">{labels.allCategories}</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-md">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{labels.loading}</p>
          </div>
        </div>
      )}

      {/* Posts Table */}
      {!loading && (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">{labels.title}</th>
                  <th className="text-left p-4 font-medium">{labels.status}</th>
                  <th className="text-left p-4 font-medium">{labels.category}</th>
                  <th className="text-left p-4 font-medium">{labels.tags}</th>
                  <th className="text-left p-4 font-medium">{labels.date}</th>
                  <th className="text-right p-4 font-medium">{labels.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      {labels.noPosts}
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-muted/30">
                      {/* Title */}
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{post.title || labels.untitled}</div>
                          <div className="text-sm text-muted-foreground">{post.slug}</div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {Badge ? (
                          <Badge
                            variant={
                              post.status === "published"
                                ? "default"
                                : post.status === "draft"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {post.status === "published"
                              ? labels.published
                              : post.status === "draft"
                              ? labels.draft
                              : labels.archived}
                          </Badge>
                        ) : (
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              post.status === "published"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary"
                            }`}
                          >
                            {post.status === "published"
                              ? labels.published
                              : post.status === "draft"
                              ? labels.draft
                              : labels.archived}
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        {post.category && (
                          Badge ? (
                            <Badge variant="outline">{post.category}</Badge>
                          ) : (
                            <span className="px-2 py-1 text-xs border rounded">
                              {post.category}
                            </span>
                          )
                        )}
                      </td>

                      {/* Tags */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {post.tags?.slice(0, 2).map((tag) =>
                            Badge ? (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ) : (
                              <span key={tag} className="px-1.5 py-0.5 bg-secondary text-xs rounded">
                                {tag}
                              </span>
                            )
                          )}
                          {post.tags && post.tags.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{post.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          {Button ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const path = buildPath(basePath, "edit", { id: post.id });
                                  navigate ? navigate(path) : (window.location.href = path);
                                }}
                              >
                                {labels.edit}
                              </Button>
                              {post.status === "draft" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePublish(post.id)}
                                >
                                  {labels.publish}
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(post.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                {labels.delete}
                              </Button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  const path = buildPath(basePath, "edit", { id: post.id });
                                  navigate ? navigate(path) : (window.location.href = path);
                                }}
                                className="px-2 py-1 text-sm hover:bg-accent rounded"
                              >
                                {labels.edit}
                              </button>
                              {post.status === "draft" && (
                                <button
                                  onClick={() => handlePublish(post.id)}
                                  className="px-2 py-1 text-sm hover:bg-accent rounded"
                                >
                                  {labels.publish}
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(post.id)}
                                className="px-2 py-1 text-sm text-destructive hover:bg-destructive/10 rounded"
                              >
                                {labels.delete}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {filters.page} sur {totalPages}
          </p>
          <div className="flex gap-2">
            {Button ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
                  disabled={filters.page === 1}
                >
                  {labels.previous}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
                  disabled={filters.page === totalPages}
                >
                  {labels.next}
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
                  disabled={filters.page === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  {labels.previous}
                </button>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
                  disabled={filters.page === totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  {labels.next}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
