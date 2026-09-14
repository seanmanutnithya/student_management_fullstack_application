import { ChevronRight, Printer } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui";
import { useRoutine } from "@/context/RoutineContext";

const PageHead = () => {
  const { setPrintOpen } = useRoutine();

  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">Routine</h1>
        <p className="breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight />
          <span className="is-current">Routine</span>
        </p>
      </div>
      <Button icon={Printer} id="printBtn" onClick={() => setPrintOpen(true)}>
        Print view
      </Button>
    </div>
  );
};

export default PageHead;
