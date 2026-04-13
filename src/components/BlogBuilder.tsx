"use client";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Trash2 } from "lucide-react";
import { getLayoutClasses, getLayoutLabel } from "../utils";
import { ContentBlockInlineEditor } from "./ContentBlockInlineEditor";
import type {
  LayoutSection,
  ContentBlock,
  LayoutType,
  ContentBlockType,
  BlogBuilderConfig,
} from "../types";
import { createEmptyColumns, createDefaultBlock } from "../utils";
import { mergeConfig } from "../config/defaults";

// NOTE: This component requires shadcn/ui components:
// Button, Card, CardContent, CardHeader
// Install with: npx shadcn@latest add button card

export interface BlogBuilderProps {
  sections: LayoutSection[];
  onChange: (sections: LayoutSection[]) => void;
  config?: BlogBuilderConfig;
  // Optional set of section IDs currently being generated (for loading overlay)
  generatingSections?: Set<string>;
  // shadcn/ui components passed as props
  components: {
    Button: React.ComponentType<{
      variant?: string;
      size?: string;
      className?: string;
      onClick?: () => void;
      children: React.ReactNode;
    }>;
    Card: React.ComponentType<{ className?: string; children: React.ReactNode }>;
    CardContent: React.ComponentType<{ className?: string; children: React.ReactNode }>;
    CardHeader: React.ComponentType<{ className?: string; children: React.ReactNode }>;
    Label: React.ComponentType<{ className?: string; children: React.ReactNode }>;
    Input: React.ComponentType<any>;
    Textarea: React.ComponentType<any>;
    Select: React.ComponentType<any>;
    SelectTrigger: React.ComponentType<any>;
    SelectValue: React.ComponentType<any>;
    SelectContent: React.ComponentType<any>;
    SelectItem: React.ComponentType<any>;
    PlusIcon: React.ComponentType<{ className?: string }> | React.ForwardRefExoticComponent<any>;
    XIcon: React.ComponentType<{ className?: string }> | React.ForwardRefExoticComponent<any>;
  };
  // Optional AI improvement callback
  onImproveContent?: (content: string, instruction: "expand" | "shorten" | "rewrite" | "add-examples" | "improve-clarity" | "make-engaging") => Promise<string>;
}

export function BlogBuilder({ sections, onChange, config: userConfig, components, onImproveContent, generatingSections }: BlogBuilderProps) {
  const config = mergeConfig(userConfig);
  const { Button, Card, CardContent, CardHeader } = components;

  const addLayout = (layoutType: LayoutType) => {
    const newSection: LayoutSection = {
      id: `layout-${Date.now()}`,
      type: layoutType,
      columns: createEmptyColumns(layoutType),
    };
    onChange([...sections, newSection]);
  };

  const deleteSection = (index: number) => {
    onChange(sections.filter((_, i) => i !== index));
  };

  const deleteBlock = (sectionIndex: number, columnIndex: number, blockIndex: number) => {
    const newSections = [...sections];
    const section = newSections[sectionIndex];
    if (!section?.columns?.[columnIndex]) return;
    section.columns[columnIndex] = section.columns[columnIndex].filter((_, i) => i !== blockIndex);
    onChange(newSections);
  };

  const updateBlock = (
    sectionIndex: number,
    columnIndex: number,
    blockIndex: number,
    updatedBlock: ContentBlock
  ) => {
    const newSections = [...sections];
    const section = newSections[sectionIndex];
    if (!section?.columns?.[columnIndex]) return;
    section.columns[columnIndex][blockIndex] = updatedBlock;
    onChange(newSections);
  };

  const handleDragEnd = (result: DropResult): void => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // Handle layout drag from sidebar
    if (source.droppableId === "layouts") {
      const layoutType = draggableId.replace("layout-", "") as LayoutType;
      addLayout(layoutType);
      return;
    }

    // Handle new block drag from sidebar
    if (source.droppableId === "blocks") {
      const blockType = draggableId.replace("block-", "") as ContentBlockType;
      const [, sectionIndex, columnIndex] = destination.droppableId.split("-");

      const newSections = [...sections];
      const section = newSections[parseInt(sectionIndex)];
      if (!section?.columns?.[parseInt(columnIndex)]) return;
      const targetColumn = section.columns[parseInt(columnIndex)];
      targetColumn.splice(destination.index, 0, createDefaultBlock(blockType));
      onChange(newSections);
      return;
    }

    // Handle section reordering
    if (source.droppableId === "editor-zone" && destination.droppableId === "editor-zone") {
      const newSections = [...sections];
      const [movedSection] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, movedSection);
      onChange(newSections);
      return;
    }

    // Handle existing block reorganization
    const [, sourceSectionIdx, sourceColumnIdx] = source.droppableId.split("-");
    const [, destSectionIdx, destColumnIdx] = destination.droppableId.split("-");

    const newSections = [...sections];
    const sourceSection = newSections[parseInt(sourceSectionIdx)];
    const destSection = newSections[parseInt(destSectionIdx)];
    if (!sourceSection?.columns?.[parseInt(sourceColumnIdx)] || !destSection?.columns?.[parseInt(destColumnIdx)]) return;
    const sourceColumn = sourceSection.columns[parseInt(sourceColumnIdx)];
    const destColumn = destSection.columns[parseInt(destColumnIdx)];

    const [movedBlock] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, movedBlock);

    onChange(newSections);
  };

  const renderGeneratingSection = (section: LayoutSection, sectionIndex: number): React.ReactElement => (
    <div className="relative overflow-hidden rounded-lg">
      <Card className="border-primary/30 bg-card/95">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {getLayoutLabel(section.type)}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Generating
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 px-6 py-12 text-center">
            <svg
              className="mx-auto mb-4"
              width="64"
              height="64"
              viewBox="0 0 50 50"
              aria-hidden="true"
              style={{ animation: "spin 1s linear infinite" }}
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="rgba(184,115,51,0.2)"
                strokeWidth="4"
              />
              <path
                d="M25 5a20 20 0 0 1 20 20"
                fill="none"
                stroke="#B87333"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-lg font-semibold text-foreground">
              Génération en cours...
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Section {sectionIndex + 1}/{sections.length}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              The layout is ready. Content blocks will appear here automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar - Layouts & Blocs */}
        <div className="w-80 border-r bg-card overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Layouts */}
            <div>
              <h3 className="font-semibold mb-3">📐 Layouts</h3>
              <Droppable droppableId="layouts" isDropDisabled type="LAYOUT">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {config.layouts.map((layout, index) => (
                      <Draggable
                        key={layout.type}
                        draggableId={`layout-${layout.type}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 border rounded-lg cursor-grab flex items-center gap-3 hover:bg-accent active:cursor-grabbing ${
                              snapshot.isDragging ? "opacity-50 shadow-lg" : ""
                            }`}
                          >
                            {layout.icon && <layout.icon className="w-5 h-5 text-muted-foreground" />}
                            <span className="text-sm font-medium">{layout.label}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Blocs de contenu */}
            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-3">🧩 Blocs de contenu</h3>
              <Droppable droppableId="blocks" isDropDisabled type="BLOCK">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {config.blocks.map((block, index) => (
                      <Draggable
                        key={block.type}
                        draggableId={`block-${block.type}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 border rounded-lg cursor-grab flex items-center gap-3 hover:bg-accent active:cursor-grabbing ${
                              snapshot.isDragging ? "opacity-50 shadow-lg" : ""
                            }`}
                          >
                            {block.icon && <block.icon className="w-5 h-5 text-muted-foreground" />}
                            <span className="text-sm font-medium">{block.label}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="pt-6 border-t text-xs text-muted-foreground space-y-1">
              <p><strong>💡 Astuce :</strong></p>
              <p>1. Glissez un layout</p>
              <p>2. Glissez des blocs dans les colonnes</p>
              <p>3. Cliquez pour éditer</p>
            </div>
          </div>
        </div>

        {/* Zone d'édition */}
        <div className="flex-1 overflow-y-auto p-6">
          <Droppable droppableId="editor-zone" type="LAYOUT">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`min-h-full ${
                  snapshot.isDraggingOver ? "bg-accent/50" : ""
                }`}
              >
                {sections.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <Card className={`max-w-md w-full ${snapshot.isDraggingOver ? "border-primary" : ""}`}>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        <div className="w-12 h-12 mx-auto mb-4 opacity-50 border-2 border-dashed rounded" />
                        <p>Glissez un layout ici pour commencer</p>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
            <div className="space-y-4 max-w-6xl mx-auto pb-20">
              {sections.filter(Boolean).map((section, sectionIndex) => (
                <Draggable key={section.id} draggableId={section.id} index={sectionIndex}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={snapshot.isDragging ? "opacity-50" : ""}
                    >
                      {generatingSections?.has(section.id) ? renderGeneratingSection(section, sectionIndex) : (
                        <div className="relative overflow-hidden rounded-lg">
                        <Card>
                          <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {/* Drag Handle for Section */}
                              <div
                                className="cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                                </svg>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {getLayoutLabel(section.type)}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteSection(sectionIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className={`grid gap-4 ${getLayoutClasses(section.type)}`}>
                            {(section.columns || []).map((column, columnIndex) => (
                              <Droppable
                                key={`column-${sectionIndex}-${columnIndex}`}
                                droppableId={`column-${sectionIndex}-${columnIndex}`}
                                type="BLOCK"
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`min-h-[200px] border-2 border-dashed rounded-lg p-4 flex flex-col justify-center ${
                                      snapshot.isDraggingOver ? "border-primary bg-accent" : "border-muted"
                                    }`}
                                  >
                                    {column.length === 0 ? (
                                      <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                                        Glissez un bloc ici
                                      </div>
                                    ) : (
                                      <div className="space-y-3 w-full max-w-xl mx-auto">
                                        {column.map((block, blockIndex) => (
                                          <Draggable
                                            key={block.id}
                                            draggableId={block.id}
                                            index={blockIndex}
                                          >
                                            {(provided) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="group relative border rounded-lg bg-card hover:shadow-md transition-shadow"
                                              >
                                                <div className="flex items-start gap-2 p-3">
                                                  {/* Drag Handle */}
                                                  <div
                                                    {...provided.dragHandleProps}
                                                    className="cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity pt-1"
                                                  >
                                                    <svg
                                                      className="w-4 h-4"
                                                      fill="currentColor"
                                                      viewBox="0 0 20 20"
                                                    >
                                                      <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                                                    </svg>
                                                  </div>

                                                  {/* Content - Always editable */}
                                                  <div className="flex-1 min-w-0">
                                                    <ContentBlockInlineEditor
                                                      block={block}
                                                      onChange={(updatedBlock) =>
                                                        updateBlock(
                                                          sectionIndex,
                                                          columnIndex,
                                                          blockIndex,
                                                          updatedBlock
                                                        )
                                                      }
                                                      components={{
                                                        Label: components.Label,
                                                        Input: components.Input,
                                                        Textarea: components.Textarea,
                                                        Select: components.Select,
                                                        SelectTrigger: components.SelectTrigger,
                                                        SelectValue: components.SelectValue,
                                                        SelectContent: components.SelectContent,
                                                        SelectItem: components.SelectItem,
                                                        Button: components.Button,
                                                        PlusIcon: components.PlusIcon,
                                                        XIcon: components.XIcon,
                                                      }}
                                                      onImprove={onImproveContent}
                                                    />
                                                  </div>

                                                  {/* Delete Button */}
                                                  <div>
                                                    <Button
                                                      size="icon"
                                                      variant="ghost"
                                                      className="h-8 w-8"
                                                      onClick={() =>
                                                        deleteBlock(sectionIndex, columnIndex, blockIndex)
                                                      }
                                                    >
                                                      <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                      </div>
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            ))}
                          </div>
                        </CardContent>
                        </Card>
                      </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
          </div>
        )}
      </Droppable>
      </div>
    </div>
    </DragDropContext>
  );
}
