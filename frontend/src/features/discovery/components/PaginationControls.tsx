"use client";

import { useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pagination } from "@/lib/types/photographer";

interface PaginationControlsProps {
  pagination: Pagination;
  page: number;
  onPageChange: (page: number) => void;
}

/**
 * Build a windowed page list: [1, 2, 3, null, 8]
 */
function getPageWindow(current: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | null)[] = [];
  const SIBLING = 1;

  pages.push(1);

  const rangeStart = Math.max(2, current - SIBLING);
  const rangeEnd = Math.min(total - 1, current + SIBLING);

  if (rangeStart > 2) pages.push(null);

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (rangeEnd < total - 1) pages.push(null);

  pages.push(total);

  return pages;
}

/**
 * PaginationControls - Minimalist "SnapFind" Design.
 * Clean, icon-driven, and focused on the active state.
 */
export function PaginationControls({ pagination, page, onPageChange }: PaginationControlsProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && pagination.hasPrevPage) {
        onPageChange(page - 1);
      } else if (e.key === "ArrowRight" && pagination.hasNextPage) {
        onPageChange(page + 1);
      }
    },
    [page, pagination.hasPrevPage, pagination.hasNextPage, onPageChange],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (pagination.totalPages <= 1) return null;

  const pageWindow = getPageWindow(page, pagination.totalPages);

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {/* Previous Page */}
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={!pagination.hasPrevPage}
        className={cn(
          "size-10 flex items-center justify-center transition-all",
          !pagination.hasPrevPage ? "text-neutral-200 cursor-not-allowed" : "text-black hover:bg-neutral-50 active:scale-95"
        )}
      >
        <ChevronLeft className="size-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageWindow.map((pageNum, idx) =>
          pageNum === null ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-3 text-[10px] font-black text-neutral-300 uppercase tracking-widest"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "size-10 flex items-center justify-center text-[11px] font-black uppercase tracking-tighter transition-all",
                page === pageNum 
                  ? "bg-black text-white shadow-xl" 
                  : "text-neutral-400 hover:text-black hover:bg-neutral-50"
              )}
            >
              {pageNum}
            </button>
          )
        )}
      </div>

      {/* Next Page */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!pagination.hasNextPage}
        className={cn(
          "size-10 flex items-center justify-center transition-all",
          !pagination.hasNextPage ? "text-neutral-200 cursor-not-allowed" : "text-black hover:bg-neutral-50 active:scale-95"
        )}
      >
        <ChevronRight className="size-5" />
      </button>
    </nav>
  );
}
