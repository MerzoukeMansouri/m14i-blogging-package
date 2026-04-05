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
  PDFEditor,
  CarouselEditor,
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
}

export function ContentBlockInlineEditor({ block, onChange, components }: ContentBlockInlineEditorProps) {
  const editorProps = { onChange, components } as any;

  switch (block.type) {
    case "text":
      return <TextEditor block={block} {...editorProps} />;

    case "image":
      return <ImageEditor block={block} {...editorProps} />;

    case "video":
      return <VideoEditor block={block} {...editorProps} />;

    case "quote":
      return <QuoteEditor block={block} {...editorProps} />;

    case "pdf":
      return <PDFEditor block={block} {...editorProps} />;

    case "carousel":
      return <CarouselEditor block={block} {...editorProps} />;

    default:
      return null;
  }
}
