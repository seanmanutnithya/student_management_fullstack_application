import React from "react";

const cardMarkUp = () => {
  return (
    <div class="student-card" data-index="${i}">
      <div class="student-card-top">
        <input
          type="checkbox"
          class="row-check"
          aria-label="Select ${s.name}"
        />
        <div>
          <div class="student-card-name">${s.name}</div>
          <div class="student-card-roll">
            Roll ${s.std_class} · Class ${s.std_class}
          </div>
        </div>
        <div class="row-actions">
          <button
            class="row-action-btn edit"
            title="Edit ${s.name}"
            aria-label="Edit ${s.name}">
            <i data-lucide="pencil"></i>
          </button>
          <button
            class="row-action-btn delete"
            title="Delete ${s.name}"
            aria-label="Delete ${s.name}">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
      <dl class="student-card-grid">
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
  );
};

export default cardMarkUp;
