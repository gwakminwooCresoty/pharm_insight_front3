import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  page: number; // 0-based
  totalPages: number;
  totalElements: number;
  size: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  totalElements,
  size,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = page * size + 1;
  const end = Math.min((page + 1) * size, totalElements);

  const pages: number[] = [];
  const rangeStart = Math.max(0, page - 2);
  const rangeEnd = Math.min(totalPages - 1, page + 2);
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

  const navBtn =
    'w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors duration-[var(--transition-fast)]';
  const pageBtn = (active: boolean) =>
    `w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-[var(--transition-fast)] ${active
      ? 'bg-primary-600 text-white shadow-sm'
      : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm text-slate-500">
        {totalElements.toLocaleString()}건 중 {start}–{end}
      </span>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => onPageChange(0)}
          disabled={page === 0}
          className={navBtn}
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className={navBtn}
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={pageBtn(p === page)}
          >
            {p + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className={navBtn}
        >
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={page >= totalPages - 1}
          className={navBtn}
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}
