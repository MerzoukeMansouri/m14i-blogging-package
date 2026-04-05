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

    case "carousel":
      return (
        <div className="space-y-3">
          {/* Carousel Settings */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Auto-play</Label>
              <Select
                value={block.autoPlay ? "true" : "false"}
                onValueChange={(value) =>
                  onChange({ ...block, autoPlay: value === "true" })
                }
              >
                <SelectTrigger className="text-sm h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Non</SelectItem>
                  <SelectItem value="true">Oui</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {block.autoPlay && (
              <div>
                <Label className="text-xs text-muted-foreground">Intervalle (ms)</Label>
                <Input
                  type="number"
                  value={(block.autoPlayInterval || 3000).toString()}
                  onChange={(e) =>
                    onChange({ ...block, autoPlayInterval: parseInt(e.target.value) || 3000 })
                  }
                  placeholder="3000"
                  className="text-xs h-8"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Flèches</Label>
              <Select
                value={block.showArrows !== false ? "true" : "false"}
                onValueChange={(value) =>
                  onChange({ ...block, showArrows: value === "true" })
                }
              >
                <SelectTrigger className="text-sm h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Oui</SelectItem>
                  <SelectItem value="false">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Points</Label>
              <Select
                value={block.showDots !== false ? "true" : "false"}
                onValueChange={(value) =>
                  onChange({ ...block, showDots: value === "true" })
                }
              >
                <SelectTrigger className="text-sm h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Oui</SelectItem>
                  <SelectItem value="false">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Loop</Label>
              <Select
                value={block.loop !== false ? "true" : "false"}
                onValueChange={(value) =>
                  onChange({ ...block, loop: value === "true" })
                }
              >
                <SelectTrigger className="text-sm h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Oui</SelectItem>
                  <SelectItem value="false">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Format (Aspect Ratio)</Label>
            <Select
              value={block.aspectRatio || "16/9"}
              onValueChange={(value) =>
                onChange({ ...block, aspectRatio: value as "16/9" | "4/3" | "1/1" | "21/9" })
              }
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16/9">16:9 (Paysage)</SelectItem>
                <SelectItem value="4/3">4:3 (Standard)</SelectItem>
                <SelectItem value="1/1">1:1 (Carré)</SelectItem>
                <SelectItem value="21/9">21:9 (Ultra-large)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Slides Management */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Slides</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onChange({
                    ...block,
                    slides: [...block.slides, { src: "", alt: "" }],
                  })
                }
              >
                <PlusIcon className="w-3 h-3 mr-1" />
                Ajouter
              </Button>
            </div>

            {block.slides.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-3 border rounded">
                Aucune slide
              </p>
            ) : (
              <div className="space-y-2">
                {block.slides.map((slide, index) => (
                  <div key={index} className="border rounded p-2 space-y-2 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Slide {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          onChange({
                            ...block,
                            slides: block.slides.filter((_, i) => i !== index),
                          })
                        }
                      >
                        <XIcon className="w-3 h-3" />
                      </Button>
                    </div>
                    <Input
                      type="url"
                      value={slide.src}
                      onChange={(e) => {
                        const newSlides = [...block.slides];
                        newSlides[index].src = e.target.value;
                        onChange({ ...block, slides: newSlides });
                      }}
                      placeholder="URL de l'image"
                      className="text-xs h-8"
                    />
                    <Input
                      value={slide.alt}
                      onChange={(e) => {
                        const newSlides = [...block.slides];
                        newSlides[index].alt = e.target.value;
                        onChange({ ...block, slides: newSlides });
                      }}
                      placeholder="Texte alternatif"
                      className="text-xs h-8"
                    />
                    <Input
                      value={slide.title || ""}
                      onChange={(e) => {
                        const newSlides = [...block.slides];
                        newSlides[index].title = e.target.value;
                        onChange({ ...block, slides: newSlides });
                      }}
                      placeholder="Titre (optionnel)"
                      className="text-xs h-8"
                    />
                    <Input
                      value={slide.caption || ""}
                      onChange={(e) => {
                        const newSlides = [...block.slides];
                        newSlides[index].caption = e.target.value;
                        onChange({ ...block, slides: newSlides });
                      }}
                      placeholder="Caption (optionnel)"
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

    case "pdf":
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">URL du PDF</Label>
            <Input
              type="url"
              value={block.url}
              onChange={(e) => onChange({ ...block, url: e.target.value })}
              placeholder="https://example.com/document.pdf"
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Titre (optionnel)</Label>
            <Input
              value={block.title || ""}
              onChange={(e) => onChange({ ...block, title: e.target.value })}
              placeholder="Nom du document"
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Description (optionnel)</Label>
            <Textarea
              value={block.description || ""}
              onChange={(e) => onChange({ ...block, description: e.target.value })}
              placeholder="Brève description du PDF"
              className="min-h-[60px] text-sm resize-y"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Mode d'affichage</Label>
            <Select
              value={block.displayMode || "both"}
              onValueChange={(value) =>
                onChange({ ...block, displayMode: value as "embed" | "download" | "both" })
              }
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="embed">Intégré uniquement</SelectItem>
                <SelectItem value="download">Téléchargement uniquement</SelectItem>
                <SelectItem value="both">Intégré + Téléchargement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Hauteur de l'embed (optionnel)</Label>
            <Input
              value={block.height || ""}
              onChange={(e) => onChange({ ...block, height: e.target.value })}
              placeholder="600px"
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Par défaut: 600px
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}
