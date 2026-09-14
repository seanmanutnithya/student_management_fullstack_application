import "@/styles/exam.css";

import TopBar from "@/components/layout/TopBar";
import AnalyticsPanel from "@/components/features/exam/components/AnalyticsPanel";
import ExamTabs from "@/components/features/exam/components/ExamTabs";
import MarksPanel from "@/components/features/exam/components/MarksPanel";
import PageHead from "@/components/features/exam/components/PageHead";
import PaperFormModal from "@/components/features/exam/components/PaperFormModal";
import PlannerPanel from "@/components/features/exam/components/PlannerPanel";
import PublishModal from "@/components/features/exam/components/PublishModal";
import ReportsPanel from "@/components/features/exam/components/ReportsPanel";
import RetakesPanel from "@/components/features/exam/components/RetakesPanel";
import SeatingPanel from "@/components/features/exam/components/SeatingPanel";
import SummaryStrip from "@/components/features/exam/components/SummaryStrip";
import {
  useExamPageAnimation,
  useTabCrossfade,
} from "@/animation/examPageAnimation";
import { useExams } from "@/context/ExamContext";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";

/* Panels stay mounted and hide with CSS, so a part-filled mark sheet and its
   autosaved draft survive a trip to another tab. */
const Exam = () => {
  const { activeTab } = useExams();

  useExamPageAnimation();
  useTabCrossfade(activeTab);
  useHideScrollbar();

  return (
    <>
      <main className="main">
        <TopBar />

        <div className="page">
          <PageHead />
          <SummaryStrip />

          <section className="card exam-card">
            <ExamTabs />

            <div className="exam-panels">
              <PlannerPanel activeTab={activeTab} />
              <MarksPanel activeTab={activeTab} />
              <ReportsPanel activeTab={activeTab} />
              <AnalyticsPanel activeTab={activeTab} />
              <SeatingPanel activeTab={activeTab} />
              <RetakesPanel activeTab={activeTab} />
            </div>
          </section>
        </div>
      </main>

      <PaperFormModal />
      <PublishModal />
    </>
  );
};

export default Exam;
