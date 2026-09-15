import {
  createContext,
  useContext,
  useDebugValue,
  useEffect,
  useState,
} from "react";
// import studentData from "../../../database/data.json";
import { useToast } from "@/components/ui";
import { shake } from "@/animation/shake";
import { useCallback, useMemo, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import {
  handleCreateStudent,
  handleDeleteStudent,
  handleFetchAllStudentData,
} from "@/services/studentService";
import {
  persistAvatar as persistAvatarTo,
  withStoredAvatars as withStoredAvatarsFrom,
} from "@/utils/avatarStorage";
import { fileToThumbnailDataUrl } from "@/utils/image";

const StudentContext = createContext(null);

const AVATAR_STORAGE_KEY = "studentAvatars";

const withStoredAvatars = (list) =>
  withStoredAvatarsFrom(AVATAR_STORAGE_KEY, list);

const persistAvatar = (id, dataUrl) =>
  persistAvatarTo(AVATAR_STORAGE_KEY, id, dataUrl);

export function useAvatarUpload({ onChange, initialSrc = null } = {}) {
  const [preview, setPreview] = useState(initialSrc);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      setPreview((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return url;
      });
      onChange?.(file);
    },
    [onChange],
  );

  const handleInputChange = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const triggerPick = () => inputRef.current?.click();

  return {
    preview,
    isDragging,
    inputRef,
    handleInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemove,
    triggerPick,
  };
}

export function StudentProvider({ children }) {
  const [studentData, setStudentData] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [students, setStudents] = useState(() =>
    withStoredAvatars(studentData),
  );
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDetailForm, setIsDetailForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [openStudent, setOpenStudent] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [studentImages, setStudentImages] = useState({});
  const [query, setQuery] = useState("");

  const gridRef = useRef(null);
  const tabElRef = useRef(null);
  const tabsRef = useRef(null);
  const tabIndicatorRef = useRef(null);
  const ringRef = useRef(null);
  const valueElRef = useRef(null);
  const formRef = useRef(null);

  const regEmptyForm = {
    name: "",
    gender: "",
    id: "",
    std_class: "",
    phone: "",
    remark: "",
  };
  const detailEmptyForm = {
    email: "",
    dob: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchStudent() {
      try {
        const data = await handleFetchAllStudentData();
        if (!cancelled) setStudentData(data?.students ?? []);
      } catch (error) {
        // A dead API used to reject silently here, leaving the page blank
        // with no clue why. Surface it instead.
        if (cancelled) return;
        setStudentData([]);
        console.error("Failed to load students", error);
        toast.error("Couldn't load students — check the API is running.");
      }
    }

    fetchStudent();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  /* `students` is seeded from `studentData`, which starts empty and only
     fills once the fetch resolves — a useState initialiser runs once, so
     without this the list stayed empty no matter what arrived. */
  useEffect(() => {
    setStudents(withStoredAvatars(studentData));
  }, [studentData]);
  const scoreMatch = (studentData, query) => {
    const q = query.toLowerCase();
    const name = studentData.name.toLowerCase();

    if (name === q) return 100;
    if (name.startsWith(q)) return 80;
    if (name.includes(q)) return 60;
    if (studentData.name.toLowerCase().includes(q)) return 40;
    return 0;
  };

  const nameResult = useMemo(() => {
    if (!query.trim()) return students;
    return students
      .map((std) => ({ std, score: scoreMatch(std, query) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.std);
  }, [students, query]);

  const [formData, setFormData] = useState(regEmptyForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    value.trim() !== "" ?
      setErrors((prev) => ({ ...prev, [name]: false }))
    : null;
  };

  const handleSave = async () => {
    await saveStudent(formData, formRef).catch((error) =>
      console.error("Unexpected error saving student", error),
    );
  };

  const toggleSelect = (index) => {
    setSelectedIds((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };
  const selectAll = (checked) => {
    setSelectedIds(checked ? students.map((s) => s.id) : []);
  };
  const isAllSelected =
    students.length > 0 && selectedIds.length == students.length;

  const requestDeleteSingle = (index) => {
    setPendingDeleteIds(index);
    setConfirmOpen(true);
  };
  const requestDeleteSelected = () => {
    if (selectedIds.length == 0) {
      toast.info("Select student to delete first");
      return;
    }
    setPendingDeleteIds(null);
    setConfirmOpen(true);
  };
  const confirmDelete = async () => {
    if (pendingDeleteIds !== null) {
      setStudents((prev) => prev.filter((s) => s.id !== pendingDeleteIds));
      setSelectedIds((prev) => prev.filter((id) => id !== pendingDeleteIds));
      toast.success("Student deleted");
    } else {
      setStudents((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
      setSelectedIds([]);
      toast.success("Students deleted");
    }
    const res = await handleDeleteStudent(pendingDeleteIds);
    setConfirmOpen(false);
    setPendingDeleteIds(null);
    navigate("/allstudents");
  };
  const cancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteIds(null);
  };
  const openAddStudent = async () => {
    setIsDetailForm(true);
    setFormData({ ...regEmptyForm, ...detailEmptyForm, avatar: null });
    setModalOpen(true);
  };
  const openDetail = (id) => {
    setOpenStudent(students.find((s) => s.id === id));
    setDetailOpen(true);
  };
  const closeDetail = () => {
    setDetailOpen(false);
    setOpenStudent(null);
  };
  const updateStudentAvatar = (id, dataUrl) => {
    persistAvatar(id, dataUrl);
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, avatar: dataUrl } : s)),
    );
    setOpenStudent((prev) =>
      prev && prev.id === id ? { ...prev, avatar: dataUrl } : prev,
    );
  };

  const handleAvatarChange = async (file) => {
    if (!openStudent) return;
    if (!file) {
      updateStudentAvatar(openStudent.id, null);
      return;
    }
    try {
      updateStudentAvatar(openStudent.id, await fileToThumbnailDataUrl(file));
    } catch (error) {
      console.error("Could not read avatar", error);
      toast.error("Couldn't read that image.");
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, avatar: null }));
      return;
    }
    try {
      const avatar = await fileToThumbnailDataUrl(file);
      setFormData((prev) => ({ ...prev, avatar }));
    } catch (error) {
      console.error("Could not read avatar", error);
      toast.error("Couldn't read that image.");
    }
  };
  const openEdit = (id) => {
    // `students` is the list to read: it carries the locally cached avatar and
    // any student added this session. `studentData` is the raw server response,
    // which has neither — spreading a miss from it silently blanks the form.
    const student = students.find((s) => s.id === id);
    if (!student) {
      toast.error("Couldn't find that student.");
      return;
    }
    setErrors({});
    setEditingId(id);
    setModalOpen(true);
    setFormData({ ...regEmptyForm, ...detailEmptyForm, ...student });
  };
  const closeModal = () => {
    setEditingId(null);
    setModalOpen(false);
  };

  const saveStudent = async (data, ref) => {
    const requiredFields =
      isDetailForm ?
        [
          "name",
          "gender",
          "id",
          "std_class",
          "phone",
          "email",
          "dob",
          "address",
          "guardianName",
          "guardianPhone",
        ]
      : ["name", "gender", "id", "std_class", "phone"];
    const invalidFields = requiredFields.filter(
      (key) => !data[key] || String(data[key]).trim() === "",
    );
    if (invalidFields.length > 0) {
      setErrors((prev) => ({
        ...prev,
        ...Object.fromEntries(invalidFields.map((key) => [key, true])),
      }));
      if (ref?.current) shake(ref.current);
      toast.info("Please fill in all required fields");
      return;
    }
    const finalId =
      editingId !== null ? editingId : data.id || Date.now().toString();

    // Editing has no update endpoint wired up yet; posting here would try to
    // re-create a row that already owns this primary key.
    if (editingId === null) {
      try {
        const res = await handleCreateStudent({ ...data });
      } catch (error) {
        console.error("Failed to create student", error);
        toast.error(
          error?.response?.data?.message ??
            "Couldn't save student — check the API is running.",
        );
        return;
      }
    }

    // Avatars are only cached in this browser, so a failed write is worth a
    // warning but not the student record.
    if (data.avatar?.startsWith("data:")) {
      persistAvatar(finalId, data.avatar);
    }

    setStudents((prev) =>
      editingId !== null ?
        prev.map((s) => (s.id === editingId ? { ...s, ...data } : s))
      : [...prev, { ...data, id: finalId }],
    );

    toast.success(editingId !== null ? "Saved" : "Added");
    closeModal();
  };

  const renderCalendar = useCallback(() => {
    const grid = gridRef.current;
    const daysInMonth = 30;
    const startOffset = 3;
    const statuses = [];
    for (let i = 0; i < daysInMonth; i++) {
      const r = Math.random();
      statuses.push(
        r > 0.9 ? "absent"
        : r > 0.8 ? "late"
        : "present",
      );
    }
  }, []);

  const moveIndicator = useCallback((tabEl, animate = true) => {
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

  const animateRing = useCallback((pct) => {
    const ring = ringRef.current;
    const valueEl = valueElRef.current;

    if (!ring || !valueEl) return null;

    const circumference = 2 * Math.PI * 34;
    const offset = circumference - (pct / 100) * circumference;

    gsap.to(ring, {
      strokeDashoffset: offset,
      duration: 1.1,
      ease: "power2.out",
      delay: 0.3,
    });
    gsap.to(
      { val: 0 },
      {
        val: pct,
        duration: 1.1,
        delay: 0.3,
        ease: "power2.out",
        onUpdate: function () {
          valueEl.textContent =
            Math.round(this.fontVariantLigatures()[0].val) + "%";
        },
      },
    );
  }, []);

  const value = useMemo(
    () => ({
      gridRef,
      tabElRef,
      tabsRef,
      tabIndicatorRef,
      ringRef,
      valueElRef,
      formRef,
      renderCalendar,
      moveIndicator,
      animateRing,
      setIsDetailForm,
      formData,
      setFormData,
      students,
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
      editingStudent: editingId !== null,

      openEdit,
      closeModal,
      saveStudent,
      openAddStudent,
      openDetail,
      closeDetail,
      openStudent,
      detailOpen,
      updateStudentAvatar,
      handleAvatarChange,
      handleAvatarUpload,

      handleChange,
      handleSave,
      errors,
      studentImages,
      setStudentImages,

      query,
      setQuery,
      nameResult,
    }),
    [
      gridRef,
      tabElRef,
      tabsRef,
      tabIndicatorRef,
      ringRef,
      valueElRef,
      formRef,
      renderCalendar,
      moveIndicator,
      animateRing,
      setIsDetailForm,
      formData,
      setFormData,
      students,
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
      detailOpen,

      openEdit,
      closeModal,
      saveStudent,
      openAddStudent,
      openDetail,
      closeDetail,
      openStudent,
      updateStudentAvatar,
      handleAvatarChange,
      handleAvatarUpload,

      handleChange,
      handleSave,
      errors,

      studentImages,
      setStudentImages,

      query,
      setQuery,
      nameResult,
    ],
  );

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}
export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used inside <StudentProvider>");
  return ctx;
}
