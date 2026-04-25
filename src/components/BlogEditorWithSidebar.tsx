"use client";

interface BlogEditorWithSidebarProps {
  children: React.ReactNode; // BlogBuilder component
  onOpenLayoutPanel?: () => void;
}

export function BlogEditorWithSidebar({ children, onOpenLayoutPanel }: BlogEditorWithSidebarProps) {
  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Canvas Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
}
