import { useMemo, useRef, useState } from "react";
import { Download, FileSpreadsheet, TriangleAlert } from "lucide-react";

import { shake } from "@/animation/shake";
import { groupings } from "@/assets/data/attendanceSeed";
import { Button, Field, Modal, TextField, useToast } from "@/components/ui";
import { useAttendance } from "@/context/AttendanceContext";
import { formatDate, parseDate, toIsoDate } from "@/utils/format";

const MS_DAY = 86400000;
const today = toIsoDate(new Date());
const monthAgo = toIsoDate(new Date(Date.now() - 30 * MS_DAY));

const ReportsPanel = ({ activeTab }) => {
  const { classes, studentStats, historyDates, dailyTotals, markingClass } =
    useAttendance();
  const { toast } = useToast();

  const [selected, setSelected] = useState([markingClass]);
  const [from, setFrom] = useState(monthAgo);
  const [to, setTo] = useState(today);
  const [grouping, setGrouping] = useState("class");
  const [touched, setTouched] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const formRef = useRef(null);

  const errors = useMemo(() => {
    const next = {};
    if (selected.length === 0) next.classes = "Pick at least one class.";
    if (!from) next.from = "Choose a start date.";
    if (!to) next.to = "Choose an end date.";
    if (from && to && parseDate(from) > parseDate(to))
      next.to = "The end date must fall on or after the start date.";
    if (to && parseDate(to) > parseDate(today))
      next.to = "Reports can't run past today.";
    return next;
  }, [selected, from, to]);

  const isValid = Object.keys(errors).length === 0;
  const err = (key) => (touched ? (errors[key] ?? "") : "");

  const toggleClass = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  /* The preview is built from the same derived stats the page already
     shows, so what's exported matches what's on screen. */
  const preview = useMemo(() => {
    const days = historyDates.filter((d) => d >= from && d <= to);

    if (grouping === "day") {
      return {
        columns: ["Date", "Present", "Absent", "Late", "Excused"],
        rows: days.slice(-12).map((date) => {
          const tally = dailyTotals[date] ?? {
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
          };
          return [
            formatDate(date),
            tally.present,
            tally.absent,
            tally.late,
            tally.excused,
          ];
        }),
      };
    }

    if (grouping === "student") {
      return {
        columns: ["Student", "Attendance", "Absent", "Late", "Excused"],
        rows: studentStats
          .slice()
          .sort((a, b) => a.percent - b.percent)
          .slice(0, 12)
          .map((s) => [
            s.name,
            `${s.percent}%`,
            s.absent,
            s.late,
            s.excused,
          ]),
      };
    }

    return {
      columns: ["Class", "Students", "Average attendance", "Days covered"],
      rows: selected.map((id) => {
        const klass = classes.find((c) => c.id === id);
        const cohort =
          id === markingClass ? studentStats : studentStats.slice(0, 10);
        const average =
          cohort.reduce((sum, s) => sum + s.percent, 0) / (cohort.length || 1);
        return [
          klass?.name ?? id,
          klass?.size ?? cohort.length,
          `${Math.round(average * 10) / 10}%`,
          days.length,
        ];
      }),
    };
  }, [
    grouping,
    selected,
    classes,
    studentStats,
    historyDates,
    dailyTotals,
    from,
    to,
    markingClass,
  ]);

  const build = () => {
    setTouched(true);
    if (!isValid) {
      shake(formRef.current);
      return;
    }
    setPreviewOpen(true);
  };

  const isActive = activeTab === "reports";

  return (
    <section
      className={`attendance-panel${isActive ? " is-active" : ""}`}
      id="panel-reports"
      role="tabpanel"
      aria-labelledby="tab-reports">
      <div className="mark-head">
        <div>
          <h2>
            <FileSpreadsheet />
            Report builder
          </h2>
          <p>Choose classes, a date range and a grouping, then preview it.</p>
        </div>
      </div>

      <form
        className="report-form"
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}>
        <Field
          label="Classes"
          error={err("classes")}
          hint="Tick every class the report should cover.">
          <div className="class-picker">
            {classes.map((klass) => (
              <label
                key={klass.id}
                className={`class-chip${
                  selected.includes(klass.id) ? " is-selected" : ""
                }`}>
                <input
                  type="checkbox"
                  checked={selected.includes(klass.id)}
                  onChange={() => toggleClass(klass.id)}
                />
                <span>{klass.name}</span>
                <span className="cell-sub">{klass.size}</span>
              </label>
            ))}
          </div>
        </Field>

        <div className="form-grid">
          <TextField
            id="reportFrom"
            name="from"
            type="date"
            label="From"
            max={today}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            onBlur={() => setTouched(true)}
            error={err("from")}
          />
          <TextField
            id="reportTo"
            name="to"
            type="date"
            label="To"
            max={today}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            onBlur={() => setTouched(true)}
            error={err("to")}
          />
          <Field label="Grouping" htmlFor="reportGrouping">
            <select
              id="reportGrouping"
              name="grouping"
              value={grouping}
              onChange={(e) => setGrouping(e.target.value)}>
              {groupings.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {touched && !isValid && (
          <p className="report-warning">
            <TriangleAlert />
            Fix the highlighted fields before building the report.
          </p>
        )}

        <div className="report-foot">
          <Button icon={FileSpreadsheet} onClick={build}>
            Preview report
          </Button>
        </div>
      </form>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Report preview"
        titleId="reportPreviewTitle"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <Button
              icon={Download}
              onClick={() =>
                toast.info("Export is a UI placeholder — no file is generated.")
              }>
              Export CSV
            </Button>
          </>
        }>
        <p className="report-caption">
          {selected.length} class{selected.length === 1 ? "" : "es"} ·{" "}
          {formatDate(from)} – {formatDate(to)} ·{" "}
          {groupings.find((g) => g.value === grouping)?.label.toLowerCase()}
        </p>
        <div className="table-wrap">
          <table className="table report-table">
            <thead>
              <tr>
                {preview.columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </section>
  );
};

export default ReportsPanel;
