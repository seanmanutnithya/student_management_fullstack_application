import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { classTabButtons } from "@/assets/data/classSeed";
import { useClasses } from "@/context/ClassContext";

const ClassTabs = () => {
  const { activeTab, setActiveTab } = useClasses();
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
      className="class-tabs"
      role="tablist"
      aria-label="Class views"
      ref={tabsRef}>
      {classTabButtons.map((t) => (
        <button
          key={t.id}
          type="button"
          id={t.id}
          role="tab"
          className={`class-tab${activeTab === t.tab ? " is-active" : ""}`}
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
        className="class-tab-indicator"
        aria-hidden="true"
        ref={indicatorRef}
      />
    </div>
  );
};

export default ClassTabs;
