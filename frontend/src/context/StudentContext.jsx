import { createContext, useContext, useDebugValue, useState } from "react";
import studentData from "../../../database/data.json";
import { useToast } from "@/components/ui";
import { shake } from "@/animation/shake";
import { useCallback, useMemo, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
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
  const [formData, setFormData] = useState(regEmptyForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    value.trim() !== "" ?
      setErrors((prev) => ({ ...prev, [name]: false }))
    : null;
  };

  const handleSave = () => {
    saveStudent(formData, formRef);
    // turn form data to empty
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
  const confirmDelete = () => {
    if (pendingDeleteIds !== null) {
      setStudents((prev) => prev.filter((s) => s.id !== pendingDeleteIds));
      setSelectedIds((prev) => prev.filter((id) => id !== pendingDeleteIds));
      toast.success("Student deleted");
    } else {
      setStudents((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
      setSelectedIds([]);
      toast.success("Students deleted");
    }
    setConfirmOpen(false);
    setPendingDeleteIds(null);
    navigate("/allstudents");
  };
  const cancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteIds(null);
  };
  const openAddStudent = () => {
    setIsDetailForm(true);
    setFormData({ ...regEmptyForm, ...detailEmptyForm });
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
  const openEdit = (id) => {
    setErrors({});
    setEditingId(id);
    setModalOpen(true);
    const student = students.find((s) => s.id === id);
    setFormData({ ...regEmptyForm, ...detailEmptyForm, ...student });
  };
  const closeModal = () => {
    setEditingId(null);
    setModalOpen(false);
  };
  const saveStudent = (data, ref) => {
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
    setStudents((prev) =>
      editingId !== null ?
        prev.map((s) => (s.id === editingId ? { ...s, ...data } : s))
      : [...prev, { ...data, id: data.id || Date.now().toString() }],
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

      handleChange,
      handleSave,
      errors,
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

      handleChange,
      handleSave,
      errors,
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
