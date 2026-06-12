import { Link } from "react-router-dom";

interface MobileHeroCarouselProps {
  verified: number;
  remaining: number;
  progressPct: number;
}

export function MobileHeroCarousel({
  verified,
  remaining,
  progressPct,
}: MobileHeroCarouselProps) {
  return (
    <section className="mb-8 lg:hidden">
      <div className="relative overflow-hidden rounded-[20px] bg-white p-4 shadow-[0_4px_20px_rgba(1,47,99,0.12)]">
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="flex h-[88px] w-[88px] shrink-0 items-end justify-center rounded-2xl bg-il-blue-95"
            aria-hidden
          >
            <span className="text-5xl leading-none">🎁</span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-il-yellow-30">
              Scout rewards
            </p>
            <h2 className="mt-1 text-base font-bold leading-snug text-il-neutral-10">
              Earn Amazon coupons every 100 verified leads
            </h2>
            <p className="mt-1.5 text-xs text-il-neutral-50">
              {remaining > 0
                ? `${remaining} more to your next reward`
                : "Milestone reached — check wallet!"}
            </p>
            <Link
              to="/wallet"
              className="mt-2 inline-block text-xs font-semibold text-il-blue-30"
            >
              View my wallet →
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-4">
          <div className="mb-1 flex justify-between text-[10px] font-medium text-il-neutral-50">
            <span>{verified % 100}/100 verified</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-il-blue-30 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
