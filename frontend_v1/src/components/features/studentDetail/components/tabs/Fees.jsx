import React from "react";

const Fees = ({ activeTab }) => {
  if (activeTab !== "fees") return null;
  return (
    <div
      className="detail-panel is-active"
      id="panel-fees"
      role="tabpanel"
      aria-labelledby="tab-fees"
      data-panel="fees">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Description</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="feesBody"></tbody>
        </table>
      </div>
    </div>
  );
};

export default Fees;
