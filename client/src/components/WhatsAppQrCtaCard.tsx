import { useState } from "react";
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
      <section className="mb-8">
        <div className="relative overflow-hidden rounded-[20px] bg-white p-4 shadow-[0_4px_20px_rgba(1,47,99,0.12)] lg:rounded-2xl lg:border lg:border-il-neutral-90 lg:p-5 lg:shadow-card">
          <div className="flex items-center gap-3">
            <div
              className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-il-success-95 text-3xl lg:h-16 lg:w-16"
              aria-hidden
            >
              📱
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-il-success-50">
                WhatsApp QR
              </p>
              <h2 className="mt-1 text-base font-bold leading-snug text-il-neutral-10">
                {hasQr
                  ? "Your personal student link is ready"
                  : "Get your personal WhatsApp QR"}
              </h2>
              <p className="mt-1 text-xs text-il-neutral-50">
                {hasQr
                  ? "Show students your QR to connect on WhatsApp."
                  : "Generate once — students scan to reach Infinity Learn."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCtaClick}
            disabled={generating}
            className="mt-4 w-full rounded-xl bg-il-blue-30 px-4 py-3 text-sm font-semibold text-white transition hover:bg-il-blue-40 disabled:opacity-60"
          >
            {generating ? "Please wait…" : hasQr ? "See QR" : "Generate QR"}
          </button>

          {error && !sheetOpen && (
            <p className="mt-2 text-center text-xs text-il-error-50">{error}</p>
          )}
        </div>
      </section>

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
