interface LeadsPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function LeadsPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: LeadsPaginationProps) {
  if (totalItems <= pageSize) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <nav
      className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
      aria-label="Leads pagination"
    >
      <p className="text-xs text-il-neutral-50 lg:text-il-text-secondary">
        <span className="lg:hidden text-white/70">
          Showing {start}–{end} of {totalItems}
        </span>
        <span className="hidden lg:inline">
          Showing {start}–{end} of {totalItems} leads
        </span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-il-blue-30 shadow-[0_4px_16px_rgba(1,47,99,0.12)] transition enabled:hover:bg-il-blue-95 disabled:cursor-not-allowed disabled:opacity-40 lg:rounded-lg lg:border lg:border-il-neutral-90 lg:shadow-none lg:enabled:hover:border-il-blue-80"
        >
          Previous
        </button>

        <span className="min-w-[4.5rem] text-center text-xs font-medium text-white lg:text-il-text-secondary">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-il-blue-30 shadow-[0_4px_16px_rgba(1,47,99,0.12)] transition enabled:hover:bg-il-blue-95 disabled:cursor-not-allowed disabled:opacity-40 lg:rounded-lg lg:border lg:border-il-neutral-90 lg:shadow-none lg:enabled:hover:border-il-blue-80"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
