import "@/styles/routine.css";

import TopBar from "@/components/layout/TopBar";
import BellScheduleModal from "@/components/features/routine/components/BellScheduleModal";
import ConflictPanel from "@/components/features/routine/components/ConflictPanel";
import LensBar from "@/components/features/routine/components/LensBar";
import PageHead from "@/components/features/routine/components/PageHead";
import PrintView from "@/components/features/routine/components/PrintView";
import SubstituteModals from "@/components/features/routine/components/SubstituteModals";
import SummaryStrip from "@/components/features/routine/components/SummaryStrip";
import TimetableGrid from "@/components/features/routine/components/TimetableGrid";
import WorkloadPanel from "@/components/features/routine/components/WorkloadPanel";
import { useRoutinePageAnimation } from "@/animation/routinePageAnimation";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";

/* Grid on the left, conflicts and workload alongside — both panels react to
   the same lessons, so a drop that clears a clash updates them together. */
const Routine = () => {
  useRoutinePageAnimation();
  useHideScrollbar();

  return (
    <>
      <main className="main">
        <TopBar />

        <div className="page">
          <PageHead />
          <SummaryStrip />

          <div className="routine-layout">
            <section className="card routine-card">
              <LensBar />
              <TimetableGrid />
            </section>

            <div className="routine-side">
              <ConflictPanel />
              <WorkloadPanel />
            </div>
          </div>
        </div>
      </main>

      <BellScheduleModal />
      <SubstituteModals />
      <PrintView />
    </>
  );
};

export default Routine;
