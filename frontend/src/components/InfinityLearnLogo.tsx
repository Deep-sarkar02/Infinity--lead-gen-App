type LogoSize = "sm" | "md" | "lg";

const heights: Record<LogoSize, string> = {
  sm: "h-9",
  md: "h-14",
  lg: "h-20",
};

interface InfinityLearnLogoProps {
  /** Sidebar: logo on blue. Login: full brand mark on black. */
  variant?: "on-blue" | "on-light";
  size?: LogoSize;
  showRunnerTag?: boolean;
  className?: string;
}

export function InfinityLearnLogo({
  variant = "on-light",
  size = "md",
  showRunnerTag = false,
  className = "",
}: InfinityLearnLogoProps) {
  const imgClass = `${heights[size]} w-auto max-w-[min(100%,280px)] object-contain`;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {variant === "on-blue" ? (
        <img
          src="/logo-ilbtl.png"
          alt="ILBTL — Infinity Learn"
          className={`${imgClass} mix-blend-lighten`}
        />
      ) : (
        <img
          src="/logo-ilbtl.png"
          alt="ILBTL — Infinity Learn"
          className={`${imgClass} rounded-2xl`}
        />
      )}
      {showRunnerTag && (
        <span
          className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${
            variant === "on-blue" ? "text-il-blue-80" : "text-il-text-muted"
          }`}
        >
          ILBTL
        </span>
      )}
    </div>
  );
}
