import type { AppIconName } from "@/components/AppIcon";
import { AppIcon } from "@/components/AppIcon";

type Variant = "verified" | "unverified" | "total";

const styles: Record<Variant, { bg: string; accent: string; icon: AppIconName }> = {
  verified: {
    bg: "bg-il-success-95",
    accent: "text-il-success-50",
    icon: "check-circle",
  },
  unverified: {
    bg: "bg-il-warning-95",
    accent: "text-il-warning-50",
    icon: "clock",
  },
  total: {
    bg: "bg-il-blue-95",
    accent: "text-il-blue-30",
    icon: "users",
  },
};

const labels: Record<Variant, string> = {
  verified: "Verified",
  unverified: "Pending",
  total: "Total",
};

export function StatCard({ variant, value }: { variant: Variant; value: number }) {
  const style = styles[variant];

  return (
    <div
      className={`flex flex-col items-center rounded-2xl px-3 py-5 ${style.bg}`}
    >
      <span
        className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-card ${style.accent}`}
      >
        <AppIcon name={style.icon} className="h-5 w-5" />
      </span>
      <span className="text-2xl font-bold text-il-text-primary">{value}</span>
      <span className="mt-1 text-xs font-semibold text-il-text-secondary">
        {labels[variant]}
      </span>
    </div>
  );
}
