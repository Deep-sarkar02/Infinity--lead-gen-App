type Variant = "verified" | "unverified" | "total";

const styles: Record<Variant, { bg: string; accent: string; icon: string }> = {
  verified: {
    bg: "bg-il-success-95",
    accent: "text-il-success-50",
    icon: "✓",
  },
  unverified: {
    bg: "bg-il-warning-95",
    accent: "text-il-warning-50",
    icon: "○",
  },
  total: {
    bg: "bg-il-blue-95",
    accent: "text-il-blue-30",
    icon: "∑",
  },
};

const labels: Record<Variant, string> = {
  verified: "Verified",
  unverified: "Unverified",
  total: "Total",
};

export function StatCard({ variant, value }: { variant: Variant; value: number }) {
  const style = styles[variant];

  return (
    <div
      className={`flex flex-col items-center rounded-2xl px-3 py-5 ${style.bg}`}
    >
      <span
        className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold shadow-card ${style.accent}`}
      >
        {style.icon}
      </span>
      <span className="text-2xl font-bold text-il-text-primary">{value}</span>
      <span className="mt-1 text-xs font-semibold text-il-text-secondary">
        {labels[variant]}
      </span>
    </div>
  );
}
