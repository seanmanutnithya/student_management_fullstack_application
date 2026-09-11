import { useState } from "react";

export function usePagination({ total, pageSize = 10, initialPage = 1 }) {
  const [page, setPage] = useState(initialPage);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const pageStart = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const pageEnd = Math.min(safePage * pageSize, total);

  return { page: safePage, pageCount, pageSize, pageStart, pageEnd, setPage };
}
