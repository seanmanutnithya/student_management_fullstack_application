import { Search, SearchX } from "lucide-react";

import { recordFilterOptions } from "@/assets/data/libraryAssets";
import { useStaggerReveal } from "@/animation/libraryPageAnimation";
import { Pagination } from "@/components/ui";
import { useLibrary } from "@/context/LibraryContext";
import { formatMoney } from "@/utils/format";
import BorrowCards from "./BorrowCards";
import BorrowTable from "./BorrowTable";

const BorrowingPanel = ({ activeTab }) => {
  const {
    filteredRecords,
    pagedRecords,
    recordQuery,
    setRecordQuery,
    recordStatus,
    setRecordStatus,
    finesOutstanding,
    page,
    pageCount,
    pageStart,
    pageEnd,
    setPage,
    FINE_PER_DAY,
  } = useLibrary();

  const isActive = activeTab === "borrowing";

  useStaggerReveal(
    "#borrowTbody tr, .borrow-card",
    [isActive, recordQuery, recordStatus, page, pagedRecords.length],
    { y: 10, duration: 0.45, stagger: 0.045 },
  );

  if (!isActive) return null;

  return (
    <section
      className="library-panel"
      id="panel-borrowing"
      role="tabpanel"
      aria-labelledby="tab-borrowing">
      <div className="library-toolbar">
        <div className="search-field search-field--sm">
          <Search />
          <input
            type="text"
            placeholder="Search student, book or loan ID"
            aria-label="Search borrow records"
            value={recordQuery}
            onChange={(e) => setRecordQuery(e.target.value)}
          />
        </div>
        <select
          className="select-field"
          id="recordStatusFilter"
          aria-label="Filter by loan status"
          value={recordStatus}
          onChange={(e) => setRecordStatus(e.target.value)}>
          {recordFilterOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="fine-rate">
          Fine rate {formatMoney(FINE_PER_DAY)}/day · outstanding{" "}
          <strong className={finesOutstanding > 0 ? "fine-due" : undefined}>
            {formatMoney(finesOutstanding)}
          </strong>
        </p>
      </div>

      {filteredRecords.length === 0 ?
        <div className="library-empty">
          <SearchX />
          <h3>No borrow records found</h3>
          <p>Nothing matches this search or status filter.</p>
        </div>
      : <>
          <BorrowTable />
          <BorrowCards />

          <div className="card-foot">
            <span className="results-note">
              Showing{" "}
              <strong>
                {pageStart}–{pageEnd}
              </strong>{" "}
              of <strong>{filteredRecords.length}</strong> records
            </span>
            <nav className="pagination" aria-label="Borrow record pagination">
              <Pagination
                page={page}
                pageCount={pageCount}
                onPageChange={setPage}
              />
            </nav>
          </div>
        </>
      }
    </section>
  );
};

export default BorrowingPanel;
