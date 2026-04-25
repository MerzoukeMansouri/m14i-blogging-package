"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  CodeSquare,
} from "lucide-react";
import { markdownToHtmlSync } from "../utils/markdown";

export interface WYSIWYGEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function WYSIWYGEditor({
  content,
  onChange,
  placeholder = "Start typing...",
  disabled = false,
}: WYSIWYGEditorProps) {
  // Convert markdown to HTML on initial load
  const initialContent = React.useMemo(() => {
    // Check if content is markdown or HTML
    const isMarkdown = content && !content.trim().startsWith("<") && !content.includes("</");
    return isMarkdown ? markdownToHtmlSync(content) : content;
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialContent,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      // Store as HTML
      const html = editor.getHTML();
      onChange(html);
    },
  });

  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Convert markdown to HTML if needed
      const isMarkdown = content && !content.trim().startsWith("<") && !content.includes("</");
      const htmlContent = isMarkdown ? markdownToHtmlSync(content) : content;
      editor.commands.setContent(htmlContent);
    }
  }, [content, editor]);

  const addLink = React.useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* Text formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("bold") ? "bg-gray-300" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Bold"
          type="button"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("italic") ? "bg-gray-300" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Italic"
          type="button"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("code") ? "bg-gray-300" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Inline Code"
          type="button"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Heading 1"
          type="button"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Heading 2"
          type="button"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("heading", { level: 3 }) ? "bg-gray-300" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Heading 3"
          type="button"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("bulletList") ? "bg-gray-300" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Bullet List"
          type="button"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("orderedList") ? "bg-gray-300" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Ordered List"
          type="button"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Blockquote & Code Block */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("blockquote") ? "bg-gray-300" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Blockquote"
          type="button"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("codeBlock") ? "bg-gray-300" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Code Block"
          type="button"
        >
          <CodeSquare className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Link */}
        <button
          onClick={addLink}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive("link") ? "bg-gray-300" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Add Link"
          type="button"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <div className="bg-white">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:outline-none"
        />
      </div>
    </div>
  );
}
