import { memo, useEffect } from "react";
import {
  Archive,
  BellRing,
  CalendarClock,
  ChevronDown,
  Circle,
  Clock3,
  Pin,
  Users,
} from "lucide-react";

import { animateReadBars } from "@/animation/noticePageAnimation";
import { useStaggerReveal } from "@/animation/reveal";
import { Button } from "@/components/ui";
import { useNotices } from "@/context/NoticeContext";
import { formatDate } from "@/utils/format";

const NoticeCard = memo(function NoticeCard({
  notice,
  priority,
  categoryLabel,
  isExpanded,
  onToggle,
  onNudge,
  onArchive,
}) {
  const unread = notice.recipients - notice.readCount;

  return (
    <article
      className={`notice-card-shell notice-card--${priority?.tone}${
        notice.priority === "urgent" ? " is-pinned" : ""
      }`}
      data-notice-id={notice.id}>
      <div className="notice-card-top">
        <span className={`priority-pill priority-pill--${priority?.tone}`}>
          {priority?.icon && <priority.icon />}
          {priority?.label}
        </span>
        <span className="category-pill">{categoryLabel}</span>
        {notice.priority === "urgent" && (
          <span className="pin-flag">
            <Pin />
            Pinned
          </span>
        )}
        {/* Unread from the reader's side: nobody in the audience has opened it */}
        {notice.readCount === 0 && (
          <span className="unread-dot" title="Nobody has opened this yet">
            <Circle />
            Unread
          </span>
        )}
      </div>

      <h3 className="notice-title">{notice.title}</h3>
      <p className="notice-body">{notice.body}</p>

      <div className="notice-meta">
        <span>
          <Users />
          {notice.audienceLabel} · {notice.recipients}
        </span>
        <span>
          <CalendarClock />
          {notice.publishedAt ?
            formatDate(notice.publishedAt.slice(0, 10))
          : `Sends ${formatDate((notice.publishAt ?? "").slice(0, 10))}`}
        </span>
        {notice.expiresAt && (
          <span className="notice-expiry">
            Expires {formatDate(notice.expiresAt)}
          </span>
        )}
        <span>{notice.author}</span>
      </div>

      <div className="read-block">
        <div className="read-head">
          <span>
            <strong>{notice.readPercent}%</strong> read
            <span className="cell-sub">
              {notice.readCount} of {notice.recipients} opened · {unread} still
              to
            </span>
          </span>
          <button
            type="button"
            className={`read-toggle${isExpanded ? " is-open" : ""}`}
            aria-expanded={isExpanded}
            onClick={() => onToggle(isExpanded ? null : notice.id)}>
            {isExpanded ? "Hide" : "Who opened it"}
            <ChevronDown />
          </button>
        </div>

        <div className="read-track" aria-hidden="true">
          <span
            className="read-fill"
            data-share={notice.readPercent}
            style={{ width: `${notice.readPercent}%` }}
          />
        </div>
      </div>

      <footer className="notice-actions">
        <Button
          size="sm"
          variant="secondary"
          icon={BellRing}
          disabled={unread === 0}
          onClick={() => onNudge(notice)}>
          Remind {unread} unread
        </Button>
        <Button
          size="sm"
          variant="secondary"
          icon={Archive}
          onClick={() => onArchive(notice.id)}>
          Archive
        </Button>
      </footer>
    </article>
  );
});

const BoardPanel = ({ activeTab }) => {
  const {
    board,
    categories,
    category,
    setCategory,
    expandedId,
    setExpandedId,
    readRoster,
    readFilter,
    setReadFilter,
    nudgeUnread,
    archiveNotice,
    priorities,
  } = useNotices();

  const isActive = activeTab === "board";

  useStaggerReveal(".notice-card-shell", [isActive, category], {
    y: 12,
    duration: 0.35,
    stagger: 0.05,
  });

  useEffect(() => {
    if (isActive) animateReadBars();
  }, [isActive, board]);

  const priorityOf = (value) => priorities.find((p) => p.value === value);
  const labelOf = (value) =>
    categories.find((c) => c.value === value)?.label ?? value;

  const roster =
    readRoster ?
      readFilter === "read" ? readRoster.read
      : readRoster.unread
    : [];

  return (
    <section
      className={`notice-panel${isActive ? " is-active" : ""}`}
      id="panel-board"
      role="tabpanel"
      aria-labelledby="tab-board">
      <div className="board-toolbar">
        <div className="category-filters" role="group" aria-label="Filter by category">
          <button
            type="button"
            className={`filter-chip${category === "" ? " is-active" : ""}`}
            onClick={() => setCategory("")}>
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`filter-chip${category === c.value ? " is-active" : ""}`}
              onClick={() => setCategory(c.value)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {board.scheduled.length > 0 && (
        <div className="scheduled-strip">
          <Clock3 />
          <span>
            {board.scheduled.length} notice
            {board.scheduled.length === 1 ? "" : "s"} scheduled —{" "}
            {board.scheduled
              .map(
                (n) =>
                  `${n.title} (${formatDate((n.publishAt ?? "").slice(0, 10))})`,
              )
              .join(", ")}
          </span>
        </div>
      )}

      {board.pinned.length > 0 && (
        <section className="board-section">
          <h3 className="board-section-head">
            <Pin />
            Pinned
          </h3>
          <div className="notice-list">
            {board.pinned.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                priority={priorityOf(notice.priority)}
                categoryLabel={labelOf(notice.category)}
                isExpanded={expandedId === notice.id}
                onToggle={setExpandedId}
                onNudge={nudgeUnread}
                onArchive={archiveNotice}
              />
            ))}
          </div>
        </section>
      )}

      <section className="board-section">
        <h3 className="board-section-head">Latest</h3>
        {board.rest.length === 0 ?
          <div className="notice-empty">
            <BellRing />
            <h3>Nothing here</h3>
            <p>No live notices match that category.</p>
          </div>
        : <div className="notice-list">
            {board.rest.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                priority={priorityOf(notice.priority)}
                categoryLabel={labelOf(notice.category)}
                isExpanded={expandedId === notice.id}
                onToggle={setExpandedId}
                onNudge={nudgeUnread}
                onArchive={archiveNotice}
              />
            ))}
          </div>
        }
      </section>

      {readRoster && (
        <aside className="read-roster">
          <header className="read-roster-head">
            <h3>
              Who opened “{readRoster.notice.title}”
              <span className="cell-sub">
                {readRoster.read.length} read · {readRoster.unread.length} unread
              </span>
            </h3>
            <div className="scope-row">
              {[
                { value: "unread", label: `Unread (${readRoster.unread.length})` },
                { value: "read", label: `Read (${readRoster.read.length})` },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`scope-chip${
                    readFilter === option.value ? " is-active" : ""
                  }`}
                  onClick={() => setReadFilter(option.value)}>
                  {option.label}
                </button>
              ))}
            </div>
          </header>

          <ul className="roster-list">
            {roster.slice(0, 40).map((person) => (
              <li key={person.id}>
                <span>{person.name}</span>
                <span className="cell-sub">
                  {person.role} · {person.classId}
                </span>
              </li>
            ))}
          </ul>
          {roster.length > 40 && (
            <p className="cell-sub">
              Showing 40 of {roster.length} — the rest are in the export.
            </p>
          )}
        </aside>
      )}
    </section>
  );
};

export default BoardPanel;
