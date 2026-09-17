import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  GRADE_BANDS,
  PASS_MARK,
  gradeFor,
  seatRooms,
  seedMarks,
  seedRemarks,
  seedSessions,
  students,
  subjects,
} from "@/assets/data/examSeed";
import { DAYS, seedLessons, seedTemplates } from "@/assets/data/routineSeed";
import { useToast } from "@/components/ui";
import { parseDate } from "@/utils/format";

const ExamContext = createContext(null);

const SAVE_DELAY = 700;
const AUTOSAVE_DELAY = 900;

const periodsOf = seedTemplates[0].periods;
const periodLabel = (id) =>
  periodsOf.find((p) => p.id === id)?.label ?? String(id).toUpperCase();

/* Monday..Friday for a date-only string, in local time. */
const weekdayOf = (date) => DAYS[parseDate(date).getDay() - 1] ?? null;

const subjectByCode = Object.fromEntries(subjects.map((s) => [s.code, s]));

export function ExamProvider({ children }) {
  const { toast } = useToast();

  const [sessions, setSessions] = useState(seedSessions);
  const [sessionId, setSessionId] = useState(seedSessions[0].id);
  const [marks, setMarks] = useState(seedMarks);
  const [retakes, setRetakes] = useState({});
  const [remarks, setRemarks] = useState(seedRemarks);

  const [activeTab, setActiveTab] = useState("planner");
  const [reportStudentId, setReportStudentId] = useState(students[0].id);
  const [spaceOutClasses, setSpaceOutClasses] = useState(true);
  const [seatingRoomId, setSeatingRoomId] = useState(seatRooms[0].id);

  const [cellError, setCellError] = useState(null);
  const [saveState, setSaveState] = useState("saved");
  const [savedAt, setSavedAt] = useState(null);

  const [paperModal, setPaperModal] = useState(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [retakeFor, setRetakeFor] = useState(null);

  const autosaveRef = useRef(null);
  const paperFormRef = useRef(null);
  const retakeFormRef = useRef(null);
  const remarkFormRef = useRef(null);

  const session = useMemo(
    () => sessions.find((s) => s.id === sessionId) ?? sessions[0],
    [sessions, sessionId],
  );

  /* ---------------- Autosaving draft ---------------- */
  // Marks land in state immediately; the indicator reports the debounce so
  // the user knows a draft is safe without a Save button.
  useEffect(() => () => clearTimeout(autosaveRef.current), []);

  const touchAutosave = useCallback(() => {
    setSaveState("saving");
    clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(() => {
      setSaveState("saved");
      setSavedAt(
        new Date().toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, AUTOSAVE_DELAY);
  }, []);

  const setMark = useCallback(
    (studentId, code, raw) => {
      const subject = subjectByCode[code];
      const trimmed = String(raw).trim();

      if (trimmed === "") {
        setMarks((prev) => {
          const row = { ...(prev[studentId] ?? {}) };
          delete row[code];
          return { ...prev, [studentId]: row };
        });
        setCellError(null);
        touchAutosave();
        return;
      }

      const value = Number(trimmed);
      if (!Number.isFinite(value) || value < 0 || value > subject.max) {
        setCellError({
          studentId,
          code,
          message: `Enter 0–${subject.max} for ${code}.`,
        });
        return;
      }

      setCellError(null);
      setMarks((prev) => ({
        ...prev,
        [studentId]: { ...(prev[studentId] ?? {}), [code]: value },
      }));
      touchAutosave();
    },
    [touchAutosave],
  );

  /* ---------------- Grades ---------------- */
  /* Weighted by credits — a 4-credit paper moves the total more than a
     3-credit one, which is what the subject scheme implies. */
  const rows = useMemo(() => {
    const computed = students.map((student) => {
      const row = marks[student.id] ?? {};
      const cells = subjects.map((subject) => {
        const score = row[subject.code];
        const has = typeof score === "number";
        const percent = has ? (score / subject.max) * 100 : null;
        return {
          code: subject.code,
          score: has ? score : "",
          percent: has ? Math.round(percent * 10) / 10 : null,
          grade: has ? gradeFor(percent) : null,
          passed: has ? percent >= PASS_MARK : null,
          max: subject.max,
          credits: subject.credits,
        };
      });

      const graded = cells.filter((c) => c.percent !== null);
      const creditSum = graded.reduce((sum, c) => sum + c.credits, 0);
      const weighted =
        creditSum > 0 ?
          graded.reduce((sum, c) => sum + c.percent * c.credits, 0) / creditSum
        : null;
      const gpa =
        creditSum > 0 ?
          graded.reduce((sum, c) => sum + c.grade.points * c.credits, 0) /
          creditSum
        : null;

      return {
        ...student,
        cells,
        entered: graded.length,
        complete: graded.length === subjects.length,
        weighted: weighted === null ? null : Math.round(weighted * 10) / 10,
        grade: weighted === null ? null : gradeFor(weighted),
        gpa: gpa === null ? null : Math.round(gpa * 100) / 100,
        failing: graded.filter((c) => !c.passed).map((c) => c.code),
      };
    });

    /* Rank on the weighted total; unmarked students sit unranked. */
    const ranked = [...computed]
      .filter((r) => r.weighted !== null)
      .sort((a, b) => b.weighted - a.weighted);

    return computed.map((row) => ({
      ...row,
      rank: ranked.findIndex((r) => r.id === row.id) + 1 || null,
      cohort: ranked.length,
    }));
  }, [marks]);

  const rowById = useMemo(
    () => Object.fromEntries(rows.map((r) => [r.id, r])),
    [rows],
  );

  /* ---------------- Planner & clashes ---------------- */
  const papers = session.papers;

  /* A paper clashes when its room is in use by the teaching timetable at
     that weekday and period, or by another paper in the same slot. */
  const paperConflicts = useMemo(() => {
    const map = {};

    papers.forEach((paper) => {
      const day = weekdayOf(paper.date);
      const issues = [];

      if (!day) {
        issues.push({ type: "weekend", detail: "Falls on a weekend." });
      } else {
        const lessonClash = seedLessons.find(
          (l) =>
            l.day === day &&
            l.periodId === paper.periodId &&
            l.room === paper.room,
        );
        if (lessonClash)
          issues.push({
            type: "routine",
            detail: `${paper.room} has ${lessonClash.classId} ${lessonClash.code} on the timetable then.`,
          });
      }

      const paperClash = papers.find(
        (other) =>
          other.id !== paper.id &&
          other.date === paper.date &&
          other.periodId === paper.periodId &&
          other.room === paper.room,
      );
      if (paperClash)
        issues.push({
          type: "paper",
          detail: `${paperClash.code} is already in ${paper.room} in that slot.`,
        });

      if (issues.length) map[paper.id] = issues;
    });

    return map;
  }, [papers]);

  const conflictCount = Object.keys(paperConflicts).length;

  const savePaper = useCallback(
    (paper) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          const exists = s.papers.some((p) => p.id === paper.id);
          return {
            ...s,
            papers:
              exists ?
                s.papers.map((p) => (p.id === paper.id ? paper : p))
              : [...s.papers, paper],
          };
        }),
      );
      setPaperModal(null);
      toast.success(`${paper.code} paper scheduled`);
    },
    [sessionId, toast],
  );

  const removePaper = useCallback(
    (paperId) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ?
            { ...s, papers: s.papers.filter((p) => p.id !== paperId) }
          : s,
        ),
      );
      toast.info("Paper removed from the session");
    },
    [sessionId, toast],
  );

  /* ---------------- Publishing ---------------- */
  const publishReadiness = useMemo(() => {
    const missing = rows.filter((r) => !r.complete);
    return {
      ok: missing.length === 0 && conflictCount === 0,
      missing,
      conflictCount,
    };
  }, [rows, conflictCount]);

  const publish = useCallback(() => {
    setPublishing(true);
    setTimeout(() => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ?
            { ...s, status: "published", publishedOn: new Date().toISOString() }
          : s,
        ),
      );
      setPublishing(false);
      setPublishOpen(false);
      toast.success("Results published — students and guardians can see them now");
    }, SAVE_DELAY);
  }, [sessionId, toast]);

  const unpublish = useCallback(() => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: "draft" } : s)),
    );
    toast.info("Results pulled back to draft — only staff can see them");
  }, [sessionId, toast]);

  /* ---------------- Analytics ---------------- */
  const analytics = useMemo(() => {
    const graded = rows.filter((r) => r.weighted !== null);
    const passed = graded.filter((r) => r.weighted >= PASS_MARK);

    const histogram = GRADE_BANDS.map((band) => ({
      ...band,
      count: graded.filter((r) => r.grade.letter === band.letter).length,
    }));

    const bySubject = subjects.map((subject) => {
      const scores = rows
        .map((r) => r.cells.find((c) => c.code === subject.code))
        .filter((c) => c && c.percent !== null);
      const average =
        scores.length ?
          Math.round(
            (scores.reduce((sum, c) => sum + c.percent, 0) / scores.length) * 10,
          ) / 10
        : null;
      return {
        ...subject,
        average,
        entered: scores.length,
        failing: scores.filter((c) => !c.passed).length,
      };
    });

    const ranked = [...graded].sort((a, b) => b.weighted - a.weighted);

    return {
      graded: graded.length,
      passed: passed.length,
      failed: graded.length - passed.length,
      passRate:
        graded.length ?
          Math.round((passed.length / graded.length) * 1000) / 10
        : 0,
      histogram,
      bySubject,
      top: ranked.slice(0, 3),
      bottom: ranked.slice(-3).reverse(),
    };
  }, [rows]);

  /* ---------------- Retakes ---------------- */
  const retakeList = useMemo(
    () =>
      rows
        .flatMap((row) =>
          row.failing.map((code) => ({
            id: `${row.id}-${code}`,
            student: row,
            code,
            subject: subjectByCode[code]?.name ?? code,
            original: row.cells.find((c) => c.code === code),
            retake: retakes[`${row.id}-${code}`] ?? null,
          })),
        )
        .sort((a, b) => a.original.percent - b.original.percent),
    [rows, retakes],
  );

  /* The original score is kept — a retake is stored beside it, never over it. */
  const scheduleRetake = useCallback(
    (key, { date, room }) => {
      setRetakes((prev) => ({
        ...prev,
        [key]: { ...(prev[key] ?? {}), date, room, status: "scheduled" },
      }));
      setRetakeFor(null);
      toast.success("Makeup paper scheduled");
    },
    [toast],
  );

  const recordRetakeResult = useCallback(
    (key, score, max) => {
      const value = Number(score);
      if (!Number.isFinite(value) || value < 0 || value > max) {
        toast.error(`Enter a mark between 0 and ${max}.`);
        return false;
      }
      setRetakes((prev) => ({
        ...prev,
        [key]: {
          ...(prev[key] ?? {}),
          score: value,
          percent: Math.round((value / max) * 1000) / 10,
          status: "recorded",
        },
      }));
      toast.success("Retake result stored alongside the original");
      return true;
    },
    [toast],
  );

  /* ---------------- Seating ---------------- */
  const seating = useMemo(() => {
    const room = seatRooms.find((r) => r.id === seatingRoomId) ?? seatRooms[0];
    const capacity = room.rows * room.cols;

    /* Interleaving the two class lists puts neighbours from different
       sections next to each other. */
    const pool = [...students];
    let ordered = pool;
    if (spaceOutClasses) {
      const groups = {};
      pool.forEach((s) => {
        (groups[s.classId] ??= []).push(s);
      });
      const lists = Object.values(groups);
      ordered = [];
      for (let i = 0; ordered.length < pool.length; i++) {
        lists.forEach((list) => {
          if (list[i]) ordered.push(list[i]);
        });
      }
    }

    const seats = Array.from({ length: capacity }, (_, index) => ({
      seat: index + 1,
      row: Math.floor(index / room.cols),
      col: index % room.cols,
      student: ordered[index] ?? null,
    }));

    /* A neighbour clash is two seats side by side from the same class. */
    const adjacentSameClass = seats.filter((seat) => {
      if (!seat.student || seat.col === room.cols - 1) return false;
      const right = seats[seat.seat];
      return right?.student && right.student.classId === seat.student.classId;
    }).length;

    return { room, seats, capacity, seated: ordered.length, adjacentSameClass };
  }, [seatingRoomId, spaceOutClasses]);

  /* ---------------- Report card ---------------- */
  const reportRow = rowById[reportStudentId] ?? rows[0];

  const setRemark = useCallback((studentId, text) => {
    setRemarks((prev) => ({ ...prev, [studentId]: text }));
  }, []);

  const saveRemark = useCallback(
    (studentId, text) => {
      if (text.trim().length < 10) return false;
      setRemarks((prev) => ({ ...prev, [studentId]: text.trim() }));
      toast.success("Remark saved to the report card");
      return true;
    },
    [toast],
  );

  /* ---------------- Summary ---------------- */
  const summary = useMemo(
    () => ({
      papers: papers.length,
      entered: rows.reduce((sum, r) => sum + r.entered, 0),
      passRate: analytics.passRate,
      retakes: retakeList.length,
    }),
    [papers, rows, analytics, retakeList],
  );

  const value = useMemo(
    () => ({
      /* reference */
      students,
      subjects,
      subjectByCode,
      seatRooms,
      periods: periodsOf.filter((p) => !p.isBreak),
      periodLabel,
      passMark: PASS_MARK,
      gradeBands: GRADE_BANDS,

      /* session */
      sessions,
      session,
      sessionId,
      setSessionId,
      papers,
      paperConflicts,
      conflictCount,
      savePaper,
      removePaper,
      paperModal,
      setPaperModal,
      paperFormRef,

      /* marks */
      rows,
      rowById,
      setMark,
      cellError,
      setCellError,
      saveState,
      savedAt,

      /* publishing */
      publishReadiness,
      publishOpen,
      setPublishOpen,
      publishing,
      publish,
      unpublish,

      /* reports */
      reportStudentId,
      setReportStudentId,
      reportRow,
      remarks,
      setRemark,
      saveRemark,
      remarkFormRef,

      /* analytics */
      analytics,

      /* seating */
      seating,
      seatingRoomId,
      setSeatingRoomId,
      spaceOutClasses,
      setSpaceOutClasses,

      /* retakes */
      retakeList,
      retakeFor,
      setRetakeFor,
      scheduleRetake,
      recordRetakeResult,
      retakeFormRef,

      /* shell */
      activeTab,
      setActiveTab,
      summary,
    }),
    [
      sessions,
      session,
      sessionId,
      papers,
      paperConflicts,
      conflictCount,
      savePaper,
      removePaper,
      paperModal,
      rows,
      rowById,
      setMark,
      cellError,
      saveState,
      savedAt,
      publishReadiness,
      publishOpen,
      publishing,
      publish,
      unpublish,
      reportStudentId,
      reportRow,
      remarks,
      setRemark,
      saveRemark,
      analytics,
      seating,
      seatingRoomId,
      spaceOutClasses,
      retakeList,
      retakeFor,
      scheduleRetake,
      recordRetakeResult,
      activeTab,
      summary,
    ],
  );

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
}

export function useExams() {
  const ctx = useContext(ExamContext);
  if (!ctx) throw new Error("useExams must be used inside <ExamProvider>");
  return ctx;
}
