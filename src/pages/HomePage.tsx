import { Navigate } from "react-router-dom";
import { AuthPanel } from "../components/AuthPanel";
import { useSession } from "../lib/session";

export function HomePage() {
  const { user, loading } = useSession();
  if (loading) return <p className="muted">Lighting the stove…</p>;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <section className="hero">
      <div>
        <h1>Practice that leaves a mark.</h1>
        <p className="lede">
          Ember is a DSA tracker for consistency and coverage. Solve a problem and that day burns 🔥. Miss a day and the
          board still speaks — with 💤. Progress is simply how many of the questions you have cleared so far.
        </p>
        <p className="lede">
          Free includes the core set. Plus unlocks the harder vault and an AI coach for when you stall.
        </p>
      </div>
      <AuthPanel />
    </section>
  );
}
