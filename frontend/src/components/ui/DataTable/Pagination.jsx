import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageItems(page, pageCount) {
  const items = [1];
  if (page - 1 > 2) items.push("ellipsis");
  for (
    let p = Math.max(2, page - 1);
    p <= Math.min(pageCount - 1, page + 1);
    p++
  ) {
    items.push(p);
  }
  if (page + 1 < pageCount - 1) items.push("ellipsis");
  if (pageCount > 1) items.push(pageCount);
  return items;
}

const Pagination = ({ page, pageCount, onPageChange }) => {
  const items = getPageItems(page, pageCount);

  return (
    <>
      <button
        className="page-btn"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}>
        <ChevronLeft />
      </button>
      {items.map((item, idx) =>
        item === "ellipsis" ?
          <span className="page-ellipsis" key={`ellipsis-${idx}`}>
            ···
          </span>
        : <button
            key={item}
            className={`page-btn${item === page ? " is-active" : ""}`}
            onClick={() => onPageChange(item)}>
            {item}
          </button>,
      )}
      <button
        className="page-btn"
        aria-label="Next page"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}>
        <ChevronRight />
      </button>
    </>
  );
};

export default Pagination;
