import { buildConsistencyGrid, currentStreak } from "../lib/progress";

export function StreakGrid({ solvedDates }: { solvedDates: string[] }) {
  const cells = buildConsistencyGrid(solvedDates, { days: 84 });
  const streak = currentStreak(solvedDates);

  return (
    <section className="card">
      <div className="progress-head">
        <div>
          <h2>Consistency</h2>
          <p className="muted">Each day gets an emoji. Solve anything and it becomes fire.</p>
        </div>
        <div className="big-num">{streak}🔥</div>
      </div>
      <div className="streak-grid" aria-label="Last 12 weeks of practice">
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
      </div>
    </section>
  );
}
