"use client";

import React from "react";
import { WYSIWYGEditor } from "./WYSIWYGEditor";
import type {
  TextBlock,
  ImageBlock,
  VideoBlock,
  QuoteBlock,
  CodeBlock,
  PDFBlock,
  CarouselBlock,
  ChartBlock,
  ChartDataPoint,
} from "@m14i/blogging-core";

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
  onImprove?: (content: string, instruction: "expand" | "shorten" | "rewrite" | "add-examples" | "improve-clarity" | "make-engaging") => Promise<string>;
}

export function TextEditor({ block, onChange, components, onImprove }: TextEditorProps): React.ReactElement {
  const { Label, Textarea, Button } = components;
  const [isImproving, setIsImproving] = React.useState(false);
  const [showImprovementMenu, setShowImprovementMenu] = React.useState(false);

  const handleImprove = async (instruction: "expand" | "shorten" | "rewrite" | "add-examples" | "improve-clarity" | "make-engaging") => {
    if (!onImprove || !block.content) return;

    setIsImproving(true);
    setShowImprovementMenu(false);

    try {
      const improvedContent = await onImprove(block.content, instruction);
      onChange({ ...block, content: improvedContent });
    } catch (err) {
      console.error("Error improving content:", err);
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Content (Rich Text)</Label>
        {onImprove && block.content && (
          <div className="relative">
            <button
              onClick={() => setShowImprovementMenu(!showImprovementMenu)}
              disabled={isImproving}
              className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 disabled:opacity-50"
            >
              {isImproving ? "Improving..." : "✨ AI Improve"}
            </button>

            {showImprovementMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-20 min-w-[180px]">
                <button
                  onClick={() => handleImprove("expand")}
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                >
                  📝 Expand
                </button>
                <button
                  onClick={() => handleImprove("shorten")}
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                >
                  ✂️ Shorten
                </button>
                <button
                  onClick={() => handleImprove("rewrite")}
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                >
                  🔄 Rewrite
                </button>
                <button
                  onClick={() => handleImprove("add-examples")}
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                >
                  💡 Add Examples
                </button>
                <button
                  onClick={() => handleImprove("improve-clarity")}
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                >
                  🎯 Improve Clarity
                </button>
                <button
                  onClick={() => handleImprove("make-engaging")}
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                >
                  ⭐ Make Engaging
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <WYSIWYGEditor
        content={block.content}
        onChange={(content) => onChange({ ...block, content })}
        placeholder="Start typing... Use markdown shortcuts like # for headings, ** for bold"
        disabled={isImproving}
      />
    </div>
  );
}

interface ImageEditorProps {
  block: ImageBlock;
  onChange: (block: ImageBlock) => void;
  components: EditorComponents;
}

export function ImageEditor({ block, onChange, components }: ImageEditorProps): React.ReactElement {
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

export function VideoEditor({ block, onChange, components }: VideoEditorProps): React.ReactElement {
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

export function QuoteEditor({ block, onChange, components }: QuoteEditorProps): React.ReactElement {
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

export function PDFEditor({ block, onChange, components }: PDFEditorProps): React.ReactElement {
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

function CarouselSlideEditor({ slide, index, onUpdate, onRemove, components }: CarouselSlideEditorProps): React.ReactElement {
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

export function CarouselEditor({ block, onChange, components }: CarouselEditorProps): React.ReactElement {
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

interface ChartEditorProps {
  block: ChartBlock;
  onChange: (block: ChartBlock) => void;
  components: EditorComponents;
}

export function ChartEditor({ block, onChange, components }: ChartEditorProps): React.ReactElement {
  const { Label, Input, Button, PlusIcon, XIcon, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } = components;

  const updateDataPoint = (index: number, field: keyof ChartDataPoint, value: string | number) => {
    const updated = block.data.map((d, i) =>
      i === index ? { ...d, [field]: field === "value" ? Number(value) : value } : d
    );
    onChange({ ...block, data: updated });
  };

  const addDataPoint = () => {
    onChange({ ...block, data: [...block.data, { label: `Item ${block.data.length + 1}`, value: 0 }] });
  };

  const removeDataPoint = (index: number) => {
    onChange({ ...block, data: block.data.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-muted-foreground">Titre</Label>
        <Input
          value={block.title || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...block, title: e.target.value })}
          placeholder="Titre du graphique"
          className="text-sm h-8 mt-1"
        />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Type de graphique</Label>
        <Select
          value={block.chartType}
          onValueChange={(value: string) => onChange({ ...block, chartType: value as ChartBlock["chartType"] })}
        >
          <SelectTrigger className="text-sm h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Barres</SelectItem>
            <SelectItem value="line">Lignes</SelectItem>
            <SelectItem value="area">Aires</SelectItem>
            <SelectItem value="pie">Camembert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs text-muted-foreground">Axe X (label)</Label>
          <Input
            value={block.xAxisLabel || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...block, xAxisLabel: e.target.value })}
            placeholder="ex: Mois"
            className="text-sm h-8 mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Axe Y (label)</Label>
          <Input
            value={block.yAxisLabel || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...block, yAxisLabel: e.target.value })}
            placeholder="ex: Ventes"
            className="text-sm h-8 mt-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Hauteur (px)</Label>
        <Input
          type="number"
          value={block.height || 300}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...block, height: Number(e.target.value) })}
          min={150}
          max={600}
          className="text-sm h-8 mt-1"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs text-muted-foreground">Données</Label>
          <Button type="button" variant="outline" size="sm" onClick={addDataPoint}>
            <PlusIcon className="w-3 h-3 mr-1" />
            Ajouter
          </Button>
        </div>

        {block.data.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-3 border rounded">
            Aucune donnée
          </p>
        ) : (
          <div className="space-y-2">
            {block.data.map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={point.label}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDataPoint(index, "label", e.target.value)}
                  placeholder="Label"
                  className="text-sm h-8 flex-1"
                />
                <Input
                  type="number"
                  value={point.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDataPoint(index, "value", e.target.value)}
                  placeholder="0"
                  className="text-sm h-8 w-20"
                />
                <input
                  type="color"
                  value={point.color || "#6366f1"}
                  onChange={(e) => updateDataPoint(index, "color", e.target.value)}
                  className="h-8 w-8 rounded border cursor-pointer"
                  title="Couleur"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDataPoint(index)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                >
                  <XIcon className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Légende / caption</Label>
        <Input
          value={block.caption || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...block, caption: e.target.value })}
          placeholder="Source: ..."
          className="text-sm h-8 mt-1"
        />
      </div>
    </div>
  );
}

interface CodeEditorProps {
  block: CodeBlock;
  onChange: (block: CodeBlock) => void;
  components: EditorComponents;
}

export function CodeEditor({ block, onChange, components }: CodeEditorProps): React.ReactElement {
  const { Label, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } = components;

  // Language display map
  const languageLabels: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    python: "Python",
    java: "Java",
    csharp: "C#",
    cpp: "C++",
    php: "PHP",
    ruby: "Ruby",
    go: "Go",
    rust: "Rust",
    sql: "SQL",
    html: "HTML",
    css: "CSS",
    bash: "Bash",
    json: "JSON",
    yaml: "YAML",
  };

  // Ensure language has a value
  const language = block.language || "javascript";
  const displayLabel = languageLabels[language] || language;

  // Initialize language if not set
  React.useEffect(() => {
    if (!block.language) {
      onChange({ ...block, language: "javascript" });
    }
  }, [block.language]);

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-muted-foreground">Langage</Label>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => onChange({ ...block, language: e.target.value })}
            className="w-full text-sm h-8 mt-1 px-3 rounded-md border border-input bg-background"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="cpp">C++</option>
            <option value="php">PHP</option>
            <option value="ruby">Ruby</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="sql">SQL</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="bash">Bash</option>
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
          </select>
        </div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Code</Label>
        <Textarea
          value={block.code}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ ...block, code: e.target.value })}
          placeholder="// Votre code ici"
          className="text-sm font-mono mt-1 min-h-[200px]"
        />
      </div>
    </div>
  );
}