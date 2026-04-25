"use client";

// NOTE: This component requires shadcn/ui components to be installed in your project:
// - Label, Input, Textarea, Select, Button
// Install with: npx shadcn@latest add label input textarea select button

import type { ContentBlock } from "../types";
import {
  TextEditor,
  ImageEditor,
  VideoEditor,
  QuoteEditor,
  CodeEditor,
  PDFEditor,
  CarouselEditor,
  ChartEditor,
} from "./ContentBlockEditors";

interface EditorComponents {
  Label: React.ComponentType<any>;
  Input: React.ComponentType<any>;
  Textarea: React.ComponentType<any>;
  Select: React.ComponentType<any>;
  SelectTrigger: React.ComponentType<any>;
  SelectValue: React.ComponentType<any>;
  SelectContent: React.ComponentType<any>;
  SelectItem: React.ComponentType<any>;
  Button: React.ComponentType<any>;
  PlusIcon: React.ComponentType<any>;
  XIcon: React.ComponentType<any>;
}

interface ContentBlockInlineEditorProps {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
  components: EditorComponents;
  onImprove?: (
    content: string,
    instruction: "expand" | "shorten" | "rewrite" | "add-examples" | "improve-clarity" | "make-engaging"
  ) => Promise<string>;
}

export function ContentBlockInlineEditor({
  block,
  onChange,
  components,
  onImprove,
}: ContentBlockInlineEditorProps): React.ReactElement | null {
  // Map block types to their respective editor components
  const editorComponentMap = {
    text: TextEditor,
    image: ImageEditor,
    video: VideoEditor,
    quote: QuoteEditor,
    code: CodeEditor,
    pdf: PDFEditor,
    carousel: CarouselEditor,
    chart: ChartEditor,
  } as const;

  const EditorComponent = editorComponentMap[block.type as keyof typeof editorComponentMap] as any;

  if (!EditorComponent) {
    return null;
  }

  return (
    <EditorComponent
      block={block}
      onChange={onChange}
      components={components}
      onImprove={onImprove}
    />
  );
}
