import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { isNavActive, sidebarNavItems } from "@/lib/nav-config";
import { LogoutConfirmSheet } from "./LogoutConfirmSheet";
import { NavIcon } from "./NavIcon";
import { SidebarLogo } from "./SidebarLogo";

const STORAGE_KEY = "infinity_runner_sidebar_collapsed";

export function Sidebar() {
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  return (
    <aside
      className={`hidden shrink-0 flex-col bg-il-blue-30 text-white transition-[width] duration-200 lg:flex ${
        collapsed ? "w-[72px]" : "w-60"
      }`}
    >
      <div
        className={`flex items-center py-5 ${
          collapsed ? "justify-center px-2" : "justify-between px-4"
        }`}
      >
        <SidebarLogo collapsed={collapsed} />
        {!collapsed && (
          <button
            type="button"
            onClick={toggleCollapsed}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Minimize menu"
          >
            <span>Minimize menu</span>
            <NavIcon name="menu" className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          type="button"
          onClick={toggleCollapsed}
          className="mx-auto mb-2 rounded-lg p-2 text-white/80 hover:bg-white/10"
          aria-label="Expand menu"
          title="Expand menu"
        >
          <NavIcon name="menu" className="h-5 w-5" />
        </button>
      )}

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {sidebarNavItems.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-full text-sm font-medium transition ${
                collapsed ? "justify-center px-0 py-3" : "px-4 py-3"
              } ${
                active
                  ? "bg-white text-il-blue-30 shadow-sm"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <NavIcon name={item.icon} className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-3 py-4">
        <button
          type="button"
          onClick={() => setLogoutConfirmOpen(true)}
          title={collapsed ? "Logout" : undefined}
          className={`flex w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-il-neutral-50 transition hover:bg-il-bg-grey-tint ${
            collapsed ? "h-11 w-11 p-0" : "px-4 py-3"
          }`}
        >
          {collapsed ? (
            <NavIcon name="logout" className="h-5 w-5 shrink-0 text-il-neutral-50" />
          ) : (
            "Logout"
          )}
        </button>

        <LogoutConfirmSheet
          open={logoutConfirmOpen}
          onClose={() => setLogoutConfirmOpen(false)}
          onConfirm={() => {
            setLogoutConfirmOpen(false);
            signOut();
          }}
        />

        {!collapsed && (
          <div className="mt-4 space-y-1 px-2">
            <p className="text-[10px] text-white/50">Terms &amp; Conditions</p>
            <p className="text-[10px] text-white/50">Privacy Policy</p>
            <p className="pt-2 text-[10px] text-white/40">Version 1.0.0</p>
          </div>
        )}
      </div>
    </aside>
  );
}
