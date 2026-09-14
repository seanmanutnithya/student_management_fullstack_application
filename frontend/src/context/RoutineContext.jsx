import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  DAYS,
  WORKLOAD_TARGET,
  WORKLOAD_TOLERANCE,
  classes,
  rooms,
  seedAbsences,
  seedLessons,
  seedTemplates,
  teachers,
} from "@/assets/data/routineSeed";
import { useToast } from "@/components/ui";

const RoutineContext = createContext(null);

const SAVE_DELAY = 700;
const slotKey = (day, periodId) => `${day}|${periodId}`;

/* A slot clashes when one teacher, room or class appears in it twice.
   Scanned across the whole week, not just the lens in view — a class-view
   user still needs to know their teacher is double-booked elsewhere. */
const findConflicts = (lessons) => {
  const buckets = {};
  lessons.forEach((lesson) => {
    const key = slotKey(lesson.day, lesson.periodId);
    (buckets[key] ??= []).push(lesson);
  });

  const conflicts = [];
  Object.entries(buckets).forEach(([key, slotLessons]) => {
    const [day, periodId] = key.split("|");

    [
      { type: "teacher", field: "teacher" },
      { type: "room", field: "room" },
      { type: "class", field: "classId" },
    ].forEach(({ type, field }) => {
      const groups = {};
      slotLessons.forEach((lesson) => {
        (groups[lesson[field]] ??= []).push(lesson);
      });
      Object.entries(groups).forEach(([value, group]) => {
        if (group.length > 1)
          conflicts.push({
            id: `${type}-${value}-${key}`,
            type,
            value,
            day,
            periodId,
            lessons: group,
          });
      });
    });
  });

  return conflicts;
};

export function RoutineProvider({ children }) {
  const { toast } = useToast();

  const [lessons, setLessons] = useState(seedLessons);
  const [templates, setTemplates] = useState(seedTemplates);
  const [templateId, setTemplateId] = useState(seedTemplates[0].id);
  const [absences, setAbsences] = useState(seedAbsences);

  const [lens, setLens] = useState("class");
  const [classId, setClassId] = useState(classes[0].id);
  const [teacherName, setTeacherName] = useState(teachers[0]);
  const [roomName, setRoomName] = useState(rooms[0]);

  const [dragging, setDragging] = useState(null);
  const [moving, setMoving] = useState(false);
  const [focusedSlot, setFocusedSlot] = useState(null);

  const [substituteMode, setSubstituteMode] = useState(false);
  const [coverFor, setCoverFor] = useState(null);

  const [bellOpen, setBellOpen] = useState(false);
  const [absenceOpen, setAbsenceOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);

  const [workloadTarget, setWorkloadTarget] = useState(WORKLOAD_TARGET);

  const bellFormRef = useRef(null);
  const absenceFormRef = useRef(null);

  /* ---------------- Template ---------------- */
  const template = useMemo(
    () => templates.find((t) => t.id === templateId) ?? templates[0],
    [templates, templateId],
  );

  const periods = template.periods;
  const teachingPeriods = useMemo(
    () => periods.filter((p) => !p.isBreak),
    [periods],
  );
  const periodIds = useMemo(
    () => new Set(teachingPeriods.map((p) => p.id)),
    [teachingPeriods],
  );

  /* Lessons whose slot doesn't exist in the chosen template — surfaced
     rather than silently dropped from the grid. */
  const offTemplate = useMemo(
    () => lessons.filter((l) => !periodIds.has(l.periodId)),
    [lessons, periodIds],
  );

  /* ---------------- Conflicts ---------------- */
  const conflicts = useMemo(() => findConflicts(lessons), [lessons]);

  const conflictSlots = useMemo(() => {
    const map = {};
    conflicts.forEach((conflict) => {
      const key = slotKey(conflict.day, conflict.periodId);
      (map[key] ??= []).push(conflict);
    });
    return map;
  }, [conflicts]);

  const lessonConflicts = useMemo(() => {
    const map = {};
    conflicts.forEach((conflict) => {
      conflict.lessons.forEach((lesson) => {
        (map[lesson.id] ??= []).push(conflict);
      });
    });
    return map;
  }, [conflicts]);

  /* ---------------- The lens ---------------- */
  const selectedKey =
    lens === "class" ? classId
    : lens === "teacher" ? teacherName
    : roomName;

  const lensLessons = useMemo(() => {
    if (lens === "class") return lessons.filter((l) => l.classId === classId);
    if (lens === "teacher")
      return lessons.filter((l) => l.teacher === teacherName);
    return lessons.filter((l) => l.room === roomName);
  }, [lessons, lens, classId, teacherName, roomName]);

  /* grid[day][periodId] = lesson — one lookup per cell instead of a scan. */
  const grid = useMemo(() => {
    const map = {};
    DAYS.forEach((day) => {
      map[day] = {};
    });
    lensLessons.forEach((lesson) => {
      if (map[lesson.day]) map[lesson.day][lesson.periodId] = lesson;
    });
    return map;
  }, [lensLessons]);

  /* ---------------- Drag & drop ---------------- */
  const startDrag = useCallback((lesson) => setDragging(lesson), []);
  const endDrag = useCallback(() => setDragging(null), []);

  /* Answers "what breaks if this lands here?" before the drop happens. */
  const previewDrop = useCallback(
    (lesson, day, periodId) => {
      if (!lesson) return { ok: true, reason: "" };
      if (lesson.day === day && lesson.periodId === periodId)
        return { ok: true, reason: "" };

      const others = lessons.filter(
        (l) => l.id !== lesson.id && l.day === day && l.periodId === periodId,
      );

      const teacherClash = others.find((l) => l.teacher === lesson.teacher);
      if (teacherClash)
        return {
          ok: false,
          reason: `${lesson.teacher} already teaches ${teacherClash.classId} here`,
        };

      const roomClash = others.find((l) => l.room === lesson.room);
      if (roomClash)
        return {
          ok: false,
          reason: `${lesson.room} is taken by ${roomClash.classId} here`,
        };

      const classClash = others.find((l) => l.classId === lesson.classId);
      if (classClash)
        return {
          ok: false,
          reason: `${lesson.classId} already has ${classClash.code} here`,
        };

      return { ok: true, reason: "" };
    },
    [lessons],
  );

  const moveLesson = useCallback(
    (lesson, day, periodId) => {
      const check = previewDrop(lesson, day, periodId);
      if (!check.ok) {
        toast.error(check.reason);
        setDragging(null);
        return false;
      }

      setMoving(true);
      setTimeout(() => {
        setLessons((prev) =>
          prev.map((l) => (l.id === lesson.id ? { ...l, day, periodId } : l)),
        );
        setMoving(false);
        toast.success(`${lesson.code} moved to ${day}, ${periodId.toUpperCase()}`);
      }, SAVE_DELAY);

      setDragging(null);
      return true;
    },
    [previewDrop, toast],
  );

  /* ---------------- Availability & substitutes ---------------- */
  const freeTeachers = useCallback(
    (day, periodId, excludeTeacher) => {
      const busy = new Set(
        lessons
          .filter((l) => l.day === day && l.periodId === periodId)
          .map((l) => l.teacher),
      );
      const absentToday = new Set(
        absences.filter((a) => a.day === day).map((a) => a.teacher),
      );
      return teachers.filter(
        (name) =>
          name !== excludeTeacher && !busy.has(name) && !absentToday.has(name),
      );
    },
    [lessons, absences],
  );

  const absentTeachers = useMemo(
    () => new Set(absences.map((a) => a.teacher)),
    [absences],
  );

  /* Periods that lose their teacher on the day they are out. */
  const affectedLessons = useMemo(() => {
    const map = {};
    absences.forEach((absence) => {
      lessons
        .filter((l) => l.teacher === absence.teacher && l.day === absence.day)
        .forEach((lesson) => {
          map[lesson.id] = absence;
        });
    });
    return map;
  }, [absences, lessons]);

  const addAbsence = useCallback(
    (absence) => {
      setAbsences((prev) => [
        { ...absence, id: `ABS-${Date.now().toString().slice(-5)}` },
        ...prev,
      ]);
      setSubstituteMode(true);
      toast.info(
        `${absence.teacher} marked absent on ${absence.day} — affected periods are highlighted`,
      );
    },
    [toast],
  );

  const clearAbsence = useCallback(
    (id) => {
      setAbsences((prev) => prev.filter((a) => a.id !== id));
      toast.success("Absence cleared");
    },
    [toast],
  );

  const assignCover = useCallback(
    (lessonId, substitute) => {
      setLessons((prev) =>
        prev.map((l) =>
          l.id === lessonId ?
            { ...l, teacher: substitute, coveredBy: substitute }
          : l,
        ),
      );
      setCoverFor(null);
      toast.success(`${substitute} is covering that period`);
    },
    [toast],
  );

  /* ---------------- Workload ---------------- */
  const workload = useMemo(() => {
    const counts = Object.fromEntries(teachers.map((name) => [name, 0]));
    lessons.forEach((lesson) => {
      if (counts[lesson.teacher] !== undefined) counts[lesson.teacher] += 1;
    });
    return teachers
      .map((name) => {
        const periodsTaught = counts[name];
        const delta = periodsTaught - workloadTarget;
        return {
          name,
          periods: periodsTaught,
          delta,
          state:
            delta > WORKLOAD_TOLERANCE ? "over"
            : delta < -WORKLOAD_TOLERANCE ? "under"
            : "ok",
        };
      })
      .sort((a, b) => b.periods - a.periods);
  }, [lessons, workloadTarget]);

  /* ---------------- Bell templates ---------------- */
  const saveTemplate = useCallback(
    (next) => {
      setTemplates((prev) => {
        const exists = prev.some((t) => t.id === next.id);
        return exists ?
            prev.map((t) => (t.id === next.id ? next : t))
          : [...prev, next];
      });
      setTemplateId(next.id);
      toast.success(`Bell schedule "${next.name}" saved`);
    },
    [toast],
  );

  /* ---------------- Summary ---------------- */
  const summary = useMemo(
    () => ({
      lessons: lessons.length,
      conflicts: conflicts.length,
      absences: absences.length,
      periodsPerDay: teachingPeriods.length,
    }),
    [lessons, conflicts, absences, teachingPeriods],
  );

  const jumpToSlot = useCallback((conflict) => {
    // Land the user on the lens that actually shows the clash.
    if (conflict.type === "teacher") {
      setLens("teacher");
      setTeacherName(conflict.value);
    } else if (conflict.type === "room") {
      setLens("room");
      setRoomName(conflict.value);
    } else {
      setLens("class");
      setClassId(conflict.value);
    }
    setFocusedSlot(slotKey(conflict.day, conflict.periodId));
  }, []);

  const value = useMemo(
    () => ({
      /* reference */
      days: DAYS,
      classes,
      teachers,
      rooms,
      templates,
      template,
      templateId,
      setTemplateId,
      periods,
      teachingPeriods,
      offTemplate,

      /* lens */
      lens,
      setLens,
      classId,
      setClassId,
      teacherName,
      setTeacherName,
      roomName,
      setRoomName,
      selectedKey,
      grid,
      lensLessons,

      /* conflicts */
      conflicts,
      conflictSlots,
      lessonConflicts,
      focusedSlot,
      setFocusedSlot,
      jumpToSlot,

      /* drag */
      dragging,
      startDrag,
      endDrag,
      previewDrop,
      moveLesson,
      moving,

      /* substitutes */
      substituteMode,
      setSubstituteMode,
      absences,
      absentTeachers,
      affectedLessons,
      addAbsence,
      clearAbsence,
      freeTeachers,
      coverFor,
      setCoverFor,
      assignCover,

      /* workload */
      workload,
      workloadTarget,
      setWorkloadTarget,
      tolerance: WORKLOAD_TOLERANCE,

      /* modals */
      bellOpen,
      setBellOpen,
      bellFormRef,
      saveTemplate,
      absenceOpen,
      setAbsenceOpen,
      absenceFormRef,
      printOpen,
      setPrintOpen,

      summary,
    }),
    [
      templates,
      template,
      templateId,
      periods,
      teachingPeriods,
      offTemplate,
      lens,
      classId,
      teacherName,
      roomName,
      selectedKey,
      grid,
      lensLessons,
      conflicts,
      conflictSlots,
      lessonConflicts,
      focusedSlot,
      jumpToSlot,
      dragging,
      startDrag,
      endDrag,
      previewDrop,
      moveLesson,
      moving,
      substituteMode,
      absences,
      absentTeachers,
      affectedLessons,
      addAbsence,
      clearAbsence,
      freeTeachers,
      coverFor,
      assignCover,
      workload,
      workloadTarget,
      bellOpen,
      saveTemplate,
      absenceOpen,
      printOpen,
      summary,
    ],
  );

  return (
    <RoutineContext.Provider value={value}>{children}</RoutineContext.Provider>
  );
}

export function useRoutine() {
  const ctx = useContext(RoutineContext);
  if (!ctx) throw new Error("useRoutine must be used inside <RoutineProvider>");
  return ctx;
}
