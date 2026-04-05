"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import type { LayoutConfig, BlockConfig } from "../types";

interface BlogBuilderSidebarProps {
  layouts: LayoutConfig[];
  blocks: BlockConfig[];
}

export function BlogBuilderSidebar({ layouts, blocks }: BlogBuilderSidebarProps): React.ReactElement {
  return (
    <div className="w-80 border-r bg-card overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Layouts */}
        <div>
          <h3 className="font-semibold mb-3">📐 Layouts</h3>
          <Droppable droppableId="layouts" isDropDisabled type="LAYOUT">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {layouts.map((layout, index) => (
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

        {/* Content Blocks */}
        <div className="pt-6 border-t">
          <h3 className="font-semibold mb-3">🧩 Blocs de contenu</h3>
          <Droppable droppableId="blocks" isDropDisabled type="BLOCK">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {blocks.map((block, index) => (
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
  );
}