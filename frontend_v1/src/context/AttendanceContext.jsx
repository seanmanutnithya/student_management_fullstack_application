import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ABSENCE_REASONS,
  ATTENDANCE_THRESHOLD,
  MARKING_CLASS,
  classes,
  historyDates,
  seedHistory,
  seedLeaveRequests,
  seedSubmissions,
  students,
  todayIso,
} from "@/assets/data/attendanceSeed";
import { useToast } from "@/components/ui";
import { parseDate, toIsoDate as iso } from "@/utils/format";

const AttendanceContext = createContext(null);

const MS_DAY = 86400000;

/* Every register opens with the whole class present — only exceptions
   need touching, which is what keeps marking under a minute. */
const allPresent = () =>
  Object.fromEntries(students.map((s) => [s.id, "present"]));

const datesBetween = (from, to) => {
  const out = [];
  const end = parseDate(to).getTime();
  for (let t = parseDate(from).getTime(); t <= end; t += MS_DAY) {
    const d = new Date(t);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    out.push(iso(d));
  }
  return out;
};

export function AttendanceProvider({ children }) {
  const { toast } = useToast();

  const [history, setHistory] = useState(seedHistory);
  const [marks, setMarks] = useState(allPresent);
  const [submissions, setSubmissions] = useState(seedSubmissions);
  const [requests, setRequests] = useState(seedLeaveRequests);

  const [activeTab, setActiveTab] = useState("mark");
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [focusedStudentId, setFocusedStudentId] = useState(students[0].id);

  const rosterRef = useRef(null);

  /* ---------------- Marking ---------------- */
  const setMark = useCallback((studentId, status) => {
    setMarks((prev) =>
      prev[studentId] === status ? prev : { ...prev, [studentId]: status },
    );
  }, []);

  const resetMarks = useCallback(() => {
    setMarks(allPresent());
    toast.info("Register reset — everyone is present again");
  }, [toast]);

  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        String(s.roll) === q,
    );
  }, [query]);

  const markTally = useMemo(() => {
    const tally = { present: 0, absent: 0, late: 0, excused: 0 };
    Object.values(marks).forEach((status) => {
      tally[status] += 1;
    });
    return tally;
  }, [marks]);

  const exceptions = students.length - markTally.present;

  const todaySubmitted = useMemo(
    () =>
      submissions.find((s) => s.classId === MARKING_CLASS)?.submitted ?? false,
    [submissions],
  );

  const submitRegister = useCallback(() => {
    setSubmitting(true);
    // No backend — the delay only exists so the loading state is visible.
    setTimeout(() => {
      const at = new Date().toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });

      setHistory((prev) => {
        const next = { ...prev };
        students.forEach((s) => {
          const status = marks[s.id];
          next[s.id] = {
            ...next[s.id],
            [todayIso]:
              status === "absent" ?
                { status, reason: "unexcused" }
              : { status },
          };
        });
        return next;
      });

      setSubmissions((prev) =>
        prev.map((s) =>
          s.classId === MARKING_CLASS ? { ...s, submitted: true, at } : s,
        ),
      );
      setSubmitting(false);
      toast.success(
        `Register submitted — ${markTally.present} present, ${exceptions} exception(s)`,
      );
    }, 800);
  }, [marks, markTally.present, exceptions, toast]);

  /* ---------------- Submission tracker ---------------- */
  const submissionRows = useMemo(
    () =>
      submissions.map((row) => ({
        ...row,
        klass: classes.find((c) => c.id === row.classId) ?? null,
      })),
    [submissions],
  );

  const nudge = useCallback(
    (classId) => {
      const row = submissions.find((s) => s.classId === classId);
      toast.success(`Reminder sent to ${row?.by ?? "the form teacher"}`);
    },
    [submissions, toast],
  );

  /* ---------------- Derived attendance stats ---------------- */
  const studentStats = useMemo(
    () =>
      students.map((student) => {
        const days = history[student.id] ?? {};
        const entries = Object.values(days);
        const counted = entries.length;
        // Excused days are authorised, so they don't count against a student.
        const attended = entries.filter(
          (e) => e.status === "present" || e.status === "late",
        ).length;
        const excused = entries.filter((e) => e.status === "excused").length;
        const absent = entries.filter((e) => e.status === "absent").length;
        const late = entries.filter((e) => e.status === "late").length;
        const base = counted - excused;
        const percent = base > 0 ? Math.round((attended / base) * 1000) / 10 : 100;

        return {
          ...student,
          counted,
          attended,
          absent,
          late,
          excused,
          percent,
          /* Whole days back to threshold, given the same denominator. */
          shortfall:
            percent >= ATTENDANCE_THRESHOLD ?
              0
            : Math.ceil(
                (ATTENDANCE_THRESHOLD / 100) * base - attended,
              ),
          deficit: Math.round((ATTENDANCE_THRESHOLD - percent) * 10) / 10,
        };
      }),
    [history],
  );

  const atRisk = useMemo(
    () =>
      studentStats
        .filter((s) => s.percent < ATTENDANCE_THRESHOLD)
        .sort((a, b) => a.percent - b.percent),
    [studentStats],
  );

  const reasonBreakdown = useMemo(() => {
    const counts = Object.fromEntries(ABSENCE_REASONS.map((r) => [r.key, 0]));
    Object.values(history).forEach((days) => {
      Object.values(days).forEach((entry) => {
        if (entry.status === "absent" && entry.reason) counts[entry.reason] += 1;
      });
    });
    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
    return {
      total,
      segments: ABSENCE_REASONS.map((reason) => ({
        ...reason,
        value: counts[reason.key],
        percent: total ? Math.round((counts[reason.key] / total) * 100) : 0,
      })),
    };
  }, [history]);

  /* date -> { present, absent, late, excused } across the whole roster. */
  const dailyTotals = useMemo(() => {
    const totals = {};
    historyDates.forEach((date) => {
      totals[date] = { present: 0, absent: 0, late: 0, excused: 0 };
    });
    Object.values(history).forEach((days) => {
      Object.entries(days).forEach(([date, entry]) => {
        if (totals[date]) totals[date][entry.status] += 1;
      });
    });
    return totals;
  }, [history]);

  const focusedStudent = useMemo(
    () =>
      studentStats.find((s) => s.id === focusedStudentId) ?? studentStats[0],
    [studentStats, focusedStudentId],
  );

  const focusedHistory = useMemo(() => {
    const days = history[focusedStudent?.id] ?? {};
    return historyDates.map((date) => ({
      date,
      status: days[date]?.status ?? null,
      reason: days[date]?.reason ?? null,
    }));
  }, [history, focusedStudent]);

  /* ---------------- Leave requests ---------------- */
  const pendingRequests = useMemo(
    () =>
      requests
        .filter((r) => r.status === "pending")
        .map((r) => ({
          ...r,
          student: students.find((s) => s.id === r.studentId) ?? null,
          days: datesBetween(r.from, r.to).length,
        })),
    [requests],
  );

  /* Approving writes Excused straight onto every school day in the range. */
  const approveRequest = useCallback(
    (id) => {
      const request = requests.find((r) => r.id === id);
      if (!request) return;
      const days = datesBetween(request.from, request.to);

      setHistory((prev) => {
        const existing = prev[request.studentId] ?? {};
        const patch = Object.fromEntries(
          days.map((date) => [date, { status: "excused" }]),
        );
        return { ...prev, [request.studentId]: { ...existing, ...patch } };
      });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)),
      );

      const name =
        students.find((s) => s.id === request.studentId)?.name ?? "Student";
      toast.success(`Approved — ${days.length} day(s) marked excused for ${name}`);
    },
    [requests, toast],
  );

  const rejectRequest = useCallback(
    (id, note) => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "rejected", decisionNote: note } : r,
        ),
      );
      toast.info("Request rejected — the guardian has been notified");
    },
    [toast],
  );

  /* ---------------- Summary strip ---------------- */
  const summary = useMemo(
    () => ({
      presentToday: markTally.present + markTally.late,
      absentToday: markTally.absent,
      submitted: submissions.filter((s) => s.submitted).length,
      atRisk: atRisk.length,
    }),
    [markTally, submissions, atRisk],
  );

  const value = useMemo(
    () => ({
      /* reference data */
      students,
      classes,
      historyDates,
      todayIso,
      threshold: ATTENDANCE_THRESHOLD,
      markingClass: MARKING_CLASS,

      /* marking */
      marks,
      setMark,
      resetMarks,
      filteredStudents,
      markTally,
      exceptions,
      query,
      setQuery,
      submitRegister,
      submitting,
      todaySubmitted,
      rosterRef,

      /* tracker */
      submissionRows,
      nudge,

      /* insights */
      studentStats,
      atRisk,
      reasonBreakdown,
      dailyTotals,
      focusedStudent,
      focusedStudentId: focusedStudent?.id,
      setFocusedStudentId,
      focusedHistory,

      /* leave */
      pendingRequests,
      approveRequest,
      rejectRequest,

      /* shell */
      summary,
      activeTab,
      setActiveTab,
    }),
    [
      marks,
      setMark,
      resetMarks,
      filteredStudents,
      markTally,
      exceptions,
      query,
      submitRegister,
      submitting,
      todaySubmitted,
      submissionRows,
      nudge,
      studentStats,
      atRisk,
      reasonBreakdown,
      dailyTotals,
      focusedStudent,
      focusedHistory,
      pendingRequests,
      approveRequest,
      rejectRequest,
      summary,
      activeTab,
    ],
  );

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const ctx = useContext(AttendanceContext);
  if (!ctx)
    throw new Error("useAttendance must be used inside <AttendanceProvider>");
  return ctx;
}
