import { memo } from "react";
import { Search, SearchX, TriangleAlert } from "lucide-react";

import { useStaggerReveal } from "@/animation/reveal";
import { useSubjects } from "@/context/SubjectContext";

const CatalogRow = memo(function CatalogRow({ subject, isActive, onSelect }) {
  return (
    <li>
      <button
        type="button"
        className={`catalog-row${isActive ? " is-active" : ""}`}
        aria-current={isActive}
        onClick={() => onSelect(subject.id)}>
        <span className="catalog-code">{subject.code}</span>
        <span className="catalog-main">
          <span className="catalog-name">
            {subject.name}
            {!subject.hasSubstitute && (
              <TriangleAlert
                className="catalog-warn"
                aria-label="No substitute assigned"
              />
            )}
          </span>
          <span className="cell-sub">
            {subject.department} · {subject.credits} credits
          </span>
        </span>
        <span className="catalog-classes">
          <strong>{subject.classCount}</strong>
          <span className="cell-sub">
            class{subject.classCount === 1 ? "" : "es"}
          </span>
        </span>
      </button>
    </li>
  );
});

const SubjectCatalog = () => {
  const { groups, query, setQuery, selectedId, setSelectedId, subjects } =
    useSubjects();

  useStaggerReveal(".catalog-row", [query, selectedId === null], {
    y: 6,
    duration: 0.3,
    stagger: 0.02,
  });

  const empty = groups.core.length === 0 && groups.elective.length === 0;

  return (
    <aside className="subject-catalog" aria-label="Subject catalogue">
      <div className="search-field search-field--sm">
        <Search />
        <input
          type="text"
          placeholder="Search name, code or department"
          aria-label="Search subjects"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {empty ?
        <div className="catalog-empty">
          <SearchX />
          <p>No subject matches that search.</p>
        </div>
      : <div className="catalog-groups">
          {[
            { key: "core", label: "Core", rows: groups.core },
            { key: "elective", label: "Electives", rows: groups.elective },
          ].map(
            (group) =>
              group.rows.length > 0 && (
                <section className="catalog-group" key={group.key}>
                  <h3 className={`catalog-group-head catalog-group-head--${group.key}`}>
                    {group.label}
                    <span>{group.rows.length}</span>
                  </h3>
                  <ul className="catalog-list">
                    {group.rows.map((subject) => (
                      <CatalogRow
                        key={subject.id}
                        subject={subject}
                        isActive={subject.id === selectedId}
                        onSelect={setSelectedId}
                      />
                    ))}
                  </ul>
                </section>
              ),
          )}
        </div>
      }

      <p className="catalog-foot cell-sub">
        {subjects.length} subjects in this term's catalogue
      </p>
    </aside>
  );
};

export default SubjectCatalog;
