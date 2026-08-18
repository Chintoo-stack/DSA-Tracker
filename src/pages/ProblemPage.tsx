import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AiAssistant } from "../components/AiAssistant";
import { getDemoQuestion, markDemoSolved } from "../lib/demo";
import { useSession } from "../lib/session";

type QuestionDetail = {
  slug: string;
  title: string;
  difficulty: string;
  topic: string;
  prompt: string;
  starter?: string | null;
  isPlus: boolean;
  solved: boolean;
};

export function ProblemPage() {
  const { slug = "" } = useParams();
  const { user, mode, loading, refresh } = useSession();
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [locked, setLocked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user || !slug) return;
    setLocked(false);
    setError(null);
    if (mode === "demo") {
      const result = getDemoQuestion(slug, user.plan);
      if (result === "locked") {
        setLocked(true);
        setQuestion(null);
        return;
      }
      if (!result) {
        setError("Question not found.");
        return;
      }
      setQuestion(result);
      setCode(result.starter);
      return;
    }
    void fetch(`/api/questions/${slug}`)
      .then(async (res) => {
        const body = (await res.json()) as { question?: QuestionDetail; locked?: boolean; error?: string };
        if (res.status === 403 && body.locked) {
          setLocked(true);
          return;
        }
        if (!res.ok) throw new Error(body.error ?? "Could not load this problem.");
        if (body.question) {
          setQuestion(body.question);
          setCode(body.question.starter ?? "");
        }
      })
      .catch((err: Error) => setError(err.message));
  }, [mode, slug, user]);

  if (loading) return <p className="muted">Opening problem…</p>;
  if (!user) return <Navigate to="/" replace />;

  if (locked) {
    return (
      <section className="lock card">
        <p className="eyebrow">Plus vault</p>
        <h2>This problem is part of the additional Plus set</h2>
        <p className="muted">Upgrade to unlock the extra questions and the AI assistant.</p>
        <Link className="plus-btn" to="/plus">
          Unlock with Plus
        </Link>
      </section>
    );
  }

  if (error) return <p className="notice">{error}</p>;
  if (!question) return <p className="muted">Loading…</p>;

  const markSolved = async () => {
    setBusy(true);
    setError(null);
    try {
      if (mode === "demo") {
        markDemoSolved(question.slug, user.plan);
        setQuestion({ ...question, solved: true });
        await refresh();
        return;
      }
      const res = await fetch(`/api/questions/${question.slug}/solve`, { method: "POST" });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Could not record the solve.");
      setQuestion({ ...question, solved: true });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not record the solve.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="problem-layout">
      <article className="card">
        <div className="chips">
          <span className={`chip ${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
          <span className="chip">{question.topic}</span>
          {question.isPlus ? <span className="chip plus">Plus</span> : null}
        </div>
        <h2>{question.title}</h2>
        <p className="prompt">{question.prompt}</p>
        <label className="muted" htmlFor="scratchpad">
          Scratchpad — marking solved is self-reported; it lights today’s 🔥 and increments progress.
        </label>
        <textarea id="scratchpad" className="composer" value={code} onChange={(event) => setCode(event.target.value)} />
        <div className="row">
          <button className="primary" type="button" disabled={busy || question.solved} onClick={() => void markSolved()}>
            {question.solved ? "Counted in progress" : busy ? "Saving…" : "I solved this"}
          </button>
          <Link className="ghost" to="/problems">
            Back to set
          </Link>
        </div>
        {error ? <p className="notice">{error}</p> : null}
      </article>
      <AiAssistant title={question.title} prompt={question.prompt} code={code} />
    </div>
  );
}
