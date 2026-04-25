"use client";

import type { LayoutType } from "../../types";

const LAYOUT_OPTIONS: Array<{ type: LayoutType; label: string; icon: string }> = [
  { type: "1-column", label: "1 Column", icon: "📋" },
  { type: "2-columns", label: "2 Columns", icon: "📊" },
  { type: "2-columns-wide-left", label: "2 Col (Left Wide)", icon: "📐" },
  { type: "2-columns-wide-right", label: "2 Col (Right Wide)", icon: "📑" },
  { type: "grid-2x2", label: "Grid 2x2", icon: "🎯" },
];

const BLOCK_OPTIONS: Array<{ type: string; label: string; icon: string }> = [
  { type: "text", label: "Text", icon: "📝" },
  { type: "image", label: "Image", icon: "🖼️" },
  { type: "video", label: "Video", icon: "🎬" },
  { type: "quote", label: "Quote", icon: "💬" },
  { type: "code", label: "Code", icon: "💻" },
];

interface DraggableLayerPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onAddLayout?: (layoutType: LayoutType) => void;
  onAddBlock?: (blockType: string) => void;
}

export function DraggableLayerPanel({
  isOpen,
  onToggle,
  onAddLayout,
  onAddBlock,
}: DraggableLayerPanelProps) {
  const handleDragStart = (e: React.DragEvent, type: string, isLayout: boolean) => {
    e.dataTransfer.effectAllowed = "copy";
    const dragData = { type, isLayout };
    e.dataTransfer.setData("application/json", JSON.stringify(dragData));
    // Store in sessionStorage as fallback (dataTransfer not accessible in dragOver)
    sessionStorage.setItem("dragData", JSON.stringify(dragData));
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 ${
        isOpen ? "w-80 visible opacity-100" : "w-80 invisible opacity-0 pointer-events-none"
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📐</span>
          <h3 className="font-semibold">Layers</h3>
        </div>
        <button
          onClick={onToggle}
          className="text-white/80 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto h-[calc(100vh-60px)] p-4 space-y-6">
        {/* Layouts Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>📐</span> Layouts
          </h4>
          <div className="space-y-2">
            {LAYOUT_OPTIONS.map((layout) => (
              <div
                key={layout.type}
                draggable
                onDragStart={(e) => handleDragStart(e, layout.type, true)}
                className="p-3 rounded-lg border-2 border-blue-200 bg-blue-50 hover:border-blue-400 hover:shadow-md transition-all cursor-move hover:bg-blue-100"
              >
                <div className="text-sm font-medium flex items-center gap-2">
                  <span>{layout.icon}</span>
                  {layout.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Blocks Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>🧩</span> Blocks
          </h4>
          <div className="space-y-2">
            {BLOCK_OPTIONS.map((block) => (
              <div
                key={block.type}
                draggable
                onDragStart={(e) => handleDragStart(e, block.type, false)}
                className="p-3 rounded-lg border-2 border-green-200 bg-green-50 hover:border-green-400 hover:shadow-md transition-all cursor-move hover:bg-green-100"
              >
                <div className="text-sm font-medium flex items-center gap-2">
                  <span>{block.icon}</span>
                  {block.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-6">
          <h5 className="text-xs font-semibold text-blue-900 mb-2">💡 Tips</h5>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Drag layouts onto the canvas</li>
            <li>• Drag blocks into layout columns</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
