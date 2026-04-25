import type { ContentBlock } from "./blocks";

// Layout types for sections
export type LayoutType =
  | "1-column"
  | "2-columns"
  | "2-columns-wide-left"
  | "2-columns-wide-right"
  | "grid-2x2"
  | "grid-3x3"
  | "grid-2x3"
  | "grid-4-even";

// Layout section containing columns of content blocks
export interface LayoutSection {
  id: string;
  type: LayoutType;
  columns: ContentBlock[][]; // Array of columns, each column contains blocks
}