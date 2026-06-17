import { Link } from "react-router-dom";
import { AppIcon } from "@/components/AppIcon";

export function AddLeadPhoneCtaCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-3 shadow-[0_4px_16px_rgba(1,47,99,0.1)] lg:rounded-2xl lg:border lg:border-il-neutral-90 lg:p-5 lg:shadow-card">
      <div className="flex items-center gap-2.5 lg:gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-il-blue-95 text-il-blue-30 lg:h-16 lg:w-16 lg:rounded-2xl"
          aria-hidden
        >
          <AppIcon name="phone" className="h-6 w-6 lg:h-8 lg:w-8" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-il-blue-30 lg:text-[11px]">
            Phone number
          </p>
          <h2 className="mt-0.5 text-sm font-bold leading-snug text-il-neutral-10 lg:mt-1 lg:text-base">
            Add lead via phone
          </h2>
          <p className="mt-0.5 text-[11px] leading-tight text-il-neutral-50 lg:mt-1 lg:text-xs">
            OTP on WhatsApp to verify the lead.
          </p>
        </div>
      </div>

      <Link
        to="/leads/new"
        className="mt-3 flex w-full items-center justify-center rounded-xl bg-il-blue-30 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-il-blue-40 lg:mt-4 lg:py-3"
      >
        Add lead
      </Link>
    </div>
  );
}
