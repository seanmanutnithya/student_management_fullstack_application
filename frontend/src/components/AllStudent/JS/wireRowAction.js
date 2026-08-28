export function wireRowActions() {
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
