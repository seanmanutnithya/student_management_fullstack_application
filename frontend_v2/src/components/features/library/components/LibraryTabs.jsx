import { useEffect } from "react";

import { libraryTabButtons } from "@/assets/data/libraryAssets";
import { useLibrary } from "@/context/LibraryContext";

const LibraryTabs = () => {
  const { activeTab, setActiveTab, tabsRef, tabIndicatorRef, moveIndicator } =
    useLibrary();

  // Park the indicator under the active tab on mount and on resize.
  useEffect(() => {
    const place = () =>
      moveIndicator(tabsRef.current?.querySelector(".is-active"));
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [activeTab, moveIndicator, tabsRef]);

  return (
    <div
      className="library-tabs"
      role="tablist"
      aria-label="Library sections"
      ref={tabsRef}>
      {libraryTabButtons.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`library-tab${activeTab === t.tab ? " is-active" : ""}`}
          id={t.id}
          role="tab"
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
        className="library-tab-indicator"
        id="libraryTabIndicator"
        aria-hidden="true"
        ref={tabIndicatorRef}
      />
    </div>
  );
};

export default LibraryTabs;
