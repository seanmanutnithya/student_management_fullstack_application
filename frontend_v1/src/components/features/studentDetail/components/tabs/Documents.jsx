import React from "react";

const Documents = ({ activeTab }) => {
  if (activeTab !== "documents") return null;
  return (
    <div
      className="detail-panel is-active"
      id="panel-documents"
      role="tabpanel"
      aria-labelledby="tab-documents"
      data-panel="documents">
      <div className="document-grid" id="documentGrid"></div>
    </div>
  );
};

export default Documents;
