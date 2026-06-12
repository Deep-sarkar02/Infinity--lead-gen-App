import { Link } from "react-router-dom";

export function ProfileWalletCard() {
  return (
    <Link
      to="/wallet"
      className="flex items-center justify-between rounded-[20px] bg-white p-4 shadow-[0_4px_20px_rgba(1,47,99,0.12)] transition hover:bg-il-blue-95/30 lg:rounded-2xl lg:border lg:border-il-neutral-90 lg:shadow-card"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-il-yellow-95 text-xl">
          🎁
        </span>
        <div className="min-w-0 text-left">
          <p className="font-semibold text-il-neutral-10 lg:text-il-text-primary">
            My Wallet
          </p>
          <p className="truncate text-xs text-il-neutral-50 lg:text-il-text-secondary">
            View Amazon coupon rewards
          </p>
        </div>
      </div>
      <span className="shrink-0 pl-2 text-lg font-medium text-il-blue-30">→</span>
    </Link>
  );
}
