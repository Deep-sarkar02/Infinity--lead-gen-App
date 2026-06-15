import { Link, useLocation } from "react-router-dom";
import { isNavActive, mobileBottomNavItems } from "@/lib/nav-config";
import { NavIcon } from "./NavIcon";

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex justify-center px-6 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] pt-2 lg:hidden"
      aria-label="Main navigation"
    >
      <div className="pointer-events-auto flex items-center gap-6 rounded-full bg-white px-6 py-2.5 shadow-[0_6px_24px_rgba(0,0,0,0.12)]">
        {mobileBottomNavItems.map((item) => {
          const active = isNavActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-[4.5rem] flex-col items-center gap-0.5 transition-colors ${
                active ? "text-il-blue-30" : "text-il-neutral-10"
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center">
                <NavIcon name={item.icon} className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
