import type { ComponentType } from "react";
import type { AuthorInfo, SEOMetadata, OpenGraphMetadata, TwitterCardMetadata } from "./seo";

// Types pour le système de blog à 2 niveaux : Layout + Contenu

export type LayoutType =
  | "1-column"
  | "2-columns"
  | "3-columns"
  | "2-columns-wide-left"
  | "2-columns-wide-right"
  | "grid-2x2"
  | "grid-3x3"
  | "grid-2x3"
  | "grid-4-even";

export type ContentBlockType = "text" | "image" | "video" | "quote" | "pdf" | "carousel";

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

export interface QuoteBlock {
  id: string;
  type: "quote";
  content: string;
  author?: string;
  role?: string;
}

export interface CarouselBlock {
  id: string;
  type: "carousel";
  slides: Array<{
    src: string;
    alt: string;
    caption?: string;
    title?: string;
  }>;
  autoPlay?: boolean;
  autoPlayInterval?: number; // milliseconds, default 3000
  showDots?: boolean; // default true
  showArrows?: boolean; // default true
  loop?: boolean; // default true
  aspectRatio?: "16/9" | "4/3" | "1/1" | "21/9"; // default "16/9"
}

export interface PDFBlock {
  id: string;
  type: "pdf";
  url: string; // URL to PDF file
  title?: string; // Optional title/name for the PDF
  description?: string; // Optional description
  displayMode?: "embed" | "download" | "both"; // How to display the PDF
  height?: string; // Custom height for embed (default: "600px")
}

export type ContentBlock = TextBlock | ImageBlock | VideoBlock | QuoteBlock | PDFBlock | CarouselBlock;

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

  // SEO-specific fields (all optional for backward compatibility)
  /** Author information */
  author?: AuthorInfo;
  /** Category/section of the blog post */
  category?: string;
  /** Tags/keywords for the post */
  tags?: string[];
  /** Publication date (ISO 8601 format) */
  publishedDate?: string;
  /** Last modified date (ISO 8601 format) */
  modifiedDate?: string;

  // Advanced SEO metadata
  /** Core SEO metadata (description, keywords, canonical URL, etc.) */
  seo?: SEOMetadata;
  /** Open Graph metadata for social media sharing */
  openGraph?: OpenGraphMetadata;
  /** Twitter Card metadata */
  twitter?: TwitterCardMetadata;
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
