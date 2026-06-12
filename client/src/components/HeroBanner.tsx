import { Link } from "react-router-dom";

interface HeroBannerProps {
  verified: number;
  remaining: number;
  progressPct: number;
}

export function HeroBanner({ verified, remaining, progressPct }: HeroBannerProps) {
  return (
    <div className="il-hero-banner relative overflow-hidden rounded-2xl p-5 sm:p-6">
      <div className="relative z-10 max-w-[70%]">
        <p className="text-xs font-semibold uppercase tracking-wide text-il-yellow-30">
          Scout rewards
        </p>
        <h2 className="mt-1 text-lg font-bold leading-snug text-il-text-primary sm:text-xl">
          Earn Amazon coupons every 100 verified leads
        </h2>
        <p className="mt-2 text-sm text-il-text-secondary">
          {remaining > 0
            ? `${remaining} more verified leads to your next reward`
            : "You've hit a milestone — check your wallet!"}
        </p>
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs font-medium text-il-text-secondary">
            <span>{verified % 100}/100 verified</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-il-blue-30 transition-all"
              style={{ width: `${progressPct}%` }}
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
        <span className="text-7xl">🎁</span>
      </div>
    </div>
  );
}
