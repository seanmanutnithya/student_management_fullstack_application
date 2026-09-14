import "@/styles/bus.css";

import TopBar from "@/components/layout/TopBar";
import BusModals from "@/components/features/bus/components/BusModals";
import BusTabs from "@/components/features/bus/components/BusTabs";
import FeesPanel from "@/components/features/bus/components/FeesPanel";
import FleetPanel from "@/components/features/bus/components/FleetPanel";
import MaintenancePanel from "@/components/features/bus/components/MaintenancePanel";
import OccupancyPanel from "@/components/features/bus/components/OccupancyPanel";
import PageHead from "@/components/features/bus/components/PageHead";
import RoutesPanel from "@/components/features/bus/components/RoutesPanel";
import SummaryStrip from "@/components/features/bus/components/SummaryStrip";
import {
  useBusPageAnimation,
  useTabCrossfade,
} from "@/animation/busPageAnimation";
import { useBus } from "@/context/BusContext";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";

/* Panels stay mounted and hide with CSS, so a part-built route survives a
   trip to the fleet tab. */
const BusPage = () => {
  const { activeTab } = useBus();

  useBusPageAnimation();
  useTabCrossfade(activeTab);
  useHideScrollbar();

  return (
    <>
      <main className="main">
        <TopBar />

        <div className="page">
          <PageHead />
          <SummaryStrip />

          <section className="card bus-card">
            <BusTabs />

            <div className="bus-panels">
              <RoutesPanel activeTab={activeTab} />
              <FleetPanel activeTab={activeTab} />
              <OccupancyPanel activeTab={activeTab} />
              <FeesPanel activeTab={activeTab} />
              <MaintenancePanel activeTab={activeTab} />
            </div>
          </section>
        </div>
      </main>

      <BusModals />
    </>
  );
};

export default BusPage;
