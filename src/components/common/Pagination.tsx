'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  itemLabel?: string; // ex: "voyage", "demande", "article"
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  itemLabel = "élément"
}: PaginationProps) {
  const getPageNumbers = (isMobile: boolean) => {
    const pages: (number | string)[] = [];
    const maxVisible = isMobile ? 3 : 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (isMobile) {
        if (currentPage > 2) {
          pages.push(1);
          pages.push('...');
        } else {
          pages.push(1);
        }
        
        if (currentPage !== 1 && currentPage !== totalPages) {
          pages.push(currentPage);
        }
        
        if (currentPage < totalPages - 1) {
          pages.push('...');
        }
        
        pages.push(totalPages);
      } else {
        pages.push(1);

        if (currentPage > 3) {
          pages.push('...');
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        if (currentPage < totalPages - 2) {
          pages.push('...');
        }

        pages.push(totalPages);
      }
    }

    return pages;
  };

  const getItemsRange = () => {
    if (!totalItems) return null;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return { start, end };
  };

  const range = getItemsRange();
  const pluralLabel = totalItems && totalItems > 1 ? `${itemLabel}s` : itemLabel;

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Informations sur les éléments affichés */}
      {range && (
        <div className="text-sm text-gray-600">
          <span className="hidden sm:inline">
            Affichage de <span className="font-medium">{range.start}</span> à{' '}
            <span className="font-medium">{range.end}</span> sur{' '}
            <span className="font-medium">{totalItems}</span> {pluralLabel}
          </span>
          <span className="sm:hidden">
            <span className="font-medium">{range.start}-{range.end}</span> sur{' '}
            <span className="font-medium">{totalItems}</span>
          </span>
        </div>
      )}

      {/* Version desktop et tablette */}
      <div className="hidden sm:flex items-center justify-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Page précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers(false).map((page, index) =>
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={cn(
                  'min-w-[40px] h-10 px-3 rounded-lg font-medium transition-colors',
                  page === currentPage
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                )}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="px-2 text-gray-500">
                {page}
              </span>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Page suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Version mobile compacte */}
      <div className="flex sm:hidden items-center justify-between w-full gap-2 px-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Page précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1 flex-1 justify-center max-w-[200px]">
          {getPageNumbers(true).map((page, index) =>
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={cn(
                  'min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors',
                  page === currentPage
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                )}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="px-1 text-gray-500 text-sm">
                {page}
              </span>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Page suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}