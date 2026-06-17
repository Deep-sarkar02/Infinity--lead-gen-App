import type { AppIconName } from "@/components/AppIcon";
import { AppIcon } from "@/components/AppIcon";
import type { LeadSummary } from "@/lib/types";

type StatVariant = "verified" | "unverified" | "total";

const statConfig: Record<
  StatVariant,
  { bg: string; accent: string; labelColor: string; icon: AppIconName; label: string }
> = {
  verified: {
    bg: "bg-il-success-95",
    accent: "text-il-success-50",
    labelColor: "text-il-success-50",
    icon: "check-circle",
    label: "Verified",
  },
  unverified: {
    bg: "bg-il-warning-95",
    accent: "text-il-warning-50",
    labelColor: "text-il-warning-50",
    icon: "clock",
    label: "Unverified",
  },
  total: {
    bg: "bg-il-blue-95",
    accent: "text-il-blue-30",
    labelColor: "text-il-blue-30",
    icon: "users",
    label: "Total",
  },
};

function ProfileStatCard({ variant, value }: { variant: StatVariant; value: number }) {
  const config = statConfig[variant];

  return (
    <div
      className={`flex flex-col items-center rounded-[20px] px-2 py-5 shadow-[0_4px_20px_rgba(1,47,99,0.08)] lg:rounded-2xl lg:px-3 lg:py-5 lg:shadow-none ${config.bg}`}
    >
      <span
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-card ${config.accent}`}
      >
        <AppIcon name={config.icon} className="h-5 w-5" />
      </span>
      <span className="text-2xl font-bold leading-none text-il-neutral-10">{value}</span>
      <span className={`mt-2 text-xs font-semibold ${config.labelColor}`}>
        {config.label}
      </span>
    </div>
  );
}

export function ProfileStatsRow({ summary }: { summary: LeadSummary }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <ProfileStatCard variant="verified" value={summary.verified} />
      <ProfileStatCard variant="unverified" value={summary.unverified} />
      <ProfileStatCard variant="total" value={summary.total} />
    </div>
  );
}
