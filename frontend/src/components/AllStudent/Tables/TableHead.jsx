import React, { useRef } from "react";
import { selectAll } from "../JS/syncSelectAll";
const TableHead = () => {
  const selectAllRef = useRef(null);
  const handleSelectAll = () => {
    selectAll(selectAllRef.current);
  };
  return (
    <thead>
      <tr>
        <th className="col-check">
          <input
            type="checkbox"
            id="selectAll"
            aria-label="Select all"
            ref={selectAllRef}
            onChange={handleSelectAll}
          />
        </th>
        <th>Students Name</th>
        <th>ID</th>
        <th>Gender</th>
        <th>className</th>
        <th>Phone</th>
        <th>Remark</th>
        <th className="col-action">Action</th>
      </tr>
    </thead>
  );
};

export default TableHead;
