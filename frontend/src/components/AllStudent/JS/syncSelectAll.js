export function syncSelectAll() {
  const boxes = document.querySelectorAll("#studentsTbody .row-check");
  if (!boxes.length) return;
  const allChecked = [...boxes].every((b) => b.checked);
  selectAllBox.checked = allChecked;
}
