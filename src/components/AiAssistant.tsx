import { useState } from "react";
import { demoCoachReply } from "../lib/demo";
import { useSession } from "../lib/session";

type Message = { role: "you" | "ember"; text: string };

export function AiAssistant({
  title,
  prompt,
  code,
}: {
  title: string;
  prompt: string;
  code: string;
}) {
  const { user, mode } = useSession();
  const [message, setMessage] = useState("");
  const [thread, setThread] = useState<Message[]>([
    { role: "ember", text: "Stuck? Ask for a hint, an invariant, or a complexity check. I will not dump a full solution unless you ask." },
  ]);
  const [busy, setBusy] = useState(false);

  if (user?.plan !== "plus") {
    return (
      <div className="lock card">
        <h3>Plus AI assistant</h3>
        <p className="muted">Upgrade to Ember Plus to get unstuck without spoiling the whole answer.</p>
      </div>
    );
  }

  const send = async () => {
    const text = message.trim();
    if (!text) return;
    setMessage("");
    setThread((current) => [...current, { role: "you", text }]);
    setBusy(true);
    try {
      if (mode === "demo") {
        setThread((current) => [...current, { role: "ember", text: demoCoachReply(title, text) }]);
        return;
      }
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionTitle: title, prompt, code, message: text }),
      });
      const body = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok) throw new Error(body.error ?? "Assistant unavailable.");
      setThread((current) => [...current, { role: "ember", text: body.reply ?? "" }]);
    } catch (err) {
      setThread((current) => [
        ...current,
        { role: "ember", text: err instanceof Error ? err.message : "Could not reach the assistant." },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <h3>Plus AI assistant</h3>
      <div className="chat">
        {thread.map((item, index) => (
          <div className={`bubble ${item.role}`} key={`${item.role}-${index}`}>
            <strong>{item.role === "you" ? "You" : "Ember"}</strong>
            <div>{item.text}</div>
          </div>
        ))}
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <input
          className="search"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Where are you stuck?"
          onKeyDown={(event) => {
            if (event.key === "Enter") void send();
          }}
        />
        <button className="plus-btn" type="button" disabled={busy} onClick={() => void send()}>
          {busy ? "Thinking…" : "Ask"}
        </button>
      </div>
    </section>
  );
}
