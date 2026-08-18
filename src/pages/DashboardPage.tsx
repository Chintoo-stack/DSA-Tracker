import { Link, Navigate } from "react-router-dom";
import { StreakGrid } from "../components/StreakGrid";
import { QUESTION_CATALOG } from "../data/catalog";
import { currentStreak, localDateKey, solvesThisWeek, topicProgress } from "../lib/progress";
import { displayName, useSession } from "../lib/session";

export function DashboardPage() {
  const { user, me, loading } = useSession();
  if (loading) return <p className="muted">Loading your board…</p>;
  if (!user || !me) return <Navigate to="/" replace />;

  const solved = me.progress.solved;
  const total = me.progress.total;
  const percent = total === 0 ? 0 : Math.round((solved / total) * 100);
  const streak = currentStreak(me.solvedDates);
  const week = solvesThisWeek(me.solvedDates);
  const todayLit = me.solvedDates.includes(localDateKey());
  const topics = topicProgress(QUESTION_CATALOG, me.solvedQuestionIds, user.plan);

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">{todayLit ? "🔥 today is lit" : "💤 today is still quiet"}</p>
          <h1>{displayName(user)}’s board</h1>
        </div>
        <Link className="primary" to="/problems">
          Practice
        </Link>
      </div>

      <div className="stat-row">
        <article className="stat-card">
          <span className="muted">Progress</span>
          <strong>
            {solved}/{total}
          </strong>
          <em>{percent}% of your plan</em>
        </article>
        <article className="stat-card">
          <span className="muted">Current streak</span>
          <strong>{streak}🔥</strong>
          <em>consecutive solve days</em>
        </article>
        <article className="stat-card">
          <span className="muted">This week</span>
          <strong>{week}/7</strong>
          <em>days with at least one solve</em>
        </article>
        <article className="stat-card">
          <span className="muted">Plan</span>
          <strong>{user.plan === "plus" ? "Plus" : "Free"}</strong>
          <em>
            {user.plan === "plus"
              ? `${me.progress.plusUnlocked} vault problems unlocked`
              : `${me.progress.plusUnlocked} vault problems locked`}
          </em>
        </article>
      </div>

      <div className="stats">
        <section className="card">
          <div className="progress-head">
            <div>
              <h2>Coverage</h2>
              <p className="muted">
                {user.plan === "plus"
                  ? "Core set plus the Plus vault count toward this total."
                  : `Free track is ${total} problems. Plus adds ${me.progress.plusUnlocked} more.`}
              </p>
            </div>
            <div className="big-num">
              {solved}/{total}
            </div>
          </div>
          <div className="meter" aria-label={`${percent} percent complete`}>
            <span style={{ width: `${percent}%` }} />
          </div>
          <div className="topic-list">
            {topics.map((topic) => (
              <div className="topic-row" key={topic.topic}>
                <span>{topic.topic}</span>
                <div className="meter slim">
                  <span style={{ width: `${topic.percent}%` }} />
                </div>
                <em>
                  {topic.solved}/{topic.total}
                </em>
              </div>
            ))}
          </div>
        </section>
        <StreakGrid solvedDates={me.solvedDates} />
      </div>
    </div>
  );
}
