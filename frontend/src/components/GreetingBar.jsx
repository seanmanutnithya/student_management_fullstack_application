import { useState } from "react";
import { useCurrentDate } from "../hooks/useCurrentDate";
import { Megaphone, UserPlus } from "lucide-react";
import NoticeModal from "./NoticeModal";
import Toast from "./Toast";
const GreetingBar = () => {
  useCurrentDate();
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <section className="greeting-bar">
      <div className="greeting-text">
        <h1 className="greeting-title" id="greetingTitle">
          Good morning, Priscilla
        </h1>
        <p className="greeting-sub" id="greetingDate">
          Loading today's date…
        </p>
      </div>
      <div className="greeting-actions">
        <button
          className="btn btn-secondary"
          id="createNoticeBtn"
          onClick={() => setModalOpen(true)}>
          <Megaphone />
          Create Notice
        </button>
        <NoticeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
        <Toast />
        <a href="#" className="btn btn-primary">
          <UserPlus />
          <span>Add Student</span>
        </a>
      </div>
    </section>
  );
};

export default GreetingBar;
