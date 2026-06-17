import { useState } from "react";
import { AppIcon } from "@/components/AppIcon";
import { useWhatsAppQr } from "@/hooks/useWhatsAppQr";
import { WhatsAppQrSheet } from "./WhatsAppQrSheet";

export function WhatsAppQrCtaCard() {
  const { qr, loading, generating, error, generate, hasQr } = useWhatsAppQr();
  const [sheetOpen, setSheetOpen] = useState(false);

  async function handleCtaClick() {
    if (hasQr) {
      setSheetOpen(true);
      return;
    }

    const result = await generate();
    if (result?.generated) {
      setSheetOpen(true);
    }
  }

  async function handleGenerateInSheet() {
    const result = await generate();
    if (result?.generated) {
      setSheetOpen(true);
    }
  }

  if (loading) return null;

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-white p-3 shadow-[0_4px_16px_rgba(1,47,99,0.1)] lg:rounded-2xl lg:border lg:border-il-neutral-90 lg:p-5 lg:shadow-card">
          <div className="flex items-center gap-2.5 lg:gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-il-success-95 text-il-success-50 lg:h-16 lg:w-16 lg:rounded-2xl"
              aria-hidden
            >
              <AppIcon name="qr-code" className="h-6 w-6 lg:h-8 lg:w-8" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-il-success-50 lg:text-[11px]">
                QR code
              </p>
              <h2 className="mt-0.5 text-sm font-bold leading-snug text-il-neutral-10 lg:mt-1 lg:text-base">
                Add lead via QR code
              </h2>
              <p className="mt-0.5 text-[11px] leading-tight text-il-neutral-50 lg:mt-1 lg:text-xs">
                {hasQr
                  ? "Students scan your QR to message on WhatsApp."
                  : "Generate QR — students scan to connect."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCtaClick}
            disabled={generating}
            className="mt-3 w-full rounded-xl bg-il-blue-30 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-il-blue-40 disabled:opacity-60 lg:mt-4 lg:py-3"
          >
            {generating ? "Please wait…" : hasQr ? "See QR" : "Generate QR"}
          </button>

          {error && !sheetOpen && (
            <p className="mt-2 text-center text-xs text-il-error-50">{error}</p>
          )}
      </div>

      <WhatsAppQrSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        qr={qr}
        generating={generating}
        error={error}
        onGenerate={handleGenerateInSheet}
      />
    </>
  );
}
