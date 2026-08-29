import { syncSelectAll } from "./syncSelectAll";
export function wireRowSelection(selectAllBox) {
  document.querySelectorAll(".row-check").forEach((box) => {
    box.addEventListener("change", () => {
      const tr = box.closest("tr, .student-card");
      tr && tr.classList.toggle("is-selected", box.checked);
      syncSelectAll(selectAllBox);
    });
  });
}
