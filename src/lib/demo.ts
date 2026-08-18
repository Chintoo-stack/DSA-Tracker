import {
  FREE_QUESTION_COUNT,
  PLUS_QUESTION_COUNT,
  QUESTION_CATALOG,
  type Plan,
  type QuestionRecord,
} from "../data/catalog";
import { localDateKey } from "./progress";

const STORAGE_KEY = "ember-demo-v1";

export type DemoUser = {
  id: string;
  email: string;
  name: string;
  plan: Plan;
};

export type DemoState = {
  user: DemoUser;
  solves: { questionId: number; date: string }[];
};

export type ListedQuestion = QuestionRecord & { solved: boolean; locked: boolean };

const DEFAULT_USER: DemoUser = {
  id: "demo-free",
  email: "free@ember.dev",
  name: "Free practice",
  plan: "free",
};

function emptyState(user: DemoUser): DemoState {
  return { user, solves: [] };
}

export function loadDemo(): DemoState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoState;
  } catch {
    return null;
  }
}

export function saveDemo(state: DemoState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function startDemo(plan: Plan): DemoState {
  const user: DemoUser =
    plan === "plus"
      ? { id: "demo-plus", email: "plus@ember.dev", name: "Plus practice", plan: "plus" }
      : DEFAULT_USER;
  const state = emptyState(user);
  saveDemo(state);
  return state;
}

export function clearDemo() {
  localStorage.removeItem(STORAGE_KEY);
}

export function setDemoPlan(plan: Plan): DemoState {
  const current = loadDemo() ?? emptyState(DEFAULT_USER);
  current.user.plan = plan;
  current.user.id = plan === "plus" ? "demo-plus" : "demo-free";
  current.user.name = plan === "plus" ? "Plus practice" : "Free practice";
  current.user.email = plan === "plus" ? "plus@ember.dev" : "free@ember.dev";
  saveDemo(current);
  return current;
}

export function listDemoQuestions(plan: Plan): ListedQuestion[] {
  const solved = new Set((loadDemo()?.solves ?? []).map((row) => row.questionId));
  return QUESTION_CATALOG.map((question) => ({
    ...question,
    solved: solved.has(question.id),
    locked: question.isPlus && plan !== "plus",
  }));
}

export function getDemoQuestion(slug: string, plan: Plan): (QuestionRecord & { solved: boolean }) | "locked" | null {
  const question = QUESTION_CATALOG.find((item) => item.slug === slug);
  if (!question) return null;
  if (question.isPlus && plan !== "plus") return "locked";
  const solved = (loadDemo()?.solves ?? []).some((row) => row.questionId === question.id);
  return { ...question, solved };
}

export function markDemoSolved(slug: string, plan: Plan) {
  const question = getDemoQuestion(slug, plan);
  if (!question || question === "locked") return question;
  const state = loadDemo() ?? emptyState(DEFAULT_USER);
  if (!state.solves.some((row) => row.questionId === question.id)) {
    state.solves.push({ questionId: question.id, date: localDateKey() });
    saveDemo(state);
  }
  return { ...question, solved: true };
}

export function demoSnapshot() {
  const state = loadDemo();
  if (!state) return null;
  const plus = state.user.plan === "plus";
  const catalog = plus ? QUESTION_CATALOG : QUESTION_CATALOG.filter((question) => !question.isPlus);
  const solvedIds = new Set(state.solves.map((row) => row.questionId));
  const solvedQuestionIds = catalog.filter((question) => solvedIds.has(question.id)).map((question) => question.id);
  const solvedDates = [
    ...new Set(
      state.solves
        .filter((row) => catalog.some((question) => question.id === row.questionId))
        .map((row) => row.date),
    ),
  ];
  return {
    user: state.user,
    progress: {
      solved: solvedQuestionIds.length,
      total: plus ? FREE_QUESTION_COUNT + PLUS_QUESTION_COUNT : FREE_QUESTION_COUNT,
      plusUnlocked: PLUS_QUESTION_COUNT,
    },
    solvedQuestionIds,
    solvedDates,
  };
}

export function demoCoachReply(title: string, message: string) {
  const lower = `${title} ${message}`.toLowerCase();
  if (lower.includes("complexity") || lower.includes("time")) {
    return "Start from the brute-force bound, then ask which nested loop you can replace with a hash map, two pointers, or a sorted structure. Name the bottleneck before rewriting code.";
  }
  if (lower.includes("base case") || lower.includes("empty") || lower.includes("edge")) {
    return "Write the tiny cases first: empty input, one element, already-sorted, and duplicates. If those fail, the algorithm is not ready for the general path.";
  }
  if (lower.includes("hint") || lower.includes("stuck") || lower.includes("help")) {
    return `For ${title}, ignore the full input. Invent a 4–6 element example, simulate your current approach on paper, and mark the first index where the invariant breaks. That index is the hint.`;
  }
  return `Restate ${title} as an invariant: what must stay true after each step? Then check whether your code restores that invariant. If you want a stronger nudge, ask about the data structure, not the final answer.`;
}
