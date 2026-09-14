import { Printer, X } from "lucide-react";

import { Button } from "@/components/ui";
import { useRoutine } from "@/context/RoutineContext";

/* A clean sheet for paper: no app chrome, no fills, hairline rules. The
   @media print block in routine.css hides everything except this. */
const PrintView = () => {
  const {
    printOpen,
    setPrintOpen,
    days,
    periods,
    grid,
    lens,
    selectedKey,
    template,
  } = useRoutine();

  if (!printOpen) return null;

  const heading =
    lens === "class" ? `Class ${selectedKey}`
    : lens === "teacher" ? selectedKey
    : `Room ${selectedKey}`;

  return (
    <div className="print-layer">
      <div className="print-toolbar">
        <div>
          <strong>Print preview</strong>
          <span className="cell-sub">
            {heading} · {template.name}
          </span>
        </div>
        <div className="print-toolbar-actions">
          <Button
            variant="secondary"
            icon={X}
            onClick={() => setPrintOpen(false)}>
            Close
          </Button>
          <Button icon={Printer} onClick={() => window.print()}>
            Print
          </Button>
        </div>
      </div>

      <article className="print-sheet">
        <header className="print-head">
          <h1>{heading} — weekly timetable</h1>
          <p>
            {template.name} · {periods.filter((p) => !p.isBreak).length} teaching
            periods a day
          </p>
        </header>

        <table className="print-table">
          <thead>
            <tr>
              <th>Period</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr key={period.id} className={period.isBreak ? "is-break" : ""}>
                <th scope="row">
                  {period.label}
                  <span>
                    {period.start}–{period.end}
                  </span>
                </th>
                {period.isBreak ?
                  <td colSpan={days.length}>{period.label}</td>
                : days.map((day) => {
                    const lesson = grid[day]?.[period.id];
                    return (
                      <td key={`${day}-${period.id}`}>
                        {lesson ?
                          <>
                            <strong>{lesson.subject}</strong>
                            <span>
                              {lens === "class" ? lesson.teacher
                              : lens === "teacher" ? lesson.classId
                              : `${lesson.classId} · ${lesson.teacher}`}
                            </span>
                            <span>
                              {lens === "room" ? lesson.subject : lesson.room}
                            </span>
                          </>
                        : <span className="print-empty">—</span>}
                      </td>
                    );
                  })
                }
              </tr>
            ))}
          </tbody>
        </table>

        <footer className="print-foot">
          Generated from the school timetable · {heading}
        </footer>
      </article>
    </div>
  );
};

export default PrintView;
