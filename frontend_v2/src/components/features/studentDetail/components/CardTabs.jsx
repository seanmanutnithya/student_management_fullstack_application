import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { tabButtons } from "@/assets/data/tabs";
import Overview from "./tabs/Overview";
import Attandance from "./tabs/Attandance";
import Results from "./tabs/Results";
import Fees from "./tabs/Fees";
import Documents from "./tabs/Documents";

import { useStudent } from "@/context/StudentContext";

const CardTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");
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
            to={"#"}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(t.tab);
              moveIndicator(e.currentTarget);
            }}
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
