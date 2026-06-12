import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { HeroBanner } from "@/components/HeroBanner";
import { LeadActivityCard, LeadSummaryActivityCard } from "@/components/LeadActivityCard";
import { MilestoneModal } from "@/components/MilestoneModal";
import { MobileHeroCarousel } from "@/components/MobileHeroCarousel";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { PageHeader } from "@/components/PageHeader";
import { QuickActionPills } from "@/components/QuickActionPills";
import { StatCard } from "@/components/StatCard";
import {
  acknowledgeMilestone,
  getLeads,
  getPendingMilestone,
  getWallet,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { LeadRecord, PendingMilestone } from "@/lib/types";

function DashboardContent() {
  const { summary, token, refresh } = useAuth();
  const [milestone, setMilestone] = useState<PendingMilestone | null>(null);
  const [walletCount, setWalletCount] = useState(0);
  const [recentLeads, setRecentLeads] = useState<LeadRecord[]>([]);

  const loadExtras = useCallback(async () => {
    if (!token) return;
    try {
      const [pending, wallet, leadsData] = await Promise.all([
        getPendingMilestone(token),
        getWallet(token),
        getLeads(token),
      ]);
      if (pending.has_pending && pending.milestone) {
        setMilestone(pending.milestone);
      }
      setWalletCount(wallet.items.length);
      setRecentLeads(leadsData.leads.slice(0, 3));
    } catch {
      /* ignore */
    }
  }, [token]);

  useEffect(() => {
    loadExtras();
    refresh();
  }, [loadExtras, refresh]);

  const progressPct = summary.verified % 100;
  const remaining = 100 - progressPct;
  const taskCount = summary.total;

  async function dismissMilestone() {
    if (!token || !milestone) return;
    await acknowledgeMilestone(token, milestone.id);
    setMilestone(null);
    refresh();
  }

  async function viewWalletMilestone() {
    if (!token || !milestone) return;
    await acknowledgeMilestone(token, milestone.id);
    setMilestone(null);
  }

  return (
    <AppLayout mobileTheme="blue">
      <MobileHomeHeader title="Home" />
      <div className="hidden lg:block">
        <PageHeader title="Home" />
      </div>

      <MobileHeroCarousel
        verified={summary.verified}
        remaining={remaining}
        progressPct={progressPct}
      />

      <div className="mb-8 hidden flex-col gap-4 lg:flex lg:flex-row lg:items-start lg:gap-5">
        <div className="flex-1">
          <HeroBanner
            verified={summary.verified}
            remaining={remaining}
            progressPct={progressPct}
          />
        </div>
        <QuickActionPills walletCount={walletCount} />
      </div>

      <section className="lg:hidden">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">Your leads</h2>
            <p className="mt-0.5 text-xs text-white/60">
              You have {taskCount} lead{taskCount === 1 ? "" : "s"}
            </p>
          </div>
          <Link
            to="/leads"
            className="text-sm font-medium text-white/90 hover:text-white"
          >
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {recentLeads.length > 0 ? (
            recentLeads.map((lead, index) => (
              <LeadActivityCard key={lead.id} lead={lead} index={index} />
            ))
          ) : (
            <>
              <LeadSummaryActivityCard
                variant="verified"
                value={summary.verified}
                index={0}
              />
              <LeadSummaryActivityCard
                variant="unverified"
                value={summary.unverified}
                index={1}
              />
              <LeadSummaryActivityCard variant="add" index={2} />
            </>
          )}
        </div>
      </section>

      <section className="hidden lg:block">
        <h2 className="mb-4 text-base font-bold text-il-text-primary">Your leads</h2>
        <div className="grid grid-cols-3 gap-3">
          <StatCard variant="verified" value={summary.verified} />
          <StatCard variant="unverified" value={summary.unverified} />
          <StatCard variant="total" value={summary.total} />
        </div>
      </section>

      {milestone && (
        <MilestoneModal
          milestone={milestone}
          onDismiss={dismissMilestone}
          onViewWallet={viewWalletMilestone}
        />
      )}

    </AppLayout>
  );
}

export function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
