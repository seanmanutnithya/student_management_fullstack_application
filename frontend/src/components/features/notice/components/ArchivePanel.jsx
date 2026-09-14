import { memo } from "react";
import { Archive, Search, SearchX } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { TextField } from "@/components/ui";
import { useNotices } from "@/context/NoticeContext";
import { formatDate } from "@/utils/format";

/* Highlights the matched run inside a field, so a hit is visible rather
   than merely implied by the row surviving the filter. */
const Highlight = ({ text, query }) => {
  if (!query) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
};

const ArchiveRow = memo(function ArchiveRow({ notice, query, categoryLabel }) {
  return (
    <li className="archive-notice" data-notice-id={notice.id}>
      <span className="archive-icon">
        <Archive />
      </span>
      <div className="archive-meta">
        <strong>
          <Highlight text={notice.title} query={query} />
        </strong>
        <p className="archive-body">
          <Highlight text={notice.body} query={query} />
        </p>
        <span className="cell-sub">
          {categoryLabel} · {notice.author} ·{" "}
          {formatDate((notice.stamp ?? "").slice(0, 10))}
          {notice.expiresAt && ` · expired ${formatDate(notice.expiresAt)}`}
        </span>
      </div>
      <span className="archive-read">
        <strong>{notice.readPercent}%</strong>
        <span className="cell-sub">read by {notice.recipients}</span>
      </span>
    </li>
  );
});

const ArchivePanel = ({ activeTab }) => {
  const {
    archive,
    archiveQuery,
    setArchiveQuery,
    archiveFrom,
    setArchiveFrom,
    archiveTo,
    setArchiveTo,
    categories,
  } = useNotices();

  const isActive = activeTab === "archive";
  useStaggerReveal(".archive-notice", [isActive, archive.length], {
    y: 8,
    duration: 0.32,
    stagger: 0.04,
  });

  const rangeInvalid =
    archiveFrom && archiveTo && archiveFrom > archiveTo ?
      "The start date is after the end date."
    : "";

  return (
    <section
      className={`notice-panel${isActive ? " is-active" : ""}`}
      id="panel-archive"
      role="tabpanel"
      aria-labelledby="tab-archive">
      <div className="panel-head">
        <div>
          <h2>Archive</h2>
          <p>
            Expired and archived notices. Search runs across the title, body,
            category and author.
          </p>
        </div>
      </div>

      <div className="archive-toolbar">
        <div className="search-field search-field--sm">
          <Search />
          <input
            type="text"
            placeholder="Search past notices"
            aria-label="Search the archive"
            value={archiveQuery}
            onChange={(e) => setArchiveQuery(e.target.value)}
          />
        </div>

        <TextField
          id="archiveFrom"
          name="from"
          type="date"
          label="From"
          value={archiveFrom}
          onChange={(e) => setArchiveFrom(e.target.value)}
        />
        <TextField
          id="archiveTo"
          name="to"
          type="date"
          label="To"
          value={archiveTo}
          onChange={(e) => setArchiveTo(e.target.value)}
          error={rangeInvalid}
        />

        <span className="results-note">
          <strong>{archive.length}</strong> notice
          {archive.length === 1 ? "" : "s"} found
        </span>
      </div>

      {archive.length === 0 ?
        <div className="notice-empty">
          <SearchX />
          <h3>Nothing matches</h3>
          <p>Try a different word, or widen the date range.</p>
        </div>
      : <ul className="archive-notices">
          {archive.map((notice) => (
            <ArchiveRow
              key={notice.id}
              notice={notice}
              query={archiveQuery.trim()}
              categoryLabel={
                categories.find((c) => c.value === notice.category)?.label ??
                notice.category
              }
            />
          ))}
        </ul>
      }
    </section>
  );
};

export default ArchivePanel;
