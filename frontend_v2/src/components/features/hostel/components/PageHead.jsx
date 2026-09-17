import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useHostel } from "@/context/HostelContext";

const PageHead = () => {
  const { totals } = useHostel();

  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">Hostel</h1>
        <p className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight />
          <span className="is-current">Hostel</span>
        </p>
      </div>
      <p className="hostel-head-meta">
        <strong>{totals.percent}%</strong> occupied · {totals.vacant} beds free
      </p>
    </div>
  );
};

export default PageHead;
