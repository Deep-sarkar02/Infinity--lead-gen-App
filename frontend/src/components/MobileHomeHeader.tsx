import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { MobileMenuSheet } from "./MobileMenuSheet";
import { NavIcon } from "./NavIcon";

function HeaderAvatar() {
  const { user } = useAuth();
  const initial = user?.full_name?.[0]?.toUpperCase() ?? "R";

  if (user?.photo_url) {
    return (
      <img
        src={user.photo_url}
        alt=""
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <span className="flex h-full w-full items-center justify-center bg-il-blue-30 text-sm font-bold text-white">
      {initial}
    </span>
  );
}

export function MobileHomeHeader({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="mb-5 flex items-center justify-between lg:hidden">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card"
            aria-label="Go back"
          >
            <NavIcon name="back" className="h-5 w-5 text-il-neutral-10" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card"
            aria-label="Open menu"
          >
            <NavIcon name="menu" className="h-5 w-5 text-il-neutral-10" />
          </button>
        )}

        <h1 className="text-lg font-semibold text-white">{title}</h1>

        <Link
          to="/profile"
          className="flex h-10 w-10 overflow-hidden rounded-full border-2 border-white/90 bg-white shadow-card"
          aria-label="Profile"
        >
          <HeaderAvatar />
        </Link>
      </header>

      {!onBack && (
        <MobileMenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
      )}
    </>
  );
}
