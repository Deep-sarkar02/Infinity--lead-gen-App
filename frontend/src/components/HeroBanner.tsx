import { Link } from "react-router-dom";
import { AppIcon } from "@/components/AppIcon";
import { getMilestoneProgress, getRewardSubtitle } from "@/lib/milestone-progress";

interface HeroBannerProps {
  verified: number;
}

export function HeroBanner({ verified }: HeroBannerProps) {
  const progress = getMilestoneProgress(verified);
  const isComplete = progress.milestoneComplete;

  return (
    <div className="il-hero-banner relative overflow-hidden rounded-2xl p-5 sm:p-6">
      <div className="relative z-10 max-w-[70%]">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-il-yellow-30">
            Win coupons
          </p>
          {isComplete && (
            <span className="rounded-full bg-il-success-50 px-2 py-0.5 text-[10px] font-bold text-white">
              Unlocked
            </span>
          )}
        </div>
        <h2 className="mt-1 text-lg font-bold leading-snug text-il-text-primary sm:text-xl">
          {isComplete
            ? "Amazon coupon unlocked!"
            : "Earn Amazon coupons every 100 verified leads"}
        </h2>
        <p className="mt-2 text-sm text-il-text-secondary">
          {getRewardSubtitle(progress)}
        </p>
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs font-medium text-il-text-secondary">
            <span>{progress.verifiedCount}/{progress.targetCount} verified</span>
            <span>{progress.progressPct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-il-blue-40 to-il-blue-30"
              style={{ width: `${progress.progressPct}%` }}
            />
          </div>
        </div>
        <Link
          to="/wallet"
          className="mt-4 inline-flex text-sm font-semibold text-il-blue-30 hover:text-il-blue-20"
        >
          View my wallet →
        </Link>
      </div>

      <div
        className="pointer-events-none absolute -right-6 bottom-0 hidden h-32 w-32 items-end justify-center sm:flex"
        aria-hidden
      >
        <div className="flex h-32 w-32 items-end justify-center text-il-yellow-30">
          <AppIcon name={isComplete ? "trophy" : "gift"} className="h-24 w-24 opacity-90" />
        </div>
      </div>
    </div>
  );
}
