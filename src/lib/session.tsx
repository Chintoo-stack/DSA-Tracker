import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AuthError,
  getUser,
  handleAuthCallback,
  login,
  logout,
  MissingIdentityError,
  onAuthChange,
  signup,
} from "@netlify/identity";
import { clearDemo, demoSnapshot, loadDemo, setDemoPlan, startDemo, type DemoUser } from "./demo";
import type { Plan } from "../data/catalog";

export type SessionUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  plan: Plan;
};

export type MePayload = {
  user: SessionUser;
  progress: { solved: number; total: number; plusUnlocked: number };
  solvedQuestionIds: number[];
  solvedDates: string[];
};

type Session = {
  loading: boolean;
  identityAvailable: boolean;
  mode: "live" | "demo" | "guest";
  user: SessionUser | null;
  me: MePayload | null;
  error: string | null;
  refresh: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<string>;
  signOut: () => Promise<void>;
  enterDemo: (plan: Plan) => void;
  setPlan: (plan: Plan) => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

async function fetchMe(): Promise<MePayload> {
  const res = await fetch("/api/me");
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Could not load your progress.");
  }
  return (await res.json()) as MePayload;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [identityAvailable, setIdentityAvailable] = useState(false);
  const [mode, setMode] = useState<Session["mode"]>("guest");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [me, setMe] = useState<MePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadLive = async () => {
    const current = await getUser();
    if (!current) {
      setMode("guest");
      setUser(null);
      setMe(null);
      return;
    }
    const payload = await fetchMe();
    setMode("live");
    setUser(payload.user);
    setMe(payload);
  };

  const loadDemoSession = () => {
    const snapshot = demoSnapshot();
    if (!snapshot) {
      setMode("guest");
      setUser(null);
      setMe(null);
      return;
    }
    setMode("demo");
    setUser(snapshot.user);
    setMe(snapshot);
  };

  const boot = async () => {
    setError(null);
    try {
      await handleAuthCallback();
      setIdentityAvailable(true);
      if (loadDemo()) {
        loadDemoSession();
      } else {
        await loadLive();
      }
    } catch (err) {
      if (err instanceof MissingIdentityError) {
        setIdentityAvailable(false);
        loadDemoSession();
      } else if (err instanceof AuthError) {
        setError(err.message);
        loadDemoSession();
      } else {
        setIdentityAvailable(true);
        loadDemoSession();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void boot();
    try {
      return onAuthChange(() => {
        if (loadDemo()) {
          loadDemoSession();
          return;
        }
        void loadLive().catch((err: Error) => setError(err.message));
      });
    } catch {
      return undefined;
    }
  }, []);

  const value = useMemo<Session>(
    () => ({
      loading,
      identityAvailable,
      mode,
      user,
      me,
      error,
      refresh: async () => {
        if (mode === "demo") {
          loadDemoSession();
          return;
        }
        await loadLive();
      },
      signIn: async (email, password) => {
        clearDemo();
        const current = await login(email, password);
        const payload = await fetchMe();
        setIdentityAvailable(true);
        setMode("live");
        setUser({ ...payload.user, name: current.name ?? payload.user.name });
        setMe(payload);
      },
      signUp: async (email, password, name) => {
        clearDemo();
        const created = await signup(email, password, { full_name: name });
        if (!created.confirmedAt) {
          return "Check your email to confirm the account, then sign in.";
        }
        const payload = await fetchMe();
        setMode("live");
        setUser(payload.user);
        setMe(payload);
        return "Account created. You are signed in.";
      },
      signOut: async () => {
        clearDemo();
        if (identityAvailable && mode === "live") {
          await logout();
        }
        setMode("guest");
        setUser(null);
        setMe(null);
      },
      enterDemo: (plan) => {
        startDemo(plan);
        loadDemoSession();
      },
      setPlan: async (plan) => {
        if (mode === "demo") {
          setDemoPlan(plan);
          loadDemoSession();
          return;
        }
        const res = await fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error ?? "Could not update plan.");
        }
        await loadLive();
      },
    }),
    [error, identityAvailable, loading, me, mode, user],
  );

  return createElement(SessionContext.Provider, { value }, children);
}

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession must be used within SessionProvider");
  return session;
}

export function displayName(user: SessionUser | DemoUser | null) {
  if (!user) return "Guest";
  return user.name?.trim() || user.email || "Learner";
}
