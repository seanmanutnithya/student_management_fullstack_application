import { ChevronRight, PenSquare } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui";
import { useNotices } from "@/context/NoticeContext";

const PageHead = () => {
  const { setActiveTab, summary } = useNotices();

  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">Notices</h1>
        <p className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight />
          <span className="is-current">Notices</span>
        </p>
      </div>
      <div className="page-head-actions">
        <span className="notice-head-meta">
          {summary.live} live · {summary.scheduled} scheduled
        </span>
        <Button
          icon={PenSquare}
          id="composeBtn"
          onClick={() => setActiveTab("compose")}>
          Compose notice
        </Button>
      </div>
    </div>
  );
};

export default PageHead;
