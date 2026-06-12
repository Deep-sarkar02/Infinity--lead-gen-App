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
  const remaining = milestone.milestone_number * 100 + 100 - milestone.verified_count;

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

          <h2
            id="milestone-title"
            className="mt-6 text-xl font-bold text-il-neutral-10"
          >
            Milestone {milestone.milestone_number} unlocked!
          </h2>

          <p className="mt-3 max-w-sm text-base leading-relaxed text-il-neutral-10">
            You earned{" "}
            <span className="font-bold text-il-orange-50">
              {milestone.reward.value} Amazon coupon
            </span>{" "}
            for{" "}
            <span className="font-bold text-il-orange-50">
              {milestone.verified_count} verified leads
            </span>
            !
          </p>

          {remaining > 0 && (
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-il-neutral-50">
              Collect{" "}
              <span className="font-bold text-il-orange-50">
                {remaining} more verified leads
              </span>{" "}
              to unlock your next reward.
            </p>
          )}

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
