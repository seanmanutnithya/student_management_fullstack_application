import React from "react";

const TableHead = () => {
  return (
    <thead>
      <tr>
        <th className="col-check">
          <input type="checkbox" id="selectAll" aria-label="Select all" />
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
