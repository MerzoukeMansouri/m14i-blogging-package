"use client";

/**
 * Pagination Component
 * Navigation controls for paginated content
 */

import { useBlogContext } from "../context/BlogContext";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Pagination component for navigating pages
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  const { labels, classNames, components } = useBlogContext();
  const Button = components?.Button || "button";

  if (totalPages <= 1) {
    return null;
  }

  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    // Show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show first page
    pages.push(1);

    // Add ellipsis if needed
    if (currentPage > 3) pages.push("...");

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) pages.push("...");

    // Show last page
    pages.push(totalPages);
  }

  return (
    <nav
      className={`flex items-center justify-center gap-2 ${
        classNames?.pagination || ""
      } ${className}`}
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← {labels.previous}
      </Button>

      {pages.map((page, index) =>
        typeof page === "number" ? (
          <Button
            key={index}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ) : (
          <span key={index} className="px-2">
            {page}
          </span>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {labels.next} →
      </Button>
    </nav>
  );
}
