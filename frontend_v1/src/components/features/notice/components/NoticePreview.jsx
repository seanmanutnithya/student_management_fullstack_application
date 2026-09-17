import { memo } from "react";
import { CalendarClock, Eye, Pin, Users } from "lucide-react";

import { useNotices } from "@/context/NoticeContext";
import { formatDate } from "@/utils/format";

/* The same card the board renders, fed from the live draft — what the
   writer sees here is what recipients get. */
const NoticePreview = memo(function NoticePreview() {
  const { draft, reach, categories, priorities } = useNotices();

  const priority = priorities.find((p) => p.value === draft.priority);
  const category = categories.find((c) => c.value === draft.category);

  return (
    <aside className="preview-pane">
      <header className="preview-head">
        <Eye />
        <span>
          Live preview
          <span className="cell-sub">Exactly as recipients will see it</span>
        </span>
      </header>

      <article className={`notice-card notice-card--${priority?.tone}`}>
        <div className="notice-card-top">
          <span className={`priority-pill priority-pill--${priority?.tone}`}>
            {priority?.icon && <priority.icon />}
            {priority?.label}
          </span>
          <span className="category-pill">{category?.label}</span>
          {draft.priority === "urgent" && (
            <span className="pin-flag">
              <Pin />
              Pinned
            </span>
          )}
        </div>

        <h3 className="notice-title">
          {draft.title.trim() || "Your notice title appears here"}
        </h3>

        <p className="notice-body">
          {draft.body.trim() ||
            "Start typing and the body of the notice will render here, with the same spacing and type the recipient sees on their board."}
        </p>

        <footer className="notice-card-foot">
          <span>
            <Users />
            {reach.length} recipient{reach.length === 1 ? "" : "s"}
          </span>
          <span>
            <CalendarClock />
            {draft.scheduleMode === "later" && draft.publishAt ?
              `Sends ${new Date(draft.publishAt).toLocaleString()}`
            : "Sends immediately"}
          </span>
          {draft.expiresAt && (
            <span className="notice-expiry">
              Expires {formatDate(draft.expiresAt)}
            </span>
          )}
        </footer>
      </article>

      {draft.priority === "urgent" && (
        <p className="preview-note">
          Urgent notices pin above everything else on the board until they
          expire — keep them for things that genuinely can't wait.
        </p>
      )}
    </aside>
  );
});

export default NoticePreview;
