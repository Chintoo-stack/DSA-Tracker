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
        <p className="eyebrow">DSA progress tracker</p>
        <h1>See your progress. Keep the streak honest.</h1>
        <p className="lede">
          Ember is a practice board for consistency and coverage. Solve any question and that calendar day turns into 🔥.
          Skip a day and the dashboard still records it — with 💤. Progress is simply how many questions you have solved
          out of the set available on your plan.
        </p>
        <ul className="feature-list">
          <li>
            <strong>Free</strong> — core problem set, dashboard, and solved / total progress.
          </li>
          <li>
            <strong>Plus</strong> — extra vault problems plus an AI assistant when you get stuck.
          </li>
        </ul>
      </div>
      <AuthPanel />
    </section>
  );
}
