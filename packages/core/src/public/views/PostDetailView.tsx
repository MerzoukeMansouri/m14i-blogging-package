"use client";

/**
 * PostDetailView Component
 * View for displaying a single blog post with full content
 */

import { useMemo } from "react";
import { useBlogContext } from "../context/BlogContext";
import { usePost } from "../hooks/usePost";
import { useRelatedPosts } from "../hooks/useRelatedPosts";
import { BlogPreview } from "../../components/BlogPreview";
import { PostCard } from "../components/PostCard";
import { buildPath, navigateTo } from "../utils/router";
import {
  formatDate,
  getPostReadingTime,
  formatReadingTime,
} from "../utils/formatting";

export interface PostDetailViewProps {
  slug: string;
  className?: string;
}

/**
 * PostDetailView for displaying a single post
 */
export function PostDetailView({ slug, className = "" }: PostDetailViewProps) {
  const { basePath, display, labels, features, classNames, components, navigate } = useBlogContext();

  const { post, isLoading, error } = usePost(slug);
  const { relatedPosts } = useRelatedPosts(post?.id);

  const { Badge = "span", Button = "button" } = components || {};

  const readingTime = useMemo(() => {
    if (!post || !display.showReadingTime) return null;
    const minutes = getPostReadingTime(post);
    return formatReadingTime(minutes, labels);
  }, [post, display.showReadingTime, labels]);

  const handleBackClick = () => {
    const path = buildPath(basePath, "list");
    if (navigate) {
      navigate(path);
    } else {
      navigateTo(path);
    }
  };

  if (error) {
    return (
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        <div className="text-center py-12">
          <p className="text-red-500">{labels.error}</p>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button variant="default" className="mt-4" onClick={handleBackClick}>
            {labels.backToBlog}
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !post) {
    return (
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        <div className="text-center py-12">
          <p className="text-muted-foreground">{labels.loading}</p>
          <pre className="text-left text-xs mt-4 max-w-2xl mx-auto overflow-auto">
            {JSON.stringify({ isLoading, post, error, slug }, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${classNames?.container || ""} ${className}`}>
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={handleBackClick}>
          ← {labels.backToBlog}
        </Button>
      </div>

      {/* Post Header */}
      <article className={`max-w-4xl mx-auto ${classNames?.postContent || ""}`}>
        <header className={`mb-8 ${classNames?.header || ""}`}>
          {/* Metadata */}
          <div className={`flex flex-wrap items-center gap-3 mb-4 ${classNames?.postMeta || ""}`}>
            {display.showCategory && post.category && (
              <Badge variant="secondary" className={classNames?.categoryBadge}>
                {post.category}
              </Badge>
            )}

            {display.showDate && post.published_at && (
              <span className="text-sm text-muted-foreground">
                {labels.publishedOn} {formatDate(post.published_at)}
              </span>
            )}

            {readingTime && (
              <span className="text-sm text-muted-foreground">{readingTime}</span>
            )}
          </div>

          {/* Title */}
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${classNames?.postTitle || ""}`}>
            {post.title}
          </h1>

          {/* Author */}
          {display.showAuthor && post.author_info && (
            <p className="text-lg text-muted-foreground">
              {labels.by} {post.author_info.name}
            </p>
          )}

          {/* Tags */}
          {display.showTags && post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className={classNames?.tagBadge}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {display.showFeaturedImage && post.featured_image && (
          <div className={`mb-8 ${classNames?.postImage || ""}`}>
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full rounded-lg"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-lg max-w-none">
          <BlogPreview title={post.title} sections={post.sections} />
        </div>
      </article>

      {/* Related Posts */}
      {features.relatedPosts && relatedPosts.length > 0 && (
        <aside className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6">{labels.relatedPosts}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
