import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({ currentPage, totalItems, itemsPerPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(createPageUrl(page), { scroll: false });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span key={`dots-${index}`} className="px-3 py-2 text-slate-400 font-body">
            <MoreHorizontal className="w-5 h-5" />
          </span>
        );
      }

      const isCurrent = page === currentPage;
      return (
        <button
          key={`page-${page}`}
          onClick={() => handlePageChange(page as number)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl font-semibold transition-all font-body ${
            isCurrent
              ? "bg-primary text-white shadow-md shadow-primary/30"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1">
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
