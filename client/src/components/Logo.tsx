import { InfinityLearnLogo } from "./InfinityLearnLogo";

/** @deprecated Use InfinityLearnLogo directly */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <InfinityLearnLogo
      variant="on-blue"
      size="lg"
      showRunnerTag
      className={className}
    />
  );
}
