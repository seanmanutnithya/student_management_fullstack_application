import { Check, RotateCcw, Search, SearchX } from "lucide-react";

import { STATUSES } from "@/assets/data/attendanceSeed";
import { useStaggerReveal } from "@/animation/reveal";
import { Button, useToast } from "@/components/ui";
import { useAttendance } from "@/context/AttendanceContext";
import MarkRow from "./MarkRow";

const MarkPanel = ({ activeTab }) => {
  const {
    filteredStudents,
    students,
    marks,
    setMark,
    resetMarks,
    markTally,
    exceptions,
    query,
    setQuery,
    submitRegister,
    submitting,
    todaySubmitted,
    markingClass,
    setFocusedStudentId,
    rosterRef,
  } = useAttendance();
  const { toast } = useToast();

  const isActive = activeTab === "mark";

  useStaggerReveal(".mark-row", [isActive, query], {
    y: 6,
    duration: 0.3,
    stagger: 0.012,
  });

  const handleSubmit = () => {
    if (todaySubmitted) {
      toast.info("Today's register for this class is already in");
      return;
    }
    submitRegister();
  };

  return (
    <section
      className={`attendance-panel${isActive ? " is-active" : ""}`}
      id="panel-mark"
      role="tabpanel"
      aria-labelledby="tab-mark">
      <div className="mark-head">
        <div>
          <h2>
            {markingClass} · today's register
            {todaySubmitted && (
              <span className="status-pill status-pill--green">Submitted</span>
            )}
          </h2>
          <p>
            Everyone starts <strong>Present</strong> — only mark the exceptions.
            Click a chip, or focus a row and press <kbd>P</kbd> <kbd>A</kbd>{" "}
            <kbd>L</kbd> <kbd>E</kbd>, with <kbd>↑</kbd> <kbd>↓</kbd> to move.
          </p>
        </div>
        <div className="mark-head-actions">
          <Button
            variant="secondary"
            icon={RotateCcw}
            onClick={resetMarks}
            disabled={exceptions === 0}>
            Reset
          </Button>
          <Button icon={Check} loading={submitting} onClick={handleSubmit}>
            Submit register
          </Button>
        </div>
      </div>

      <div className="mark-tally" role="status">
        {STATUSES.map((status) => (
          <span
            key={status.value}
            className={`tally-chip tally-chip--${status.value}`}>
            <status.icon />
            <strong>{markTally[status.value]}</strong>
            {status.label}
          </span>
        ))}
        <span className="tally-note">
          {exceptions === 0 ?
            `All ${students.length} present`
          : `${exceptions} exception${exceptions === 1 ? "" : "s"} of ${students.length}`
          }
        </span>
      </div>

      <div className="attendance-toolbar">
        <div className="search-field search-field--sm">
          <Search />
          <input
            type="text"
            placeholder="Jump to a student by name, ID or roll"
            aria-label="Search the roster"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <span className="results-note">
          Showing <strong>{filteredStudents.length}</strong> of{" "}
          <strong>{students.length}</strong> students
        </span>
      </div>

      {filteredStudents.length === 0 ?
        <div className="attendance-empty">
          <SearchX />
          <h3>No student matches that search</h3>
          <p>Try a different name, student ID or roll number.</p>
        </div>
      : <div className="mark-roster" ref={rosterRef}>
          {filteredStudents.map((student) => (
            <MarkRow
              key={student.id}
              student={student}
              status={marks[student.id]}
              onMark={setMark}
              onFocusRow={setFocusedStudentId}
            />
          ))}
        </div>
      }
    </section>
  );
};

export default MarkPanel;
