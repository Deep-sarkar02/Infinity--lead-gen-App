import { Link } from "react-router-dom";
import { MilestoneTrophyIllustration } from "./MilestoneTrophyIllustration";
import { NavIcon } from "./NavIcon";
import type { PendingMilestone } from "@/lib/types";

export function MilestoneModal({
  milestone,
  onDismiss,
  onViewWallet,
}: {
  milestone: PendingMilestone;
  onDismiss: () => void;
  onViewWallet: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="milestone-title"
    >
      <button
        type="button"
        className="il-mobile-menu-backdrop absolute inset-0 bg-black/50"
        aria-label="Close"
        onClick={onDismiss}
      />

      <div className="il-mobile-menu-sheet il-milestone-screen relative w-full max-w-lg rounded-t-[40px] px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 lg:max-w-md lg:rounded-2xl lg:shadow-[0_24px_64px_rgba(1,47,99,0.18)]">
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center text-il-neutral-50 transition hover:text-il-neutral-10"
          aria-label="Close"
        >
          <NavIcon name="close" className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center pt-2 text-center">
          <MilestoneTrophyIllustration className="h-36 w-36 sm:h-40 sm:w-40" />

          <p
            id="milestone-title"
            className="mt-6 max-w-sm text-base font-semibold leading-relaxed text-il-neutral-10"
          >
            Milestone achieved! You earned Rs 100 Amazon coupons for{" "}
            {milestone.verified_count} verified leads.
          </p>

          <div className="mt-8 flex w-full gap-3">
            <button
              type="button"
              onClick={onDismiss}
              className="flex-1 rounded-full border border-il-neutral-90 bg-white py-3.5 text-sm font-semibold text-il-neutral-50 transition hover:bg-il-bg-grey-tint"
            >
              Continue
            </button>
            <Link
              to="/wallet"
              onClick={onViewWallet}
              className="flex flex-1 items-center justify-center rounded-full bg-il-blue-30 py-3.5 text-sm font-semibold text-white transition hover:bg-il-blue-20"
            >
              View Wallet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
