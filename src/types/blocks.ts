// Content block types - each block has a unique type identifier
export type ContentBlockType = "text" | "image" | "video" | "quote" | "pdf" | "carousel" | "chart";

// Base interface for all blocks
interface BaseBlock {
  id: string;
  type: ContentBlockType;
}

// Text content block
export interface TextBlock extends BaseBlock {
  type: "text";
  content: string; // Markdown supported
}

// Image content block
export interface ImageBlock extends BaseBlock {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
}

// Video content block
export interface VideoBlock extends BaseBlock {
  type: "video";
  url: string; // YouTube, Vimeo, etc.
  caption?: string;
}

// Quote content block
export interface QuoteBlock extends BaseBlock {
  type: "quote";
  content: string;
  author?: string;
  role?: string;
}

// Carousel slide
export interface CarouselSlide {
  src: string;
  alt: string;
  caption?: string;
  title?: string;
}

// Carousel content block
export interface CarouselBlock extends BaseBlock {
  type: "carousel";
  slides: CarouselSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number; // milliseconds, default 3000
  showDots?: boolean; // default true
  showArrows?: boolean; // default true
  loop?: boolean; // default true
  aspectRatio?: "16/9" | "4/3" | "1/1" | "21/9"; // default "16/9"
}

// PDF display modes
export type PDFDisplayMode = "embed" | "download" | "both";

// PDF content block
export interface PDFBlock extends BaseBlock {
  type: "pdf";
  url: string;
  title?: string;
  description?: string;
  displayMode?: PDFDisplayMode; // default "both"
  height?: string; // Custom height for embed, default "600px"
}

// Chart data point
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

// Chart content block
export interface ChartBlock extends BaseBlock {
  type: "chart";
  chartType: "bar" | "line" | "area" | "pie";
  title?: string;
  data: ChartDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  caption?: string;
  height?: number;
}

// Union type for all content blocks
export type ContentBlock = TextBlock | ImageBlock | VideoBlock | QuoteBlock | PDFBlock | CarouselBlock | ChartBlock;