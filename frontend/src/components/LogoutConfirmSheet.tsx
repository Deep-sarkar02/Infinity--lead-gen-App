import { NavIcon } from "./NavIcon";

interface LogoutConfirmSheetProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmSheet({ open, onClose, onConfirm }: LogoutConfirmSheetProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-confirm-title"
    >
      <button
        type="button"
        className="il-mobile-menu-backdrop absolute inset-0 bg-black/50"
        aria-label="Close"
        onClick={onClose}
      />

      <div className="il-mobile-menu-sheet relative w-full max-w-lg rounded-t-[40px] bg-white px-6 pb-10 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center text-il-blue-30"
          aria-label="Close"
        >
          <NavIcon name="close" className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center pt-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-il-error-95">
            <NavIcon name="logout" className="h-7 w-7 text-il-error-50" />
          </div>

          <h2
            id="logout-confirm-title"
            className="mt-5 text-center text-lg font-bold text-il-neutral-10"
          >
            Are you sure you want to Logout?
          </h2>

          <button
            type="button"
            onClick={onConfirm}
            className="mt-8 w-full rounded-full border-2 border-il-error-50 py-3.5 text-base font-semibold text-il-error-50 transition hover:bg-il-error-95"
          >
            Logout
          </button>

          <button
            type="button"
            onClick={onClose}
            className="mt-4 py-2 text-base font-medium text-il-blue-30"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
