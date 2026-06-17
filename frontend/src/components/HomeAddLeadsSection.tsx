import { AddLeadPhoneCtaCard } from "./AddLeadPhoneCtaCard";
import { WhatsAppQrCtaCard } from "./WhatsAppQrCtaCard";

export function HomeAddLeadsSection() {
  return (
    <section className="mb-6">
      <div className="mb-3 lg:hidden">
        <h2 className="text-base font-semibold text-white">Add leads</h2>
        <p className="mt-0.5 text-xs text-white/60">
          Capture students by WhatsApp QR or phone
        </p>
      </div>

      <div className="mb-4 hidden lg:block">
        <h2 className="text-base font-bold text-il-text-primary">Add leads</h2>
        <p className="mt-0.5 text-sm text-il-text-secondary">
          Capture students by WhatsApp QR or phone
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
        <WhatsAppQrCtaCard />
        <AddLeadPhoneCtaCard />
      </div>
    </section>
  );
}
