import "@/styles/subject.css";

import TopBar from "@/components/layout/TopBar";
import BulkAssignModal from "@/components/features/subject/components/BulkAssignModal";
import PageHead from "@/components/features/subject/components/PageHead";
import SubjectCatalog from "@/components/features/subject/components/SubjectCatalog";
import SubjectDetail from "@/components/features/subject/components/SubjectDetail";
import SummaryStrip from "@/components/features/subject/components/SummaryStrip";
import {
  useSubjectPageAnimation,
  useTabCrossfade,
} from "@/animation/subjectPageAnimation";
import { useSubjects } from "@/context/SubjectContext";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";

/* Catalogue on the left, the selected subject on the right. Detail panels
   stay mounted and hide with CSS so a part-built grading scheme survives a
   tab switch. */
const Subject = () => {
  const { activeTab, selectedId } = useSubjects();

  useSubjectPageAnimation();
  useTabCrossfade(activeTab, selectedId);
  useHideScrollbar();

  return (
    <>
      <main className="main">
        <TopBar />

        <div className="page">
          <PageHead />
          <SummaryStrip />

          <section className="card subject-card">
            <div className="subject-layout">
              <SubjectCatalog />
              <SubjectDetail />
            </div>
          </section>
        </div>
      </main>

      <BulkAssignModal />
    </>
  );
};

export default Subject;
