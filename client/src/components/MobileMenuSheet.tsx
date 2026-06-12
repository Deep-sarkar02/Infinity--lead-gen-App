import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { isNavActive, mobileMenuSections } from "@/lib/nav-config";
import { LogoutConfirmSheet } from "./LogoutConfirmSheet";
import { NavIcon } from "./NavIcon";

interface MobileMenuSheetProps {
  open: boolean;
  onClose: () => void;
}

const APP_VERSION = "1.0.0";

function MenuRow({
  href,
  label,
  icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: (typeof mobileMenuSections)[number]["items"][number]["icon"];
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      to={href}
      onClick={onNavigate}
      className={`flex items-center gap-4 px-6 py-4 text-base font-medium transition ${
        active ? "text-il-blue-30" : "text-il-neutral-20"
      }`}
    >
      <NavIcon
        name={icon}
        className={`h-6 w-6 shrink-0 ${active ? "text-il-blue-30" : "text-il-neutral-30"}`}
      />
      {label}
    </Link>
  );
}

export function MobileMenuSheet({ open, onClose }: MobileMenuSheetProps) {
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  if (!open && !logoutConfirmOpen) return null;

  return (
    <>
    {open && (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button
        type="button"
        className="il-mobile-menu-backdrop absolute inset-0 bg-black/50"
        aria-label="Close menu"
        onClick={onClose}
      />

      <div className="il-mobile-menu-sheet absolute inset-x-0 bottom-0 flex flex-col items-center">
        <div className="w-full max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-[#B8B8B8] pb-6">
          {mobileMenuSections.map((section, index) => (
            <div key={section.items.map((i) => i.href).join("-")}>
              {index > 0 && <hr className="mx-6 border-0 border-t border-white/40" />}
              <nav>
                {section.items.map((item) => (
                  <MenuRow
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={isNavActive(pathname, item.href)}
                    onNavigate={onClose}
                  />
                ))}
              </nav>
            </div>
          ))}

          <hr className="mx-6 border-0 border-t border-white/40" />

          <button
            type="button"
            onClick={() => {
              onClose();
              setLogoutConfirmOpen(true);
            }}
            className="flex w-full items-center gap-4 px-6 py-4 text-base font-medium text-il-neutral-20"
          >
            <NavIcon name="logout" className="h-6 w-6 shrink-0 text-il-neutral-30" />
            Logout
          </button>

          <div className="mt-4 px-6 text-center">
            <p className="text-xs text-il-neutral-30">
              <button type="button" className="underline underline-offset-2">
                Terms &amp; Conditions
              </button>
              {" & "}
              <button type="button" className="underline underline-offset-2">
                Privacy Policy
              </button>
            </p>
            <p className="mt-3 text-[10px] text-il-neutral-40">
              App Version : {APP_VERSION}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="-mt-5 mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
          aria-label="Close menu"
        >
          <NavIcon name="close" className="h-6 w-6 text-il-neutral-20" />
        </button>
      </div>
    </div>
    )}

    <LogoutConfirmSheet
      open={logoutConfirmOpen}
      onClose={() => setLogoutConfirmOpen(false)}
      onConfirm={() => {
        setLogoutConfirmOpen(false);
        signOut();
      }}
    />
    </>
  );
}
