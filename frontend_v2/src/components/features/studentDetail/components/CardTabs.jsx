import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { tabButtons } from "@/assets/data/tabs";
import Overview from "./tabs/Overview";
import Attandance from "./tabs/Attandance";
import Results from "./tabs/Results";
import Fees from "./tabs/Fees";
import Documents from "./tabs/Documents";

import { useStudent } from "@/context/StudentContext";

const TAB_NAMES = tabButtons.map((t) => t.tab);

const CardTabs = () => {
  /* The active tab lives in the URL (/allstudents/studentdetail/:id/:tab), so a
     tab can be linked to and survives a refresh. Tab links use `replace`, so
     Back still closes the modal instead of stepping through every tab visited.
     No tab or an unknown one falls back to Overview. */
  const { id, tab } = useParams();
  const activeTab = TAB_NAMES.includes(tab) ? tab : "overview";
  const { tabsRef, tabIndicatorRef, moveIndicator } = useStudent();

  useEffect(() => {
    const activeEl = tabsRef.current?.querySelector(".is-active");
    moveIndicator(activeEl);
  }, [activeTab, moveIndicator, tabsRef]);

  return (
    <section className="card tab-card">
      <div
        className="detail-tabs"
        role="tablist"
        aria-label="Student details"
        ref={tabsRef}>
        {tabButtons.map((t, idx) => (
          <Link
            key={idx}
            to={`/allstudents/studentdetail/${id}/${t.tab}`}
            replace
            onClick={(e) => moveIndicator(e.currentTarget)}
            className={`detail-tab ${activeTab === t.tab ? "is-active" : ""}`}
            id={t.id}
            role={t.role}
            aria-selected={activeTab === t.tab}
            aria-controls={t.control}
            data-tab={t.tab}>
            {t.label}
          </Link>
        ))}

        <span
          className="detail-tab-indicator"
          id="tabIndicator"
          aria-hidden="true"
          ref={tabIndicatorRef}></span>
      </div>

      <div className="detail-panels">
        {/* <!-- Overview --> */}
        <Overview activeTab={activeTab} />

        {/* <!-- Attendance --> */}
        <Attandance activeTab={activeTab} />

        {/* <!-- Results --> */}
        <Results activeTab={activeTab} />

        {/* <!-- Fees --> */}
        <Fees activeTab={activeTab} />

        {/* <!-- Documents --> */}
        <Documents activeTab={activeTab} />
      </div>
    </section>
  );
};

export default CardTabs;
