import { Navigate } from "react-router-dom";
import { StreakGrid } from "../components/StreakGrid";
import { displayName, useSession } from "../lib/session";

export function DashboardPage() {
  const { user, me, loading } = useSession();
  if (loading) return <p className="muted">Loading your board…</p>;
  if (!user || !me) return <Navigate to="/" replace />;

  const { solved, total, percent } = {
    solved: me.progress.solved,
    total: me.progress.total,
    percent: me.progress.total === 0 ? 0 : Math.round((me.progress.solved / me.progress.total) * 100),
  };

  return (
    <div>
      <h1 className="brand" style={{ fontSize: "2rem", margin: "18px 0" }}>
        {displayName(user)}’s board
      </h1>
      <div className="stats">
        <section className="card">
          <div className="progress-head">
            <div>
              <h2>Progress</h2>
              <p className="muted">
                {user.plan === "plus"
                  ? `Plus vault is open — ${me.progress.plusUnlocked} extra problems count toward your total.`
                  : `Free track: ${total} problems. Plus adds ${me.progress.plusUnlocked} more.`}
              </p>
            </div>
            <div className="big-num">
              {solved}/{total}
            </div>
          </div>
          <div className="meter" aria-label={`${percent} percent complete`}>
            <span style={{ width: `${percent}%` }} />
          </div>
          <p className="muted">{percent}% of the questions available on your plan.</p>
        </section>
        <StreakGrid solvedDates={me.solvedDates} />
      </div>
    </div>
  );
}
