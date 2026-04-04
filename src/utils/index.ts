import type { LayoutType, ContentBlock } from "../types";

// Helper pour créer des colonnes vides selon le layout
export function createEmptyColumns(layoutType: LayoutType): ContentBlock[][] {
  switch (layoutType) {
    case "1-column":
      return [[]];
    case "2-columns":
    case "2-columns-wide-left":
    case "2-columns-wide-right":
      return [[], []];
    case "3-columns":
      return [[], [], []];
  }
}

// Helper pour obtenir les classes CSS du layout
export function getLayoutClasses(layoutType: LayoutType): string {
  switch (layoutType) {
    case "1-column":
      return "grid-cols-1";
    case "2-columns":
      return "md:grid-cols-2";
    case "2-columns-wide-left":
      return "md:grid-cols-[2fr_1fr]";
    case "2-columns-wide-right":
      return "md:grid-cols-[1fr_2fr]";
    case "3-columns":
      return "md:grid-cols-3";
  }
}

export function getLayoutLabel(layoutType: LayoutType): string {
  switch (layoutType) {
    case "1-column":
      return "1 Colonne";
    case "2-columns":
      return "2 Colonnes";
    case "2-columns-wide-left":
      return "2 Colonnes (Large Gauche)";
    case "2-columns-wide-right":
      return "2 Colonnes (Large Droite)";
    case "3-columns":
      return "3 Colonnes";
  }
}
