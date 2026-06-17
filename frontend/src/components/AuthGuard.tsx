import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLoaderScreen } from "@/components/AuthLoaderScreen";
import { useAuth } from "@/lib/auth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [user, loading, navigate]);

  if (loading) {
    return <AuthLoaderScreen />;
  }

  if (!user) return null;
  return <>{children}</>;
}
