import { useState } from "react";
import { LogoutConfirmSheet } from "../LogoutConfirmSheet";

interface ProfileSignOutButtonProps {
  onSignOut: () => void;
}

export function ProfileSignOutButton({ onSignOut }: ProfileSignOutButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="w-full rounded-full bg-white py-3.5 text-sm font-semibold text-il-neutral-50 shadow-[0_4px_20px_rgba(1,47,99,0.12)] transition hover:bg-il-bg-grey-tint lg:rounded-xl lg:border lg:border-il-neutral-90 lg:shadow-none"
      >
        Logout
      </button>

      <LogoutConfirmSheet
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onSignOut();
        }}
      />
    </>
  );
}
