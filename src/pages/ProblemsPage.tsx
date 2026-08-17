import { useEffect, useState } from "react";
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
};

export function ProblemsPage() {
  const { user, mode, loading } = useSession();
  const [items, setItems] = useState<ProblemListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

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
  }, [mode, user]);

  if (loading) return <p className="muted">Loading problems…</p>;
  if (!user) return <Navigate to="/" replace />;

  return (
    <div>
      <div className="progress-head" style={{ margin: "18px 0" }}>
        <div>
          <h1 className="brand" style={{ fontSize: "2rem" }}>
            Problem set
          </h1>
          <p className="muted">
            {user.plan === "plus" ? "Core set plus the Plus vault." : "Free set only. Upgrade to unlock the vault."}
          </p>
        </div>
        <Link className="plus-btn" to="/plus">
          {user.plan === "plus" ? "Plus benefits" : "See Plus"}
        </Link>
      </div>
      {error ? <p className="notice">{error}</p> : null}
      <div className="problem-grid">
        {items.map((item) => (
          <Link className={`problem-card${item.solved ? " solved" : ""}`} key={item.slug} to={`/problems/${item.slug}`}>
            <div className="chips">
              <span className={`chip ${item.difficulty.toLowerCase()}`}>{item.difficulty}</span>
              <span className="chip">{item.topic}</span>
              {item.isPlus ? <span className="chip plus">Plus</span> : null}
              {item.solved ? <span className="chip">Solved</span> : null}
            </div>
            <h3>{item.title}</h3>
            <p className="muted">{item.solved ? "Logged toward your total." : "Open and mark it when you finish."}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
