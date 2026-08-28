import React from "react";
import { Trash2, ChevronDown, Search, Calendar } from "lucide-react";
const CardHead = () => {
  return (
    <div className="card-head">
      <h2 className="card-title">Students Information</h2>
      <div className="card-head-actions">
        <div className="search-field search-field--sm">
          <Search />
          <input
            type="text"
            placeholder="Search by name or roll"
            aria-label="Search students"
          />
        </div>
        <button className="select-field" id="dateFilterBtn">
          <Calendar />
          <span>Last 30 days</span>
          <ChevronDown />
        </button>
        <button
          className="icon-btn icon-btn--ghost"
          id="deleteSelectestudnetIDBtn"
          title="Delete selected"
          aria-label="Delete selected">
          <Trash2 />
        </button>
      </div>
    </div>
  );
};

export default CardHead;
