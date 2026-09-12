import { useLibrary } from "@/context/LibraryContext";

const MemberList = () => {
  const { memberRows, selectedStudentId, setSelectedStudentId } = useLibrary();

  return (
    <ul className="member-list" aria-label="Students">
      {memberRows.map((m) => (
        <li key={m.id}>
          <button
            type="button"
            className={`member-row${m.id === selectedStudentId ? " is-active" : ""}`}
            aria-current={m.id === selectedStudentId}
            onClick={() => setSelectedStudentId(m.id)}>
            <img
              className="student-avatar"
              src={m.avatar}
              alt=""
              loading="lazy"
            />
            <span className="member-row-text">
              <span className="member-row-name">{m.name}</span>
              <span className="cell-sub">{m.std_class}</span>
            </span>
            <span
              className={`member-count${m.atLimit ? " is-limit" : ""}${
                m.overdueCount > 0 ? " is-overdue" : ""
              }`}
              title={`${m.activeCount} active borrows`}>
              {m.activeCount}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default MemberList;
