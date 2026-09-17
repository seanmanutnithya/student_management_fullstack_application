import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  PASS_TARGET,
  PERIOD_MINUTES,
  classes,
  seedSubjects,
  teachers,
} from "@/assets/data/subjectSeed";
import { useToast } from "@/components/ui";

const SubjectContext = createContext(null);

const SAVE_DELAY = 700;

/* Walks prerequisites backwards then forwards from one subject, so the chain
   shown is the whole line it sits on (Math I -> II -> III), not just its
   immediate parent. Guards against the cycles it is meant to expose. */
const buildChain = (subject, byId) => {
  const back = [];
  let cursor = subject;
  const seenBack = new Set([subject.id]);
  while (cursor?.prerequisites?.length) {
    const parentId = cursor.prerequisites[0];
    if (seenBack.has(parentId)) break; // cycle — stop unrolling
    const parent = byId[parentId];
    if (!parent) {
      back.unshift({ id: parentId, missing: true });
      break;
    }
    seenBack.add(parentId);
    back.unshift(parent);
    cursor = parent;
  }

  const forward = [];
  const seenForward = new Set([subject.id]);
  let next = Object.values(byId).find((s) =>
    s.prerequisites?.includes(subject.id),
  );
  while (next && !seenForward.has(next.id)) {
    seenForward.add(next.id);
    forward.push(next);
    next = Object.values(byId).find((s) => s.prerequisites?.includes(next.id));
  }

  return [...back, subject, ...forward];
};

/* Depth-first cycle hunt across the whole catalogue. */
const findCycles = (subjects, byId) => {
  const cycles = [];
  const state = {}; // 0 unvisited, 1 on stack, 2 done

  const visit = (id, stack) => {
    if (state[id] === 1) {
      const start = stack.indexOf(id);
      if (start !== -1) cycles.push([...stack.slice(start), id]);
      return;
    }
    if (state[id] === 2) return;
    state[id] = 1;
    (byId[id]?.prerequisites ?? []).forEach((parentId) => {
      if (byId[parentId]) visit(parentId, [...stack, id]);
    });
    state[id] = 2;
  };

  subjects.forEach((s) => visit(s.id, []));
  return cycles;
};

export function SubjectProvider({ children }) {
  const { toast } = useToast();

  const [subjects, setSubjects] = useState(seedSubjects);
  const [selectedId, setSelectedId] = useState(seedSubjects[0].id);
  const [activeTab, setActiveTab] = useState("overview");
  const [query, setQuery] = useState("");

  /* Grading draft lives here so switching tabs never loses a part-built
     scheme; it is keyed by subject. */
  const [gradingDraft, setGradingDraft] = useState({});
  const [savingGrading, setSavingGrading] = useState(false);
  const gradingFormRef = useRef(null);

  const [bulkOpen, setBulkOpen] = useState(false);
  const bulkFormRef = useRef(null);

  const byId = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s])),
    [subjects],
  );

  const classById = useMemo(
    () => Object.fromEntries(classes.map((c) => [c.id, c])),
    [],
  );

  /* ---------------- Catalogue ---------------- */
  const decorated = useMemo(
    () =>
      subjects.map((subject) => {
        const periods = subject.mapping.reduce(
          (sum, m) => sum + m.periodsPerWeek,
          0,
        );
        const rates = Object.values(subject.passRates);
        return {
          ...subject,
          classCount: subject.mapping.length,
          periodsPerWeek: periods,
          weeklyHours: Math.round((periods * PERIOD_MINUTES) / 6) / 10,
          averagePassRate:
            rates.length ?
              Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 10) /
              10
            : null,
          hasSubstitute: subject.substitutes.length > 0,
        };
      }),
    [subjects],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return decorated;
    return decorated.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q),
    );
  }, [decorated, query]);

  const groups = useMemo(
    () => ({
      core: filtered.filter((s) => s.type === "core"),
      elective: filtered.filter((s) => s.type === "elective"),
    }),
    [filtered],
  );

  const selected = useMemo(
    () => decorated.find((s) => s.id === selectedId) ?? decorated[0],
    [decorated, selectedId],
  );

  /* ---------------- Prerequisites ---------------- */
  const chain = useMemo(
    () => (selected ? buildChain(selected, byId) : []),
    [selected, byId],
  );

  const cycles = useMemo(() => findCycles(subjects, byId), [subjects, byId]);

  const selectedCycle = useMemo(
    () => cycles.find((c) => c.includes(selected?.id)) ?? null,
    [cycles, selected],
  );

  const brokenLinks = useMemo(
    () =>
      (selected?.prerequisites ?? []).filter((id) => !byId[id]),
    [selected, byId],
  );

  /* ---------------- Class mapping ---------------- */
  const mappingRows = useMemo(
    () =>
      (selected?.mapping ?? []).map((row) => ({
        ...row,
        grade: classById[row.classId]?.grade ?? "—",
        weeklyHours:
          Math.round((row.periodsPerWeek * PERIOD_MINUTES) / 6) / 10,
        passRate: selected?.passRates[row.classId] ?? null,
      })),
    [selected, classById],
  );

  /* ---------------- Difficulty ---------------- */
  const difficulty = useMemo(() => {
    if (!selected) return { rows: [], average: null, verdict: "" };
    const rows = mappingRows
      .filter((row) => row.passRate !== null)
      .sort((a, b) => a.passRate - b.passRate);
    const average = selected.averagePassRate;
    const below = rows.filter((r) => r.passRate < PASS_TARGET).length;

    let verdict = "Every class is clearing the target.";
    if (rows.length === 1 && below === 1)
      // One data point can't separate a hard subject from a struggling room.
      verdict = `Only one class takes this subject, so there is nothing to compare against — ${rows[0].passRate}% could be the subject or that room.`;
    else if (rows.length > 1 && below === rows.length)
      verdict = `Subject-wide: all ${rows.length} classes sit below the ${PASS_TARGET}% target, so the problem is the subject, not one room.`;
    else if (below > 0)
      verdict = `Class-specific: ${below} of ${rows.length} classes are below ${PASS_TARGET}% while the rest clear it.`;

    return { rows, average, below, verdict };
  }, [selected, mappingRows]);

  /* ---------------- Grading scheme ---------------- */
  const draft = gradingDraft[selected?.id] ?? selected?.grading ?? null;

  const gradingTotal = draft ?
    Number(draft.assignment) + Number(draft.midterm) + Number(draft.final)
  : 0;

  const gradingValid = gradingTotal === 100;

  const gradingDirty = useMemo(() => {
    if (!draft || !selected) return false;
    return (
      draft.assignment !== selected.grading.assignment ||
      draft.midterm !== selected.grading.midterm ||
      draft.final !== selected.grading.final
    );
  }, [draft, selected]);

  const setWeight = useCallback(
    (part, value) => {
      if (!selected) return;
      const clamped = Math.max(0, Math.min(100, Number(value) || 0));
      setGradingDraft((prev) => ({
        ...prev,
        [selected.id]: {
          ...(prev[selected.id] ?? selected.grading),
          [part]: clamped,
        },
      }));
    },
    [selected],
  );

  const resetGrading = useCallback(() => {
    if (!selected) return;
    setGradingDraft((prev) => {
      const next = { ...prev };
      delete next[selected.id];
      return next;
    });
  }, [selected]);

  const saveGrading = useCallback(() => {
    if (!selected || !gradingValid) return false;
    setSavingGrading(true);
    // No backend — the delay only exists so the loading state is visible.
    setTimeout(() => {
      setSubjects((prev) =>
        prev.map((s) => (s.id === selected.id ? { ...s, grading: draft } : s)),
      );
      resetGrading();
      setSavingGrading(false);
      toast.success(`Grading scheme saved for ${selected.code}`);
    }, SAVE_DELAY);
    return true;
  }, [selected, gradingValid, draft, resetGrading, toast]);

  /* ---------------- Syllabus ---------------- */
  const addSyllabusVersion = useCallback(
    (subjectId, entry) => {
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === subjectId ?
            { ...s, syllabus: [entry, ...s.syllabus] }
          : s,
        ),
      );
      toast.success(`${entry.version} uploaded — earlier versions kept`);
    },
    [toast],
  );

  /* ---------------- Bulk assign ---------------- */
  const bulkAssign = useCallback(
    ({ subjectId, classIds, teacher, periodsPerWeek }) => {
      setSubjects((prev) =>
        prev.map((subject) => {
          if (subject.id !== subjectId) return subject;
          const mapping = [...subject.mapping];
          classIds.forEach((classId) => {
            const index = mapping.findIndex((m) => m.classId === classId);
            if (index === -1) mapping.push({ classId, periodsPerWeek });
            else mapping[index] = { classId, periodsPerWeek };
          });
          return {
            ...subject,
            primaryTeacher: teacher,
            mapping: mapping.sort((a, b) => a.classId.localeCompare(b.classId)),
          };
        }),
      );

      const subject = byId[subjectId];
      toast.success(
        `${subject?.code ?? "Subject"} assigned to ${classIds.length} class(es) — ${teacher}, ${periodsPerWeek} period(s)/week`,
      );
    },
    [byId, toast],
  );

  /* ---------------- Summary ---------------- */
  const summary = useMemo(
    () => ({
      total: subjects.length,
      core: subjects.filter((s) => s.type === "core").length,
      elective: subjects.filter((s) => s.type === "elective").length,
      uncovered: subjects.filter((s) => s.substitutes.length === 0).length,
    }),
    [subjects],
  );

  const value = useMemo(
    () => ({
      /* reference */
      classes,
      teachers,
      passTarget: PASS_TARGET,
      periodMinutes: PERIOD_MINUTES,

      /* catalogue */
      subjects: decorated,
      groups,
      query,
      setQuery,
      selected,
      selectedId: selected?.id,
      setSelectedId,
      summary,

      /* detail */
      activeTab,
      setActiveTab,
      mappingRows,
      difficulty,

      /* prerequisites */
      chain,
      cycles,
      selectedCycle,
      brokenLinks,

      /* grading */
      draft,
      gradingTotal,
      gradingValid,
      gradingDirty,
      savingGrading,
      gradingFormRef,
      setWeight,
      resetGrading,
      saveGrading,

      /* syllabus */
      addSyllabusVersion,

      /* bulk assign */
      bulkOpen,
      setBulkOpen,
      bulkFormRef,
      bulkAssign,
    }),
    [
      decorated,
      groups,
      query,
      selected,
      summary,
      activeTab,
      mappingRows,
      difficulty,
      chain,
      cycles,
      selectedCycle,
      brokenLinks,
      draft,
      gradingTotal,
      gradingValid,
      gradingDirty,
      savingGrading,
      setWeight,
      resetGrading,
      saveGrading,
      addSyllabusVersion,
      bulkOpen,
      bulkAssign,
    ],
  );

  return (
    <SubjectContext.Provider value={value}>{children}</SubjectContext.Provider>
  );
}

export function useSubjects() {
  const ctx = useContext(SubjectContext);
  if (!ctx) throw new Error("useSubjects must be used inside <SubjectProvider>");
  return ctx;
}
