import type { LayoutType, ContentBlock, ContentBlockType } from "../types";

// Helper pour créer des colonnes vides selon le layout
export function createEmptyColumns(layoutType: LayoutType): ContentBlock[][] {
  const columnCounts: Record<LayoutType, number> = {
    "1-column": 1,
    "2-columns": 2,
    "2-columns-wide-left": 2,
    "2-columns-wide-right": 2,
    "3-columns": 3,
    "grid-2x2": 4,
    "grid-3x3": 9,
    "grid-2x3": 6,
    "grid-4-even": 4,
  };

  const count = columnCounts[layoutType];
  return Array.from({ length: count }, () => []);
}

// Helper pour obtenir les classes CSS du layout
export function getLayoutClasses(layoutType: LayoutType): string {
  switch (layoutType) {
    case "1-column":
      return "grid-cols-1";
    case "2-columns":
      return "grid-cols-2";
    case "2-columns-wide-left":
      return "grid-cols-[2fr_1fr]";
    case "2-columns-wide-right":
      return "grid-cols-[1fr_2fr]";
    case "3-columns":
      return "grid-cols-3";
    case "grid-2x2":
      return "grid-cols-2"; // 2x2 grid
    case "grid-3x3":
      return "grid-cols-3"; // 3x3 grid
    case "grid-2x3":
      return "grid-cols-2"; // 2 columns, 3 rows
    case "grid-4-even":
      return "grid-cols-4"; // 4 equal columns
  }
}

export function getLayoutLabel(layoutType: LayoutType): string {
  const labels: Record<LayoutType, string> = {
    "1-column": "1 Colonne",
    "2-columns": "2 Colonnes",
    "2-columns-wide-left": "2 Colonnes (Large Gauche)",
    "2-columns-wide-right": "2 Colonnes (Large Droite)",
    "3-columns": "3 Colonnes",
    "grid-2x2": "Grille 2×2",
    "grid-3x3": "Grille 3×3",
    "grid-2x3": "Grille 2×3",
    "grid-4-even": "Grille 4 colonnes",
  };

  return labels[layoutType];
}

// Helper to create a default block with unique ID
export function createDefaultBlock(type: ContentBlockType): ContentBlock {
  const id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const blockDefaults: Record<ContentBlockType, Omit<ContentBlock, "id">> = {
    text: { type: "text", content: "Votre texte ici... (Markdown supporté)" },
    image: { type: "image", src: "", alt: "" },
    video: { type: "video", url: "" },
    carousel: {
      type: "carousel",
      slides: [],
      autoPlay: false,
      showDots: true,
      showArrows: true,
      loop: true,
      aspectRatio: "16/9"
    },
    quote: { type: "quote", content: "Votre citation ici" },
    pdf: { type: "pdf", url: "", displayMode: "both" },
  };

  return { id, ...blockDefaults[type] } as ContentBlock;
}
