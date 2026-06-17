import { Link } from "react-router-dom";
import { AppIcon } from "@/components/AppIcon";
import { getMilestoneProgress, getRewardSubtitleShort } from "@/lib/milestone-progress";

interface MobileHeroCarouselProps {
  verified: number;
}

export function MobileHeroCarousel({ verified }: MobileHeroCarouselProps) {
  const progress = getMilestoneProgress(verified);
  const isHot = progress.progressPct >= 75 && progress.progressPct < 100;
  const isMilestone = progress.milestoneComplete;

  return (
    <section className="mb-4 lg:hidden">
      <div
        className={`il-rewards-card relative overflow-hidden rounded-2xl border p-3 ${
          isMilestone
            ? "border-il-success-50 bg-gradient-to-br from-white via-il-success-95 to-white"
            : isHot
              ? "border-il-yellow-50 bg-gradient-to-br from-white via-il-yellow-95 to-il-blue-95"
              : "border-il-blue-80/40 bg-gradient-to-br from-white via-il-blue-95/80 to-white"
        }`}
      >
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-il-yellow-80/30 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-8 left-1/3 h-20 w-20 rounded-full bg-il-blue-80/25 blur-2xl"
          aria-hidden
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl shadow-sm ${
              isMilestone
                ? "bg-gradient-to-br from-il-success-95 to-il-yellow-95 text-il-yellow-30"
                : "bg-gradient-to-br from-il-blue-95 to-il-yellow-95 text-il-blue-30"
            }`}
            aria-hidden
          >
            <AppIcon name={isMilestone ? "trophy" : "gift"} className="h-7 w-7" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-il-yellow-30">
              Win coupons
            </p>
            <h2 className="mt-0.5 text-sm font-bold leading-snug text-il-neutral-10">
              {isMilestone
                ? "Amazon coupon unlocked!"
                : "Win Amazon coupons every 100 leads"}
            </h2>
            <p className="mt-0.5 text-[11px] leading-tight text-il-neutral-50">
              <span className="font-semibold text-il-blue-30">
                {getRewardSubtitleShort(progress)}
              </span>
              {" · "}
              <Link to="/wallet" className="font-semibold text-il-blue-30">
                Wallet →
              </Link>
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-2.5">
          <div className="mb-1 flex justify-between text-[10px] font-semibold text-il-neutral-50">
            <span>
              {progress.verifiedCount}/{progress.targetCount} verified
            </span>
            <span className={isHot ? "text-il-yellow-30" : "text-il-blue-30"}>
              {progress.progressPct}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/80 shadow-inner">
            <div
              className={`h-full rounded-full ${
                isHot
                  ? "bg-gradient-to-r from-il-yellow-30 via-il-orange-40 to-il-blue-30"
                  : "bg-gradient-to-r from-il-blue-40 to-il-blue-30"
              }`}
              style={{ width: `${progress.progressPct}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
