export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
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
  const today = options.today ?? new Date();
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

export function progressForPlan(solvedCount: number, isPlus: boolean, freeTotal: number, plusTotal: number) {
  const total = isPlus ? freeTotal + plusTotal : freeTotal;
  const capped = Math.min(solvedCount, total);
  const percent = total === 0 ? 0 : Math.round((capped / total) * 100);
  return { solved: capped, total, percent };
}
