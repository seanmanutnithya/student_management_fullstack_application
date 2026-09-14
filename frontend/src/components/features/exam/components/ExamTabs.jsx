import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { examTabButtons } from "@/assets/data/examSeed";
import { useExams } from "@/context/ExamContext";

const ExamTabs = () => {
  const { activeTab, setActiveTab } = useExams();
  const tabsRef = useRef(null);
  const indicatorRef = useRef(null);

  const moveIndicator = (tabEl) => {
    const indicator = indicatorRef.current;
    if (!tabEl || !indicator) return;
    const parentRect = tabEl.parentElement.getBoundingClientRect();
    const rect = tabEl.getBoundingClientRect();
    gsap.to(indicator, {
      x: rect.left - parentRect.left,
      width: rect.width,
      duration: 0.32,
      ease: "power2.out",
    });
  };

  useGSAP(() => {
    moveIndicator(tabsRef.current?.querySelector(".is-active"));
  }, [activeTab]);

  useEffect(() => {
    const place = () =>
      moveIndicator(tabsRef.current?.querySelector(".is-active"));
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, []);

  return (
    <div
      className="exam-tabs"
      role="tablist"
      aria-label="Exam sections"
      ref={tabsRef}>
      {examTabButtons.map((t) => (
        <button
          key={t.id}
          type="button"
          id={t.id}
          role="tab"
          className={`exam-tab${activeTab === t.tab ? " is-active" : ""}`}
          aria-selected={activeTab === t.tab}
          aria-controls={t.control}
          data-tab={t.tab}
          onClick={(e) => {
            setActiveTab(t.tab);
            moveIndicator(e.currentTarget);
          }}>
          {t.label}
        </button>
      ))}
      <span
        className="exam-tab-indicator"
        aria-hidden="true"
        ref={indicatorRef}
      />
    </div>
  );
};

export default ExamTabs;
