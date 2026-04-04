"use client";

import type { LayoutSection } from "../types";
import { getLayoutClasses } from "../utils";
import { ContentBlockRenderer } from "./ContentBlockRenderer";

interface BlogPreviewProps {
  title: string;
  sections: LayoutSection[];
  ImageComponent?: React.ComponentType<{
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
  }>;
}

export function BlogPreview({ title, sections, ImageComponent }: BlogPreviewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Article Header */}
      <header className="mb-12">
        {title ? (
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        ) : (
          <div className="text-4xl text-muted-foreground italic">
            Sans titre
          </div>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <time>{new Date().toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}</time>
        </div>
      </header>

      {/* Article Content */}
      {sections.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>Aucun contenu pour le moment</p>
          <p className="text-sm mt-2">Ajoutez des sections pour voir le preview</p>
        </div>
      ) : (
        <article className="space-y-8">
          {sections.map((section) => (
            <section key={section.id} className="mb-8">
              <div className={`grid gap-6 ${getLayoutClasses(section.type)}`}>
                {section.columns.map((column, columnIndex) => (
                  <div key={columnIndex} className="space-y-4">
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
