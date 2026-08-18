import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { listDemoQuestions } from "../lib/demo";
import { useSession } from "../lib/session";

type ProblemListItem = {
  id: number;
  slug: string;
  title: string;
  difficulty: string;
  topic: string;
  isPlus: boolean;
  solved: boolean;
  locked?: boolean;
};

export function ProblemsPage() {
  const { user, mode, loading, me } = useSession();
  const [items, setItems] = useState<ProblemListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    if (!user) return;
    if (mode === "demo") {
      setItems(listDemoQuestions(user.plan));
      return;
    }
    void fetch("/api/questions")
      .then(async (res) => {
        const body = (await res.json()) as { questions?: ProblemListItem[]; error?: string };
        if (!res.ok) throw new Error(body.error ?? "Could not load problems.");
        setItems(body.questions ?? []);
      })
      .catch((err: Error) => setError(err.message));
  }, [mode, user, me?.progress.solved]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (needle && !`${item.title} ${item.topic}`.toLowerCase().includes(needle)) return false;
      if (difficulty !== "all" && item.difficulty !== difficulty) return false;
      if (status === "solved" && !item.solved) return false;
      if (status === "open" && (item.solved || item.locked)) return false;
      if (status === "plus" && !item.isPlus) return false;
      return true;
    });
  }, [difficulty, items, query, status]);

  if (loading) return <p className="muted">Loading problems…</p>;
  if (!user) return <Navigate to="/" replace />;

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Problem set</p>
          <h1>Choose the next question</h1>
          <p className="muted">
            {user.plan === "plus"
              ? "Core set plus the Plus vault. Marking a solve lights today’s fire."
              : "Free set is unlocked. Plus vault cards stay visible so you can see what the upgrade adds."}
          </p>
        </div>
        <Link className="plus-btn" to="/plus">
          {user.plan === "plus" ? "Plus benefits" : "See Plus"}
        </Link>
      </div>
      <div className="filters">
        <input className="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title or topic" />
        <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
          <option value="all">All difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All status</option>
          <option value="open">Still open</option>
          <option value="solved">Solved</option>
          <option value="plus">Plus vault</option>
        </select>
      </div>
      {error ? <p className="notice">{error}</p> : null}
      <div className="problem-grid">
        {filtered.map((item) => {
          const locked = Boolean(item.locked);
          const to = locked ? "/plus" : `/problems/${item.slug}`;
          return (
            <Link className={`problem-card${item.solved ? " solved" : ""}${locked ? " locked-card" : ""}`} key={item.slug} to={to}>
              <div className="chips">
                <span className={`chip ${item.difficulty.toLowerCase()}`}>{item.difficulty}</span>
                <span className="chip">{item.topic}</span>
                {item.isPlus ? <span className="chip plus">Plus</span> : null}
                {item.solved ? <span className="chip">Solved</span> : null}
                {locked ? <span className="chip">Locked</span> : null}
              </div>
              <h3>{item.title}</h3>
              <p className="muted">
                {locked
                  ? "Included with Plus. Open the upgrade page to unlock."
                  : item.solved
                    ? "Counted toward your solved / total progress."
                    : "Open it, work it, then mark it solved."}
              </p>
            </Link>
          );
        })}
      </div>
      {filtered.length === 0 ? <p className="muted">No problems match those filters.</p> : null}
    </div>
  );
}
