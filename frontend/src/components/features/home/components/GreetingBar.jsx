import { useState } from "react";
import { Megaphone, UserPlus } from "lucide-react";

import { useCurrentDate } from "@/hooks/useCurrentDate";
import NoticeModal from "./NoticeModal";
import { Link } from "react-router-dom";
import { useStudent } from "@/context/StudentContext";
const GreetingBar = () => {
  useCurrentDate();
  const [modalOpen, setModalOpen] = useState(false);
  const { openAddStudent } = useStudent();

  return (
    <>
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

          <Link
            to={"allstudents"}
            className="btn btn-primary"
            onClick={() => openAddStudent()}>
            <UserPlus />
            <span>Add Student</span>
          </Link>
        </div>
      </section>
      <NoticeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default GreetingBar;
