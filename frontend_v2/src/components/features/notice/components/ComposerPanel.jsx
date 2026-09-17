import { useState } from "react";
import { BookmarkPlus, RotateCcw, Send, TriangleAlert } from "lucide-react";

import { shake } from "@/animation/shake";
import { Button, Field, Modal, TextField } from "@/components/ui";
import { useNotices } from "@/context/NoticeContext";
import AudienceBuilder from "./AudienceBuilder";
import NoticePreview from "./NoticePreview";

const ComposerPanel = ({ activeTab }) => {
  const {
    draft,
    update,
    categories,
    priorities,
    fieldError,
    errors,
    isValid,
    touched,
    setTouched,
    sending,
    send,
    resetComposer,
    composerRef,
    saveAsTemplate,
  } = useNotices();

  const [saveOpen, setSaveOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);

  const isActive = activeTab === "compose";

  const submit = () => {
    setTouched(true);
    if (!send()) shake(composerRef.current);
  };

  const nameValid = templateName.trim().length >= 3;

  const confirmSaveTemplate = () => {
    setNameTouched(true);
    if (!nameValid) return;
    saveAsTemplate(templateName);
    setSaveOpen(false);
    setTemplateName("");
    setNameTouched(false);
  };

  return (
    <section
      className={`notice-panel${isActive ? " is-active" : ""}`}
      id="panel-compose"
      role="tabpanel"
      aria-labelledby="tab-compose">
      <div className="composer-layout">
        <form
          className="composer-form"
          ref={composerRef}
          onSubmit={(e) => e.preventDefault()}>
          <section className="composer-block">
            <h3>Notice</h3>

            <TextField
              id="noticeTitle"
              name="title"
              label="Title"
              placeholder="e.g. Campus closed Friday"
              value={draft.title}
              onChange={(e) => update({ title: e.target.value })}
              onBlur={() => setTouched(true)}
              error={fieldError("title")}
              valid={draft.title.trim().length >= 5}
            />

            <Field
              label="Body"
              htmlFor="noticeBody"
              error={fieldError("body")}
              hint={`${draft.body.trim().length} characters`}>
              <textarea
                id="noticeBody"
                rows={7}
                className="notice-textarea"
                placeholder="Write the notice as recipients should read it."
                value={draft.body}
                onChange={(e) => update({ body: e.target.value })}
                onBlur={() => setTouched(true)}
              />
            </Field>

            <div className="form-grid">
              <Field label="Category" htmlFor="noticeCategory">
                <select
                  id="noticeCategory"
                  value={draft.category}
                  onChange={(e) => update({ category: e.target.value })}>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Priority" htmlFor="noticePriority">
                <select
                  id="noticePriority"
                  value={draft.priority}
                  onChange={(e) => update({ priority: e.target.value })}>
                  {priorities.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <p className="priority-note cell-sub">
              {priorities.find((p) => p.value === draft.priority)?.note}
            </p>
          </section>

          <AudienceBuilder />

          <section className="composer-block">
            <h3>Schedule</h3>
            <div className="scope-row" role="radiogroup" aria-label="Send time">
              {[
                { value: "now", label: "Publish now" },
                { value: "later", label: "Schedule" },
              ].map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  role="radio"
                  aria-checked={draft.scheduleMode === mode.value}
                  className={`scope-chip${
                    draft.scheduleMode === mode.value ? " is-active" : ""
                  }`}
                  onClick={() => update({ scheduleMode: mode.value })}>
                  {mode.label}
                </button>
              ))}
            </div>

            <div className="form-grid">
              {draft.scheduleMode === "later" && (
                <TextField
                  id="noticePublishAt"
                  name="publishAt"
                  type="datetime-local"
                  label="Send at"
                  value={draft.publishAt}
                  onChange={(e) => update({ publishAt: e.target.value })}
                  onBlur={() => setTouched(true)}
                  error={fieldError("publishAt")}
                />
              )}

              <TextField
                id="noticeExpiresAt"
                name="expiresAt"
                type="date"
                label="Expires (optional)"
                value={draft.expiresAt}
                onChange={(e) => update({ expiresAt: e.target.value })}
                onBlur={() => setTouched(true)}
                error={fieldError("expiresAt")}
                hint="After this date the notice drops into the archive."
              />
            </div>
          </section>

          {touched && !isValid && (
            <p className="composer-warning">
              <TriangleAlert />
              {Object.values(errors)[0]}
            </p>
          )}

          <div className="composer-foot">
            <Button
              variant="secondary"
              icon={RotateCcw}
              onClick={resetComposer}
              disabled={sending}>
              Clear
            </Button>
            <Button
              variant="secondary"
              icon={BookmarkPlus}
              onClick={() => setSaveOpen(true)}
              disabled={draft.title.trim().length < 5}>
              Save as template
            </Button>
            <Button icon={Send} loading={sending} onClick={submit}>
              {draft.scheduleMode === "later" ? "Schedule notice" : "Publish now"}
            </Button>
          </div>
        </form>

        <NoticePreview />
      </div>

      <Modal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        title="Save as template"
        titleId="saveTemplateTitle"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSaveOpen(false)}>
              Cancel
            </Button>
            <Button icon={BookmarkPlus} onClick={confirmSaveTemplate}>
              Save template
            </Button>
          </>
        }>
        <TextField
          id="templateName"
          name="name"
          label="Template name"
          placeholder="e.g. Exam reminder"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          onBlur={() => setNameTouched(true)}
          error={
            nameTouched && !nameValid ?
              "Give the template a name of at least 3 characters."
            : ""
          }
          hint="The current title, body, category and priority are stored."
        />
      </Modal>
    </section>
  );
};

export default ComposerPanel;
