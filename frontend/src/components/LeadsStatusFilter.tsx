import type { LeadStatus } from "@/lib/types";

type LeadStatusFilter = "verified" | "unverified";

interface LeadsStatusFilterProps {
  value: LeadStatusFilter;
  verifiedCount: number;
  unverifiedCount: number;
  onChange: (value: LeadStatusFilter) => void;
}

export function LeadsStatusFilter({
  value,
  verifiedCount,
  unverifiedCount,
  onChange,
}: LeadsStatusFilterProps) {
  const options: { id: LeadStatusFilter; label: string; count: number }[] = [
    { id: "verified", label: "Verified", count: verifiedCount },
    { id: "unverified", label: "Pending", count: unverifiedCount },
  ];

  return (
    <div
      className="mb-4 flex gap-2 lg:mb-6"
      role="tablist"
      aria-label="Filter leads by status"
    >
      {options.map((option) => {
        const active = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-white text-il-blue-30 shadow-[0_4px_20px_rgba(1,47,99,0.12)] lg:bg-il-blue-30 lg:text-white lg:shadow-none"
                : "bg-white/20 text-white hover:bg-white/30 lg:border lg:border-il-neutral-90 lg:bg-white lg:text-il-text-secondary lg:hover:border-il-blue-80 lg:hover:bg-il-blue-95"
            }`}
          >
            {option.label}
            <span
              className={`ml-1.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                active
                  ? "bg-il-blue-95 text-il-blue-30 lg:bg-white/20 lg:text-white"
                  : "bg-white/25 text-white lg:bg-il-neutral-95 lg:text-il-neutral-50"
              }`}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function filterLeadsByStatus<T extends { status: LeadStatus }>(
  leads: T[],
  filter: LeadStatusFilter,
): T[] {
  return leads.filter((lead) => lead.status === filter);
}
