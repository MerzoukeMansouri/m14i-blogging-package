"use client";

import { useRef, useState } from "react";
import { BlogBuilder } from "./BlogBuilder";
import { BlogEditorWithSidebar } from "./BlogEditorWithSidebar";
import { DraggableLayerPanel } from "./DraggableLayerPanel";
import { AIAssistantPanel } from "./AIAssistantPanel";
import { createEmptyColumns, createDefaultBlock } from "@m14i/blogging-core";
import type { LayoutType, LayoutSection, ContentBlockType } from "@m14i/blogging-core";

interface BlogEditorContainerProps {
  sections: LayoutSection[];
  onChange: (sections: LayoutSection[]) => void;
  generatingSections?: Set<string>;
  components: any;
  showLayerPanel: boolean;
  onToggleLayerPanel: () => void;
  showAIPanel: boolean;
  onToggleAIPanel: () => void;
  aiPanelProps?: any;
}

export function BlogEditorContainer({
  sections,
  onChange,
  generatingSections,
  components,
  showLayerPanel,
  onToggleLayerPanel,
  showAIPanel,
  onToggleAIPanel,
  aiPanelProps,
}: BlogEditorContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredColumnIndex, setHoveredColumnIndex] = useState<number | null>(null);
  const [hoveredSectionIndex, setHoveredSectionIndex] = useState<number | null>(null);
  const [isDraggingBlock, setIsDraggingBlock] = useState(false);

  const detectDropTarget = (e: React.DragEvent): { sectionIndex: number; columnIndex: number } | null => {
    const editorZone = containerRef.current?.querySelector('[data-editor-zone]');
    if (!editorZone) return null;

    const gridContainers = editorZone.querySelectorAll('[data-grid-container]');

    for (let sectionIndex = 0; sectionIndex < gridContainers.length; sectionIndex++) {
      const gridContainer = gridContainers[sectionIndex];
      const rect = gridContainer.getBoundingClientRect();

      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const relativeX = e.clientX - rect.left;
        const columnCount = sections[sectionIndex]?.columns?.length || 1;
        const columnWidth = rect.width / columnCount;
        const columnIndex = Math.min(
          Math.floor(relativeX / columnWidth),
          columnCount - 1
        );

        return { sectionIndex, columnIndex };
      }
    }

    return null;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";

    try {
      const dragDataStr = sessionStorage.getItem("dragData");
      const data = dragDataStr ? JSON.parse(dragDataStr) : {};

      if (data.isLayout === false && sections.length > 0) {
        setIsDraggingBlock(true);

        const target = detectDropTarget(e);
        if (target) {
          setHoveredSectionIndex(target.sectionIndex);
          setHoveredColumnIndex(target.columnIndex);
        }
      } else {
        setIsDraggingBlock(false);
        setHoveredColumnIndex(null);
        setHoveredSectionIndex(null);
      }
    } catch {
      setIsDraggingBlock(false);
      setHoveredColumnIndex(null);
      setHoveredSectionIndex(null);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.target === containerRef.current) {
      setHoveredColumnIndex(null);
      setHoveredSectionIndex(null);
      setIsDraggingBlock(false);
      sessionStorage.removeItem("dragData");
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      const { type, isLayout } = data;

      if (isLayout) {
        const newSection = {
          id: `layout-${Date.now()}`,
          type: type as LayoutType,
          columns: createEmptyColumns(type as LayoutType),
        };
        onChange([...sections, newSection]);
      } else {
        const blockType = type as ContentBlockType;
        const newBlock = createDefaultBlock(blockType);

        if (sections.length === 0) {
          const newSection = {
            id: `layout-${Date.now()}`,
            type: "1-column" as LayoutType,
            columns: createEmptyColumns("1-column"),
          };
          newSection.columns[0].push(newBlock);
          onChange([newSection]);
        } else {
          const newSections = [...sections];
          const targetSectionIndex = hoveredSectionIndex ?? newSections.length - 1;
          const targetColumnIndex = hoveredColumnIndex ?? 0;

          if (newSections[targetSectionIndex]?.columns?.[targetColumnIndex]) {
            newSections[targetSectionIndex].columns[targetColumnIndex].push(newBlock);
            onChange(newSections);
          }
        }
      }
    } catch {
      // Silent fail - drag data may not be valid
    } finally {
      setHoveredColumnIndex(null);
      setHoveredSectionIndex(null);
      setIsDraggingBlock(false);
      sessionStorage.removeItem("dragData");
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex h-full relative"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Left Sidebar - Layer Panel */}
      <DraggableLayerPanel isOpen={showLayerPanel} onToggle={onToggleLayerPanel} />

      <BlogEditorWithSidebar>
        <BlogBuilder
          sections={sections}
          onChange={onChange}
          generatingSections={generatingSections}
          hideLayoutPicker={true}
          components={components}
        />
      </BlogEditorWithSidebar>

      {/* Right Sidebar - AI Assistant Panel */}
      {aiPanelProps && (
        <AIAssistantPanel
          isOpen={showAIPanel}
          onClose={onToggleAIPanel}
          {...aiPanelProps}
        />
      )}
    </div>
  );
}
