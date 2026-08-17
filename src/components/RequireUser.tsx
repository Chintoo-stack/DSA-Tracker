import { Navigate } from "react-router-dom";
import { useSession } from "../lib/session";
import type { ReactNode } from "react";

export function RequireUser({ children }: { children: ReactNode }) {
  const { user, loading } = useSession();
  if (loading) return <p className="muted">Loading…</p>;
  if (!user) return <Navigate to="/" replace />;
  return children;
}
