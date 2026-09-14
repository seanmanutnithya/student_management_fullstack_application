import "@/styles/class.css";

import TopBar from "@/components/layout/TopBar";
import ArchivePanel from "@/components/features/class/components/ArchivePanel";
import ClassTabs from "@/components/features/class/components/ClassTabs";
import ComparePanel from "@/components/features/class/components/ComparePanel";
import PageHead from "@/components/features/class/components/PageHead";
import PromotionWizard from "@/components/features/class/components/PromotionWizard";
import RosterDrawer from "@/components/features/class/components/RosterDrawer";
import SectionsPanel from "@/components/features/class/components/SectionsPanel";
import SummaryStrip from "@/components/features/class/components/SummaryStrip";
import TransferConfirm from "@/components/features/class/components/TransferConfirm";
import {
  useClassPageAnimation,
  useTabCrossfade,
} from "@/animation/classPageAnimation";
import { useClasses } from "@/context/ClassContext";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";

/* The grid stays on screen while the roster drawer is open — the cards are
   the drop targets a dragged student needs. */
const Class = () => {
  const { activeTab } = useClasses();

  useClassPageAnimation();
  useTabCrossfade(activeTab);
  useHideScrollbar();

  return (
    <>
      <main className="main">
        <TopBar />

        <div className="page">
          <PageHead />
          <SummaryStrip />

          <section className="card class-card-wrap">
            <ClassTabs />

            <div className="class-panels">
              <SectionsPanel activeTab={activeTab} />
              <ComparePanel activeTab={activeTab} />
              <ArchivePanel activeTab={activeTab} />
            </div>
          </section>
        </div>
      </main>

      <RosterDrawer />
      <TransferConfirm />
      <PromotionWizard />
    </>
  );
};

export default Class;
