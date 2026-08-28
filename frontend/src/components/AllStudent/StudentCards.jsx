const StudentCards = () => {
  return (
    <div classNameName="student-cards" id="studentCards">
      {students.map((s, idx) => (
        <div className="student-card" data-index="${i}">
          <div className="student-card-top">
            <input
              type="checkbox"
              className="row-check"
              aria-label="Select ${s.name}"
            />
            <div>
              <div className="student-card-name">${s.name}</div>
              <div className="student-card-roll">
                Roll ${s.std_className} · className ${s.std_className}
              </div>
            </div>
            <div className="row-actions">
              <button
                className="row-action-btn edit"
                title="Edit ${s.name}"
                aria-label="Edit ${s.name}">
                <i data-lucide="pencil"></i>
              </button>
              <button
                className="row-action-btn delete"
                title="Delete ${s.name}"
                aria-label="Delete ${s.name}">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
          <dl className="student-card-grid">
            <div>
              <dt>Address</dt>
              <dd>${s.gender}</dd>
            </div>
            <div>
              <dt>Date of birth</dt>
              <dd>${s.phone}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>${s.remark}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
};

export default StudentCards;
