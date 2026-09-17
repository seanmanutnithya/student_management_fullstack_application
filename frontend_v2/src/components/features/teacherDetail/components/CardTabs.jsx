import { useEffect, useState } from "react";

import { teacherTabButtons } from "@/assets/data/teacherTabAssets";
import { useTeachers } from "@/context/TeacherContext";
import Overview from "./tabs/Overview";
import Schedule from "./tabs/Schedule";

const CardTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { tabsRef, tabIndicatorRef, moveIndicator } = useTeachers();

  useEffect(() => {
    const activeEl = tabsRef.current?.querySelector(".is-active");
    moveIndicator(activeEl);
  }, [activeTab, moveIndicator, tabsRef]);

  return (
    <section className="card tab-card">
      <div
        className="detail-tabs"
        role="tablist"
        aria-label="Teacher details"
        ref={tabsRef}>
        {teacherTabButtons.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`detail-tab${activeTab === t.tab ? " is-active" : ""}`}
            id={t.id}
            role={t.role}
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
          className="detail-tab-indicator"
          id="tabIndicator"
          aria-hidden="true"
          ref={tabIndicatorRef}
        />
      </div>

      <div className="detail-panels">
        <Overview activeTab={activeTab} />
        <Schedule activeTab={activeTab} />
      </div>
    </section>
  );
};

export default CardTabs;
