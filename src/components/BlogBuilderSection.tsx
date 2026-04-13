"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Trash2 } from "lucide-react";
import type { LayoutSection, ContentBlock } from "../types";
import { getLayoutClasses, getLayoutLabel } from "../utils";
import { ContentBlockInlineEditor } from "./ContentBlockInlineEditor";

interface BlogBuilderSectionProps {
  section: LayoutSection;
  sectionIndex: number;
  onDeleteSection: () => void;
  onDeleteBlock: (columnIndex: number, blockIndex: number) => void;
  onUpdateBlock: (columnIndex: number, blockIndex: number, updatedBlock: ContentBlock) => void;
  components: {
    Button: React.ComponentType<any>;
    Card: React.ComponentType<any>;
    CardContent: React.ComponentType<any>;
    CardHeader: React.ComponentType<any>;
    Label: React.ComponentType<any>;
    Input: React.ComponentType<any>;
    Textarea: React.ComponentType<any>;
    Select: React.ComponentType<any>;
    SelectTrigger: React.ComponentType<any>;
    SelectValue: React.ComponentType<any>;
    SelectContent: React.ComponentType<any>;
    SelectItem: React.ComponentType<any>;
    PlusIcon: React.ComponentType<any>;
    XIcon: React.ComponentType<any>;
  };
}

export function BlogBuilderSection({
  section,
  sectionIndex,
  onDeleteSection,
  onDeleteBlock,
  onUpdateBlock,
  components,
}: BlogBuilderSectionProps): React.ReactElement {
  const { Button, Card, CardContent, CardHeader } = components;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {getLayoutLabel(section.type)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDeleteSection}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-4 ${getLayoutClasses(section.type)}`}>
          {(section.columns || []).map((column, columnIndex) => (
            <BlogBuilderColumn
              key={`column-${sectionIndex}-${columnIndex}`}
              column={column}
              columnId={`column-${sectionIndex}-${columnIndex}`}
              onDeleteBlock={(blockIndex) => onDeleteBlock(columnIndex, blockIndex)}
              onUpdateBlock={(blockIndex, block) => onUpdateBlock(columnIndex, blockIndex, block)}
              components={components}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface BlogBuilderColumnProps {
  column: ContentBlock[];
  columnId: string;
  onDeleteBlock: (blockIndex: number) => void;
  onUpdateBlock: (blockIndex: number, updatedBlock: ContentBlock) => void;
  components: any;
}

function BlogBuilderColumn({
  column,
  columnId,
  onDeleteBlock,
  onUpdateBlock,
  components,
}: BlogBuilderColumnProps): React.ReactElement {
  const { Button } = components;

  return (
    <Droppable droppableId={columnId} type="BLOCK">
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
                <Draggable key={block.id} draggableId={block.id} index={blockIndex}>
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
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                          </svg>
                        </div>

                        {/* Content Editor */}
                        <div className="flex-1 min-w-0">
                          <ContentBlockInlineEditor
                            block={block}
                            onChange={(updatedBlock) => onUpdateBlock(blockIndex, updatedBlock)}
                            components={components}
                          />
                        </div>

                        {/* Delete Button */}
                        <div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => onDeleteBlock(blockIndex)}
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
  );
}
