import "@/styles/attendance.css";

import TopBar from "@/components/layout/TopBar";
import AttendanceTabs from "@/components/features/attendance/components/AttendanceTabs";
import InsightsPanel from "@/components/features/attendance/components/InsightsPanel";
import MarkPanel from "@/components/features/attendance/components/MarkPanel";
import PageHead from "@/components/features/attendance/components/PageHead";
import ReportsPanel from "@/components/features/attendance/components/ReportsPanel";
import RequestsPanel from "@/components/features/attendance/components/RequestsPanel";
import SummaryStrip from "@/components/features/attendance/components/SummaryStrip";
import TodayPanel from "@/components/features/attendance/components/TodayPanel";
import {
  useAttendancePageAnimation,
  useTabCrossfade,
} from "@/animation/attendancePageAnimation";
import { useAttendance } from "@/context/AttendanceContext";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";

/* Panels stay mounted and hide with CSS rather than unmounting, so a
   part-marked register survives a trip to another tab. */
const Attendance = () => {
  const { activeTab } = useAttendance();

  useAttendancePageAnimation();
  useTabCrossfade(activeTab);
  useHideScrollbar();

  return (
    <main className="main">
      <TopBar />

      <div className="page">
        <PageHead />
        <SummaryStrip />

        <section className="card attendance-card">
          <AttendanceTabs />

          <div className="attendance-panels">
            <MarkPanel activeTab={activeTab} />
            <TodayPanel activeTab={activeTab} />
            <InsightsPanel activeTab={activeTab} />
            <RequestsPanel activeTab={activeTab} />
            <ReportsPanel activeTab={activeTab} />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Attendance;
