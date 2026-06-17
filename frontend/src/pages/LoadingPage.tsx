import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLoaderScreen } from "@/components/AuthLoaderScreen";
import { useAuth } from "@/lib/auth";

const MIN_LOADER_MS = 1800;

export function LoadingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const timer = window.setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, MIN_LOADER_MS);

    return () => window.clearTimeout(timer);
  }, [user, loading, navigate]);

  return <AuthLoaderScreen />;
}
