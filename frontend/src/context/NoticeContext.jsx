import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  CATEGORIES,
  CLASSES,
  PRIORITIES,
  ROLES,
  audienceAll,
  emptyComposer,
  people,
  seedNotices,
  seedTemplates,
} from "@/assets/data/noticeSeed";
import { useToast } from "@/components/ui";

const NoticeContext = createContext(null);

const SAVE_DELAY = 700;
const peopleById = Object.fromEntries(people.map((p) => [p.id, p]));

/* Layered targeting: each scope narrows the one above it, so the counter
   always reflects the deepest layer the writer has set. */
const resolveAudience = (audience) => {
  if (!audience || audience.scope === "all") return people;
  if (audience.scope === "role")
    return people.filter((p) => audience.roles.includes(p.role));
  if (audience.scope === "class")
    return people.filter(
      (p) =>
        audience.classes.includes(p.classId) &&
        (audience.roles.length === 0 || audience.roles.includes(p.role)),
    );
  return people.filter((p) => audience.individuals.includes(p.id));
};

const describeAudience = (audience) => {
  if (!audience || audience.scope === "all") return "Everyone";
  if (audience.scope === "role") {
    const labels = audience.roles.map(
      (r) => ROLES.find((role) => role.value === r)?.label ?? r,
    );
    return labels.length ? labels.join(", ") : "No role picked";
  }
  if (audience.scope === "class")
    return audience.classes.length ?
        `Classes ${audience.classes.join(", ")}`
      : "No class picked";
  return `${audience.individuals.length} named ${
    audience.individuals.length === 1 ? "person" : "people"
  }`;
};

const todayIso = () => new Date().toISOString().slice(0, 10);

/* The single definition of "still on the board": published, and not past
   its expiry. The board, the archive and the summary all read this one. */
const isLive = (notice) =>
  notice.status === "published" &&
  !(notice.expiresAt && notice.expiresAt < todayIso());

const fillPlaceholders = (text, values) =>
  text.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    values[key]?.trim() ? values[key].trim() : match,
  );

export function NoticeProvider({ children }) {
  const { toast } = useToast();

  const [notices, setNotices] = useState(seedNotices);
  const [templates, setTemplates] = useState(seedTemplates);
  const [draft, setDraft] = useState(emptyComposer);
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);

  const [activeTab, setActiveTab] = useState("compose");
  const [category, setCategory] = useState("");
  const [archiveQuery, setArchiveQuery] = useState("");
  const [archiveFrom, setArchiveFrom] = useState("");
  const [archiveTo, setArchiveTo] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [readFilter, setReadFilter] = useState("unread");

  const [templateModal, setTemplateModal] = useState(null);
  const [templateValues, setTemplateValues] = useState({});
  const [templateTouched, setTemplateTouched] = useState(false);

  const composerRef = useRef(null);
  const templateFormRef = useRef(null);

  /* ---------------- Composer ---------------- */
  const update = useCallback((patch) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const setAudience = useCallback((patch) => {
    setDraft((prev) => ({ ...prev, audience: { ...prev.audience, ...patch } }));
  }, []);

  const reach = useMemo(() => resolveAudience(draft.audience), [draft.audience]);

  const reachBreakdown = useMemo(() => {
    const counts = { student: 0, teacher: 0, guardian: 0 };
    reach.forEach((p) => {
      counts[p.role] += 1;
    });
    return counts;
  }, [reach]);

  const errors = useMemo(() => {
    const next = {};
    if (draft.title.trim().length < 5)
      next.title = "Give the notice a title of at least 5 characters.";
    if (draft.body.trim().length < 20)
      next.body = "Write at least 20 characters so the notice says something.";
    if (reach.length === 0)
      next.audience = "This reaches nobody — widen the audience.";

    if (draft.scheduleMode === "later") {
      if (!draft.publishAt) next.publishAt = "Pick when this should go out.";
      else if (new Date(draft.publishAt) <= new Date())
        next.publishAt = "The send time has already passed.";
    }
    if (draft.expiresAt) {
      const start =
        draft.scheduleMode === "later" && draft.publishAt ?
          new Date(draft.publishAt)
        : new Date();
      if (new Date(`${draft.expiresAt}T23:59:59`) <= start)
        next.expiresAt = "Expiry must fall after the notice goes out.";
    }
    return next;
  }, [draft, reach]);

  const isValid = Object.keys(errors).length === 0;
  const fieldError = useCallback(
    (key) => (touched ? (errors[key] ?? "") : ""),
    [touched, errors],
  );

  const resetComposer = useCallback(() => {
    setDraft(emptyComposer);
    setTouched(false);
  }, []);

  const send = useCallback(() => {
    setTouched(true);
    if (!isValid) return false;

    setSending(true);
    setTimeout(() => {
      const scheduled = draft.scheduleMode === "later";
      const notice = {
        id: `N-${Date.now().toString().slice(-5)}`,
        title: draft.title.trim(),
        body: draft.body.trim(),
        category: draft.category,
        priority: draft.priority,
        status: scheduled ? "scheduled" : "published",
        audience: draft.audience,
        publishedAt: scheduled ? null : new Date().toISOString(),
        publishAt: scheduled ? new Date(draft.publishAt).toISOString() : null,
        expiresAt: draft.expiresAt || null,
        author: "Priscilla Lily",
        readBy: [],
      };

      setNotices((prev) => [notice, ...prev]);
      setSending(false);
      resetComposer();
      setActiveTab("board");
      toast.success(
        scheduled ?
          `Scheduled for ${new Date(draft.publishAt).toLocaleString()} — ${reach.length} recipients`
        : `Published to ${reach.length} people`,
      );
    }, SAVE_DELAY);

    return true;
  }, [draft, isValid, reach, resetComposer, toast]);

  /* ---------------- Derived notices ---------------- */
  const decorated = useMemo(
    () =>
      notices.map((notice) => {
        const recipients = resolveAudience(notice.audience);
        const readCount = notice.readBy.length;
        return {
          ...notice,
          recipients: recipients.length,
          readCount,
          readPercent:
            recipients.length ?
              Math.round((readCount / recipients.length) * 1000) / 10
            : 0,
          audienceLabel: describeAudience(notice.audience),
          stamp: notice.publishedAt ?? notice.publishAt,
        };
      }),
    [notices],
  );

  /* Urgent notices pin above everything; the rest run newest first.
     A notice past its expiry leaves the board even if nobody archived it
     by hand — otherwise it would sit in the feed and the archive at once. */
  const board = useMemo(() => {
    const live = decorated.filter(isLive);
    const filtered = category ? live.filter((n) => n.category === category) : live;
    const byDate = (a, b) => new Date(b.stamp) - new Date(a.stamp);
    return {
      pinned: filtered.filter((n) => n.priority === "urgent").sort(byDate),
      rest: filtered.filter((n) => n.priority !== "urgent").sort(byDate),
      scheduled: decorated
        .filter((n) => n.status === "scheduled")
        .sort((a, b) => new Date(a.stamp) - new Date(b.stamp)),
    };
  }, [decorated, category]);

  /* Anything published but past its expiry belongs in the archive. */
  const archive = useMemo(() => {
    const rows = decorated.filter((n) => n.status === "archived" || !isLive(n) && n.status !== "scheduled");

    const q = archiveQuery.trim().toLowerCase();
    return rows
      .filter((n) => {
        if (q) {
          const haystack =
            `${n.title} ${n.body} ${n.category} ${n.author}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        const stamp = (n.stamp ?? "").slice(0, 10);
        if (archiveFrom && stamp < archiveFrom) return false;
        if (archiveTo && stamp > archiveTo) return false;
        return true;
      })
      .sort((a, b) => new Date(b.stamp) - new Date(a.stamp));
  }, [decorated, archiveQuery, archiveFrom, archiveTo]);

  /* ---------------- Read tracking ---------------- */
  const readRoster = useMemo(() => {
    const notice = decorated.find((n) => n.id === expandedId);
    if (!notice) return null;
    const recipients = resolveAudience(notice.audience);
    const readSet = new Set(notice.readBy);
    const read = [];
    const unread = [];
    recipients.forEach((person) => {
      (readSet.has(person.id) ? read : unread).push(person);
    });
    return { notice, read, unread };
  }, [decorated, expandedId]);

  const nudgeUnread = useCallback(
    (notice) => {
      const unread = notice.recipients - notice.readCount;
      toast.success(
        `Reminder sent to ${unread} ${unread === 1 ? "person" : "people"} who haven't opened it`,
      );
    },
    [toast],
  );

  const archiveNotice = useCallback(
    (id) => {
      setNotices((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "archived" } : n)),
      );
      toast.info("Notice moved to the archive");
    },
    [toast],
  );

  /* ---------------- Templates ---------------- */
  const openTemplate = useCallback((template) => {
    setTemplateModal(template);
    setTemplateValues(
      Object.fromEntries(template.fields.map((f) => [f.key, ""])),
    );
    setTemplateTouched(false);
  }, []);

  const templatePreview = useMemo(() => {
    if (!templateModal) return null;
    return {
      title: fillPlaceholders(templateModal.title, templateValues),
      body: fillPlaceholders(templateModal.body, templateValues),
    };
  }, [templateModal, templateValues]);

  const templateMissing = useMemo(() => {
    if (!templateModal) return [];
    return templateModal.fields.filter(
      (f) => !templateValues[f.key]?.trim(),
    );
  }, [templateModal, templateValues]);

  const applyTemplate = useCallback(() => {
    setTemplateTouched(true);
    if (templateMissing.length > 0) return false;

    setDraft((prev) => ({
      ...prev,
      title: templatePreview.title,
      body: templatePreview.body,
      category: templateModal.category,
      priority: templateModal.priority,
    }));
    setTemplateModal(null);
    setActiveTab("compose");
    setTouched(false);
    toast.success(`"${templateModal.name}" loaded into the composer`);
    return true;
  }, [templateMissing, templatePreview, templateModal, toast]);

  /* Saving the current draft back as a reusable template. */
  const saveAsTemplate = useCallback(
    (name) => {
      const template = {
        id: `TPL-${Date.now().toString().slice(-5)}`,
        name: name.trim(),
        category: draft.category,
        priority: draft.priority,
        title: draft.title.trim(),
        body: draft.body.trim(),
        fields: [],
      };
      setTemplates((prev) => [...prev, template]);
      toast.success(`Saved "${template.name}" as a template`);
    },
    [draft, toast],
  );

  /* ---------------- Summary ---------------- */
  const summary = useMemo(() => {
    const live = decorated.filter(isLive);
    const avg =
      live.length ?
        Math.round(
          (live.reduce((sum, n) => sum + n.readPercent, 0) / live.length) * 10,
        ) / 10
      : 0;
    return {
      live: live.length,
      scheduled: decorated.filter((n) => n.status === "scheduled").length,
      avgRead: avg,
      archived: archive.length,
    };
  }, [decorated, archive]);

  const value = useMemo(
    () => ({
      /* reference */
      people,
      peopleById,
      roles: ROLES,
      classes: CLASSES,
      categories: CATEGORIES,
      priorities: PRIORITIES,

      /* composer */
      draft,
      update,
      setAudience,
      reach,
      reachBreakdown,
      errors,
      isValid,
      fieldError,
      touched,
      setTouched,
      sending,
      send,
      resetComposer,
      composerRef,
      audienceAll,

      /* board */
      board,
      category,
      setCategory,
      expandedId,
      setExpandedId,
      readRoster,
      readFilter,
      setReadFilter,
      nudgeUnread,
      archiveNotice,

      /* archive */
      archive,
      archiveQuery,
      setArchiveQuery,
      archiveFrom,
      setArchiveFrom,
      archiveTo,
      setArchiveTo,

      /* templates */
      templates,
      templateModal,
      setTemplateModal,
      templateValues,
      setTemplateValues,
      templatePreview,
      templateMissing,
      templateTouched,
      openTemplate,
      applyTemplate,
      saveAsTemplate,
      templateFormRef,

      /* shell */
      activeTab,
      setActiveTab,
      summary,
    }),
    [
      draft,
      update,
      setAudience,
      reach,
      reachBreakdown,
      errors,
      isValid,
      fieldError,
      touched,
      sending,
      send,
      resetComposer,
      board,
      category,
      expandedId,
      readRoster,
      readFilter,
      nudgeUnread,
      archiveNotice,
      archive,
      archiveQuery,
      archiveFrom,
      archiveTo,
      templates,
      templateModal,
      templateValues,
      templatePreview,
      templateMissing,
      templateTouched,
      openTemplate,
      applyTemplate,
      saveAsTemplate,
      activeTab,
      summary,
    ],
  );

  return (
    <NoticeContext.Provider value={value}>{children}</NoticeContext.Provider>
  );
}

export function useNotices() {
  const ctx = useContext(NoticeContext);
  if (!ctx) throw new Error("useNotices must be used inside <NoticeProvider>");
  return ctx;
}
