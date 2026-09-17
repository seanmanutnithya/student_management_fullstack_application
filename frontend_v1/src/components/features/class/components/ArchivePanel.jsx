import { Archive, Eye, Lock } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { Button } from "@/components/ui";
import { useClasses } from "@/context/ClassContext";
import { formatDate } from "@/utils/format";

const ArchivePanel = ({ activeTab }) => {
  const { archivedRows, openDrawer } = useClasses();
  const isActive = activeTab === "archive";

  useStaggerReveal(".archive-row", [isActive, archivedRows.length], {
    y: 10,
    duration: 0.35,
    stagger: 0.05,
  });

  return (
    <section
      className={`class-panel${isActive ? " is-active" : ""}`}
      id="panel-archive"
      role="tabpanel"
      aria-labelledby="tab-archive">
      <p className="panel-hint">
        <Lock />
        Archived sections keep their roster and results for the record. They
        open read-only — nothing can be edited or transferred.
      </p>

      {archivedRows.length === 0 ?
        <div className="class-empty">
          <Archive />
          <h3>Nothing archived yet</h3>
          <p>Closing out a year with the promotion wizard files it here.</p>
        </div>
      : <ul className="archive-list">
          {archivedRows.map((klass) => (
            <li className="archive-row" key={klass.id}>
              <span className="archive-icon">
                <Archive />
              </span>
              <div className="archive-meta">
                <strong>
                  {klass.id}
                  <span className="status-pill status-pill--muted">
                    {klass.year}
                  </span>
                </strong>
                <span className="cell-sub">
                  {klass.enrolled} students · {klass.homeroom}
                  {klass.archivedOn && ` · archived ${formatDate(klass.archivedOn)}`}
                </span>
              </div>

              <dl className="archive-figures">
                <div>
                  <dt>Attendance</dt>
                  <dd>{klass.attendance}%</dd>
                </div>
                <div>
                  <dt>Average grade</dt>
                  <dd>{klass.averageGrade}%</dd>
                </div>
                {klass.promotedCount !== undefined && (
                  <div>
                    <dt>Outcome</dt>
                    <dd>
                      {klass.promotedCount} promoted · {klass.retainedCount}{" "}
                      retained
                    </dd>
                  </div>
                )}
              </dl>

              <Button
                size="sm"
                variant="secondary"
                icon={Eye}
                onClick={() => openDrawer(klass.id)}>
                View
              </Button>
            </li>
          ))}
        </ul>
      }
    </section>
  );
};

export default ArchivePanel;
