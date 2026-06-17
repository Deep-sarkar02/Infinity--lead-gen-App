import { InfinityLearnLogo } from "./InfinityLearnLogo";

export function SidebarLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <InfinityLearnLogo
      variant="on-blue"
      size={collapsed ? "sm" : "md"}
      className={collapsed ? "items-center" : "items-start"}
    />
  );
}
