import { QRCodeSVG } from "qrcode.react";
import { AppIcon } from "@/components/AppIcon";
import { useWhatsAppQr } from "@/hooks/useWhatsAppQr";

export function ProfileWhatsAppQrCard() {
  const { qr, loading, generating, error, generate } = useWhatsAppQr();

  return (
    <div className="rounded-[20px] bg-white p-4 shadow-[0_4px_20px_rgba(1,47,99,0.12)] lg:rounded-2xl lg:border lg:border-il-neutral-90 lg:p-6 lg:shadow-card">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-il-success-95 text-il-success-50">
          <AppIcon name="qr-code" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-il-neutral-10 lg:text-il-text-primary">
            WhatsApp QR Code
          </p>
          <p className="mt-0.5 text-xs text-il-neutral-50 lg:text-il-text-secondary">
            Students scan to message Infinity Learn with your name attached.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="mt-4 text-center text-sm text-il-neutral-50">Loading…</p>
      ) : error ? (
        <p className="mt-4 text-center text-sm text-il-error-50">{error}</p>
      ) : qr?.generated && qr.url ? (
        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="rounded-2xl border border-il-neutral-90 bg-white p-4">
            <QRCodeSVG value={qr.url} size={200} level="M" includeMargin />
          </div>
          <p className="text-center text-xs text-il-neutral-50">
            Generated{" "}
            {qr.generated_at
              ? new Date(qr.generated_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : ""}
          </p>
          <a
            href={qr.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-il-blue-30 underline-offset-2 hover:underline"
          >
            Open WhatsApp link
          </a>
        </div>
      ) : (
        <button
          type="button"
          onClick={generate}
          disabled={generating}
          className="mt-4 w-full rounded-xl bg-il-blue-30 px-4 py-3 text-sm font-semibold text-white transition hover:bg-il-blue-40 disabled:opacity-60"
        >
          {generating ? "Generating…" : "Generate QR Code"}
        </button>
      )}
    </div>
  );
}
