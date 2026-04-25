import type { LayoutType, ContentBlock, ContentBlockType } from "../types";
import { DEFAULT_CONTENT_PLACEHOLDERS, DEFAULT_CAROUSEL_SETTINGS, DEFAULT_PDF_SETTINGS } from "../config/constants";

// Helper pour créer des colonnes vides selon le layout
export function createEmptyColumns(layoutType: LayoutType): ContentBlock[][] {
  const columnCounts: Record<LayoutType, number> = {
    "1-column": 1,
    "2-columns": 2,
    "2-columns-wide-left": 2,
    "2-columns-wide-right": 2,
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

  switch (type) {
    case "text":
      return { id, type, content: DEFAULT_CONTENT_PLACEHOLDERS.text };
    case "image":
      return { id, type, src: "", alt: "" };
    case "video":
      return { id, type, url: "" };
    case "carousel":
      return { id, type, slides: [], ...DEFAULT_CAROUSEL_SETTINGS };
    case "quote":
      return { id, type, content: DEFAULT_CONTENT_PLACEHOLDERS.quote };
    case "code":
      return { id, type, code: "// Your code here", language: "javascript" };
    case "pdf":
      return { id, type, url: "", displayMode: DEFAULT_PDF_SETTINGS.displayMode };
    case "chart":
      return {
        id,
        type,
        chartType: "bar",
        title: "Chart Title",
        data: [
          { label: "A", value: 40 },
          { label: "B", value: 70 },
          { label: "C", value: 55 },
          { label: "D", value: 90 },
        ],
        height: 300,
      };
    default:
      throw new Error(`Unknown block type: ${type}`);
  }
}
