import { createContext, useContext, useEffect, useState } from "react";
// import studentData from "../../../database/data.json";
import { useToast } from "@/components/ui";
import { shake } from "@/animation/shake";
import { useCallback, useMemo, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import {
  handleCreateStudent,
  handleDeleteStudent,
  handleEditStudent,
  handleFetchAllStudentData,
  handleMultipleDelete,
} from "@/services/studentService";
import { handleUploadStudentImage } from "@/services/uploadService";
import { usePagination } from "@/hooks/usePagination";

const StudentContext = createContext(null);

const PAGE_SIZE = 20;

// The API reports which columns clashed; these turn that into copy a teacher
// can act on. Anything not listed falls back to the server's own message.
const DUPLICATE_FIELD_MESSAGES = {
  id: "This student ID is already registered.",
  phone: "This phone number is already registered.",
  email: "This email is already registered.",
};

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

  const [students, setStudents] = useState(studentData);
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
    setStudents(studentData);
  }, [studentData]);
  const scoreMatch = (studentData, query) => {
    const q = query.toLowerCase();
    const name = studentData.name.toLowerCase();
    const id = studentData.id.toLowerCase();

    if (name === q || id === q) return 100;
    if (name.startsWith(q) || id.startsWith(q)) return 80;
    if (name.includes(q) || id.includes(q)) return 60;
    if (
      studentData.name.toLowerCase().includes(q) ||
      studentData.id.toLowerCase().includes(q)
    )
      return 40;
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

  /* Pagination slices `nameResult`, never `students`: the search scores the
     whole list first, so a match on page 9 is still found from page 1. */
  const { page, pageCount, pageStart, pageEnd, setPage } = usePagination({
    total: nameResult.length,
    pageSize: PAGE_SIZE,
  });

  const pagedStudents = useMemo(
    () => nameResult.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [nameResult, page],
  );

  // A new search restarts at the first page of its own results.
  useEffect(() => {
    setPage(1);
  }, [query]);

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
    setSelectedIds(checked ? nameResult.map((s) => s.id) : []);
  };
  const isAllSelected =
    nameResult.length > 0 &&
    nameResult.every((s) => selectedIds.includes(s.id));

  const requestDeleteSingle = (id) => {
    setPendingDeleteIds([id]);
    setConfirmOpen(true);
  };
  const requestDeleteSelected = () => {
    if (selectedIds.length === 0) {
      toast.info("Select student to delete first");
      return;
    }
    setPendingDeleteIds([...selectedIds]);
    setConfirmOpen(true);
  };
  const confirmDelete = async () => {
    const ids = pendingDeleteIds ?? [];
    if (ids.length === 0) return;

    setConfirmOpen(false);
    setPendingDeleteIds(null);

    const results = await Promise.allSettled(
      ids.map((id) => handleDeleteStudent(id)),
    );

    const deleted = ids.filter(
      (_, i) => results[i].status === "fulfilled" && results[i].value?.status,
    );

    if (deleted.length > 0) {
      setStudents((prev) => prev.filter((s) => !deleted.includes(s.id)));
      setSelectedIds((prev) => prev.filter((id) => !deleted.includes(id)));
      toast.success(
        deleted.length === 1 ?
          "Student Deleted"
        : `${deleted.length} students deleted`,
      );
    }
    const failedCount = ids.length - deleted.length;
    if (failedCount > 0) {
      toast.error(
        `Couldn't delete ${failedCount} student${failedCount === 1 ? "" : "s"}`,
      );
    }
    navigate("/allstudents");
  };
  const cancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteIds(null);
  };
  const openAddStudent = async () => {
    setErrors({});
    setIsDetailForm(true);
    setFormData({
      ...regEmptyForm,
      ...detailEmptyForm,
      avatar: null,
      avatarFile: null,
    });
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
  const updateStudentAvatar = (id, avatar) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, avatar } : s)));
    setOpenStudent((prev) =>
      prev && prev.id === id ? { ...prev, avatar } : prev,
    );
  };

  /* Detail view: the student already exists, so the file goes straight to the
     server and what we keep is the path it was stored at. */
  const handleAvatarChange = async (file) => {
    if (!openStudent) return;
    if (!file) {
      updateStudentAvatar(openStudent.id, null);
      return;
    }
    try {
      const { avatar } = await handleUploadStudentImage(file, openStudent.id);
      updateStudentAvatar(openStudent.id, avatar);
      toast.success("Photo updated");
    } catch (error) {
      console.error("Could not upload avatar", error);
      toast.error(
        error.response?.data?.message ?? "Couldn't upload that image.",
      );
    }
  };

  /* Create/edit form: the student may not have an id yet, so hold the file and
     let saveStudent upload it once there is a record to attach it to. Abandoning
     the form then costs nothing on the server. AvatarUpload shows its own local
     preview meanwhile, so there is nothing to read here. */
  const handleAvatarUpload = (file) => {
    setFormData((prev) =>
      file ? { ...prev, avatarFile: file } : (
        { ...prev, avatar: null, avatarFile: null }
      ),
    );
  };
  const openEdit = (id) => {
    // `students` is the list to read: it carries any student added or edited
    // this session. `studentData` is the raw server response from page load,
    // which does not — spreading a miss from it silently blanks the form.
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

    // Both paths reject the same way, so they share one reporter: mark the
    // offending inputs red, shake the form, and surface the server's message.
    const reportSaveError = (error) => {
      console.error("Failed to save student", error);
      const { message, fields, reason } = error?.response?.data ?? {};

      // `true` keeps the field's own "is required" copy; a string replaces it.
      if (fields?.length) {
        setErrors((prev) => ({
          ...prev,
          ...Object.fromEntries(
            fields.map((key) => [
              key,
              reason === "missing" ? true : (
                (DUPLICATE_FIELD_MESSAGES[key] ?? message ?? true)
              ),
            ]),
          ),
        }));
      }

      if (ref?.current) shake(ref.current);
      toast.error(
        message ?? "Couldn't save student — check the API is running.",
      );
    };

    try {
      if (editingId !== null) await handleEditStudent(editingId, data);
      else await handleCreateStudent(data);
    } catch (error) {
      reportSaveError(error);
      return;
    }

    /* The record has to exist before an avatar can point at it, so the upload
       runs after the save. A failed upload is worth a warning but must not
       discard a student the server has already accepted. */
    let avatar = data.avatar;
    if (data.avatarFile) {
      try {
        ({ avatar } = await handleUploadStudentImage(data.avatarFile, finalId));
      } catch (error) {
        console.error("Failed to upload avatar", error);
        toast.error("Student saved, but the photo didn't upload.");
      }
    }

    // avatarFile is a File and has no place in the list state.
    const { avatarFile: _discarded, ...rest } = data;
    const saved = { ...rest, avatar, id: finalId };

    setStudents((prev) =>
      editingId !== null ?
        prev.map((s) => (s.id === editingId ? { ...s, ...saved } : s))
      : [...prev, saved],
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

      pagedStudents,
      page,
      pageCount,
      pageStart,
      pageEnd,
      setPage,
      pageSize: PAGE_SIZE,
      resultCount: nameResult.length,
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

      pagedStudents,
      page,
      pageCount,
      pageStart,
      pageEnd,
      setPage,
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
