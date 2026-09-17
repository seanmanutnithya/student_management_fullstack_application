import { useRef, useState } from "react";
import { FileDown, FileText, History, Upload } from "lucide-react";

import { shake } from "@/animation/shake";
import { useStaggerReveal } from "@/animation/reveal";
import { Button, Field, Modal, TextField, useToast } from "@/components/ui";
import { useSubjects } from "@/context/SubjectContext";
import { formatDate, toIsoDate } from "@/utils/format";

const VERSION_RE = /^v\d+(\.\d+)?$/i;

const SyllabusPanel = ({ activeTab }) => {
  const { selected, addSyllabusVersion } = useSubjects();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ version: "", uploader: "", note: "" });
  const [touched, setTouched] = useState({});
  const formRef = useRef(null);

  const isActive = activeTab === "syllabus";
  useStaggerReveal(".version-row", [isActive, selected?.id], {
    y: 8,
    duration: 0.3,
    stagger: 0.04,
  });

  if (!selected) return null;

  const [current, ...previous] = selected.syllabus;

  const versionValid = VERSION_RE.test(form.version.trim());
  const uploaderValid = form.uploader.trim().length >= 2;
  const duplicate = selected.syllabus.some(
    (v) => v.version.toLowerCase() === form.version.trim().toLowerCase(),
  );
  const canSubmit = versionValid && uploaderValid && !duplicate;

  const close = () => {
    setOpen(false);
    setForm({ version: "", uploader: "", note: "" });
    setTouched({});
  };

  const submit = () => {
    setTouched({ version: true, uploader: true });
    if (!canSubmit) {
      shake(formRef.current);
      return;
    }
    addSyllabusVersion(selected.id, {
      version: form.version.trim(),
      uploader: form.uploader.trim(),
      note: form.note.trim() || "No release note.",
      uploadedOn: toIsoDate(new Date()),
      file: `${selected.code.toLowerCase()}-syllabus-${form.version.trim().toLowerCase()}.pdf`,
    });
    close();
  };

  return (
    <div
      className={`subject-panel${isActive ? " is-active" : ""}`}
      id="panel-syllabus"
      role="tabpanel"
      aria-labelledby="tab-syllabus">
      <section className="detail-block">
        <header className="detail-block-head">
          <h3>
            <FileText />
            Syllabus
          </h3>
          <Button
            size="sm"
            variant="secondary"
            icon={Upload}
            onClick={() => setOpen(true)}>
            Upload new version
          </Button>
        </header>

        <article className="syllabus-current">
          <span className="syllabus-icon">
            <FileText />
          </span>
          <div className="syllabus-meta">
            <strong>
              {current.file}
              <span className="status-pill status-pill--green">
                {current.version} · current
              </span>
            </strong>
            <span className="cell-sub">
              Uploaded {formatDate(current.uploadedOn)} by {current.uploader}
            </span>
            <p className="syllabus-note">{current.note}</p>
          </div>
          <button
            className="row-action-btn edit"
            title={`Download ${current.file}`}
            aria-label={`Download ${current.file}`}
            onClick={() =>
              toast.info("Download is a UI placeholder — no file attached.")
            }>
            <FileDown />
          </button>
        </article>

        <div className="version-history">
          <h4>
            <History />
            Previous versions
          </h4>
          {previous.length === 0 ?
            <p className="cell-sub">
              No earlier versions — this is the first issue.
            </p>
          : <ul className="version-list">
              {previous.map((version) => (
                <li className="version-row" key={version.version}>
                  <span className="version-tag">{version.version}</span>
                  <span className="version-meta">
                    <strong>{version.file}</strong>
                    <span className="cell-sub">
                      {formatDate(version.uploadedOn)} · {version.uploader} ·{" "}
                      {version.note}
                    </span>
                  </span>
                  <button
                    className="row-action-btn edit"
                    title={`Download ${version.file}`}
                    aria-label={`Download ${version.file}`}
                    onClick={() =>
                      toast.info(
                        "Download is a UI placeholder — no file attached.",
                      )
                    }>
                    <FileDown />
                  </button>
                </li>
              ))}
            </ul>
          }
        </div>
      </section>

      <Modal
        open={open}
        onClose={close}
        title={`Upload syllabus — ${selected.code}`}
        titleId="syllabusUploadTitle"
        footer={
          <>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button icon={Upload} onClick={submit}>
              Upload version
            </Button>
          </>
        }>
        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          <p className="cell-sub upload-intro">
            The current version is kept — {current.version} moves into the
            history below rather than being replaced.
          </p>
          <div className="form-grid">
            <TextField
              id="syllabusVersion"
              name="version"
              label="Version"
              placeholder="e.g. v4.0"
              value={form.version}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, version: e.target.value }))
              }
              onBlur={() => setTouched((t) => ({ ...t, version: true }))}
              error={
                touched.version && !versionValid ?
                  "Use a version like v2 or v2.1."
                : duplicate ? `${form.version.trim()} already exists.`
                : ""
              }
              valid={versionValid && !duplicate}
            />
            <TextField
              id="syllabusUploader"
              name="uploader"
              label="Uploaded by"
              placeholder="e.g. Sarah Kim"
              value={form.uploader}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, uploader: e.target.value }))
              }
              onBlur={() => setTouched((t) => ({ ...t, uploader: true }))}
              error={
                touched.uploader && !uploaderValid ?
                  "Enter who is uploading this version."
                : ""
              }
              valid={uploaderValid}
            />
            <Field
              label="Release note"
              htmlFor="syllabusNote"
              className="field--full"
              hint="What changed in this version?">
              <textarea
                id="syllabusNote"
                rows={3}
                className="subject-textarea"
                placeholder="e.g. Added a statistics unit to term 3."
                value={form.note}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, note: e.target.value }))
                }
              />
            </Field>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SyllabusPanel;
