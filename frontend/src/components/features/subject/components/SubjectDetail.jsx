import { TriangleAlert } from "lucide-react";

import { useSubjects } from "@/context/SubjectContext";
import DetailTabs from "./DetailTabs";
import DifficultyPanel from "./DifficultyPanel";
import GradingPanel from "./GradingPanel";
import OverviewPanel from "./OverviewPanel";
import PrereqPanel from "./PrereqPanel";
import SyllabusPanel from "./SyllabusPanel";

const SubjectDetail = () => {
  const { selected, activeTab } = useSubjects();

  if (!selected) return null;

  return (
    <div className="subject-detail">
      <header className="subject-detail-head">
        <div>
          <span className="subject-code-pill">{selected.code}</span>
          <h2>{selected.name}</h2>
          <p className="cell-sub">
            {selected.department} · {selected.credits} credits ·{" "}
            {selected.classCount} class{selected.classCount === 1 ? "" : "es"} ·{" "}
            {selected.periodsPerWeek} periods a week
          </p>
        </div>
        <div className="subject-detail-tags">
          <span
            className={`status-pill status-pill--${
              selected.type === "core" ? "purple" : "blue"
            }`}>
            {selected.type === "core" ? "Core" : "Elective"}
          </span>
          {!selected.hasSubstitute && (
            <span className="status-pill status-pill--amber">
              <TriangleAlert />
              No substitute
            </span>
          )}
        </div>
      </header>

      <DetailTabs />

      <div className="subject-panels">
        <OverviewPanel activeTab={activeTab} />
        <GradingPanel activeTab={activeTab} />
        <PrereqPanel activeTab={activeTab} />
        <DifficultyPanel activeTab={activeTab} />
        <SyllabusPanel activeTab={activeTab} />
      </div>
    </div>
  );
};

export default SubjectDetail;
