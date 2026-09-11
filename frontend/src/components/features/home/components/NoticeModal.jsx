import { useState } from "react";
import { Send } from "lucide-react";
import { Modal, Button, Field, TextField, useToast } from "@/components/ui";

const today = () => new Date().toISOString().slice(0, 10);

const NoticeModal = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState("all");
  const [date, setDate] = useState(today);
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState({ title: false, message: false });
  const [publishing, setPublishing] = useState(false);

  const titleValid = title.trim().length >= 4;
  const messageValid = message.trim().length >= 10;

  const resetAndClose = () => {
    setTitle("");
    setAudience("all");
    setDate(today());
    setMessage("");
    setTouched({ title: false, message: false });
    onClose?.();
  };

  const handlePublish = () => {
    setTouched({ title: true, message: true });
    if (!titleValid || !messageValid) return;
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      toast.success("Notice published successfully");
      resetAndClose();
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={resetAndClose}
      title="Create Notice"
      titleId="noticeModalTitle"
      overlayId="modalOverlay"
      footer={
        <>
          <Button variant="secondary" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button icon={Send} loading={publishing} onClick={handlePublish}>
            Publish notice
          </Button>
        </>
      }>
      <form
        className="form-grid"
        id="noticeForm"
        noValidate
        onSubmit={(e) => e.preventDefault()}>
        <TextField
          id="noticeTitle"
          className="field--full"
          label="Notice title"
          placeholder="e.g. Term 3 fee due date reminder"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, title: true }))}
          error={
            touched.title && !titleValid ?
              "Please enter a title (min. 4 characters)."
            : null
          }
        />

        <Field label="Audience" htmlFor="noticeAudience">
          <select
            id="noticeAudience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}>
            <option value="all">Everyone</option>
            <option value="students">Students only</option>
            <option value="teachers">Teachers only</option>
            <option value="parents">Parents only</option>
          </select>
        </Field>

        <Field label="Publish date" htmlFor="noticeDate">
          <input
            type="date"
            id="noticeDate"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>

        <Field
          className="field--full"
          label="Message"
          htmlFor="noticeMessage"
          error={
            touched.message && !messageValid ?
              "Please enter a message (min. 10 characters)."
            : null
          }>
          <textarea
            id="noticeMessage"
            rows="4"
            placeholder="Write the notice details…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, message: true }))}
          />
        </Field>
      </form>
    </Modal>
  );
};

export default NoticeModal;
