import type { LayoutConfig, BlockConfig, BlogBuilderConfig } from "../types";
import type { BrandContext } from "../types/aiGeneration";
import {
  LayoutGrid,
  Columns,
  Type,
  Image as ImageIcon,
  Video,
  Grid2x2,
  Quote,
  FileText,
  ImagePlay,
  BarChart2,
} from "lucide-react";
import { DEFAULT_COLORS, DEFAULT_UI_SETTINGS } from "./constants";

export const DEFAULT_LAYOUTS: LayoutConfig[] = [
  { type: "1-column", label: "1 Colonne", icon: LayoutGrid },
  { type: "2-columns", label: "2 Colonnes", icon: Columns },
  { type: "2-columns-wide-left", label: "2 Colonnes (Large Gauche)", icon: Columns },
  { type: "2-columns-wide-right", label: "2 Colonnes (Large Droite)", icon: Columns },
  { type: "grid-2x2", label: "Grille 2×2", icon: Grid2x2 },
];

export const DEFAULT_BLOCKS: BlockConfig[] = [
  { type: "text", label: "Texte", icon: Type },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "video", label: "Vidéo", icon: Video },
  { type: "carousel", label: "Carousel", icon: ImagePlay },
  { type: "quote", label: "Citation", icon: Quote },
  { type: "pdf", label: "PDF", icon: FileText },
  { type: "chart", label: "Graphique", icon: BarChart2 },
];

export const DEFAULT_CONFIG: Required<BlogBuilderConfig> = {
  layouts: DEFAULT_LAYOUTS,
  blocks: DEFAULT_BLOCKS,
  theme: {
    colors: DEFAULT_COLORS,
  },
  ui: DEFAULT_UI_SETTINGS,
  callbacks: {
    onSave: undefined,
    onChange: undefined,
    onValidate: undefined,
  },
};

export const DEFAULT_BRAND_CONTEXT: BrandContext = {
  siteName: "My Blog",
  description: "A blog about technology, design, and innovation",
  industry: "technology",
  targetAudience: "professionals and enthusiasts",
  tone: "professional, approachable",
  vocabulary: {
    prefer: ["practical", "actionable", "specific", "concrete"],
    avoid: [
      "game-changing",
      "transformative",
      "revolutionary",
      "unlock",
      "leverage",
      "synergy",
      "paradigm",
      "cutting-edge",
      "best-in-class",
      "world-class",
      "next-level",
      "seamless",
    ],
  },
};

export function mergeConfig(userConfig?: BlogBuilderConfig): Required<BlogBuilderConfig> {
  if (!userConfig) {
    return DEFAULT_CONFIG;
  }

  return {
    layouts: userConfig.layouts || DEFAULT_CONFIG.layouts,
    blocks: userConfig.blocks || DEFAULT_CONFIG.blocks,
    theme: {
      colors: {
        ...DEFAULT_CONFIG.theme.colors,
        ...(userConfig.theme?.colors || {}),
      },
    },
    ui: {
      ...DEFAULT_CONFIG.ui,
      ...(userConfig.ui || {}),
    },
    callbacks: {
      ...DEFAULT_CONFIG.callbacks,
      ...(userConfig.callbacks || {}),
    },
  };
}

export function mergeBrandContext(dbContext?: Partial<BrandContext>): BrandContext {
  if (!dbContext) {
    return DEFAULT_BRAND_CONTEXT;
  }

  return {
    ...DEFAULT_BRAND_CONTEXT,
    ...dbContext,
    vocabulary: {
      ...DEFAULT_BRAND_CONTEXT.vocabulary,
      ...dbContext.vocabulary,
    },
  };
}
