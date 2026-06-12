import { Link } from "react-router-dom";
import type { LeadRecord } from "@/lib/types";

const subjectStyles = [
  { bg: "bg-il-orange-95", accent: "text-il-orange-40", label: "Lead", icon: "💡" },
  { bg: "bg-il-blue-95", accent: "text-il-blue-30", label: "Lead", icon: "📋" },
  { bg: "bg-il-purple-95", accent: "text-il-purple-30", label: "Lead", icon: "📐" },
] as const;

function formatLeadTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: LeadRecord["status"] }) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-il-success-95 px-2.5 py-1 text-[11px] font-semibold text-il-success-50">
        <span className="h-1.5 w-1.5 rounded-full bg-il-success-50" />
        Verified
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="rounded-full bg-il-error-95 px-2.5 py-1 text-[11px] font-semibold text-il-error-50">
        Rejected
      </span>
    );
  }

  return (
    <span className="rounded-full bg-il-warning-95 px-2.5 py-1 text-[11px] font-semibold text-il-warning-50">
      Pending
    </span>
  );
}

export function LeadActivityCard({
  lead,
  index = 0,
}: {
  lead: LeadRecord;
  index?: number;
}) {
  const style = subjectStyles[index % subjectStyles.length];

  return (
    <article className="rounded-[20px] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl ${style.bg}`}
        >
          <span className="text-lg leading-none">{style.icon}</span>
          <span className={`mt-0.5 text-[9px] font-semibold ${style.accent}`}>
            {style.label}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-il-neutral-10">
            {lead.student_name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-il-neutral-50">
            {lead.student_phone}
          </p>

          <div className="mt-2.5 flex flex-wrap gap-2">
            <StatusBadge status={lead.status} />
            <span className="inline-flex items-center gap-1 rounded-full border border-il-neutral-90 px-2.5 py-1 text-[11px] font-medium text-il-neutral-50">
              <span aria-hidden>📝</span>
              Student lead
            </span>
          </div>

          <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-il-neutral-50">
            <span aria-hidden>🕐</span>
            Added {formatLeadTime(lead.created_at)}
          </p>
        </div>
      </div>
    </article>
  );
}

export function LeadSummaryActivityCard({
  variant,
  value,
  index = 0,
}: {
  variant: "verified" | "unverified" | "add";
  value?: number;
  index?: number;
}) {
  const style = subjectStyles[index % subjectStyles.length];

  if (variant === "add") {
    return (
      <Link
        to="/leads/new"
        className="block rounded-[20px] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      >
        <div className="flex gap-3">
          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-il-blue-95">
            <span className="text-lg leading-none">➕</span>
            <span className="mt-0.5 text-[9px] font-semibold text-il-blue-30">New</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-il-neutral-10">Add a new lead</h3>
            <p className="mt-0.5 text-xs text-il-neutral-50">
              Capture student name and phone at your center
            </p>
            <div className="mt-2.5">
              <span className="rounded-full bg-il-blue-95 px-2.5 py-1 text-[11px] font-semibold text-il-blue-30">
                Quick action
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  const isVerified = variant === "verified";

  return (
    <article className="rounded-[20px] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl ${style.bg}`}
        >
          <span className="text-lg leading-none">{isVerified ? "✓" : "○"}</span>
          <span className={`mt-0.5 text-[9px] font-semibold ${style.accent}`}>
            {isVerified ? "Done" : "Open"}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-il-neutral-10">
            {isVerified ? "Verified leads" : "Pending verification"}
          </h3>
          <p className="mt-0.5 text-xs text-il-neutral-50">
            {isVerified
              ? "Leads confirmed by Infinity Learn"
              : "Awaiting backend verification"}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-il-success-95 px-2.5 py-1 text-[11px] font-semibold text-il-success-50">
                <span className="h-1.5 w-1.5 rounded-full bg-il-success-50" />
                Completed
              </span>
            ) : (
              <span className="rounded-full bg-il-warning-95 px-2.5 py-1 text-[11px] font-semibold text-il-warning-50">
                Pending
              </span>
            )}
            <span className="rounded-full border border-il-neutral-90 px-2.5 py-1 text-[11px] font-medium text-il-neutral-50">
              {value ?? 0} total
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
