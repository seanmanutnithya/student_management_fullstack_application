import "@/styles/library.css";

import TopBar from "@/components/layout/TopBar";
import BookFormModal from "@/components/features/library/components/BookFormModal";
import BorrowingPanel from "@/components/features/library/components/BorrowingPanel";
import CatalogPanel from "@/components/features/library/components/CatalogPanel";
import ConfirmDialog from "@/components/features/library/components/ConfirmDialog";
import IssueModal from "@/components/features/library/components/IssueModal";
import LibraryTabs from "@/components/features/library/components/LibraryTabs";
import MembersPanel from "@/components/features/library/components/MembersPanel";
import PageHead from "@/components/features/library/components/PageHead";
import SummaryStrip from "@/components/features/library/components/SummaryStrip";
import { useLibraryPageAnimation } from "@/animation/libraryPageAnimation";
import { useLibrary } from "@/context/LibraryContext";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";

const Library = () => {
  const { activeTab } = useLibrary();

  useLibraryPageAnimation();
  useHideScrollbar();

  return (
    <>
      <main className="main">
        <TopBar />
        <ConfirmDialog />

        <div className="page">
          <PageHead />
          <SummaryStrip />

          <section className="card library-card">
            <LibraryTabs />

            <div className="library-panels">
              <CatalogPanel activeTab={activeTab} />
              <BorrowingPanel activeTab={activeTab} />
              <MembersPanel activeTab={activeTab} />
            </div>
          </section>
        </div>
      </main>

      <BookFormModal />
      <IssueModal />
    </>
  );
};

export default Library;
