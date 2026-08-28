import { useEffect, useState } from "react";
import { Megaphone, UserPlus } from "lucide-react";

import { useCurrentDate } from "@/hooks/useCurrentDate";
import { wireHoverScale } from "@/animation/wireHoverScale";

import NoticeModal from "./NoticeModal";

const GreetingBar = () => {
  useCurrentDate();
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    wireHoverScale(".btn", 1.03);
  }, []);
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

          <a href="#" className="btn btn-primary">
            <UserPlus />
            <span>Add Student</span>
          </a>
        </div>
      </section>
      <NoticeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default GreetingBar;
