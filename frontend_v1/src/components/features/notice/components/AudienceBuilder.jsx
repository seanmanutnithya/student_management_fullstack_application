import { useEffect, useRef } from "react";
import { Search, Users } from "lucide-react";

import { countTo } from "@/animation/noticePageAnimation";
import { Field } from "@/components/ui";
import { useNotices } from "@/context/NoticeContext";

const SCOPES = [
  { value: "all", label: "Everyone" },
  { value: "role", label: "By role" },
  { value: "class", label: "By class" },
  { value: "individual", label: "Named people" },
];

/* Layered targeting: each scope narrows the one above it, and the counter
   underneath always reports the resolved total. */
const AudienceBuilder = () => {
  const {
    draft,
    setAudience,
    reach,
    reachBreakdown,
    roles,
    classes,
    people,
    fieldError,
  } = useNotices();

  const { audience } = draft;
  const countRef = useRef(null);
  const previous = useRef(reach.length);

  useEffect(() => {
    countTo(countRef.current, previous.current, reach.length);
    previous.current = reach.length;
  }, [reach.length]);

  const toggle = (key, value) => {
    const list = audience[key];
    setAudience({
      [key]: list.includes(value) ?
          list.filter((v) => v !== value)
        : [...list, value],
    });
  };

  return (
    <section className="composer-block">
      <h3>
        <Users />
        Audience
      </h3>

      <div className="scope-row" role="radiogroup" aria-label="Audience scope">
        {SCOPES.map((scope) => (
          <button
            key={scope.value}
            type="button"
            role="radio"
            aria-checked={audience.scope === scope.value}
            className={`scope-chip${
              audience.scope === scope.value ? " is-active" : ""
            }`}
            onClick={() => setAudience({ scope: scope.value })}>
            {scope.label}
          </button>
        ))}
      </div>

      {audience.scope === "role" && (
        <div className="audience-options">
          {roles.map((role) => (
            <label
              key={role.value}
              className={`audience-chip${
                audience.roles.includes(role.value) ? " is-selected" : ""
              }`}>
              <input
                type="checkbox"
                checked={audience.roles.includes(role.value)}
                onChange={() => toggle("roles", role.value)}
              />
              {role.label}
            </label>
          ))}
        </div>
      )}

      {audience.scope === "class" && (
        <>
          <div className="audience-options">
            {classes.map((classId) => (
              <label
                key={classId}
                className={`audience-chip${
                  audience.classes.includes(classId) ? " is-selected" : ""
                }`}>
                <input
                  type="checkbox"
                  checked={audience.classes.includes(classId)}
                  onChange={() => toggle("classes", classId)}
                />
                {classId}
              </label>
            ))}
          </div>
          <p className="audience-hint cell-sub">
            Optionally narrow further by role — leave blank for everyone
            attached to those classes.
          </p>
          <div className="audience-options">
            {roles.map((role) => (
              <label
                key={role.value}
                className={`audience-chip audience-chip--sm${
                  audience.roles.includes(role.value) ? " is-selected" : ""
                }`}>
                <input
                  type="checkbox"
                  checked={audience.roles.includes(role.value)}
                  onChange={() => toggle("roles", role.value)}
                />
                {role.label}
              </label>
            ))}
          </div>
        </>
      )}

      {audience.scope === "individual" && (
        <div className="individual-picker">
          <div className="search-field search-field--sm">
            <Search />
            <input
              type="text"
              placeholder="Filter the roster"
              aria-label="Filter people"
              onChange={(e) => setAudience({ filter: e.target.value })}
            />
          </div>
          <ul className="people-list">
            {people
              .filter((person) =>
                (audience.filter ?? "").trim() ?
                  person.name
                    .toLowerCase()
                    .includes(audience.filter.trim().toLowerCase())
                : true,
              )
              .slice(0, 40)
              .map((person) => (
                <li key={person.id}>
                  <label
                    className={`person-row${
                      audience.individuals.includes(person.id) ?
                        " is-selected"
                      : ""
                    }`}>
                    <input
                      type="checkbox"
                      checked={audience.individuals.includes(person.id)}
                      onChange={() => toggle("individuals", person.id)}
                    />
                    <span>
                      {person.name}
                      <span className="cell-sub">
                        {person.role} · {person.classId}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
          </ul>
          <p className="cell-sub">
            Showing the first 40 of {people.length} — filter to narrow.
          </p>
        </div>
      )}

      <div className={`reach-meter${reach.length === 0 ? " is-empty" : ""}`}>
        <span className="reach-count">
          This reaches <strong ref={countRef}>{reach.length}</strong>{" "}
          {reach.length === 1 ? "person" : "people"}
        </span>
        <span className="reach-breakdown">
          {reachBreakdown.student} students · {reachBreakdown.teacher} teachers ·{" "}
          {reachBreakdown.guardian} guardians
        </span>
      </div>

      {fieldError("audience") && (
        <Field error={fieldError("audience")}>
          <span />
        </Field>
      )}
    </section>
  );
};

export default AudienceBuilder;
