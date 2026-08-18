import { AuthError } from "@netlify/identity";
import { useState } from "react";
import { useSession } from "../lib/session";

export function AuthPanel() {
  const { identityAvailable, signIn, signUp, enterDemo, error } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      if (mode === "in") {
        await signIn(email, password);
      } else {
        const note = await signUp(email, password, name);
        setMessage(note);
      }
    } catch (err) {
      setMessage(err instanceof AuthError ? err.message : err instanceof Error ? err.message : "Could not authenticate.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="hero-card">
      <p className="eyebrow">Start tracking</p>
      <h3>{identityAvailable ? "Sign in to keep your streak" : "Try Ember in this browser"}</h3>
      {identityAvailable ? (
        <form className="auth-form" onSubmit={(event) => void submit(event)}>
          {mode === "up" ? (
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" required />
          ) : null}
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
            minLength={8}
          />
          <button className="primary" type="submit" disabled={busy}>
            {busy ? "Working…" : mode === "in" ? "Sign in" : "Create account"}
          </button>
          <button className="ghost" type="button" onClick={() => setMode(mode === "in" ? "up" : "in")}>
            {mode === "in" ? "Need an account?" : "Have an account?"}
          </button>
        </form>
      ) : (
        <p className="muted">
          Netlify Identity is available after the first production deploy. Until then, open a local demo — progress stays in
          this browser.
        </p>
      )}
      <div className="row">
        <button className="ghost" type="button" onClick={() => enterDemo("free")}>
          Free demo
        </button>
        <button className="plus-btn" type="button" onClick={() => enterDemo("plus")}>
          Plus demo
        </button>
      </div>
      {error ? <p className="notice">{error}</p> : null}
      {message ? <p className="notice">{message}</p> : null}
    </div>
  );
}
