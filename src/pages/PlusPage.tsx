import { Navigate } from "react-router-dom";
import { PLUS_QUESTION_COUNT } from "../data/catalog";
import { useSession } from "../lib/session";

export function PlusPage() {
  const { user, loading, setPlan } = useSession();
  if (loading) return <p className="muted">Loading plan…</p>;
  if (!user) return <Navigate to="/" replace />;

  const plus = user.plan === "plus";

  return (
    <section className="card" style={{ margin: "24px 0 40px" }}>
      <h1 className="brand" style={{ fontSize: "2.2rem" }}>
        Ember Plus
      </h1>
      <p className="lede">
        Plus adds an extra vault of {PLUS_QUESTION_COUNT} problems and an AI assistant that coaches you when a problem
        stalls. Free still tracks the same consistency board — fire or sleep, every day.
      </p>
      <ul>
        <li>Additional hard-set problems that count toward your progress total</li>
        <li>AI hints on any unlocked problem, without requiring a full spoiler</li>
        <li>Same dashboard: solved days glow 🔥, quiet days stay 💤</li>
      </ul>
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
      </div>
      <p className="muted">
        This starter uses a one-click plan switch so you can evaluate the product. Wire a payment provider before a public
        launch.
      </p>
    </section>
  );
}
