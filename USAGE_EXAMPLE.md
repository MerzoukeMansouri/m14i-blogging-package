# Usage Example

## Installation in your Next.js/React project

```bash
# In your project directory
pnpm add file:../path/to/m14i-blogging

# Install peer dependencies
pnpm add @hello-pangea/dnd react-markdown remark-gfm lucide-react

# Install shadcn/ui components
npx shadcn@latest add label input textarea select button card
```

## Full Example with Next.js

```tsx
"use client";

import { useState } from "react";
import { BlogBuilder, BlogPreview } from "m14i-blogging";
import type { LayoutSection } from "m14i-blogging";
import Image from "next/image";

// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";

export default function BlogEditorPage() {
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<LayoutSection[]>([]);
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const handleSave = () => {
    console.log("Saving:", { title, sections });
    // Save to database, localStorage, etc.
  };

  return (
    <div className="min-h-screen">
      {/* Header with mode toggle */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'article"
            className="max-w-md"
          />

          <div className="flex gap-2">
            <Button
              variant={mode === "edit" ? "default" : "outline"}
              onClick={() => setMode("edit")}
            >
              Éditer
            </Button>
            <Button
              variant={mode === "preview" ? "default" : "outline"}
              onClick={() => setMode("preview")}
            >
              Preview
            </Button>
            <Button onClick={handleSave}>Sauvegarder</Button>
          </div>
        </div>
      </div>

      {/* Editor or Preview */}
      {mode === "edit" ? (
        <BlogBuilder
          sections={sections}
          onChange={setSections}
          config={{
            // Customize if needed
            callbacks: {
              onChange: (newSections) => {
                console.log("Sections changed:", newSections);
                setSections(newSections);
              },
            },
          }}
          components={{
            Button,
            Card,
            CardContent,
            CardHeader,
            Label,
            Input,
            Textarea,
            Select,
            SelectTrigger,
            SelectValue,
            SelectContent,
            SelectItem,
            PlusIcon: Plus,
            XIcon: X,
          }}
        />
      ) : (
        <BlogPreview
          title={title}
          sections={sections}
          ImageComponent={Image}
        />
      )}
    </div>
  );
}
```

## Customization Example

```tsx
import { BlogBuilder, DEFAULT_LAYOUTS, DEFAULT_BLOCKS } from "m14i-blogging";
import { Type, ImageIcon } from "lucide-react";

<BlogBuilder
  sections={sections}
  onChange={setSections}
  config={{
    // Only text and image blocks
    blocks: [
      { type: "text", label: "Texte", icon: Type },
      { type: "image", label: "Image", icon: ImageIcon },
    ],

    // Only 1 and 2 columns
    layouts: DEFAULT_LAYOUTS.filter(l =>
      ["1-column", "2-columns"].includes(l.type)
    ),

    // Custom theme
    theme: {
      colors: {
        primary: "#B87333", // Copper color
      },
    },

    // Callbacks
    callbacks: {
      onSave: (sections) => {
        fetch("/api/blog/save", {
          method: "POST",
          body: JSON.stringify({ sections }),
        });
      },
    },
  }}
  components={{ /* your shadcn/ui components */ }}
/>
```

## Save/Load Example

```tsx
function MyBlogEditor() {
  const [sections, setSections] = useState<LayoutSection[]>([]);

  // Load on mount
  useEffect(() => {
    const saved = localStorage.getItem("blog-draft");
    if (saved) {
      setSections(JSON.parse(saved));
    }
  }, []);

  // Auto-save on change
  const handleChange = (newSections: LayoutSection[]) => {
    setSections(newSections);
    localStorage.setItem("blog-draft", JSON.stringify(newSections));
  };

  return (
    <BlogBuilder
      sections={sections}
      onChange={handleChange}
      components={{ /* ... */ }}
    />
  );
}
```
