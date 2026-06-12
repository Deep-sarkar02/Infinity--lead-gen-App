import type { LeadRecord } from "@/lib/types";

const statusStyles = {
  verified: "bg-il-success-95 text-il-success-50",
  unverified: "bg-il-warning-95 text-il-warning-50",
  rejected: "bg-il-error-95 text-il-error-50",
};

export function LeadListItem({ lead }: { lead: LeadRecord }) {
  const maskedPhone = lead.student_phone.replace(/(\d{2})\d{6}(\d{2})/, "$1XXXXXX$2");

  return (
    <div className="flex items-center justify-between rounded-2xl border border-il-neutral-90 bg-white px-4 py-3.5 shadow-card">
      <div className="min-w-0">
        <p className="truncate font-semibold text-il-text-primary">{lead.student_name}</p>
        <p className="mt-0.5 text-xs text-il-text-secondary">+91 {maskedPhone}</p>
        <p className="mt-1 text-[10px] text-il-text-muted">
          {new Date(lead.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusStyles[lead.status]}`}
      >
        {lead.status}
      </span>
    </div>
  );
}
