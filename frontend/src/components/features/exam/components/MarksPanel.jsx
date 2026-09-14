import { useCallback, useEffect, useRef } from "react";
import { CircleCheck, CloudUpload, Loader, Send, TriangleAlert } from "lucide-react";

import { shake } from "@/animation/shake";
import { Button } from "@/components/ui";
import { useExams } from "@/context/ExamContext";
import MarkRow from "./MarkRow";

const MarksPanel = ({ activeTab }) => {
  const {
    rows,
    subjects,
    setMark,
    cellError,
    saveState,
    savedAt,
    session,
    setPublishOpen,
    publishReadiness,
    unpublish,
  } = useExams();

  const isActive = activeTab === "marks";
  const sheetRef = useRef(null);

  // Shake the offending cell rather than the whole sheet.
  useEffect(() => {
    if (!cellError) return;
    const cell = sheetRef.current?.querySelector(".mark-cell.is-invalid");
    if (cell) shake(cell);
  }, [cellError]);

  /* Enter and the arrow keys walk the grid; Tab keeps its native order. */
  const handleKeyNav = useCallback((e, rowIndex, colIndex) => {
    const move = (r, c) => {
      const next = sheetRef.current?.querySelector(`[data-cell="${r}-${c}"]`);
      if (next) {
        e.preventDefault();
        next.focus();
        next.select?.();
      }
    };
    if (e.key === "ArrowDown" || e.key === "Enter") move(rowIndex + 1, colIndex);
    if (e.key === "ArrowUp") move(rowIndex - 1, colIndex);
    if (e.key === "ArrowLeft" && e.currentTarget.selectionStart === 0)
      move(rowIndex, colIndex - 1);
    if (
      e.key === "ArrowRight" &&
      e.currentTarget.selectionStart === e.currentTarget.value.length
    )
      move(rowIndex, colIndex + 1);
  }, []);

  const published = session.status === "published";

  return (
    <section
      className={`exam-panel${isActive ? " is-active" : ""}`}
      id="panel-marks"
      role="tabpanel"
      aria-labelledby="tab-marks">
      <div className="panel-head">
        <div>
          <h2>Mark entry — {session.name}</h2>
          <p>
            Type a mark and move on: <kbd>Tab</kbd> across, <kbd>Enter</kbd> or{" "}
            <kbd>↓</kbd> down. Grades and the weighted total update as you go.
          </p>
        </div>

        <div className="panel-head-actions">
          <span className={`autosave autosave--${saveState}`} role="status">
            {saveState === "saving" ?
              <>
                <Loader className="autosave-spin" />
                Saving draft…
              </>
            : <>
                <CloudUpload />
                {savedAt ? `Draft saved ${savedAt}` : "Draft saved"}
              </>
            }
          </span>

          {published ?
            <Button variant="secondary" onClick={unpublish}>
              Pull back to draft
            </Button>
          : <Button icon={Send} onClick={() => setPublishOpen(true)}>
              Publish results
            </Button>
          }
        </div>
      </div>

      <div className="sheet-status">
        <span className={`status-pill ${published ? "status-pill--green" : "status-pill--amber"}`}>
          {published ? <CircleCheck /> : <TriangleAlert />}
          {published ? "Published" : "Draft — staff only"}
        </span>
        {!publishReadiness.ok && (
          <span className="cell-sub">
            {publishReadiness.missing.length > 0 &&
              `${publishReadiness.missing.length} student(s) not fully marked`}
            {publishReadiness.missing.length > 0 &&
              publishReadiness.conflictCount > 0 &&
              " · "}
            {publishReadiness.conflictCount > 0 &&
              `${publishReadiness.conflictCount} paper clash(es)`}
          </span>
        )}
      </div>

      {cellError && (
        <p className="field-error sheet-error">{cellError.message}</p>
      )}

      <div className="table-wrap" ref={sheetRef}>
        <table className="mark-sheet">
          <thead>
            <tr>
              <th className="sheet-corner">Student</th>
              {subjects.map((subject) => (
                <th key={subject.code}>
                  {subject.code}
                  <span className="cell-sub">max {subject.max}</span>
                </th>
              ))}
              <th className="sheet-total">Weighted</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <MarkRow
                key={row.id}
                row={row}
                rowIndex={index}
                error={cellError?.studentId === row.id ? cellError : null}
                onMark={setMark}
                onKeyNav={handleKeyNav}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MarksPanel;
