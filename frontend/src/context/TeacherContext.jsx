import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

import teacherData from "../../../database/teachers.json";
import { useToast } from "@/components/ui";
import { shake } from "@/animation/shake";
import { usePagination } from "@/hooks/usePagination";
import { EMAIL_RE, PHONE_RE } from "@/lib/validations";

const TeacherContext = createContext(null);

const AVATAR_STORAGE_KEY = "teacherAvatars";
const PAGE_SIZE = 10;
const SAVE_DELAY = 900;

const loadStoredAvatars = () => {
  try {
    return JSON.parse(localStorage.getItem(AVATAR_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

const withStoredAvatars = (list) => {
  const stored = loadStoredAvatars();
  return list.map((t) => (stored[t.id] ? { ...t, avatar: stored[t.id] } : t));
};

const persistAvatar = (id, dataUrl) => {
  const stored = loadStoredAvatars();
  if (dataUrl) stored[id] = dataUrl;
  else delete stored[id];
  localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(stored));
};

const emptyForm = {
  id: "",
  name: "",
  email: "",
  phone: "",
  subject: "",
  dept: "",
  exp: "",
  type: "Full-time",
  qualification: "",
  joinDate: "",
  address: "",
  avatar: null,
};

const isValidPhone = (value) => {
  const digits = String(value).replace(/[^\d]/g, "");
  return (
    PHONE_RE.test(String(value).trim()) &&
    digits.length >= 7 &&
    digits.length <= 15
  );
};

const validators = {
  name: (value) => String(value).trim().length >= 2,
  email: (value) => EMAIL_RE.test(String(value).trim()),
  phone: isValidPhone,
};

const errorMessages = {
  name: "Please enter the teacher's full name.",
  email: "Enter a valid email address.",
  phone: "Enter a valid phone number (7–15 digits).",
};

export function TeacherProvider({ children }) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState(() =>
    withStoredAvatars(teacherData),
  );
  const [selectedIds, setSelectedIds] = useState([]);
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [openTeacher, setOpenTeacher] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const formRef = useRef(null);
  const tabsRef = useRef(null);
  const tabIndicatorRef = useRef(null);
  const saveTimerRef = useRef(null);

  /* ---------------- Derived data ---------------- */
  const departments = useMemo(
    () => [...new Set(teachers.map((t) => t.dept).filter(Boolean))].sort(),
    [teachers],
  );

  const summary = useMemo(
    () => ({
      total: teachers.length,
      fullTime: teachers.filter((t) => t.type === "Full-time").length,
      partTime: teachers.filter((t) => t.type === "Part-time").length,
      departments: new Set(teachers.map((t) => t.dept).filter(Boolean)).size,
    }),
    [teachers],
  );

  const filteredTeachers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teachers.filter(
      (t) =>
        (!dept || t.dept === dept) &&
        (!q ||
          t.name.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)),
    );
  }, [teachers, query, dept]);

  const { page, pageCount, pageStart, pageEnd, setPage } = usePagination({
    total: filteredTeachers.length,
    pageSize: PAGE_SIZE,
  });

  const pagedTeachers = useMemo(
    () => filteredTeachers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredTeachers, page],
  );

  const isAllSelected =
    filteredTeachers.length > 0 &&
    filteredTeachers.every((t) => selectedIds.includes(t.id));

  /* ---------------- Selection ---------------- */
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = (checked) => {
    setSelectedIds(checked ? filteredTeachers.map((t) => t.id) : []);
  };

  /* ---------------- Delete ---------------- */
  const animateRowsOut = (ids, onDone) => {
    const rows = ids.flatMap((id) => [
      ...document.querySelectorAll(`[data-row-id="${id}"]`),
    ]);
    if (!rows.length) {
      onDone();
      return;
    }
    gsap.to(rows, {
      opacity: 0,
      x: -16,
      height: 0,
      paddingTop: 0,
      paddingBottom: 0,
      marginTop: 0,
      marginBottom: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onDone,
    });
  };

  const requestDeleteSingle = (id) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const requestDeleteSelected = () => {
    if (selectedIds.length === 0) {
      toast.info("Select teachers to delete first");
      return;
    }
    setPendingDeleteId(null);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    const ids = pendingDeleteId !== null ? [pendingDeleteId] : selectedIds;
    const isSingle = pendingDeleteId !== null;

    setConfirmOpen(false);
    setPendingDeleteId(null);

    if (openTeacher && ids.includes(openTeacher.id)) navigate("/allteachers");

    animateRowsOut(ids, () => {
      setTeachers((prev) => prev.filter((t) => !ids.includes(t.id)));
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
      toast.success(
        isSingle ? "Teacher removed" : `${ids.length} teacher(s) removed`,
      );
    });
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  /* ---------------- Add / Edit form ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] && validators[name]?.(value)) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!validators[name]) return;
    setErrors((prev) => ({ ...prev, [name]: !validators[name](value) }));
  };

  const fieldError = (name) => (errors[name] ? errorMessages[name] : "");

  const openAddTeacher = () => {
    setEditingId(null);
    setErrors({});
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (id) => {
    const teacher = teachers.find((t) => t.id === id);
    setEditingId(id);
    setErrors({});
    setFormData({ ...emptyForm, ...teacher });
    setModalOpen(true);
  };

  const closeModal = () => {
    clearTimeout(saveTimerRef.current);
    setSaving(false);
    setEditingId(null);
    setModalOpen(false);
  };

  const saveTeacher = () => {
    const invalid = Object.keys(validators).filter(
      (key) => !validators[key](formData[key] ?? ""),
    );
    if (invalid.length > 0) {
      setErrors((prev) => ({
        ...prev,
        ...Object.fromEntries(invalid.map((key) => [key, true])),
      }));
      if (formRef.current) shake(formRef.current);
      return;
    }

    setSaving(true);
    saveTimerRef.current = setTimeout(() => {
      const finalId =
        editingId ??
        (formData.id.trim() || `T-${Date.now().toString().slice(-5)}`);

      if (formData.avatar?.startsWith("data:"))
        persistAvatar(finalId, formData.avatar);

      const saved = { ...formData, id: finalId };
      setTeachers((prev) =>
        editingId !== null ?
          prev.map((t) => (t.id === editingId ? { ...t, ...saved } : t))
        : [...prev, saved],
      );
      setOpenTeacher((prev) =>
        prev && prev.id === finalId ? { ...prev, ...saved } : prev,
      );

      closeModal();
      toast.success("Teacher saved successfully");
    }, SAVE_DELAY);
  };

  /* ---------------- Avatar ---------------- */
  const updateTeacherAvatar = (id, dataUrl) => {
    persistAvatar(id, dataUrl);
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, avatar: dataUrl } : t)),
    );
    setOpenTeacher((prev) =>
      prev && prev.id === id ? { ...prev, avatar: dataUrl } : prev,
    );
  };

  // Detail header — swaps the photo straight away.
  const handleAvatarChange = (file) => {
    if (!openTeacher) return;
    if (!file) {
      updateTeacherAvatar(openTeacher.id, null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateTeacherAvatar(openTeacher.id, reader.result);
    reader.readAsDataURL(file);
  };

  // Add/Edit modal — staged on the form until "Save teacher".
  const handleAvatarUpload = (file) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, avatar: null }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setFormData((prev) => ({ ...prev, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  /* ---------------- Detail popup ---------------- */
  const openDetail = (id) => {
    setOpenTeacher(teachers.find((t) => t.id === id) ?? null);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setOpenTeacher(null);
  };

  const moveIndicator = useCallback((tabEl) => {
    const tabIndicator = tabIndicatorRef.current;
    if (!tabEl || !tabIndicator) return;
    const parentRect = tabEl.parentElement.getBoundingClientRect();
    const rect = tabEl.getBoundingClientRect();
    gsap.to(tabIndicator, {
      x: rect.left - parentRect.left,
      width: rect.width,
      duration: 0.32,
      ease: "power2.out",
    });
  }, []);

  const value = useMemo(
    () => ({
      teachers,
      filteredTeachers,
      pagedTeachers,
      departments,
      summary,

      query,
      setQuery,
      dept,
      setDept,

      page,
      pageCount,
      pageStart,
      pageEnd,
      setPage,

      selectedIds,
      toggleSelect,
      selectAll,
      isAllSelected,

      confirmOpen,
      requestDeleteSingle,
      requestDeleteSelected,
      confirmDelete,
      cancelDelete,

      modalOpen,
      editingId,
      editingTeacher: editingId !== null,
      formData,
      errors,
      fieldError,
      saving,
      formRef,
      handleChange,
      handleBlur,
      openAddTeacher,
      openEdit,
      closeModal,
      saveTeacher,

      handleAvatarUpload,
      handleAvatarChange,
      updateTeacherAvatar,

      openTeacher,
      detailOpen,
      openDetail,
      closeDetail,
      tabsRef,
      tabIndicatorRef,
      moveIndicator,
    }),
    [
      teachers,
      filteredTeachers,
      pagedTeachers,
      departments,
      summary,
      query,
      dept,
      page,
      pageCount,
      pageStart,
      pageEnd,
      selectedIds,
      isAllSelected,
      confirmOpen,
      modalOpen,
      editingId,
      formData,
      errors,
      saving,
      openTeacher,
      detailOpen,
      moveIndicator,
    ],
  );

  return (
    <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>
  );
}

export function useTeachers() {
  const ctx = useContext(TeacherContext);
  if (!ctx)
    throw new Error("useTeachers must be used inside <TeacherProvider>");
  return ctx;
}
