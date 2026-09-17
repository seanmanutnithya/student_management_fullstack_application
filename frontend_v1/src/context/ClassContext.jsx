import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ATTENDANCE_THRESHOLD,
  CAPACITY_WARN,
  GRADE_THRESHOLD,
  seedArchived,
  seedClasses,
  teachers,
} from "@/assets/data/classSeed";
import { useToast } from "@/components/ui";

const ClassContext = createContext(null);

const SAVE_DELAY = 700;

const average = (values) =>
  values.length ?
    Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
  : 0;

/* Every headcount is derived, never stored, so a transfer can't leave a
   card disagreeing with its roster. */
const decorate = (klass) => {
  const enrolled = klass.students.length;
  const fill = klass.capacity > 0 ? enrolled / klass.capacity : 0;
  const attendance = average(klass.students.map((s) => s.attendance));
  // Named apart from klass.grade — that one is the grade level ("Grade 10").
  const averageGrade = average(klass.students.map((s) => s.grade));

  return {
    ...klass,
    enrolled,
    fill,
    fillPercent: Math.round(fill * 100),
    seatsLeft: klass.capacity - enrolled,
    capacityState:
      fill > 1 ? "over"
      : fill >= CAPACITY_WARN ? "near"
      : "ok",
    attendance,
    averageGrade,
    belowAttendance: klass.students.filter(
      (s) => s.attendance < ATTENDANCE_THRESHOLD,
    ).length,
    belowGrade: klass.students.filter((s) => s.grade < GRADE_THRESHOLD).length,
    unassignedSubjects: klass.subjects.filter((s) => !s.teacher).length,
  };
};

export function ClassProvider({ children }) {
  const { toast } = useToast();

  const [classes, setClasses] = useState(seedClasses);
  const [archived, setArchived] = useState(seedArchived);

  const [activeTab, setActiveTab] = useState("sections");
  const [drawerId, setDrawerId] = useState(null);
  const [draggingStudent, setDraggingStudent] = useState(null);
  const [pendingTransfer, setPendingTransfer] = useState(null);
  const [transferring, setTransferring] = useState(false);

  /* Health snapshot -> filtered student list */
  const [filterView, setFilterView] = useState(null);

  /* Promotion wizard */
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardClassId, setWizardClassId] = useState("");
  const [decisions, setDecisions] = useState({});
  const [retainNotes, setRetainNotes] = useState({});
  const [wizardTouched, setWizardTouched] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const wizardFormRef = useRef(null);

  /* ---------------- Derived ---------------- */
  const rows = useMemo(() => classes.map(decorate), [classes]);
  const archivedRows = useMemo(() => archived.map(decorate), [archived]);

  /* A teacher holding more than one homeroom is a scheduling clash. */
  const homeroomCounts = useMemo(() => {
    const counts = {};
    classes.forEach((k) => {
      counts[k.homeroom] = (counts[k.homeroom] ?? 0) + 1;
    });
    return counts;
  }, [classes]);

  const drawerClass = useMemo(
    () =>
      rows.find((k) => k.id === drawerId) ??
      archivedRows.find((k) => k.id === drawerId) ??
      null,
    [rows, archivedRows, drawerId],
  );

  const drawerTeacher = useMemo(
    () =>
      drawerClass ?
        (teachers.find((t) => t.name === drawerClass.homeroom) ?? {
          name: drawerClass.homeroom,
        })
      : null,
    [drawerClass],
  );

  const comparison = useMemo(() => {
    const grades = {};
    rows.forEach((row) => {
      (grades[row.grade] ??= []).push(row);
    });
    return Object.entries(grades).map(([grade, sections]) => ({
      grade,
      sections,
      bestAttendance: Math.max(...sections.map((s) => s.attendance)),
      worstAttendance: Math.min(...sections.map((s) => s.attendance)),
      bestGrade: Math.max(...sections.map((s) => s.averageGrade)),
      worstGrade: Math.min(...sections.map((s) => s.averageGrade)),
    }));
  }, [rows]);

  const summary = useMemo(
    () => ({
      sections: rows.length,
      students: rows.reduce((sum, k) => sum + k.enrolled, 0),
      nearCapacity: rows.filter((k) => k.capacityState !== "ok").length,
      archived: archivedRows.length,
    }),
    [rows, archivedRows],
  );

  /* ---------------- Drawer ---------------- */
  const openDrawer = useCallback((id) => setDrawerId(id), []);
  const closeDrawer = useCallback(() => {
    setDrawerId(null);
    setFilterView(null);
  }, []);

  /* ---------------- Transfer ---------------- */
  const startDrag = useCallback((student, fromId) => {
    setDraggingStudent({ ...student, fromId });
  }, []);

  const endDrag = useCallback(() => setDraggingStudent(null), []);

  const requestTransfer = useCallback(
    (toId) => {
      if (!draggingStudent || draggingStudent.fromId === toId) {
        setDraggingStudent(null);
        return;
      }
      setPendingTransfer({ student: draggingStudent, toId });
      setDraggingStudent(null);
    },
    [draggingStudent],
  );

  const cancelTransfer = useCallback(() => setPendingTransfer(null), []);

  /* A class already at capacity can't take another body — the confirm step
     explains it rather than silently refusing the drop. */
  const transferCheck = useMemo(() => {
    if (!pendingTransfer) return { ok: false, reason: "" };
    const target = rows.find((k) => k.id === pendingTransfer.toId);
    if (!target) return { ok: false, reason: "That section no longer exists." };
    if (target.enrolled >= target.capacity)
      return {
        ok: false,
        reason: `${target.id} is already at capacity (${target.enrolled}/${target.capacity}). Free a seat before moving anyone in.`,
      };
    return { ok: true, reason: "" };
  }, [pendingTransfer, rows]);

  const confirmTransfer = useCallback(() => {
    if (!pendingTransfer || !transferCheck.ok) return;
    const { student, toId } = pendingTransfer;

    setTransferring(true);
    setTimeout(() => {
      setClasses((prev) =>
        prev.map((klass) => {
          if (klass.id === student.fromId)
            return {
              ...klass,
              students: klass.students.filter((s) => s.id !== student.id),
            };
          if (klass.id === toId)
            return { ...klass, students: [...klass.students, student] };
          return klass;
        }),
      );
      setPendingTransfer(null);
      setTransferring(false);
      toast.success(`${student.name} moved from ${student.fromId} to ${toId}`);
    }, SAVE_DELAY);
  }, [pendingTransfer, transferCheck, toast]);

  /* ---------------- Health snapshot filters ---------------- */
  const openFilter = useCallback((kind) => setFilterView(kind), []);
  const closeFilter = useCallback(() => setFilterView(null), []);

  const filteredStudents = useMemo(() => {
    if (!drawerClass || !filterView) return [];
    if (filterView === "attendance")
      return drawerClass.students.filter(
        (s) => s.attendance < ATTENDANCE_THRESHOLD,
      );
    if (filterView === "grade")
      return drawerClass.students.filter((s) => s.grade < GRADE_THRESHOLD);
    return drawerClass.students;
  }, [drawerClass, filterView]);

  /* ---------------- Promotion wizard ---------------- */
  const wizardClass = useMemo(
    () => rows.find((k) => k.id === wizardClassId) ?? null,
    [rows, wizardClassId],
  );

  const openWizard = useCallback(() => {
    setWizardOpen(true);
    setWizardStep(0);
    setWizardClassId("");
    setDecisions({});
    setRetainNotes({});
    setWizardTouched(false);
  }, []);

  const closeWizard = useCallback(() => setWizardOpen(false), []);

  /* Default: a student is promoted unless they are under either threshold. */
  const seedDecisions = useCallback((klass) => {
    setDecisions(
      Object.fromEntries(
        klass.students.map((s) => [
          s.id,
          s.attendance < ATTENDANCE_THRESHOLD || s.grade < GRADE_THRESHOLD ?
            "retain"
          : "promote",
        ]),
      ),
    );
  }, []);

  const setDecision = useCallback((studentId, decision) => {
    setDecisions((prev) =>
      prev[studentId] === decision ? prev : { ...prev, [studentId]: decision },
    );
  }, []);

  const setRetainNote = useCallback((studentId, note) => {
    setRetainNotes((prev) => ({ ...prev, [studentId]: note }));
  }, []);

  const retained = useMemo(
    () =>
      (wizardClass?.students ?? []).filter((s) => decisions[s.id] === "retain"),
    [wizardClass, decisions],
  );

  const promoted = useMemo(
    () =>
      (wizardClass?.students ?? []).filter(
        (s) => decisions[s.id] !== "retain",
      ),
    [wizardClass, decisions],
  );

  /* Retaining a student needs a written reason — the guardian sees it. */
  const missingNotes = useMemo(
    () => retained.filter((s) => (retainNotes[s.id] ?? "").trim().length < 5),
    [retained, retainNotes],
  );

  const stepValid = useMemo(() => {
    if (wizardStep === 0) return Boolean(wizardClassId);
    if (wizardStep === 1) return missingNotes.length === 0;
    return true;
  }, [wizardStep, wizardClassId, missingNotes]);

  const goNext = useCallback(() => {
    setWizardTouched(true);
    if (!stepValid) return false;
    if (wizardStep === 0 && wizardClass) seedDecisions(wizardClass);
    setWizardTouched(false);
    setWizardStep((s) => Math.min(s + 1, 2));
    return true;
  }, [stepValid, wizardStep, wizardClass, seedDecisions]);

  const goBack = useCallback(() => {
    setWizardTouched(false);
    setWizardStep((s) => Math.max(s - 1, 0));
  }, []);

  const confirmPromotion = useCallback(() => {
    if (!wizardClass) return;
    setPromoting(true);
    setTimeout(() => {
      const promotedIds = new Set(promoted.map((s) => s.id));

      setClasses((prev) =>
        prev.map((klass) =>
          klass.id === wizardClass.id ?
            {
              ...klass,
              students: klass.students.filter((s) => !promotedIds.has(s.id)),
            }
          : klass,
        ),
      );
      // The finished year keeps its full roster, read-only.
      setArchived((prev) => [
        {
          ...wizardClass,
          id: `${wizardClass.id}-${wizardClass.year}`,
          archived: true,
          archivedOn: new Date().toISOString().slice(0, 10),
          promotedCount: promoted.length,
          retainedCount: retained.length,
        },
        ...prev,
      ]);

      setPromoting(false);
      setWizardOpen(false);
      toast.success(
        `${wizardClass.id} closed out — ${promoted.length} promoted, ${retained.length} retained`,
      );
    }, SAVE_DELAY);
  }, [wizardClass, promoted, retained, toast]);

  const value = useMemo(
    () => ({
      /* data */
      rows,
      archivedRows,
      teachers,
      summary,
      comparison,
      homeroomCounts,
      attendanceThreshold: ATTENDANCE_THRESHOLD,
      gradeThreshold: GRADE_THRESHOLD,

      /* shell */
      activeTab,
      setActiveTab,

      /* drawer */
      drawerId,
      drawerClass,
      drawerTeacher,
      openDrawer,
      closeDrawer,

      /* transfer */
      draggingStudent,
      startDrag,
      endDrag,
      requestTransfer,
      pendingTransfer,
      transferCheck,
      transferring,
      confirmTransfer,
      cancelTransfer,

      /* health filters */
      filterView,
      openFilter,
      closeFilter,
      filteredStudents,

      /* wizard */
      wizardOpen,
      wizardStep,
      wizardClassId,
      setWizardClassId,
      wizardClass,
      decisions,
      setDecision,
      retainNotes,
      setRetainNote,
      retained,
      promoted,
      missingNotes,
      stepValid,
      wizardTouched,
      wizardFormRef,
      promoting,
      openWizard,
      closeWizard,
      goNext,
      goBack,
      confirmPromotion,
    }),
    [
      rows,
      archivedRows,
      summary,
      comparison,
      homeroomCounts,
      activeTab,
      drawerId,
      drawerClass,
      drawerTeacher,
      openDrawer,
      closeDrawer,
      draggingStudent,
      startDrag,
      endDrag,
      requestTransfer,
      pendingTransfer,
      transferCheck,
      transferring,
      confirmTransfer,
      cancelTransfer,
      filterView,
      openFilter,
      closeFilter,
      filteredStudents,
      wizardOpen,
      wizardStep,
      wizardClassId,
      wizardClass,
      decisions,
      setDecision,
      retainNotes,
      setRetainNote,
      retained,
      promoted,
      missingNotes,
      stepValid,
      wizardTouched,
      promoting,
      openWizard,
      closeWizard,
      goNext,
      goBack,
      confirmPromotion,
    ],
  );

  return (
    <ClassContext.Provider value={value}>{children}</ClassContext.Provider>
  );
}

export function useClasses() {
  const ctx = useContext(ClassContext);
  if (!ctx) throw new Error("useClasses must be used inside <ClassProvider>");
  return ctx;
}
