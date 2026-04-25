"use client";

import { useState } from "react";
import type { LayoutType, LayoutSection } from "../types";

interface ContentLayerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLayout: (layoutType: LayoutType) => void;
  onAddBlock: (blockType: string) => void;
  sections?: LayoutSection[];
  selectedSectionId?: string | null;
  selectedColumnIndex?: number;
  onSelectSection?: (sectionId: string) => void;
  onSelectColumn?: (columnIndex: number) => void;
}

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

export function ContentLayerPanel({
  isOpen,
  onClose,
  onAddLayout,
  onAddBlock,
  sections = [],
  selectedSectionId,
  selectedColumnIndex = 0,
  onSelectSection,
  onSelectColumn,
}: ContentLayerPanelProps) {
  const [tab, setTab] = useState<"layouts" | "blocks">("layouts");

  // Get the selected section to show its columns
  const selectedSection = sections.find(s => s.id === selectedSectionId);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="content-layer-title"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📐</span>
                <h2 id="content-layer-title" className="text-xl font-semibold">
                  Layouts & Blocks
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white text-2xl leading-none hover:bg-white/20 rounded-md p-1 transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="sticky top-12 border-b border-gray-200 bg-white px-6 flex gap-4">
              <button
                onClick={() => setTab("layouts")}
                className={`py-3 px-4 font-medium transition-colors ${
                  tab === "layouts"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                📐 Layouts
              </button>
              <button
                onClick={() => setTab("blocks")}
                className={`py-3 px-4 font-medium transition-colors ${
                  tab === "blocks"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                🧩 Blocks
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {tab === "layouts" ? (
                <>
                  {/* Layouts Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Layout Section</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {LAYOUT_OPTIONS.map((layout) => (
                        <button
                          key={layout.type}
                          onClick={() => {
                            onAddLayout(layout.type);
                            onClose();
                          }}
                          className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all text-left"
                        >
                          <div className="text-2xl mb-2">{layout.icon}</div>
                          <div className="text-sm font-medium text-gray-900">{layout.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Select Target Section for Block */}
                  {sections.length > 0 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Select Layout Section</h3>
                        <div className="grid grid-cols-1 gap-2">
                          {sections.map((section, idx) => (
                            <button
                              key={section.id}
                              onClick={() => {
                                onSelectSection?.(section.id);
                                onSelectColumn?.(0); // Reset to first column when selecting section
                              }}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                selectedSectionId === section.id
                                  ? "border-blue-600 bg-blue-50"
                                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
                              }`}
                            >
                              <div className="text-sm font-medium">
                                Section {idx + 1}: {section.type}
                              </div>
                              <div className="text-xs text-gray-600">{section.columns.length} column(s)</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Select Target Column within Section */}
                      {selectedSection && selectedSection.columns.length > 1 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Select Column</h3>
                          <div className="grid grid-cols-1 gap-2">
                            {selectedSection.columns.map((column, idx) => (
                              <button
                                key={idx}
                                onClick={() => onSelectColumn?.(idx)}
                                className={`p-3 rounded-lg border-2 transition-all text-left ${
                                  selectedColumnIndex === idx
                                    ? "border-green-600 bg-green-50"
                                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                }`}
                              >
                                <div className="text-sm font-medium">
                                  Column {idx + 1}
                                </div>
                                <div className="text-xs text-gray-600">{column.length} block(s)</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Blocks Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Block Type</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {BLOCK_OPTIONS.map((block) => (
                        <button
                          key={block.type}
                          onClick={() => {
                            onAddBlock(block.type);
                            onClose();
                          }}
                          className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg hover:border-green-400 hover:shadow-md transition-all text-left"
                        >
                          <div className="text-2xl mb-2">{block.icon}</div>
                          <div className="text-sm font-medium text-gray-900">{block.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Click a layout to add a new section</li>
                  <li>• Select a section, then click a block to add content</li>
                  <li>• Edit and reorder blocks on the canvas</li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 p-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
