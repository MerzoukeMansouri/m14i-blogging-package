import type { LayoutConfig, BlockConfig, BlogBuilderConfig } from "../types";
import {
  LayoutGrid,
  Columns,
  Columns3,
  Type,
  Image as ImageIcon,
  Video,
  Grid3x3,
  Grid2x2,
  Quote,
  FileText,
  ImagePlay,
} from "lucide-react";
import { DEFAULT_COLORS, DEFAULT_UI_SETTINGS } from "./constants";

export const DEFAULT_LAYOUTS: LayoutConfig[] = [
  { type: "1-column", label: "1 Colonne", icon: LayoutGrid },
  { type: "2-columns", label: "2 Colonnes", icon: Columns },
  { type: "3-columns", label: "3 Colonnes", icon: Columns3 },
  { type: "grid-2x2", label: "Grille 2×2", icon: Grid2x2 },
  { type: "grid-3x3", label: "Grille 3×3", icon: Grid3x3 },
  { type: "grid-2x3", label: "Grille 2×3", icon: Grid2x2 },
  { type: "grid-4-even", label: "Grille 4 colonnes", icon: Columns3 },
];

export const DEFAULT_BLOCKS: BlockConfig[] = [
  { type: "text", label: "Texte", icon: Type },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "video", label: "Vidéo", icon: Video },
  { type: "carousel", label: "Carousel", icon: ImagePlay },
  { type: "quote", label: "Citation", icon: Quote },
  { type: "pdf", label: "PDF", icon: FileText },
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
