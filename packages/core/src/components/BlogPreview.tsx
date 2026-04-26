"use client";

import type { LayoutSection } from "../types";
import { getLayoutClasses } from "../utils";
import { ContentBlockRenderer } from "./ContentBlockRenderer";
import { calculateReadingTimeFromSections, formatReadingTime } from "../utils/seo-analysis";

export interface BlogPreviewTheme {
  /** Main container wrapper classes */
  container?: string;
  /** Header section classes */
  header?: string;
  /** Article title classes */
  title?: string;
  /** Excerpt/subtitle classes */
  excerpt?: string;
  /** Metadata (date, reading time) classes */
  meta?: string;
  /** Article content wrapper classes */
  article?: string;
  /** Section wrapper classes */
  section?: string;
  /** Column wrapper classes */
  column?: string;
  /** Empty state container classes */
  emptyContainer?: string;
  /** Empty state text classes */
  emptyText?: string;
  /** "No title" placeholder classes */
  noTitlePlaceholder?: string;
}

export interface BlogPreviewProps {
  /** Article title */
  title: string;
  /** Article content sections */
  sections: LayoutSection[];
  /** Article excerpt/subtitle */
  excerpt?: string;
  /** Optional image component (e.g., Next.js Image) */
  ImageComponent?: React.ComponentType<{
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
  }>;
  /** Custom theme classes */
  theme?: BlogPreviewTheme;
  /** @deprecated Use theme instead */
  classNames?: BlogPreviewTheme;
  /** Show reading time estimate */
  showReadingTime?: boolean;
  /** Custom date to display (ISO string or Date object) */
  date?: string | Date;
  /** Custom reading time text (overrides automatic calculation) */
  readingTimeText?: string;
  /** Date locale (default: "fr-FR") */
  dateLocale?: string;
  /** Show metadata (date, reading time) */
  showMeta?: boolean;
  /** Custom "no title" placeholder text */
  noTitleText?: string;
  /** Custom empty state message */
  emptyStateMessage?: string;
  /** Custom empty state helper text */
  emptyStateHelper?: string;
}

export function BlogPreview({
  title,
  sections,
  excerpt,
  ImageComponent,
  theme,
  classNames,
  showReadingTime = false,
  date,
  readingTimeText,
  dateLocale = "fr-FR",
  showMeta = true,
  noTitleText = "Sans titre",
  emptyStateMessage = "Aucun contenu pour le moment",
  emptyStateHelper = "Ajoutez des sections pour voir le preview",
}: BlogPreviewProps) {
  // Merge theme with classNames (classNames for backward compatibility)
  const styles = theme || classNames;

  // Calculate reading time if enabled
  const readingTime = showReadingTime
    ? (readingTimeText || formatReadingTime(calculateReadingTimeFromSections(sections)))
    : null;

  // Format date
  const displayDate = date ? new Date(date) : new Date();
  const formattedDate = displayDate.toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className={styles?.container || "max-w-4xl mx-auto px-4 py-8"}>
      {/* Article Header */}
      <header className={styles?.header || "mb-12"}>
        {title ? (
          <h1 className={styles?.title || "text-4xl md:text-5xl font-bold mb-4"}>{title}</h1>
        ) : (
          <div className={styles?.noTitlePlaceholder || "text-4xl text-muted-foreground italic"}>
            {noTitleText}
          </div>
        )}
        {excerpt && (
          <p className={styles?.excerpt || "text-xl text-muted-foreground mb-6"}>{excerpt}</p>
        )}
        {showMeta && (
          <div className={styles?.meta || "flex items-center gap-4 text-sm text-muted-foreground"}>
            <time dateTime={displayDate.toISOString()}>{formattedDate}</time>
            {readingTime && (
              <>
                <span aria-hidden="true">•</span>
                <span>{readingTime}</span>
              </>
            )}
          </div>
        )}
      </header>

      {/* Article Content */}
      {sections.length === 0 ? (
        <div className={styles?.emptyContainer || "text-center py-20 text-muted-foreground"}>
          <p className={styles?.emptyText}>{emptyStateMessage}</p>
          {emptyStateHelper && (
            <p className="text-sm mt-2">{emptyStateHelper}</p>
          )}
        </div>
      ) : (
        <article className={styles?.article || "space-y-8"}>
          {sections.filter(Boolean).map((section) => (
            <section key={section.id} className={styles?.section || "mb-8"}>
              <div className={`grid gap-6 ${getLayoutClasses(section.type)}`}>
                {(section.columns || []).map((column, columnIndex) => (
                  <div key={columnIndex} className={styles?.column || "flex flex-col justify-center space-y-4 min-w-0 overflow-hidden"}>
                    {column.length === 0 ? (
                      <div className="text-muted-foreground text-sm italic">
                        Colonne vide
                      </div>
                    ) : (
                      column.map((block) => (
                        <ContentBlockRenderer
                          key={block.id}
                          block={block}
                          ImageComponent={ImageComponent}
                        />
                      ))
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </article>
      )}
    </div>
  );
}
