export function syncSelectAll(selectAllBox) {
  const boxes = document.querySelectorAll("#studentsTbody .row-check");
  if (!boxes.length) return;
  const allChecked = [...boxes].every((b) => b.checked);
  selectAllBox.checked = allChecked;
}

export function selectAll(selectAllBox) {
  document.querySelectorAll(".row-check").forEach((box) => {
    box.checked = selectAllBox.checked;
    const tr = box.closest("tr, .student-card");
    tr && tr.classList.toggle("is-selected", box.checked);
  });
}
