import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { PageHeader } from "@/components/PageHeader";
import { WalletCard } from "@/components/WalletCard";
import { WalletEmptyCard } from "@/components/wallet/WalletEmptyCard";
import { getWallet } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { WalletItem } from "@/lib/types";

function WalletContent() {
  const { token, summary } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<WalletItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getWallet(token);
      setItems(data.items);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const remaining = 100 - (summary.verified % 100);

  return (
    <AppLayout mobileTheme="blue">
      <MobileHomeHeader title="My Wallet" onBack={() => navigate(-1)} />
      <div className="hidden lg:block">
        <PageHeader title="My Wallet" />
      </div>

      {loading ? (
        <>
          <div className="flex justify-center py-16 lg:hidden">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />
          </div>
          <div className="hidden justify-center py-12 lg:flex">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-il-blue-30 border-t-transparent" />
          </div>
        </>
      ) : items.length === 0 ? (
        <WalletEmptyCard summary={summary} remaining={remaining} />
      ) : (
        <div className="mx-auto max-w-lg space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-[20px] shadow-[0_4px_20px_rgba(1,47,99,0.12)] lg:rounded-none lg:shadow-none"
            >
              <WalletCard item={item} />
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}

export function WalletPage() {
  return (
    <AuthGuard>
      <WalletContent />
    </AuthGuard>
  );
}
