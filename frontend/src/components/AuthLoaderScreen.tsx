function VerifiedCheckIcon({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex h-[148px] w-[148px] items-center justify-center ${className}`}
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full animate-[il-ring-spin_2.8s_linear_infinite]"
        viewBox="0 0 148 148"
        fill="none"
      >
        <circle
          cx="74"
          cy="74"
          r="68"
          stroke="var(--il-blue-50)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="320 120"
          opacity="0.55"
        />
      </svg>
      <svg
        className="absolute inset-0 h-full w-full animate-[il-ring-spin_2.8s_linear_infinite_reverse]"
        viewBox="0 0 148 148"
        fill="none"
      >
        <circle
          cx="74"
          cy="74"
          r="58"
          stroke="var(--il-blue-40)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="240 100"
          opacity="0.75"
        />
      </svg>

      <div className="relative flex h-[88px] w-[88px] items-center justify-center rounded-full bg-il-blue-40 shadow-[0_8px_24px_rgba(2,123,254,0.35)]">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <defs>
            <pattern
              id="il-check-pattern"
              patternUnits="userSpaceOnUse"
              width="4"
              height="4"
              patternTransform="rotate(45)"
            >
              <rect width="4" height="4" fill="#ffffff" />
              <line x1="0" y1="0" x2="0" y2="4" stroke="#cbe5fe" strokeWidth="1.5" />
            </pattern>
          </defs>
          <path
            d="M12 22.5L19 29.5L32 15.5"
            stroke="url(#il-check-pattern)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

function VerifiedContent({ fillHeight = false }: { fillHeight?: boolean }) {
  return (
    <div
      className={`flex w-full flex-col items-center text-center ${
        fillHeight ? "min-h-full flex-1" : ""
      }`}
    >
      <h1 className="text-[28px] font-semibold leading-tight text-il-neutral-10 lg:text-[32px]">
        Verified!
      </h1>

      <div className={`flex items-center justify-center ${fillHeight ? "flex-1 py-8" : "mt-10 lg:mt-14"}`}>
        <VerifiedCheckIcon />
      </div>

      <p className={`text-sm text-il-neutral-50 lg:text-base ${fillHeight ? "pb-2" : "pt-16 lg:pt-20"}`}>
        Redirecting you...
      </p>
    </div>
  );
}

function BrandLogo({
  className = "",
  variant = "on-blue",
}: {
  className?: string;
  variant?: "on-blue" | "on-dark";
}) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img
        src="/logo-ilbtl.png"
        alt="ILBTL — Infinity Learn"
        className={`h-[52px] w-auto max-w-[220px] object-contain lg:h-[72px] lg:max-w-[280px] ${
          variant === "on-blue" ? "mix-blend-lighten" : ""
        }`}
      />
      <p className="mt-2 text-center text-[11px] tracking-wide text-white/90 lg:mt-3 lg:text-xs">
        Power up your learning journey
      </p>
    </div>
  );
}

/** Mobile — Figma 51_IL_Mobile node 14350:47207 */
function MobileVerifiedLoader() {
  return (
    <div className="il-mobile-login-bg flex min-h-screen flex-col px-4 pb-6 pt-14">
      <BrandLogo className="shrink-0 [&_img]:h-24 sm:[&_img]:h-28" />

      <div className="mt-6 flex min-h-0 flex-1 flex-col rounded-[40px] bg-white px-6 pb-10 pt-10 shadow-[0_8px_32px_rgba(1,47,99,0.12)]">
        <VerifiedContent fillHeight />
      </div>
    </div>
  );
}

/** Web — Figma 51_IL_Mobile node 39733:98792 */
function WebVerifiedLoader() {
  return (
    <div className="hidden min-h-screen lg:flex">
      <aside className="il-login-web-brand relative flex w-[42%] shrink-0 items-center justify-center overflow-hidden">
        <div className="relative z-10 px-10">
          <BrandLogo />
        </div>
      </aside>

      <main className="il-verified-web-panel flex flex-1 items-center justify-center bg-white px-16 xl:px-24">
        <div className="w-full max-w-[420px]">
          <VerifiedContent />
        </div>
      </main>
    </div>
  );
}

export function AuthLoaderScreen() {
  return (
    <>
      <div className="lg:hidden">
        <MobileVerifiedLoader />
      </div>
      <WebVerifiedLoader />
    </>
  );
}
