import { memo } from "react";
import { FileText, Send, TriangleAlert } from "lucide-react";

import { shake } from "@/animation/shake";
import { useStaggerReveal } from "@/animation/reveal";
import { Button, Field, Modal, TextField } from "@/components/ui";
import { useNotices } from "@/context/NoticeContext";

const TemplateCard = memo(function TemplateCard({ template, onUse, priority }) {
  return (
    <article className="template-card">
      <header className="template-head">
        <span className="template-icon">
          <FileText />
        </span>
        <div>
          <strong>{template.name}</strong>
          <span className="cell-sub">
            {template.category} · {priority?.label}
          </span>
        </div>
      </header>

      <p className="template-title">{template.title}</p>
      <p className="template-body">{template.body}</p>

      {template.fields.length > 0 && (
        <ul className="placeholder-list">
          {template.fields.map((field) => (
            <li key={field.key}>{`{{${field.key}}}`}</li>
          ))}
        </ul>
      )}

      <Button size="sm" icon={Send} onClick={() => onUse(template)}>
        Use template
      </Button>
    </article>
  );
});

const TemplatesPanel = ({ activeTab }) => {
  const {
    templates,
    priorities,
    openTemplate,
    templateModal,
    setTemplateModal,
    templateValues,
    setTemplateValues,
    templatePreview,
    templateMissing,
    templateTouched,
    applyTemplate,
    templateFormRef,
  } = useNotices();

  const isActive = activeTab === "templates";
  useStaggerReveal(".template-card", [isActive, templates.length], {
    y: 10,
    duration: 0.35,
    stagger: 0.05,
  });

  const submit = () => {
    if (!applyTemplate()) shake(templateFormRef.current);
  };

  const missingKeys = new Set(templateMissing.map((f) => f.key));

  return (
    <section
      className={`notice-panel${isActive ? " is-active" : ""}`}
      id="panel-templates"
      role="tabpanel"
      aria-labelledby="tab-templates">
      <div className="panel-head">
        <div>
          <h2>Templates</h2>
          <p>
            Recurring notices with <code>{"{{placeholders}}"}</code> filled in
            each time, so the wording stays consistent across terms.
          </p>
        </div>
      </div>

      <div className="template-grid">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            priority={priorities.find((p) => p.value === template.priority)}
            onUse={openTemplate}
          />
        ))}
      </div>

      <Modal
        open={Boolean(templateModal)}
        onClose={() => setTemplateModal(null)}
        title={templateModal ? `Use “${templateModal.name}”` : "Use template"}
        titleId="useTemplateTitle"
        footer={
          <>
            <Button variant="secondary" onClick={() => setTemplateModal(null)}>
              Cancel
            </Button>
            <Button icon={Send} onClick={submit}>
              Load into composer
            </Button>
          </>
        }>
        {templateModal && (
          <form ref={templateFormRef} onSubmit={(e) => e.preventDefault()}>
            {templateModal.fields.length === 0 ?
              <p className="cell-sub template-note">
                This template has no placeholders — it loads straight into the
                composer as written.
              </p>
            : <div className="form-grid">
                {templateModal.fields.map((field) => (
                  <TextField
                    key={field.key}
                    id={`tpl-${field.key}`}
                    name={field.key}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={templateValues[field.key] ?? ""}
                    onChange={(e) =>
                      setTemplateValues((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    error={
                      templateTouched && missingKeys.has(field.key) ?
                        `${field.label} is needed to fill this notice.`
                      : ""
                    }
                    valid={Boolean(templateValues[field.key]?.trim())}
                  />
                ))}
              </div>
            }

            {templateTouched && templateMissing.length > 0 && (
              <p className="composer-warning">
                <TriangleAlert />
                {templateMissing.length} placeholder
                {templateMissing.length === 1 ? "" : "s"} still to fill.
              </p>
            )}

            <Field label="Preview" className="template-preview-field">
              <div className="template-preview">
                <strong>{templatePreview?.title}</strong>
                <p>{templatePreview?.body}</p>
              </div>
            </Field>
          </form>
        )}
      </Modal>
    </section>
  );
};

export default TemplatesPanel;
