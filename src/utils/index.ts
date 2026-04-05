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
    case "grid-2x2":
      return [[], [], [], []]; // 4 cells
    case "grid-3x3":
      return [[], [], [], [], [], [], [], [], []]; // 9 cells
    case "grid-2x3":
      return [[], [], [], [], [], []]; // 6 cells
    case "grid-4-even":
      return [[], [], [], []]; // 4 columns
  }
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
    case "grid-2x2":
      return "Grille 2×2";
    case "grid-3x3":
      return "Grille 3×3";
    case "grid-2x3":
      return "Grille 2×3";
    case "grid-4-even":
      return "Grille 4 colonnes";
  }
}
