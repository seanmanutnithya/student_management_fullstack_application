import { Download, Eye } from "lucide-react";

import { DOCUMENTS } from "../../utils/renderDocuments";

const Documents = ({ activeTab }) => {
  if (activeTab !== "documents") return null;
  return (
    <div
      className="detail-panel is-active"
      id="panel-documents"
      role="tabpanel"
      aria-labelledby="tab-documents"
      data-panel="documents">
      <div className="document-grid" id="documentGrid">
        {DOCUMENTS.map(({ name, size, icon: Icon }) => (
          <div className="document-card" key={name}>
            <div className="document-icon">
              <Icon />
            </div>
            <div className="document-info">
              <div className="document-name">{name}</div>
              <div className="document-meta">{size}</div>
            </div>
            <div className="document-actions">
              <button
                type="button"
                className="row-action-btn edit"
                title="View"
                aria-label={`View ${name}`}>
                <Eye />
              </button>
              <button
                type="button"
                className="row-action-btn edit"
                title="Download"
                aria-label={`Download ${name}`}>
                <Download />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
