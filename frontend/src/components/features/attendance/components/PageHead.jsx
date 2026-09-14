import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useAttendance } from "@/context/AttendanceContext";
import { formatDate } from "@/utils/format";

const PageHead = () => {
  const { todayIso, markingClass } = useAttendance();

  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">Attendance</h1>
        <p className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight />
          <span className="is-current">Attendance</span>
        </p>
      </div>
      <p className="attendance-head-meta">
        {formatDate(todayIso)} · <strong>{markingClass}</strong>
      </p>
    </div>
  );
};

export default PageHead;
