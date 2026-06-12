import type {
  LeadRecord,
  LeadSummary,
  PendingMilestone,
  UserRecord,
  WalletItem,
} from "./types";

async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...init } = options;
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(path, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data as T;
}

export const syncUser = (token: string) =>
  apiFetch<{ user: UserRecord; summary: LeadSummary }>("/api/v1/auth/sync", {
    method: "POST",
    token,
  });

export const getMe = (token: string) =>
  apiFetch<{ user: UserRecord; summary: LeadSummary }>("/api/v1/auth/me", {
    token,
  });

export const getLeads = (token: string) =>
  apiFetch<{ leads: LeadRecord[] }>("/api/v1/leads", { token });

export const createLead = (
  token: string,
  student_name: string,
  student_phone: string,
) =>
  apiFetch<{ id: string; status: string; summary: LeadSummary; message_sent?: boolean }>(
    "/api/v1/leads",
    {
      method: "POST",
      token,
      body: JSON.stringify({ student_name, student_phone }),
    },
  );

export const getWallet = (token: string) =>
  apiFetch<{ items: WalletItem[] }>("/api/v1/wallet", { token });

export const getPendingMilestone = (token: string) =>
  apiFetch<{ has_pending: boolean; milestone: PendingMilestone | null }>(
    "/api/v1/milestones/pending",
    { token },
  );

export const acknowledgeMilestone = (token: string, id: string) =>
  apiFetch<{ ok: boolean }>(`/api/v1/milestones/${id}/acknowledge`, {
    method: "POST",
    token,
  });
