import { createContext, useContext, useState } from "react";
import studentData from "../../../../../../database/data.json";
import { showToast } from "@/hooks/useToast";
const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [students, setStudents] = useState(studentData);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const toggleSelect = (index) => {
    setSelectedIds((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };
  const selectAll = (checked) => {
    setSelectedIds(checked ? students.map((_, i) => i) : []);
  };
  const isAllSelected =
    students.length > 0 && selectedIds.length == students.length;

  const requestDeleteSingle = (index) => {
    console.log("index: ", index);
    console.log(confirmOpen);
    setPendingDeleteIndex(index);
    setConfirmOpen(true);
  };
  const requestDeleteSelected = () => {
    if (selectedIds.length == 0) {
      showToast("Select student to delete first", "info");
      return;
    }
    setPendingDeleteIndex(null);
    setConfirmOpen(true);
  };
  const confirmDelete = () => {
    if (pendingDeleteIndex !== null) {
      setStudents((prev) => prev.filter((_, i) => i !== pendingDeleteIndex));
    } else {
      setStudents((prev) => prev.filter((_, i) => !selectedIds.includes(i)));
      setSelectedIds([]);
    }
    setConfirmOpen(false);
    setPendingDeleteIndex(null);
  };
  const cancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteIndex(null);
  };
  const openEdit = (index) => {
    setEditingIndex(index);
    setModalOpen(true);
  };
  const closeModal = () => {
    setEditingIndex(null);
    setModalOpen(false);
  };
  const saveStudent = (data) => {
    setStudents((prev) =>
      editingIndex !== null ?
        prev.map((s, i) => (i == editingIndex ? { ...s, ...data } : s))
      : [...prev, data],
    );
    closeModal();
  };
  const value = {
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
    editingStudent: editingIndex !== null ? students[editingIndex] : null,
    openEdit,
    closeModal,
    saveStudent,
  };

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}
export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used inside <StudentProvider>");
  return ctx;
}
