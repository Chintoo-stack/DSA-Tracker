import { Link, Navigate } from "react-router-dom";
import { PLUS_QUESTION_COUNT } from "../data/catalog";
import { useSession } from "../lib/session";

export function PlusPage() {
  const { user, loading, setPlan } = useSession();
  if (loading) return <p className="muted">Loading plan…</p>;
  if (!user) return <Navigate to="/" replace />;

  const plus = user.plan === "plus";

  return (
    <section className="card plus-page">
      <p className="eyebrow">Plans</p>
      <h1>Ember Plus</h1>
      <p className="lede">
        Free already tracks consistency and coverage. Plus adds an extra vault of {PLUS_QUESTION_COUNT} problems and an AI
        assistant that coaches you when a problem stalls.
      </p>
      <div className="plan-grid">
        <article className={`plan-card${!plus ? " current" : ""}`}>
          <h2>Free</h2>
          <ul>
            <li>Core problem set</li>
            <li>Dashboard with 🔥 / 💤 days</li>
            <li>Solved / total progress for the free set</li>
          </ul>
        </article>
        <article className={`plan-card${plus ? " current" : ""}`}>
          <h2>Plus</h2>
          <ul>
            <li>Everything in Free</li>
            <li>Additional hard-set problems that count toward your total</li>
            <li>AI hints on any unlocked problem</li>
          </ul>
        </article>
      </div>
      <div className="row">
        {plus ? (
          <button className="ghost" type="button" onClick={() => void setPlan("free")}>
            Switch to free
          </button>
        ) : (
          <button className="plus-btn" type="button" onClick={() => void setPlan("plus")}>
            Upgrade to Plus
          </button>
        )}
        <Link className="ghost" to="/problems">
          Back to problems
        </Link>
      </div>
      <p className="muted">
        This starter uses a one-click plan switch so you can evaluate the product. Connect a payment provider before a
        public launch.
      </p>
    </section>
  );
}
