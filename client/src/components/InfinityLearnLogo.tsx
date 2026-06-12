type LogoSize = "sm" | "md" | "lg";

const heights: Record<LogoSize, string> = {
  sm: "h-8",
  md: "h-12",
  lg: "h-20",
};

interface InfinityLearnLogoProps {
  /** Sidebar: white logo on blue. Login: logo on black card. */
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
  const img = (
    <img
      src="/logo-white.png"
      alt="Infinity Learn by Sri Chaitanya"
      className={`${heights[size]} w-auto object-contain`}
    />
  );

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {variant === "on-blue" ? (
        <div className="flex items-center justify-center">
          <img
            src="/logo-white.png"
            alt="Infinity Learn by Sri Chaitanya"
            className={`${heights[size]} w-auto object-contain mix-blend-lighten`}
          />
        </div>
      ) : (
        <div className="inline-flex rounded-2xl bg-black px-5 py-4">{img}</div>
      )}
      {showRunnerTag && (
        <span
          className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${
            variant === "on-blue" ? "text-il-blue-80" : "text-il-text-muted"
          }`}
        >
          Scout
        </span>
      )}
    </div>
  );
}
