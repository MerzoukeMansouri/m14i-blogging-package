"use client";

import type {
  TextBlock,
  ImageBlock,
  VideoBlock,
  QuoteBlock,
  PDFBlock,
  CarouselBlock
} from "../types";

interface EditorComponents {
  Label: React.ComponentType<{ className?: string; children: React.ReactNode }>;
  Input: React.ComponentType<any>;
  Textarea: React.ComponentType<any>;
  Select: React.ComponentType<any>;
  SelectTrigger: React.ComponentType<any>;
  SelectValue: React.ComponentType<any>;
  SelectContent: React.ComponentType<any>;
  SelectItem: React.ComponentType<any>;
  Button: React.ComponentType<any>;
  PlusIcon: React.ComponentType<{ className?: string }>;
  XIcon: React.ComponentType<{ className?: string }>;
}

interface TextEditorProps {
  block: TextBlock;
  onChange: (block: TextBlock) => void;
  components: EditorComponents;
}

export function TextEditor({ block, onChange, components }: TextEditorProps): JSX.Element {
  const { Label, Textarea } = components;

  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">Contenu (Markdown)</Label>
      <Textarea
        value={block.content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange({ ...block, content: e.target.value })
        }
        className="min-h-[150px] font-mono text-sm resize-y"
        placeholder="**Gras**, *italique*, # Titre, etc."
      />
    </div>
  );
}

interface ImageEditorProps {
  block: ImageBlock;
  onChange: (block: ImageBlock) => void;
  components: EditorComponents;
}

export function ImageEditor({ block, onChange, components }: ImageEditorProps): JSX.Element {
  const { Label, Input } = components;

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-muted-foreground">URL de l'image</Label>
        <Input
          type="url"
          value={block.src}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ ...block, src: e.target.value })
          }
          placeholder="https://example.com/image.jpg"
          className="text-sm"
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Texte alternatif</Label>
        <Input
          value={block.alt}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ ...block, alt: e.target.value })
          }
          placeholder="Description de l'image"
          className="text-sm"
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Légende (optionnel)</Label>
        <Input
          value={block.caption || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ ...block, caption: e.target.value })
          }
          placeholder="Texte sous l'image"
          className="text-sm"
        />
      </div>
    </div>
  );
}

interface VideoEditorProps {
  block: VideoBlock;
  onChange: (block: VideoBlock) => void;
  components: EditorComponents;
}

export function VideoEditor({ block, onChange, components }: VideoEditorProps): JSX.Element {
  const { Label, Input } = components;

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-muted-foreground">URL de la vidéo</Label>
        <Input
          type="url"
          value={block.url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ ...block, url: e.target.value })
          }
          placeholder="https://youtube.com/watch?v=..."
          className="text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">YouTube ou Vimeo</p>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Légende (optionnel)</Label>
        <Input
          value={block.caption || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ ...block, caption: e.target.value })
          }
          placeholder="Description de la vidéo"
          className="text-sm"
        />
      </div>
    </div>
  );
}

interface QuoteEditorProps {
  block: QuoteBlock;
  onChange: (block: QuoteBlock) => void;
  components: EditorComponents;
}

export function QuoteEditor({ block, onChange, components }: QuoteEditorProps): JSX.Element {
  const { Label, Input, Textarea } = components;

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-muted-foreground">Citation</Label>
        <Textarea
          value={block.content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onChange({ ...block, content: e.target.value })
          }
          className="min-h-[80px] text-sm resize-y"
          placeholder="Votre citation ici"
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Auteur (optionnel)</Label>
        <Input
          value={block.author || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ ...block, author: e.target.value })
          }
          placeholder="Nom de l'auteur"
          className="text-sm"
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Titre/Rôle (optionnel)</Label>
        <Input
          value={block.role || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ ...block, role: e.target.value })
          }
          placeholder="ex: CEO de l'entreprise"
          className="text-sm"
        />
      </div>
    </div>
  );
}

interface PDFEditorProps {
  block: PDFBlock;
  onChange: (block: PDFBlock) => void;
  components: EditorComponents;
}

export function PDFEditor({ block, onChange, components }: PDFEditorProps): JSX.Element {
  const { Label, Input, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } = components;

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-muted-foreground">URL du PDF</Label>
        <Input
          type="url"
          value={block.url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ ...block, url: e.target.value })
          }
          placeholder="https://example.com/document.pdf"
          className="text-sm"
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Titre (optionnel)</Label>
        <Input
          value={block.title || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ ...block, title: e.target.value })
          }
          placeholder="Nom du document"
          className="text-sm"
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Description (optionnel)</Label>
        <Textarea
          value={block.description || ""}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onChange({ ...block, description: e.target.value })
          }
          placeholder="Brève description du PDF"
          className="min-h-[60px] text-sm resize-y"
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Mode d'affichage</Label>
        <Select
          value={block.displayMode || "both"}
          onValueChange={(value: string) =>
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ ...block, height: e.target.value })
          }
          placeholder="600px"
          className="text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">Par défaut: 600px</p>
      </div>
    </div>
  );
}

interface CarouselSlideEditorProps {
  slide: CarouselBlock['slides'][0];
  index: number;
  onUpdate: (index: number, slide: CarouselBlock['slides'][0]) => void;
  onRemove: (index: number) => void;
  components: EditorComponents;
}

function CarouselSlideEditor({ slide, index, onUpdate, onRemove, components }: CarouselSlideEditorProps): JSX.Element {
  const { Input, Button, XIcon } = components;

  return (
    <div className="border rounded p-2 space-y-2 bg-muted/30">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">Slide {index + 1}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onRemove(index)}
        >
          <XIcon className="w-3 h-3" />
        </Button>
      </div>
      <Input
        type="url"
        value={slide.src}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onUpdate(index, { ...slide, src: e.target.value })
        }
        placeholder="URL de l'image"
        className="text-xs h-8"
      />
      <Input
        value={slide.alt}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onUpdate(index, { ...slide, alt: e.target.value })
        }
        placeholder="Texte alternatif"
        className="text-xs h-8"
      />
      <Input
        value={slide.title || ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onUpdate(index, { ...slide, title: e.target.value })
        }
        placeholder="Titre (optionnel)"
        className="text-xs h-8"
      />
      <Input
        value={slide.caption || ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onUpdate(index, { ...slide, caption: e.target.value })
        }
        placeholder="Caption (optionnel)"
        className="text-xs h-8"
      />
    </div>
  );
}

interface CarouselEditorProps {
  block: CarouselBlock;
  onChange: (block: CarouselBlock) => void;
  components: EditorComponents;
}

export function CarouselEditor({ block, onChange, components }: CarouselEditorProps): JSX.Element {
  const { Label, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Button, PlusIcon } = components;

  const updateSlide = (index: number, slide: CarouselBlock['slides'][0]): void => {
    const newSlides = [...block.slides];
    newSlides[index] = slide;
    onChange({ ...block, slides: newSlides });
  };

  const removeSlide = (index: number): void => {
    onChange({
      ...block,
      slides: block.slides.filter((_, i) => i !== index),
    });
  };

  const addSlide = (): void => {
    onChange({
      ...block,
      slides: [...block.slides, { src: "", alt: "" }],
    });
  };

  return (
    <div className="space-y-3">
      {/* Carousel Settings */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs text-muted-foreground">Auto-play</Label>
          <Select
            value={block.autoPlay ? "true" : "false"}
            onValueChange={(value: string) => onChange({ ...block, autoPlay: value === "true" })}
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
            onValueChange={(value: string) => onChange({ ...block, showArrows: value === "true" })}
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
            onValueChange={(value: string) => onChange({ ...block, showDots: value === "true" })}
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
            onValueChange={(value: string) => onChange({ ...block, loop: value === "true" })}
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
          onValueChange={(value: string) =>
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
          <Button type="button" variant="outline" size="sm" onClick={addSlide}>
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
              <CarouselSlideEditor
                key={index}
                slide={slide}
                index={index}
                onUpdate={updateSlide}
                onRemove={removeSlide}
                components={components}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}