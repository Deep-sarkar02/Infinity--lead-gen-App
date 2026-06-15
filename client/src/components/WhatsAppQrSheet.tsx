import { QRCodeSVG } from "qrcode.react";
import { NavIcon } from "./NavIcon";
import type { WhatsAppQrInfo } from "@/lib/types";

interface WhatsAppQrSheetProps {
  open: boolean;
  onClose: () => void;
  qr: WhatsAppQrInfo | null;
  generating: boolean;
  error: string | null;
  onGenerate: () => void;
}

export function WhatsAppQrSheet({
  open,
  onClose,
  qr,
  generating,
  error,
  onGenerate,
}: WhatsAppQrSheetProps) {
  if (!open) return null;

  const showQr = Boolean(qr?.generated && qr.url);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center lg:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-qr-title"
    >
      <button
        type="button"
        className="il-mobile-menu-backdrop absolute inset-0 bg-black/50"
        aria-label="Close"
        onClick={onClose}
      />

      <div className="il-mobile-menu-sheet relative w-full max-w-lg rounded-t-[40px] bg-white px-6 pb-10 pt-6 lg:rounded-3xl lg:pb-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center text-il-blue-30"
          aria-label="Close"
        >
          <NavIcon name="close" className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center pt-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-il-success-95 text-2xl">
            📱
          </div>

          <h2
            id="whatsapp-qr-title"
            className="mt-4 text-center text-lg font-bold text-il-neutral-10"
          >
            {showQr ? "Your WhatsApp QR" : "Generate WhatsApp QR"}
          </h2>
          <p className="mt-2 max-w-xs text-center text-sm text-il-neutral-50">
            {showQr
              ? "Students scan this to message Infinity Learn with your name attached."
              : "Create a personal QR code students can scan to reach Infinity Learn on WhatsApp."}
          </p>

          {error && (
            <p className="mt-4 text-center text-sm text-il-error-50">{error}</p>
          )}

          {showQr && qr?.url ? (
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="rounded-2xl border border-il-neutral-90 bg-white p-4">
                <QRCodeSVG value={qr.url} size={220} level="M" includeMargin />
              </div>
              {qr.generated_at && (
                <p className="text-xs text-il-neutral-50">
                  Generated{" "}
                  {new Date(qr.generated_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
              <a
                href={qr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-il-blue-30 underline-offset-2 hover:underline"
              >
                Open WhatsApp link
              </a>
            </div>
          ) : (
            <button
              type="button"
              onClick={onGenerate}
              disabled={generating}
              className="mt-8 w-full rounded-full bg-il-blue-30 py-3.5 text-base font-semibold text-white transition hover:bg-il-blue-40 disabled:opacity-60"
            >
              {generating ? "Generating…" : "Generate QR Code"}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="mt-4 py-2 text-base font-medium text-il-blue-30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
