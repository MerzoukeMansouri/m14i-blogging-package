import type { ComponentType, ReactNode } from "react";
import type { ContentBlock } from "@m14i/blogging-core";

/**
 * Base editor components required by all block editors
 */
export interface EditorComponents {
  Label: ComponentType<{ className?: string; children: ReactNode }>;
  Input: ComponentType<any>;
  Textarea: ComponentType<any>;
  Select: ComponentType<any>;
  SelectTrigger: ComponentType<any>;
  SelectValue: ComponentType<any>;
  SelectContent: ComponentType<any>;
  SelectItem: ComponentType<any>;
  Button: ComponentType<any>;
  PlusIcon: ComponentType<{ className?: string }>;
  XIcon: ComponentType<{ className?: string }>;
}

/**
 * AI improvement instruction types
 */
export type ImprovementInstruction =
  | "expand"
  | "shorten"
  | "rewrite"
  | "add-examples"
  | "improve-clarity"
  | "make-engaging";

/**
 * Base props for all block editors
 * Eliminates duplication across TextEditor, ImageEditor, etc.
 */
export interface BaseBlockEditorProps<T extends ContentBlock> {
  block: T;
  onChange: (block: T) => void;
  components: EditorComponents;
  onImprove?: (content: string, instruction: ImprovementInstruction) => Promise<string>;
}
