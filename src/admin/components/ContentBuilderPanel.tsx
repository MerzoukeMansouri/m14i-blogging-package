"use client";

/**
 * ContentBuilderPanel Component
 * Collapsible side panel for blog content builder (layouts and blocks)
 */

import type { LayoutSection } from "../../types/layouts";

export interface ContentBuilderPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sections: LayoutSection[];
  onChange: (sections: LayoutSection[]) => void;
  generatingSections?: Set<string>;
  BlogBuilder?: React.ComponentType<any>;
}

export function ContentBuilderPanel({
  isOpen,
  onClose,
  sections,
  onChange,
  generatingSections,
  BlogBuilder,
}: ContentBuilderPanelProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed left-0 top-0 h-full w-full lg:w-[600px] xl:w-[700px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between border-b shadow-sm z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <h2 className="font-semibold text-lg">Content Builder</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
            aria-label="Close Content Builder"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {BlogBuilder ? (
            <BlogBuilder
              sections={sections}
              onChange={onChange}
              generatingSections={generatingSections}
            />
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p className="text-lg font-medium mb-2">Layout & Content Controls</p>
              <p className="text-sm">Configure your blog sections and layouts here.</p>
              <p className="text-sm mt-4">The editing area is on the main page.</p>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="p-6 pt-0 mt-8 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-3">💡 Tips</h3>
          <ul className="space-y-2 text-xs text-gray-600">
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>Drag sections to reorder them</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>Each section can have different layouts (1-col, 2-col, grid)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>Add blocks (text, images, videos, charts) to each column</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>Use the AI Assistant to generate sections automatically</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
