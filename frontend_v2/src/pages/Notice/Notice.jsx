import "@/styles/notice.css";

import TopBar from "@/components/layout/TopBar";
import ArchivePanel from "@/components/features/notice/components/ArchivePanel";
import BoardPanel from "@/components/features/notice/components/BoardPanel";
import ComposerPanel from "@/components/features/notice/components/ComposerPanel";
import NoticeTabs from "@/components/features/notice/components/NoticeTabs";
import PageHead from "@/components/features/notice/components/PageHead";
import SummaryStrip from "@/components/features/notice/components/SummaryStrip";
import TemplatesPanel from "@/components/features/notice/components/TemplatesPanel";
import {
  useNoticePageAnimation,
  useTabCrossfade,
} from "@/animation/noticePageAnimation";
import { useNotices } from "@/context/NoticeContext";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";

/* Panels stay mounted and hide with CSS, so a half-written notice and its
   audience survive a trip to the board. */
const Notice = () => {
  const { activeTab } = useNotices();

  useNoticePageAnimation();
  useTabCrossfade(activeTab);
  useHideScrollbar();

  return (
    <main className="main">
      <TopBar />

      <div className="page">
        <PageHead />
        <SummaryStrip />

        <section className="card notice-card-wrap">
          <NoticeTabs />

          <div className="notice-panels">
            <ComposerPanel activeTab={activeTab} />
            <BoardPanel activeTab={activeTab} />
            <TemplatesPanel activeTab={activeTab} />
            <ArchivePanel activeTab={activeTab} />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Notice;
