import "@/styles/hostel.css";

import TopBar from "@/components/layout/TopBar";
import GatePanel from "@/components/features/hostel/components/GatePanel";
import HostelModals from "@/components/features/hostel/components/HostelModals";
import HostelTabs from "@/components/features/hostel/components/HostelTabs";
import LeavePanel from "@/components/features/hostel/components/LeavePanel";
import OccupancyPanel from "@/components/features/hostel/components/OccupancyPanel";
import PageHead from "@/components/features/hostel/components/PageHead";
import ResidentsPanel from "@/components/features/hostel/components/ResidentsPanel";
import RoomsPanel from "@/components/features/hostel/components/RoomsPanel";
import SummaryStrip from "@/components/features/hostel/components/SummaryStrip";
import TicketsPanel from "@/components/features/hostel/components/TicketsPanel";
import WardensPanel from "@/components/features/hostel/components/WardensPanel";
import {
  useHostelPageAnimation,
  useTabCrossfade,
} from "@/animation/hostelPageAnimation";
import { useHostel } from "@/context/HostelContext";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";

/* Panels stay mounted and hide with CSS, so a drill-down position and a
   half-typed search survive a trip to another tab. */
const Hostel = () => {
  const { activeTab } = useHostel();

  useHostelPageAnimation();
  useTabCrossfade(activeTab);
  useHideScrollbar();

  return (
    <>
      <main className="main">
        <TopBar />

        <div className="page">
          <PageHead />
          <SummaryStrip />

          <section className="card hostel-card">
            <HostelTabs />

            <div className="hostel-panels">
              <RoomsPanel activeTab={activeTab} />
              <OccupancyPanel activeTab={activeTab} />
              <ResidentsPanel activeTab={activeTab} />
              <WardensPanel activeTab={activeTab} />
              <GatePanel activeTab={activeTab} />
              <LeavePanel activeTab={activeTab} />
              <TicketsPanel activeTab={activeTab} />
            </div>
          </section>
        </div>
      </main>

      <HostelModals />
    </>
  );
};

export default Hostel;
