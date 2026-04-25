"use client";

import { useState } from "react";

interface CollapsibleFormSectionProps {
  title: string;
  icon?: React.ReactNode;
  isComplete: boolean;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  modalContent: React.ReactNode;
  Button?: React.ComponentType<any>;
}

export function CollapsibleFormSection({
  title,
  icon,
  isComplete,
  onOpenChange,
  modalContent,
  Button,
}: CollapsibleFormSectionProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const handleClick = () => {
    handleOpenChange(true);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleOpenChange(false);
    }
  };

  const handleEscKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleOpenChange(false);
    }
  };

  return (
    <>
      {/* Section Header - Clickable to open modal */}
      <div
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick();
          }
        }}
        className="group cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <span className="text-lg">{icon}</span>}
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{title}</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl transition-transform">
              {isComplete ? "✅" : "⭕"}
            </span>
            <span className="text-gray-400 group-hover:text-gray-600 transition-transform">→</span>
          </div>
        </div>
      </div>

      {/* Modal Dialog with Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 p-6 bg-white">
              <div className="flex items-center gap-3">
                {icon && <span className="text-lg">{icon}</span>}
                <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
                  {title}
                </h2>
              </div>
              <button
                onClick={() => handleOpenChange(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none hover:bg-gray-100 rounded-md p-1 transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-1 overflow-y-auto text-gray-900">
              {modalContent}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 p-6 flex justify-end gap-3">
              <button
                onClick={() => handleOpenChange(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleOpenChange(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
