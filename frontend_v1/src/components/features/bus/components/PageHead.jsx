import { ChevronRight, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";

import { useBus } from "@/context/BusContext";

const PageHead = () => {
  const { fleet } = useBus();
  const alerts = fleet.filter((b) => b.worst !== "ok").length;

  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">Transport</h1>
        <p className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight />
          <span className="is-current">Bus</span>
        </p>
      </div>
      {alerts > 0 && (
        <span className="status-pill status-pill--red bus-head-alert">
          <TriangleAlert />
          {alerts} vehicle{alerts === 1 ? "" : "s"} need attention
        </span>
      )}
    </div>
  );
};

export default PageHead;
