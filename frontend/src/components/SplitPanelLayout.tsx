import type { ReactNode } from "react";
import { InfinityLearnLogo } from "./InfinityLearnLogo";

interface SplitPanelLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
  /** Hide RUNNER tag on brand panel (login uses logo only, per IL auth screens) */
  logoOnly?: boolean;
}

/** IL auth-style split: patterned blue brand panel + white content */
export function SplitPanelLayout({
  children,
  footer,
  logoOnly = false,
}: SplitPanelLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white">
      <aside className="il-auth-panel relative flex w-[34%] max-w-[120px] shrink-0 flex-col items-center justify-center px-3 py-10 sm:max-w-[160px] md:max-w-[200px] lg:w-[38%] lg:max-w-[320px] lg:px-8">
        <div className="relative z-10 flex flex-col items-center">
          <InfinityLearnLogo
            variant="on-blue"
            size="sm"
            showRunnerTag={!logoOnly}
            className="[&_img]:h-9 sm:[&_img]:h-10 lg:[&_img]:h-14"
          />
        </div>
        {footer && (
          <div className="absolute bottom-8 left-0 right-0 z-10 hidden space-y-1 px-6 lg:block">
            {footer}
          </div>
        )}
      </aside>

      <main className="flex min-h-screen flex-1 flex-col bg-white">{children}</main>
    </div>
  );
}
