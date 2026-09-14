import { useEffect } from "react";
import { MousePointerClick } from "lucide-react";

import { animateRings } from "@/animation/classPageAnimation";
import { useStaggerReveal } from "@/animation/reveal";
import { useClasses } from "@/context/ClassContext";
import ClassCard from "./ClassCard";

const SectionsPanel = ({ activeTab }) => {
  const {
    rows,
    homeroomCounts,
    openDrawer,
    draggingStudent,
    requestTransfer,
  } = useClasses();

  const isActive = activeTab === "sections";

  useStaggerReveal(".class-card-shell", [isActive], {
    y: 14,
    duration: 0.38,
    stagger: 0.05,
  });

  // Rings sweep in once the cards are on screen, and again after a transfer.
  useEffect(() => {
    if (isActive) animateRings();
  }, [isActive, rows]);

  return (
    <section
      className={`class-panel${isActive ? " is-active" : ""}`}
      id="panel-sections"
      role="tabpanel"
      aria-labelledby="tab-sections">
      <p className="panel-hint">
        <MousePointerClick />
        Click a section to open its roster. Drag a student from the drawer onto
        another card to transfer them.
      </p>

      <div className="class-grid">
        {rows.map((klass) => (
          <ClassCard
            key={klass.id}
            klass={klass}
            isDropTarget={Boolean(draggingStudent)}
            doubleHomeroom={homeroomCounts[klass.homeroom] > 1}
            onOpen={openDrawer}
            onDropStudent={requestTransfer}
          />
        ))}
      </div>
    </section>
  );
};

export default SectionsPanel;
