"use client";

// NOTE: This component requires shadcn/ui components to be installed in your project:
// - Label, Input, Textarea, Select, Button
// Install with: npx shadcn@latest add label input textarea select button

import type { ContentBlock } from "../types";

interface ContentBlockInlineEditorProps {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
  // shadcn/ui components passed as props for flexibility
  components: {
    Label: React.ComponentType<{ className?: string; children: React.ReactNode }>;
    Input: React.ComponentType<{
      type?: string;
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      placeholder?: string;
      className?: string;
    }>;
    Textarea: React.ComponentType<{
      value: string;
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
      placeholder?: string;
      className?: string;
    }>;
    Select: React.ComponentType<{
      value: string;
      onValueChange: (value: string) => void;
      children: React.ReactNode;
    }>;
    SelectTrigger: React.ComponentType<{ className?: string; children: React.ReactNode }>;
    SelectValue: React.ComponentType<Record<string, never>>;
    SelectContent: React.ComponentType<{ children: React.ReactNode }>;
    SelectItem: React.ComponentType<{ value: string; children: React.ReactNode }>;
    Button: React.ComponentType<{
      type?: "button";
      variant?: string;
      size?: string;
      className?: string;
      onClick?: () => void;
      children: React.ReactNode;
    }>;
    PlusIcon: React.ComponentType<{ className?: string }>;
    XIcon: React.ComponentType<{ className?: string }>;
  };
}

export function ContentBlockInlineEditor({
  block,
  onChange,
  components: {
    Label,
    Input,
    Textarea,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Button,
    PlusIcon,
    XIcon,
  },
}: ContentBlockInlineEditorProps) {
  switch (block.type) {
    case "text":
      return (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Contenu (Markdown)</Label>
          <Textarea
            value={block.content}
            onChange={(e) => onChange({ ...block, content: e.target.value })}
            className="min-h-[150px] font-mono text-sm resize-y"
            placeholder="**Gras**, *italique*, # Titre, etc."
          />
        </div>
      );

    case "image":
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">URL de l'image</Label>
            <Input
              type="url"
              value={block.src}
              onChange={(e) => onChange({ ...block, src: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Texte alternatif</Label>
            <Input
              value={block.alt}
              onChange={(e) => onChange({ ...block, alt: e.target.value })}
              placeholder="Description de l'image"
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Légende (optionnel)</Label>
            <Input
              value={block.caption || ""}
              onChange={(e) => onChange({ ...block, caption: e.target.value })}
              placeholder="Texte sous l'image"
              className="text-sm"
            />
          </div>
        </div>
      );

    case "video":
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">URL de la vidéo</Label>
            <Input
              type="url"
              value={block.url}
              onChange={(e) => onChange({ ...block, url: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              YouTube ou Vimeo
            </p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Légende (optionnel)</Label>
            <Input
              value={block.caption || ""}
              onChange={(e) => onChange({ ...block, caption: e.target.value })}
              placeholder="Description de la vidéo"
              className="text-sm"
            />
          </div>
        </div>
      );

    case "gallery":
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Nombre de colonnes</Label>
            <Select
              value={block.columns.toString()}
              onValueChange={(value) =>
                onChange({ ...block, columns: parseInt(value) as 2 | 3 | 4 })
              }
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 colonnes</SelectItem>
                <SelectItem value="3">3 colonnes</SelectItem>
                <SelectItem value="4">4 colonnes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Images</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onChange({
                    ...block,
                    images: [...block.images, { src: "", alt: "" }],
                  })
                }
              >
                <PlusIcon className="w-3 h-3 mr-1" />
                Ajouter
              </Button>
            </div>

            {block.images.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-3 border rounded">
                Aucune image
              </p>
            ) : (
              <div className="space-y-2">
                {block.images.map((image, index) => (
                  <div key={index} className="border rounded p-2 space-y-2 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Image {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          onChange({
                            ...block,
                            images: block.images.filter((_, i) => i !== index),
                          })
                        }
                      >
                        <XIcon className="w-3 h-3" />
                      </Button>
                    </div>
                    <Input
                      type="url"
                      value={image.src}
                      onChange={(e) => {
                        const newImages = [...block.images];
                        newImages[index].src = e.target.value;
                        onChange({ ...block, images: newImages });
                      }}
                      placeholder="URL"
                      className="text-xs h-8"
                    />
                    <Input
                      value={image.alt}
                      onChange={(e) => {
                        const newImages = [...block.images];
                        newImages[index].alt = e.target.value;
                        onChange({ ...block, images: newImages });
                      }}
                      placeholder="Alt"
                      className="text-xs h-8"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );

    case "quote":
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Citation</Label>
            <Textarea
              value={block.content}
              onChange={(e) => onChange({ ...block, content: e.target.value })}
              className="min-h-[80px] text-sm resize-y"
              placeholder="Votre citation ici"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Auteur (optionnel)</Label>
            <Input
              value={block.author || ""}
              onChange={(e) => onChange({ ...block, author: e.target.value })}
              placeholder="Nom de l'auteur"
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Titre/Rôle (optionnel)</Label>
            <Input
              value={block.role || ""}
              onChange={(e) => onChange({ ...block, role: e.target.value })}
              placeholder="ex: CEO de l'entreprise"
              className="text-sm"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}
