import type { ComponentType } from "react";

// Types pour le système de blog à 2 niveaux : Layout + Contenu

export type LayoutType = "1-column" | "2-columns" | "3-columns" | "2-columns-wide-left" | "2-columns-wide-right";

export type ContentBlockType = "text" | "image" | "video" | "gallery" | "quote";

// Blocs de contenu (ce qu'on glisse dans les colonnes)
export interface TextBlock {
  id: string;
  type: "text";
  content: string; // Markdown
}

export interface ImageBlock {
  id: string;
  type: "image";
  src: string;
  alt: string;
  caption?: string;
}

export interface VideoBlock {
  id: string;
  type: "video";
  url: string; // YouTube, Vimeo, etc.
  caption?: string;
}

export interface GalleryBlock {
  id: string;
  type: "gallery";
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  columns: 2 | 3 | 4;
}

export interface QuoteBlock {
  id: string;
  type: "quote";
  content: string;
  author?: string;
  role?: string;
}

export type ContentBlock = TextBlock | ImageBlock | VideoBlock | GalleryBlock | QuoteBlock;

// Section avec layout (conteneur de colonnes)
export interface LayoutSection {
  id: string;
  type: LayoutType;
  columns: ContentBlock[][]; // Tableau de colonnes, chaque colonne contient des blocs
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  sections: LayoutSection[];
  createdAt?: string;
  updatedAt?: string;
}

// Configuration du BlogBuilder
export interface LayoutConfig {
  type: LayoutType;
  label: string;
  icon?: ComponentType<{ className?: string }>;
}

export interface BlockConfig {
  type: ContentBlockType;
  label: string;
  icon?: ComponentType<{ className?: string }>;
}

export interface ThemeConfig {
  colors?: {
    primary?: string;
    border?: string;
    background?: string;
    accent?: string;
  };
}

export interface UIConfig {
  showPreviewToggle?: boolean;
  compactMode?: boolean;
  sidebarWidth?: string;
}

export interface CallbacksConfig {
  onSave?: (sections: LayoutSection[]) => void;
  onChange?: (sections: LayoutSection[]) => void;
  onValidate?: (sections: LayoutSection[]) => boolean | string;
}

export interface BlogBuilderConfig {
  layouts?: LayoutConfig[];
  blocks?: BlockConfig[];
  theme?: ThemeConfig;
  ui?: UIConfig;
  callbacks?: CallbacksConfig;
}
