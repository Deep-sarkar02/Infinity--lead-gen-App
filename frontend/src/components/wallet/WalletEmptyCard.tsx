import type { LeadSummary } from "@/lib/types";
import { AppIcon } from "@/components/AppIcon";
import { getMilestoneProgress, getRewardSubtitle } from "@/lib/milestone-progress";

interface WalletEmptyCardProps {
  summary: LeadSummary;
}

export function WalletEmptyCard({ summary }: WalletEmptyCardProps) {
  const progress = getMilestoneProgress(summary.verified);

  return (
    <div className="il-rewards-card mx-auto max-w-lg overflow-hidden rounded-[20px] border border-il-blue-80/30 bg-gradient-to-br from-white via-il-blue-95/50 to-white px-6 py-10 text-center shadow-[0_4px_20px_rgba(1,47,99,0.12)] lg:rounded-2xl lg:p-10 lg:shadow-card">
      <div className="mx-auto flex h-24 w-full max-w-[200px] items-center justify-center rounded-2xl bg-gradient-to-br from-il-yellow-95 to-il-blue-95 text-il-blue-30">
        <AppIcon name="gift" className="h-12 w-12" />
      </div>

      <h2 className="mt-6 text-base font-bold text-il-neutral-10 lg:font-semibold lg:text-il-text-primary">
        No rewards yet
      </h2>
      <p className="mx-auto mt-2 max-w-[280px] text-sm text-il-neutral-50 lg:text-il-text-secondary">
        {progress.remaining > 0
          ? getRewardSubtitle(progress)
          : "You've unlocked a reward — it will appear here soon."}
      </p>
      <p className="mt-4 text-xs text-il-neutral-50 lg:text-il-text-muted">
        {summary.verified} verified · {summary.unverified} pending
      </p>
    </div>
  );
}
