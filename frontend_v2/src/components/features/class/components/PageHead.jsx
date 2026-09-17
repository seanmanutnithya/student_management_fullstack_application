import { ChevronRight, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui";
import { useClasses } from "@/context/ClassContext";

const PageHead = () => {
  const { openWizard } = useClasses();

  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">Classes</h1>
        <p className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight />
          <span className="is-current">Classes</span>
        </p>
      </div>
      <Button icon={GraduationCap} id="promoteBtn" onClick={openWizard}>
        Year-end promotion
      </Button>
    </div>
  );
};

export default PageHead;
