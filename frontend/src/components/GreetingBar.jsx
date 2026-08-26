import { useEffect } from "react";
import { getCurrentDate } from "../funcs/getCurrentDate";
const GreetingBar = () => {
  useEffect(() => {
    getCurrentDate();
  }, []);
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
        <button className="btn btn-secondary" id="createNoticeBtn">
          <i data-lucide="megaphone"></i>
          <span>Create Notice</span>
        </button>
        <a href="../dashboard/index.html" className="btn btn-primary">
          <i data-lucide="user-plus"></i>
          <span>Add Student</span>
        </a>
      </div>
    </section>
  );
};

export default GreetingBar;
