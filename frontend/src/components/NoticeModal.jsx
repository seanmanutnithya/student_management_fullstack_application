import React from "react";

const NoticeModal = () => {
  return (
    <div className="modal-overlay" id="modalOverlay">
      <div
        className="modal"
        id="noticeModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="noticeModalTitle">
        <div className="modal-head">
          <h3 id="noticeModalTitle">Create Notice</h3>
          <button className="icon-btn" id="modalCloseBtn" aria-label="Close">
            <i data-lucide="x"></i>
          </button>
        </div>

        <form className="modal-body" id="noticeForm" noValidate>
          <div className="form-grid">
            <div className="field field--full" data-field="noticeTitle">
              <label htmlFor="noticeTitle">Notice title</label>
              <input
                type="text"
                id="noticeTitle"
                placeholder="e.g. Term 3 fee due date reminder"
              />
              <span className="field-error">
                Please enter a title (min. 4 characters).
              </span>
            </div>

            <div className="field">
              <label htmlFor="noticeAudience">Audience</label>
              <select id="noticeAudience">
                <option value="all">Everyone</option>
                <option value="students">Students only</option>
                <option value="teachers">Teachers only</option>
                <option value="parents">Parents only</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="noticeDate">Publish date</label>
              <input type="date" id="noticeDate" />
            </div>

            <div className="field field--full" data-field="noticeMessage">
              <label htmlFor="noticeMessage">Message</label>
              <textarea
                id="noticeMessage"
                rows="4"
                placeholder="Write the notice details…"></textarea>
              <span className="field-error">
                Please enter a message (min. 10 characters).
              </span>
            </div>
          </div>
        </form>

        <div className="modal-foot">
          <button
            className="btn btn-secondary"
            id="modalCancelBtn"
            type="button">
            Cancel
          </button>
          <button
            className="btn btn-primary"
            id="modalPublishBtn"
            type="button">
            <span className="btn-label">
              <i data-lucide="send"></i>
              <span>Publish notice</span>
            </span>
            <span className="btn-spinner"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeModal;
