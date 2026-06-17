import { useCallback, useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/AppIcon";
import { AppLayout } from "@/components/AppLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { LeadActivityCard } from "@/components/LeadActivityCard";
import { LeadListItem } from "@/components/LeadListItem";
import { LeadsPagination } from "@/components/LeadsPagination";
import {
  LeadsStatusFilter,
  filterLeadsByStatus,
} from "@/components/LeadsStatusFilter";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { PageHeader } from "@/components/PageHeader";
import { getLeads } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { LeadRecord } from "@/lib/types";

const PAGE_SIZE = 10;

type StatusFilter = "verified" | "unverified";

function MobileLeadsEmpty({ filter }: { filter: StatusFilter }) {
  return (
    <div className="rounded-[20px] bg-white px-6 py-12 text-center shadow-[0_4px_20px_rgba(1,47,99,0.12)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-il-blue-95 text-il-blue-30">
        <AppIcon name="clipboard" className="h-8 w-8" />
      </div>
      <h2 className="mt-4 text-base font-bold text-il-neutral-10">
        No {filter === "verified" ? "verified" : "pending"} leads
      </h2>
      <p className="mx-auto mt-2 max-w-[260px] text-sm text-il-neutral-50">
        {filter === "verified"
          ? "Verified leads from phone entry or WhatsApp QR will appear here."
          : "Leads awaiting verification will appear here."}
      </p>
    </div>
  );
}

function DesktopLeadsEmpty({ filter }: { filter: StatusFilter }) {
  return (
    <div className="rounded-2xl border border-il-neutral-90 bg-il-bg-grey-tint p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-il-blue-95 text-il-blue-30">
        <AppIcon name="clipboard" className="h-7 w-7" />
      </div>
      <h2 className="mt-4 font-semibold text-il-text-primary">
        No {filter === "verified" ? "verified" : "pending"} leads
      </h2>
      <p className="mt-2 text-sm text-il-text-secondary">
        {filter === "verified"
          ? "Verified leads from phone entry or WhatsApp QR will appear here."
          : "Leads awaiting verification will appear here."}
      </p>
    </div>
  );
}

function LeadsContent() {
  const { token } = useAuth();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("unverified");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getLeads(token);
      setLeads(data.leads);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const verifiedCount = useMemo(
    () => leads.filter((lead) => lead.status === "verified").length,
    [leads],
  );
  const unverifiedCount = useMemo(
    () => leads.filter((lead) => lead.status === "unverified").length,
    [leads],
  );

  const filteredLeads = useMemo(
    () => filterLeadsByStatus(leads, statusFilter),
    [leads, statusFilter],
  );

  const leadCount = filteredLeads.length;
  const totalPages = Math.max(1, Math.ceil(leadCount / PAGE_SIZE));

  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredLeads.slice(start, start + PAGE_SIZE);
  }, [filteredLeads, page]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function handleFilterChange(next: StatusFilter) {
    setStatusFilter(next);
  }

  function goToPage(nextPage: number) {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AppLayout mobileTheme="blue">
      <MobileHomeHeader title="Pending Leads" />
      <div className="hidden lg:block">
        <PageHeader title="Leads" />
      </div>

      <LeadsStatusFilter
        value={statusFilter}
        verifiedCount={verifiedCount}
        unverifiedCount={unverifiedCount}
        onChange={handleFilterChange}
      />

      {loading ? (
        <>
          <div className="flex justify-center py-16 lg:hidden">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />
          </div>
          <div className="hidden justify-center py-12 lg:flex">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-il-blue-30 border-t-transparent" />
          </div>
        </>
      ) : leadCount === 0 ? (
        <>
          <div className="lg:hidden">
            <MobileLeadsEmpty filter={statusFilter} />
          </div>
          <div className="hidden lg:block">
            <DesktopLeadsEmpty filter={statusFilter} />
          </div>
        </>
      ) : (
        <>
          <section className="lg:hidden">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-white">
                {statusFilter === "verified" ? "Verified leads" : "Pending leads"}
              </h2>
              <p className="mt-0.5 text-xs text-white/60">
                {leadCount} lead{leadCount === 1 ? "" : "s"}
              </p>
            </div>
            <div className="space-y-3">
              {paginatedLeads.map((lead, index) => (
                <LeadActivityCard key={lead.id} lead={lead} index={index} />
              ))}
            </div>
            <LeadsPagination
              page={page}
              totalPages={totalPages}
              totalItems={leadCount}
              pageSize={PAGE_SIZE}
              onPageChange={goToPage}
            />
          </section>

          <div className="hidden lg:block">
            <h2 className="mb-4 text-base font-bold text-il-text-primary">
              {statusFilter === "verified" ? "Verified leads" : "Pending leads"}
            </h2>
            <div className="space-y-3">
              {paginatedLeads.map((lead) => (
                <LeadListItem key={lead.id} lead={lead} />
              ))}
            </div>
            <LeadsPagination
              page={page}
              totalPages={totalPages}
              totalItems={leadCount}
              pageSize={PAGE_SIZE}
              onPageChange={goToPage}
            />
          </div>
        </>
      )}
    </AppLayout>
  );
}

export function LeadsPage() {
  return (
    <AuthGuard>
      <LeadsContent />
    </AuthGuard>
  );
}
