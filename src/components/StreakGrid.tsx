import { buildConsistencyGrid, currentStreak } from "../lib/progress";

export function StreakGrid({ solvedDates }: { solvedDates: string[] }) {
  const cells = buildConsistencyGrid(solvedDates, { days: 84 });
  const streak = currentStreak(solvedDates);
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
  const weekdayIndex: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const padDays = Array.from({ length: cells[0] ? weekdayIndex[cells[0].weekday] ?? 0 : 0 });

  return (
    <section className="card">
      <div className="progress-head">
        <div>
          <h2>Consistency</h2>
          <p className="muted">Last 12 weeks. 🔥 means you solved at least one problem that day. 💤 means you did not.</p>
        </div>
        <div className="big-num">
          {streak}
          <span>day streak</span>
        </div>
      </div>
      <div className="weekday-row" aria-hidden="true">
        {weekdays.map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
      <div className="streak-grid" aria-label="Last 12 weeks of practice">
        {padDays.map((_, index) => (
          <div className="day pad" key={`pad-${index}`} />
        ))}
        {cells.map((cell) => (
          <div
            key={cell.date}
            className={`day${cell.solved ? " fire" : ""}${cell.isToday ? " today" : ""}${cell.inFuture ? " future" : ""}`}
            title={`${cell.date} · ${cell.solved ? "solved" : "no solve"}`}
          >
            {cell.emoji}
          </div>
        ))}
      </div>
      <div className="legend">
        <span>🔥 solved that day</span>
        <span>💤 no solve that day</span>
        <span className="today-mark">today outlined</span>
      </div>
    </section>
  );
}
