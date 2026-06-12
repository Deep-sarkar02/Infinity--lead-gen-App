import type { LeadSummary } from "@/lib/types";

interface WalletEmptyCardProps {
  summary: LeadSummary;
  remaining: number;
}

export function WalletEmptyCard({ summary, remaining }: WalletEmptyCardProps) {
  return (
    <div className="mx-auto max-w-lg rounded-[20px] bg-white px-6 py-10 text-center shadow-[0_4px_20px_rgba(1,47,99,0.12)] lg:rounded-2xl lg:border lg:border-il-neutral-90 lg:p-10 lg:shadow-card">
      <div className="mx-auto flex h-24 w-full max-w-[200px] items-center justify-center rounded-2xl bg-il-yellow-95">
        <span className="text-5xl">🎁</span>
      </div>

      <h2 className="mt-6 text-base font-bold text-il-neutral-10 lg:font-semibold lg:text-il-text-primary">
        No rewards yet
      </h2>
      <p className="mx-auto mt-2 max-w-[280px] text-sm text-il-neutral-50 lg:text-il-text-secondary">
        Collect {remaining} more verified leads to earn your first Amazon coupon.
      </p>
      <p className="mt-4 text-xs text-il-neutral-50 lg:text-il-text-muted">
        {summary.verified} verified · {summary.unverified} pending
      </p>
    </div>
  );
}
