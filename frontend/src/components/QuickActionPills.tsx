import { Link } from "react-router-dom";
import { NavIcon } from "./NavIcon";

interface QuickActionPillsProps {
  walletCount?: number;
}

export function QuickActionPills({ walletCount = 0 }: QuickActionPillsProps) {
  return (
    <div className="flex flex-col gap-2 sm:min-w-[148px]">
      <Link
        to="/leads/new"
        className="flex items-center justify-center gap-2 rounded-full border border-il-neutral-90 bg-white px-5 py-2.5 text-sm font-semibold text-il-blue-30 shadow-card transition hover:border-il-blue-80 hover:bg-il-blue-95"
      >
        <NavIcon name="add-lead" className="h-4 w-4" />
        Add Lead
      </Link>
      <Link
        to="/wallet"
        className="flex items-center justify-center gap-2 rounded-full border border-il-neutral-90 bg-white px-5 py-2.5 text-sm font-semibold text-il-blue-30 shadow-card transition hover:border-il-blue-80 hover:bg-il-blue-95"
      >
        <NavIcon name="wallet" className="h-4 w-4" />
        My Wallet
        {walletCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-il-blue-30 px-1.5 text-[10px] font-bold text-white">
            {walletCount}
          </span>
        )}
      </Link>
    </div>
  );
}
