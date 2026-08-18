import type { Plan, QuestionRecord } from "../data/catalog";

export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export type DayCell = {
  date: string;
  weekday: string;
  solved: boolean;
  emoji: "🔥" | "💤";
  isToday: boolean;
  inFuture: boolean;
};

export function buildConsistencyGrid(
  solvedDates: Iterable<string>,
  options: { days?: number; today?: Date } = {},
): DayCell[] {
  const days = options.days ?? 84;
  const today = new Date(options.today ?? new Date());
  today.setHours(0, 0, 0, 0);
  const solved = new Set(solvedDates);
  const start = addDays(today, -(days - 1));
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const cells: DayCell[] = [];

  for (let i = 0; i < days; i += 1) {
    const date = addDays(start, i);
    const key = localDateKey(date);
    const isToday = key === localDateKey(today);
    const inFuture = date.getTime() > today.getTime();
    const didSolve = solved.has(key);
    cells.push({
      date: key,
      weekday: weekday[date.getDay()],
      solved: didSolve,
      emoji: didSolve ? "🔥" : "💤",
      isToday,
      inFuture,
    });
  }

  return cells;
}

export function currentStreak(solvedDates: Iterable<string>, today = new Date()): number {
  const solved = new Set(solvedDates);
  let cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);

  if (!solved.has(localDateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;
  while (solved.has(localDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function solvesThisWeek(solvedDates: Iterable<string>, today = new Date()): number {
  const solved = new Set(solvedDates);
  const end = new Date(today);
  end.setHours(0, 0, 0, 0);
  const start = addDays(end, -end.getDay());
  let count = 0;
  for (let cursor = new Date(start); cursor.getTime() <= end.getTime(); cursor = addDays(cursor, 1)) {
    if (solved.has(localDateKey(cursor))) count += 1;
  }
  return count;
}

export function progressForPlan(solvedCount: number, isPlus: boolean, freeTotal: number, plusTotal: number) {
  const total = isPlus ? freeTotal + plusTotal : freeTotal;
  const capped = Math.min(solvedCount, total);
  const percent = total === 0 ? 0 : Math.round((capped / total) * 100);
  return { solved: capped, total, percent };
}

export function topicProgress(
  catalog: Pick<QuestionRecord, "id" | "topic" | "isPlus">[],
  solvedIds: Iterable<number>,
  plan: Plan,
) {
  const solved = new Set(solvedIds);
  const visible = catalog.filter((question) => plan === "plus" || !question.isPlus);
  const topics = new Map<string, { solved: number; total: number }>();

  for (const question of visible) {
    const current = topics.get(question.topic) ?? { solved: 0, total: 0 };
    current.total += 1;
    if (solved.has(question.id)) current.solved += 1;
    topics.set(question.topic, current);
  }

  return [...topics.entries()]
    .map(([topic, counts]) => ({
      topic,
      ...counts,
      percent: counts.total === 0 ? 0 : Math.round((counts.solved / counts.total) * 100),
    }))
    .sort((a, b) => a.topic.localeCompare(b.topic));
}
