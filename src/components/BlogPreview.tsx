"use client";

import type { LayoutSection } from "../types";
import { getLayoutClasses } from "../utils";
import { ContentBlockRenderer } from "./ContentBlockRenderer";
import { calculateReadingTimeFromSections, formatReadingTime } from "../utils/seo-analysis";

interface BlogPreviewProps {
  title: string;
  sections: LayoutSection[];
  ImageComponent?: React.ComponentType<{
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
  }>;
  classNames?: {
    container?: string;
    header?: string;
    title?: string;
    meta?: string;
    article?: string;
    section?: string;
    column?: string;
  };
  /** Show reading time estimate */
  showReadingTime?: boolean;
  /** Custom date to display (ISO string or Date object) */
  date?: string | Date;
  /** Custom reading time text (overrides automatic calculation) */
  readingTimeText?: string;
}

export function BlogPreview({
  title,
  sections,
  ImageComponent,
  classNames,
  showReadingTime = false,
  date,
  readingTimeText
}: BlogPreviewProps) {
  // Calculate reading time if enabled
  const readingTime = showReadingTime
    ? (readingTimeText || formatReadingTime(calculateReadingTimeFromSections(sections)))
    : null;

  // Format date
  const displayDate = date ? new Date(date) : new Date();
  const formattedDate = displayDate.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className={classNames?.container || "max-w-4xl mx-auto px-4 py-8"}>
      {/* Article Header */}
      <header className={classNames?.header || "mb-12"}>
        {title ? (
          <h1 className={classNames?.title || "text-4xl md:text-5xl font-bold mb-4"}>{title}</h1>
        ) : (
          <div className="text-4xl text-muted-foreground italic">
            Sans titre
          </div>
        )}
        <div className={classNames?.meta || "flex items-center gap-4 text-sm text-muted-foreground"}>
          <time dateTime={displayDate.toISOString()}>{formattedDate}</time>
          {readingTime && (
            <>
              <span aria-hidden="true">•</span>
              <span>{readingTime}</span>
            </>
          )}
        </div>
      </header>

      {/* Article Content */}
      {sections.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>Aucun contenu pour le moment</p>
          <p className="text-sm mt-2">Ajoutez des sections pour voir le preview</p>
        </div>
      ) : (
        <article className={classNames?.article || "space-y-8"}>
          {sections.map((section) => (
            <section key={section.id} className={classNames?.section || "mb-8"}>
              <div className={`grid gap-6 ${getLayoutClasses(section.type)}`}>
                {section.columns.map((column, columnIndex) => (
                  <div key={columnIndex} className={classNames?.column || "space-y-4 min-w-0 overflow-hidden"}>
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
