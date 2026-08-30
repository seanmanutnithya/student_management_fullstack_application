import gsap from "gsap";
import { showToast } from "@/hooks/useToast";
import STUDENTS from "../../../../../../database/data.json";
let pendingDeleteEl = null;
let pendingEditEle = null;

function useStudent() {
  const confirmOverlay = document.getElementById("confirmOverlay");
  function closeConfirm() {
    if (!confirmOverlay) return;
    gsap.to(confirmOverlay, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => (confirmOverlay.style.visibility = "hidden"),
    });
  }

  function openConfirm() {
    if (!confirmOverlay) return;
    confirmOverlay.style.visibility = "visible";
    const dialog = confirmOverlay.querySelector(".modal");

    gsap.to(confirmOverlay, { opacity: 1, duration: 0.2 });
    if (dialog) {
      gsap.fromTo(
        dialog,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.28, ease: "back.out(1.6)" },
      );
    }
  }

  function runLoading(callback, duration = 550) {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (!loadingOverlay) {
      callback?.();
      return;
    }
    loadingOverlay.style.visibility = "visible";
    gsap.fromTo(loadingOverlay, { opacity: 0 }, { opacity: 1, duration: 0.18 });
    gsap.fromTo(
      ".spinner",
      { rotate: 0 },
      { rotate: 360, duration: 0.7, repeat: 1, ease: "none" },
    );
    setTimeout(() => {
      gsap.to(loadingOverlay, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          loadingOverlay.style.visibility = "hidden";
          callback?.();
        },
      });
    }, duration);
  }
  function wireRowActions() {
    document.querySelectorAll(".row-action-btn.edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        pendingEditEle = btn.closest("tr , .student-card");
        currentMode = "update";
        const index = pendingEditEle.dataset.index;
        const student = STUDENTS[index];
        document.getElementById("studentName").value = student.name;
        document.getElementById("studentId").value = student.id;
        document.getElementById("studentGender").value = student.gender;
        document.getElementById("studentClass").value = student.std_class;
        document.getElementById("studentPhone").value = student.phone;
        document.getElementById("studentRemark").value = student.remark ?? "";

        openModal("Edit Student");
      });
    });
    document.querySelectorAll(".row-action-btn.delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentMode = "edit";
        pendingDeleteEl = btn.closest("tr, .student-card");
        openConfirm();
      });
    });
  }
  function wireRowSelection(selectAllBox) {
    document.querySelectorAll(".row-check").forEach((box) => {
      box.addEventListener("change", () => {
        const tr = box.closest("tr, .student-card");
        tr && tr.classList.toggle("is-selected", box.checked);
        syncSelectAll(selectAllBox);
      });
    });
  }
  function syncSelectAll(selectAllBox) {
    const boxes = document.querySelectorAll("#studentsTbody .row-check");
    if (!boxes.length) return;
    const allChecked = [...boxes].every((b) => b.checked);
    selectAllBox.checked = allChecked;
  }

  function selectAll(selectAllBox) {
    document.querySelectorAll(".row-check").forEach((box) => {
      box.checked = selectAllBox.checked;
      const tr = box.closest("tr, .student-card");
      tr && tr.classList.toggle("is-selected", box.checked);
    });
  }

  function confirmDelete() {
    const el = pendingDeleteEl;
    confirmOverlay.style.visibility = "hidden";
    confirmOverlay.style.opacity = 0;

    console.log(el);

    if (!el) return;
    const index = el.dataset.index;

    console.log(index);

    const student = STUDENTS[index];

    console.log(student);

    deleteStudent();
    el.remove();
  }

  function deleteStudent() {
    const checked = document.querySelectorAll(
      "#studentsTbody .row-check:checked",
    );
    if (!checked.length) {
      showToast("Select students to delete first", "info");
      return;
    }
    pendingDeleteEl = null;
    openConfirm();
  }

  return {
    closeConfirm,
    openConfirm,
    runLoading,
    wireRowActions,
    wireRowSelection,
    syncSelectAll,
    selectAll,
    deleteStudent,
    confirmDelete,
  };
}
export default useStudent;
