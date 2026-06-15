import { useCallback, useEffect, useState } from "react";
import { generateWhatsAppQr, getWhatsAppQr } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { WhatsAppQrInfo } from "@/lib/types";

export function useWhatsAppQr() {
  const { token } = useAuth();
  const [qr, setQr] = useState<WhatsAppQrInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQr = useCallback(async () => {
    if (!token) return;
    setError(null);
    try {
      const data = await getWhatsAppQr(token);
      setQr(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load QR code");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const generate = useCallback(async () => {
    if (!token) return null;
    setGenerating(true);
    setError(null);
    try {
      const data = await generateWhatsAppQr(token);
      setQr(data);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate QR code");
      return null;
    } finally {
      setGenerating(false);
    }
  }, [token]);

  useEffect(() => {
    loadQr();
  }, [loadQr]);

  return {
    qr,
    loading,
    generating,
    error,
    loadQr,
    generate,
    hasQr: Boolean(qr?.generated && qr.url),
  };
}
