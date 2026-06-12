import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { LeadActivityCard } from "@/components/LeadActivityCard";
import { LeadListItem } from "@/components/LeadListItem";
import { LeadsPagination } from "@/components/LeadsPagination";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { PageHeader } from "@/components/PageHeader";
import { getLeads } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { LeadRecord } from "@/lib/types";

const PAGE_SIZE = 10;

function MobileLeadsEmpty() {
  return (
    <div className="rounded-[20px] bg-white px-6 py-12 text-center shadow-[0_4px_20px_rgba(1,47,99,0.12)]">
      <p className="text-5xl">📋</p>
      <h2 className="mt-4 text-base font-bold text-il-neutral-10">No leads yet</h2>
      <p className="mx-auto mt-2 max-w-[260px] text-sm text-il-neutral-50">
        Start collecting student leads at your exam center.
      </p>
    </div>
  );
}

function DesktopLeadsEmpty() {
  return (
    <div className="rounded-2xl border border-il-neutral-90 bg-il-bg-grey-tint p-10 text-center">
      <p className="text-4xl">📋</p>
      <h2 className="mt-4 font-semibold text-il-text-primary">No leads yet</h2>
      <p className="mt-2 text-sm text-il-text-secondary">
        Start collecting student leads at your exam center.
      </p>
    </div>
  );
}

function LeadsContent() {
  const { token } = useAuth();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

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

  const leadCount = leads.length;
  const totalPages = Math.max(1, Math.ceil(leadCount / PAGE_SIZE));

  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return leads.slice(start, start + PAGE_SIZE);
  }, [leads, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function goToPage(nextPage: number) {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AppLayout mobileTheme="blue">
      <MobileHomeHeader title="Leads" />
      <div className="hidden lg:block">
        <PageHeader title="Leads" />
      </div>

      <Link
        to="/leads/new"
        className="mb-6 flex w-full items-center justify-center rounded-full bg-white py-3.5 text-sm font-semibold text-il-blue-30 shadow-[0_4px_20px_rgba(1,47,99,0.12)] transition hover:bg-il-blue-95 lg:hidden"
      >
        + Add Lead
      </Link>

      <Link
        to="/leads/new"
        className="mb-6 hidden w-full items-center justify-center rounded-xl bg-il-blue-30 py-3.5 text-sm font-semibold text-white hover:bg-il-blue-20 lg:flex"
      >
        + Add Lead
      </Link>

      {loading ? (
        <>
          <div className="flex justify-center py-16 lg:hidden">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />
          </div>
          <div className="hidden justify-center py-12 lg:flex">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-il-blue-30 border-t-transparent" />
          </div>
        </>
      ) : leads.length === 0 ? (
        <>
          <div className="lg:hidden">
            <MobileLeadsEmpty />
          </div>
          <div className="hidden lg:block">
            <DesktopLeadsEmpty />
          </div>
        </>
      ) : (
        <>
          <section className="lg:hidden">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-white">All leads</h2>
              <p className="mt-0.5 text-xs text-white/60">
                You have {leadCount} lead{leadCount === 1 ? "" : "s"}
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
