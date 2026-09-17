import { ChevronRight, Layers } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui";
import { useSubjects } from "@/context/SubjectContext";

const PageHead = () => {
  const { setBulkOpen } = useSubjects();

  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">Subjects</h1>
        <p className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight />
          <span className="is-current">Subjects</span>
        </p>
      </div>
      <Button icon={Layers} id="bulkAssignBtn" onClick={() => setBulkOpen(true)}>
        Bulk assign
      </Button>
    </div>
  );
};

export default PageHead;
