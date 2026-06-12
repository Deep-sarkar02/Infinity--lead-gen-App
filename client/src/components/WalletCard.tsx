import { useState } from "react";
import type { WalletItem } from "@/lib/types";

export function WalletCard({ item }: { item: WalletItem }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(item.coupon_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-[20px] border border-il-gray-100 bg-white p-4 shadow-card lg:rounded-2xl">
      <button type="button" className="w-full text-left" onClick={() => setExpanded((v) => !v)}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-il-gray-900">
              🛒 Amazon Coupon — {item.coupon_value}
            </p>
            <p className="mt-1 text-xs text-il-gray-600">
              {item.milestone_number * 100} verified leads ·{" "}
              {new Date(item.earned_at).toLocaleDateString("en-IN")}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              item.status === "active"
                ? "bg-il-success-bg text-il-success"
                : "bg-il-gray-100 text-il-gray-600"
            }`}
          >
            {item.status}
          </span>
        </div>
      </button>
      {expanded && (
        <div className="mt-4 border-t border-il-gray-100 pt-4">
          <p className="text-xs font-medium text-il-gray-600">Coupon code</p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-il-gray-50 px-3 py-2 font-mono text-sm">
              {item.coupon_code}
            </code>
            <button
              type="button"
              onClick={copyCode}
              className="rounded-lg bg-il-primary px-3 py-2 text-xs font-semibold text-white"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
